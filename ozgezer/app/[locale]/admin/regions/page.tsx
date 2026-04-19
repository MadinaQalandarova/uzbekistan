import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { ADMIN_SESSION_COOKIE, canUseAdminAuth, readAdminSession } from "@/lib/auth";
import { canManageCatalog, getRegions } from "@/lib/data/catalog-service";
import { isLocale } from "@/lib/i18n";

type AdminRegionsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; created?: string; deleted?: string }>;
};

export default async function AdminRegionsPage({
  params,
  searchParams,
}: AdminRegionsPageProps) {
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

  const regions = await getRegions();
  const canManage = canManageCatalog();

  return (
    <section className="container-shell py-10 pb-14">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-teal)]">
            Admin only
          </p>
          <h1 className="display-title mt-2 text-5xl font-semibold text-[var(--color-ink)]">
            Region management
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-black/70">
            Hozircha faqat siz belgilagan 5 ta region bilan ishlayapmiz. Yangi region qo&apos;shish
            va olib tashlash huquqi faqat admin sessiyasida.
          </p>
        </div>
        <Link
          href={`/${locale}/admin`}
          className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-sky)] hover:text-[var(--color-sky)]"
        >
          Dashboard
        </Link>
      </div>

      {query.created ? (
        <div className="mb-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          Region muvaffaqiyatli qo&apos;shildi.
        </div>
      ) : null}

      {query.deleted ? (
        <div className="mb-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Region muvaffaqiyatli o&apos;chirildi.
        </div>
      ) : null}

      {query.error ? (
        <div className="mb-6 rounded-[1.5rem] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {mapRegionError(query.error)}
        </div>
      ) : null}

      {!canManage ? (
        <div className="mb-8 rounded-[1.75rem] bg-[var(--color-sand)] p-5 text-sm leading-7 text-[var(--color-ink)]">
          Region CRUD saqlanishi uchun `DATABASE_URL` va migrate/seed tayyor bo&apos;lishi kerak.
          Hozircha admin-only struktura tayyor, lekin persist qilish DB ulanmaguncha ishlamaydi.
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <article className="section-card rounded-[1.75rem] p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-gold)]">
            Joriy regionlar
          </p>
          <div className="mt-5 grid gap-3">
            {regions.map((region) => (
              <div
                key={region.slug}
                className="flex flex-col gap-4 rounded-[1.25rem] bg-[var(--color-mist)] p-4 md:flex-row md:items-start md:justify-between"
              >
                <div>
                  <p className="text-lg font-semibold text-[var(--color-ink)]">
                    {region.name[locale]}
                  </p>
                  <p className="mt-1 text-sm text-black/60">{region.focus[locale]}</p>
                </div>
                <form action="/api/admin/regions/delete" method="post">
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="slug" value={region.slug} />
                  <button
                    type="submit"
                    disabled={!canManage}
                    className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    O&apos;chirish
                  </button>
                </form>
              </div>
            ))}
          </div>
        </article>

        <article className="section-card rounded-[1.75rem] p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-sky)]">
            Yangi region qo&apos;shish
          </p>
          <form action="/api/admin/regions/create" method="post" className="mt-5 space-y-4">
            <input type="hidden" name="locale" value={locale} />
            <Field label="Slug" name="slug" placeholder="masalan: samarqand" />
            <Field label="Name UZ" name="nameUz" placeholder="Samarqand" />
            <Field label="Name RU" name="nameRu" placeholder="Самарканд" />
            <Field label="Name EN" name="nameEn" placeholder="Samarkand" />
            <Field label="Summary UZ" name="summaryUz" placeholder="Qisqacha tavsif..." />
            <Field label="Summary RU" name="summaryRu" placeholder="Краткое описание..." />
            <Field label="Summary EN" name="summaryEn" placeholder="Short summary..." />
            <Field label="Focus UZ" name="focusUz" placeholder="Tarixiy turizm" />
            <Field label="Focus RU" name="focusRu" placeholder="Исторический туризм" />
            <Field label="Focus EN" name="focusEn" placeholder="Historical tourism" />
            <button
              type="submit"
              disabled={!canManage}
              className="h-12 rounded-full bg-[var(--color-ink)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--color-sky)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Region qo&apos;shish
            </button>
          </form>
        </article>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  placeholder,
}: {
  label: string;
  name: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[var(--color-ink)]">{label}</span>
      <input
        type="text"
        name={name}
        required
        placeholder={placeholder}
        className="h-12 w-full rounded-[1rem] border border-black/10 bg-[var(--color-mist)] px-4 outline-none focus:border-[var(--color-sky)]"
      />
    </label>
  );
}

function mapRegionError(code: string) {
  switch (code) {
    case "DATABASE_NOT_CONFIGURED":
      return "DB ulanmagan. Regionni saqlash uchun avval Prisma database sozlanishi kerak.";
    case "REGION_HAS_PLACES":
      return "Bu region ichida place yozuvlari bor, avval o'sha joylarni olib tashlash kerak.";
    case "REGION_NOT_FOUND":
      return "Region topilmadi.";
    default:
      return "Region management jarayonida xatolik yuz berdi.";
  }
}
