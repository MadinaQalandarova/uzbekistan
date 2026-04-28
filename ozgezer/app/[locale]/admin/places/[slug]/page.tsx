import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { ADMIN_SESSION_COOKIE, canUseAdminAuth, readAdminSession } from "@/lib/auth";
import {
  canManageCatalog,
  getAllPlacesAdmin,
  getCategories,
  getRegions,
} from "@/lib/data/catalog-service";
import { isLocale } from "@/lib/i18n";

type EditPlacePageProps = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ error?: string; updated?: string }>;
};

export default async function EditPlacePage({ params, searchParams }: EditPlacePageProps) {
  const { locale, slug } = await params;
  const query = await searchParams;

  if (!isLocale(locale)) {
    notFound();
  }

  if (!canUseAdminAuth()) {
    redirect(`/${locale}/admin/login?setup=1`);
  }

  const cookieStore = await cookies();
  const session = readAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

  if (!session) {
    redirect(`/${locale}/admin/login`);
  }

  const canManage = canManageCatalog();
  const [allPlaces, regions, categories] = await Promise.all([
    getAllPlacesAdmin(),
    getRegions(),
    getCategories(),
  ]);

  const place = allPlaces.find((p) => p.slug === slug);

  if (!place) {
    notFound();
  }

  return (
    <section className="container-shell py-10 pb-14">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-teal)]">
            Admin only
          </p>
          <h1 className="display-title mt-2 text-3xl font-semibold text-[var(--color-ink)] md:text-4xl">
            Joyni tahrirlash
          </h1>
          <p className="mt-2 text-sm text-[var(--color-ink)]/55">{place.slug}</p>
        </div>
        <Link
          href={`/${locale}/admin/places`}
          className="rounded-full border border-[var(--color-ink)]/10 px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-sky)] hover:text-[var(--color-sky)]"
        >
          ← Joylar ro&apos;yxati
        </Link>
      </div>

      {query.updated ? (
        <div className="mb-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          Joy muvaffaqiyatli yangilandi.
        </div>
      ) : null}

      {query.error ? (
        <div className="mb-6 rounded-[1.5rem] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {mapPlaceError(query.error)}
        </div>
      ) : null}

      <form action="/api/admin/places/update" method="post" className="space-y-8">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="slug" value={place.slug} />

        <fieldset className="section-card rounded-[1.75rem] p-6 space-y-4">
          <legend className="text-sm uppercase tracking-[0.28em] text-[var(--color-gold)]">
            Asosiy ma&apos;lumot
          </legend>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--color-ink)]">
                Viloyat (Region)
              </label>
              <select
                name="regionSlug"
                required
                defaultValue={place.regionSlug}
                className="h-12 w-full rounded-[1rem] border border-[var(--color-ink)]/10 bg-[var(--color-mist)] px-4 outline-none focus:border-[var(--color-sky)]"
              >
                {regions.map((region) => (
                  <option key={region.slug} value={region.slug}>
                    {region.name.uz}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--color-ink)]">
                Kategoriyalar (vergul bilan)
              </label>
              <input
                type="text"
                name="categorySlugs"
                defaultValue={place.categorySlugs.join(", ")}
                placeholder="masalan: historical,nature"
                className="h-12 w-full rounded-[1rem] border border-[var(--color-ink)]/10 bg-[var(--color-mist)] px-4 outline-none focus:border-[var(--color-sky)]"
              />
              <p className="mt-1 text-xs text-[var(--color-ink)]/50">
                Mavjud: {categories.map((c) => c.slug).join(", ")}
              </p>
            </div>
          </div>
        </fieldset>

        <fieldset className="section-card rounded-[1.75rem] p-6 space-y-4">
          <legend className="text-sm uppercase tracking-[0.28em] text-[var(--color-sky)]">
            Nomi (3 tilda)
          </legend>
          <TextField label="Nomi (UZ)" name="nameUz" defaultValue={place.name.uz} required />
          <TextField label="Nomi (RU)" name="nameRu" defaultValue={place.name.ru} required />
          <TextField label="Nomi (EN)" name="nameEn" defaultValue={place.name.en} required />
        </fieldset>

        <fieldset className="section-card rounded-[1.75rem] p-6 space-y-4">
          <legend className="text-sm uppercase tracking-[0.28em] text-[var(--color-teal)]">
            Tavsif (3 tilda)
          </legend>
          <TextareaField
            label="Tavsif (UZ)"
            name="descriptionUz"
            defaultValue={place.description.uz}
            required
          />
          <TextareaField
            label="Tavsif (RU)"
            name="descriptionRu"
            defaultValue={place.description.ru}
            required
          />
          <TextareaField
            label="Tavsif (EN)"
            name="descriptionEn"
            defaultValue={place.description.en}
            required
          />
        </fieldset>

        <fieldset className="section-card rounded-[1.75rem] p-6 space-y-4">
          <legend className="text-sm uppercase tracking-[0.28em] text-[var(--color-gold)]">
            Joylashuv
          </legend>
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Kenglik (Latitude)"
              name="latitude"
              defaultValue={String(place.latitude)}
              required
            />
            <TextField
              label="Uzunlik (Longitude)"
              name="longitude"
              defaultValue={String(place.longitude)}
              required
            />
          </div>
        </fieldset>

        <fieldset className="section-card rounded-[1.75rem] p-6 space-y-4">
          <legend className="text-sm uppercase tracking-[0.28em] text-[var(--color-sky)]">
            Qo&apos;shimcha ma&apos;lumotlar
          </legend>
          <div className="grid gap-4 md:grid-cols-2">
            <TextField label="Narxi" name="price" defaultValue={place.price} />
            <TextField label="Ish vaqti" name="workingHours" defaultValue={place.workingHours} />
            <TextField label="Telefon" name="phone" defaultValue={place.phone} />
            <TextField label="Veb-sayt" name="website" defaultValue={place.website} />
          </div>
        </fieldset>

        <fieldset className="section-card rounded-[1.75rem] p-6 space-y-4">
          <legend className="text-sm uppercase tracking-[0.28em] text-[var(--color-teal)]">
            Manzil
          </legend>
          <TextField label="Manzil (UZ)" name="addressUz" defaultValue={place.address.uz} />
          <TextField label="Manzil (RU)" name="addressRu" defaultValue={place.address.ru} />
          <TextField label="Manzil (EN)" name="addressEn" defaultValue={place.address.en} />
        </fieldset>

        <fieldset className="section-card rounded-[1.75rem] p-6 space-y-4">
          <legend className="text-sm uppercase tracking-[0.28em] text-[var(--color-gold)]">
            Qanday borish
          </legend>
          <TextareaField label="Yo'nalish (UZ)" name="howToGetUz" defaultValue={place.howToGet.uz} />
          <TextareaField label="Yo'nalish (RU)" name="howToGetRu" defaultValue={place.howToGet.ru} />
          <TextareaField label="Yo'nalish (EN)" name="howToGetEn" defaultValue={place.howToGet.en} />
        </fieldset>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!canManage}
            className="h-12 rounded-full bg-[var(--color-sky)] px-6 text-sm font-semibold text-white shadow-sm shadow-[var(--color-sky)]/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Saqlash
          </button>
          <Link
            href={`/${locale}/admin/places`}
            className="h-12 rounded-full border border-[var(--color-ink)]/10 px-6 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-sky)] hover:text-[var(--color-sky)] inline-flex items-center"
          >
            Bekor qilish
          </Link>
        </div>
      </form>
    </section>
  );
}

function TextField({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[var(--color-ink)]">{label}</span>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        className="h-12 w-full rounded-[1rem] border border-[var(--color-ink)]/10 bg-[var(--color-mist)] px-4 outline-none focus:border-[var(--color-sky)]"
      />
    </label>
  );
}

function TextareaField({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[var(--color-ink)]">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        rows={3}
        className="w-full rounded-[1rem] border border-[var(--color-ink)]/10 bg-[var(--color-mist)] px-4 py-3 outline-none focus:border-[var(--color-sky)] resize-none"
      />
    </label>
  );
}

function mapPlaceError(code: string) {
  switch (code) {
    case "DATABASE_NOT_CONFIGURED":
      return "DB ulanmagan.";
    case "REGION_NOT_FOUND":
      return "Ko'rsatilgan region topilmadi.";
    case "PLACE_NOT_FOUND":
      return "Joy topilmadi.";
    default:
      return "Kutilmagan xatolik yuz berdi.";
  }
}
