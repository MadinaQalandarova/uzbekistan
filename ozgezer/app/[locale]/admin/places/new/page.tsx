import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { ADMIN_SESSION_COOKIE, canUseAdminAuth, readAdminSession } from "@/lib/auth";
import { canManageCatalog, getCategories, getRegions } from "@/lib/data/catalog-service";
import { isLocale } from "@/lib/i18n";

type NewPlacePageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function NewPlacePage({ params, searchParams }: NewPlacePageProps) {
  const { locale } = await params;
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
  const [regions, categories] = await Promise.all([getRegions(), getCategories()]);

  return (
    <section className="container-shell py-10 pb-14">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-teal)]">
            Admin only
          </p>
          <h1 className="display-title mt-2 text-5xl font-semibold text-[var(--color-ink)]">
            Yangi joy qo&apos;shish
          </h1>
        </div>
        <Link
          href={`/${locale}/admin/places`}
          className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-sky)] hover:text-[var(--color-sky)]"
        >
          ← Joylar ro&apos;yxati
        </Link>
      </div>

      {query.error ? (
        <div className="mb-6 rounded-[1.5rem] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {mapPlaceError(query.error)}
        </div>
      ) : null}

      <form action="/api/admin/places/create" method="post" className="space-y-8">
        <input type="hidden" name="locale" value={locale} />

        <fieldset className="section-card rounded-[1.75rem] p-6 space-y-4">
          <legend className="text-sm uppercase tracking-[0.28em] text-[var(--color-gold)]">
            Asosiy ma&apos;lumot
          </legend>

          <TextField label="Slug" name="slug" placeholder="masalan: registon-maydoni" required />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--color-ink)]">
                Viloyat (Region)
              </label>
              <select
                name="regionSlug"
                required
                className="h-12 w-full rounded-[1rem] border border-black/10 bg-[var(--color-mist)] px-4 outline-none focus:border-[var(--color-sky)]"
              >
                <option value="">— tanlang —</option>
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
                placeholder="masalan: historical,nature"
                className="h-12 w-full rounded-[1rem] border border-black/10 bg-[var(--color-mist)] px-4 outline-none focus:border-[var(--color-sky)]"
              />
              <p className="mt-1 text-xs text-black/50">
                Mavjud: {categories.map((c) => c.slug).join(", ")}
              </p>
            </div>
          </div>
        </fieldset>

        <fieldset className="section-card rounded-[1.75rem] p-6 space-y-4">
          <legend className="text-sm uppercase tracking-[0.28em] text-[var(--color-sky)]">
            Nomi (3 tilda)
          </legend>
          <TextField label="Nomi (UZ)" name="nameUz" placeholder="Registon maydoni" required />
          <TextField label="Nomi (RU)" name="nameRu" placeholder="Площадь Регистан" required />
          <TextField label="Nomi (EN)" name="nameEn" placeholder="Registan Square" required />
        </fieldset>

        <fieldset className="section-card rounded-[1.75rem] p-6 space-y-4">
          <legend className="text-sm uppercase tracking-[0.28em] text-[var(--color-teal)]">
            Tavsif (3 tilda)
          </legend>
          <TextareaField
            label="Tavsif (UZ)"
            name="descriptionUz"
            placeholder="O'zbekistonning eng mashhur tarixiy maydoni..."
            required
          />
          <TextareaField
            label="Tavsif (RU)"
            name="descriptionRu"
            placeholder="Самая известная историческая площадь Узбекистана..."
            required
          />
          <TextareaField
            label="Tavsif (EN)"
            name="descriptionEn"
            placeholder="The most famous historical square in Uzbekistan..."
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
              placeholder="39.654522"
              required
            />
            <TextField
              label="Uzunlik (Longitude)"
              name="longitude"
              placeholder="66.975476"
              required
            />
          </div>
        </fieldset>

        <fieldset className="section-card rounded-[1.75rem] p-6 space-y-4">
          <legend className="text-sm uppercase tracking-[0.28em] text-[var(--color-sky)]">
            Qo&apos;shimcha ma&apos;lumotlar (ixtiyoriy)
          </legend>
          <div className="grid gap-4 md:grid-cols-2">
            <TextField label="Narxi" name="price" placeholder="Bepul / 20 000 so'm" />
            <TextField label="Ish vaqti" name="workingHours" placeholder="09:00 – 18:00" />
            <TextField label="Telefon" name="phone" placeholder="+998 90 000 00 00" />
            <TextField label="Veb-sayt" name="website" placeholder="https://..." />
          </div>
        </fieldset>

        <fieldset className="section-card rounded-[1.75rem] p-6 space-y-4">
          <legend className="text-sm uppercase tracking-[0.28em] text-[var(--color-teal)]">
            Manzil (ixtiyoriy)
          </legend>
          <TextField label="Manzil (UZ)" name="addressUz" placeholder="Samarqand sh., Registon ko'chasi 1" />
          <TextField label="Manzil (RU)" name="addressRu" placeholder="г. Самарканд, ул. Регистан 1" />
          <TextField label="Manzil (EN)" name="addressEn" placeholder="1 Registan St., Samarkand" />
        </fieldset>

        <fieldset className="section-card rounded-[1.75rem] p-6 space-y-4">
          <legend className="text-sm uppercase tracking-[0.28em] text-[var(--color-gold)]">
            Qanday borish (ixtiyoriy)
          </legend>
          <TextareaField label="Yo'nalish (UZ)" name="howToGetUz" placeholder="Samarqand shahar markazidan..." />
          <TextareaField label="Yo'nalish (RU)" name="howToGetRu" placeholder="Из центра Самарканда..." />
          <TextareaField label="Yo'nalish (EN)" name="howToGetEn" placeholder="From the city center..." />
        </fieldset>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!canManage}
            className="h-12 rounded-full bg-[var(--color-ink)] px-6 text-sm font-semibold text-white transition hover:bg-[var(--color-sky)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Joy qo&apos;shish (Qoralama)
          </button>
          <Link
            href={`/${locale}/admin/places`}
            className="h-12 rounded-full border border-black/10 px-6 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-sky)] hover:text-[var(--color-sky)] inline-flex items-center"
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
  placeholder,
  required,
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[var(--color-ink)]">{label}</span>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        required={required}
        className="h-12 w-full rounded-[1rem] border border-black/10 bg-[var(--color-mist)] px-4 outline-none focus:border-[var(--color-sky)]"
      />
    </label>
  );
}

function TextareaField({
  label,
  name,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[var(--color-ink)]">{label}</span>
      <textarea
        name={name}
        placeholder={placeholder}
        required={required}
        rows={3}
        className="w-full rounded-[1rem] border border-black/10 bg-[var(--color-mist)] px-4 py-3 outline-none focus:border-[var(--color-sky)] resize-none"
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
    case "SLUG_ALREADY_EXISTS":
      return "Bu slug allaqachon mavjud. Boshqa slug tanlang.";
    default:
      return "Kutilmagan xatolik yuz berdi.";
  }
}
