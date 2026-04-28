import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Star } from "lucide-react";

import { ADMIN_SESSION_COOKIE, canUseAdminAuth, readAdminSession } from "@/lib/auth";
import { getPendingReviews } from "@/lib/data/catalog-service";
import { isLocale } from "@/lib/i18n";

type AdminReviewsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ approved?: string; rejected?: string; error?: string }>;
};

export default async function AdminReviewsPage({ params, searchParams }: AdminReviewsPageProps) {
  const { locale } = await params;
  const query = await searchParams;

  if (!isLocale(locale)) notFound();
  if (!canUseAdminAuth()) redirect(`/${locale}/admin/login?setup=1`);

  const cookieStore = await cookies();
  const session = readAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) redirect(`/${locale}/admin/login`);

  const reviews = await getPendingReviews();

  return (
    <section className="container-shell py-10 pb-14">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-teal)]">Admin only</p>
          <h1 className="display-title mt-2 text-3xl font-semibold text-[var(--color-ink)] md:text-4xl">
            Izohlar moderatsiyasi
          </h1>
          <p className="mt-3 text-sm text-black/60">
            Kutayotgan izohlar: <strong>{reviews.length}</strong> ta
          </p>
        </div>
        <Link
          href={`/${locale}/admin`}
          className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-sky)] hover:text-[var(--color-sky)]"
        >
          ← Dashboard
        </Link>
      </div>

      {query.approved && (
        <div className="mb-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          Izoh tasdiqlandi va reytingga qo'shildi.
        </div>
      )}
      {query.rejected && (
        <div className="mb-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Izoh rad etildi.
        </div>
      )}
      {query.error && (
        <div className="mb-6 rounded-[1.5rem] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Xatolik: {query.error}
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="section-card rounded-[1.75rem] p-10 text-center text-sm text-black/50">
          Kutayotgan izoh yo&apos;q. Hammasi tartibda ✓
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <article key={review.id} className="section-card rounded-[1.75rem] p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-semibold text-[var(--color-ink)]">
                      {review.userName ?? "Anonim"}{" "}
                      <span className="text-sm font-normal text-black/50">({review.userEmail})</span>
                    </p>
                    <span className="rounded-full border border-black/10 px-2 py-0.5 text-xs text-black/60">
                      {review.placeName}
                    </span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          strokeWidth={0}
                          fill={i < review.rating ? "#F59E0B" : "currentColor"}
                          className={i < review.rating ? "" : "text-black/20"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-black/45">
                    {review.wouldRecommend ? "✓ Tavsiya qiladi" : "✗ Tavsiya etmaydi"} ·{" "}
                    {new Date(review.createdAt).toLocaleDateString("uz-UZ")}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-black/75">{review.comment}</p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <form action="/api/admin/reviews/moderate" method="post">
                    <input type="hidden" name="locale" value={locale} />
                    <input type="hidden" name="reviewId" value={review.id} />
                    <input type="hidden" name="action" value="APPROVED" />
                    <button
                      type="submit"
                      className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                    >
                      ✓ Tasdiqlash
                    </button>
                  </form>
                  <form action="/api/admin/reviews/moderate" method="post">
                    <input type="hidden" name="locale" value={locale} />
                    <input type="hidden" name="reviewId" value={review.id} />
                    <input type="hidden" name="action" value="REJECTED" />
                    <button
                      type="submit"
                      className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      ✗ Rad etish
                    </button>
                  </form>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
