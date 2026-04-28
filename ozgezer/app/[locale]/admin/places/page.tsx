import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { ADMIN_SESSION_COOKIE, canUseAdminAuth, readAdminSession } from "@/lib/auth";
import { canManageCatalog, getAllPlacesAdmin } from "@/lib/data/catalog-service";
import { isLocale } from "@/lib/i18n";

type AdminPlacesPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    error?: string;
    created?: string;
    deleted?: string;
    published?: string;
  }>;
};

export default async function AdminPlacesPage({
  params,
  searchParams,
}: AdminPlacesPageProps) {
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
  const places = await getAllPlacesAdmin();

  const statusLabel: Record<string, string> = {
    DRAFT: "Qoralama",
    PUBLISHED: "Chop etilgan",
    ARCHIVED: "Arxivlangan",
  };

  const statusColor: Record<string, string> = {
    DRAFT: "text-amber-600 bg-amber-50 border-amber-200",
    PUBLISHED: "text-emerald-700 bg-emerald-50 border-emerald-200",
    ARCHIVED: "text-[var(--color-ink)]/40 bg-black/5 border-[var(--color-ink)]/10",
  };

  return (
    <section className="container-shell py-10 pb-14">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-teal)]">
            Admin only
          </p>
          <h1 className="display-title mt-2 text-3xl font-semibold text-[var(--color-ink)] md:text-4xl">
            Place management
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--color-ink)]/70">
            Barcha joylar — qoralama, chop etilgan va arxivlangan. Yangi joy qo&apos;shish, tahrirlash, o&apos;chirish va nashr qilish shu yerda.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/${locale}/admin`}
            className="rounded-full border border-[var(--color-ink)]/10 px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-sky)] hover:text-[var(--color-sky)]"
          >
            Dashboard
          </Link>
          {canManage && (
            <Link
              href={`/${locale}/admin/places/new`}
              className="rounded-full bg-[var(--color-sky)] px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-[var(--color-sky)]/20 transition hover:opacity-90"
            >
              + Yangi joy
            </Link>
          )}
        </div>
      </div>

      {query.created ? (
        <div className="mb-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          Joy muvaffaqiyatli qo&apos;shildi. Nashr qilish uchun quyidagi ro&apos;yxatdan &quot;Nashr&quot; tugmasini bosing.
        </div>
      ) : null}

      {query.deleted ? (
        <div className="mb-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Joy muvaffaqiyatli o&apos;chirildi.
        </div>
      ) : null}

      {query.published ? (
        <div className="mb-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          Joy holati yangilandi.
        </div>
      ) : null}

      {query.error ? (
        <div className="mb-6 rounded-[1.5rem] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {mapPlaceError(query.error)}
        </div>
      ) : null}

      {!canManage ? (
        <div className="mb-8 rounded-[1.75rem] border border-amber-200/60 bg-amber-50 p-5 text-sm leading-7 text-[var(--color-ink)]">
          Place CRUD ishlashi uchun <code>DATABASE_URL</code> va Prisma migratsiyasi kerak.
        </div>
      ) : null}

      <div className="section-card rounded-[1.75rem] overflow-hidden">
        <div className="p-6 border-b border-[var(--color-ink)]/6">
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-sky)]">
            Joylar ro&apos;yxati
          </p>
          <p className="mt-1 text-sm text-[var(--color-ink)]/60">
            Jami: <strong>{places.length}</strong> ta joy
          </p>
        </div>

        {places.length === 0 ? (
          <div className="p-10 text-center text-sm text-[var(--color-ink)]/50">
            Hali hech qanday joy qo&apos;shilmagan.{" "}
            {canManage && (
              <Link href={`/${locale}/admin/places/new`} className="text-[var(--color-sky)] underline">
                Birinchi joyni qo&apos;shing
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-black/6">
            {places.map((place) => (
              <div
                key={place.slug}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-[var(--color-ink)] truncate">
                      {place.name.uz}
                    </p>
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${statusColor[place.status] ?? ""}`}
                    >
                      {statusLabel[place.status] ?? place.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-[var(--color-ink)]/55">
                    {place.regionName.uz} · {place.categorySlugs.join(", ") || "—"}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--color-ink)]/40">
                    {place.latitude}, {place.longitude}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/${locale}/admin/places/${place.slug}`}
                    className="rounded-full border border-[var(--color-ink)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-sky)] hover:text-[var(--color-sky)]"
                  >
                    Tahrirlash
                  </Link>

                  <form action="/api/admin/places/publish" method="post">
                    <input type="hidden" name="locale" value={locale} />
                    <input type="hidden" name="slug" value={place.slug} />
                    <input
                      type="hidden"
                      name="action"
                      value={place.published ? "unpublish" : "publish"}
                    />
                    <button
                      type="submit"
                      disabled={!canManage}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        place.published
                          ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                          : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      }`}
                    >
                      {place.published ? "Yashirish" : "Nashr"}
                    </button>
                  </form>

                  {!place.published && (
                    <form action="/api/admin/places/delete" method="post">
                      <input type="hidden" name="locale" value={locale} />
                      <input type="hidden" name="slug" value={place.slug} />
                      <button
                        type="submit"
                        disabled={!canManage}
                        className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        O&apos;chirish
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
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
    case "PLACE_NOT_FOUND":
      return "Joy topilmadi.";
    case "PLACE_HAS_REVIEWS":
      return "Bu joyda izohlar bor, o'chirish mumkin emas.";
    default:
      return "Kutilmagan xatolik yuz berdi.";
  }
}
