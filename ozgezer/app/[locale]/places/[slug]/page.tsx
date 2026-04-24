import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { PlaceCard } from "@/components/place-card";
import { PlaceMap } from "@/components/place-map";
import { ReviewForm } from "@/components/review-form";
import { ViewTracker } from "@/components/view-tracker";
import {
  getPlace,
  getPlaceReviews,
  getRelatedPlaces,
  isPlaceSavedByUser,
} from "@/lib/data/catalog-service";
import { getMessages, isLocale, locales } from "@/lib/i18n";
import { USER_SESSION_COOKIE, readUserSession } from "@/lib/user-auth";

type PlaceDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ reviewed?: string; error?: string }>;
};

export default async function PlaceDetailPage({ params, searchParams }: PlaceDetailPageProps) {
  const { locale, slug } = await params;
  const query = await searchParams;

  if (!isLocale(locale)) notFound();

  const place = await getPlace(slug);
  if (!place) notFound();

  const cookieStore = await cookies();
  const session = readUserSession(cookieStore.get(USER_SESSION_COOKIE)?.value);

  const [relatedPlaces, reviews, isSaved] = await Promise.all([
    getRelatedPlaces(place),
    getPlaceReviews(slug),
    session ? isPlaceSavedByUser(slug, session.userId) : Promise.resolve(false),
  ]);

  const alreadyReviewed = session
    ? reviews.some((r) => r.userId === session.userId)
    : false;

  const messages = getMessages(locale);

  const recommendCount = reviews.filter((r) => r.wouldRecommend).length;
  const recommendPct = reviews.length > 0 ? Math.round((recommendCount / reviews.length) * 100) : null;

  return (
    <section className="container-shell py-10 pb-14">
      <ViewTracker slug={slug} />
      <div className="mb-6 flex items-center justify-between">
        <Link
          href={`/${locale}/explore`}
          className="inline-flex rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-sky)] hover:text-[var(--color-sky)]"
        >
          {messages.place.backToExplore}
        </Link>

        {session && (
          <form action="/api/places/save" method="post">
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="placeSlug" value={slug} />
            <button
              type="submit"
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                isSaved
                  ? "border-[var(--color-gold)] bg-amber-50 text-[var(--color-gold)]"
                  : "border-black/10 text-black/60 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
              }`}
            >
              {isSaved ? "★ Saqlangan" : "☆ Saqlash"}
            </button>
          </form>
        )}
      </div>

      {query.reviewed && (
        <div className="mb-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          Izohingiz qabul qilindi. Rahmat!
        </div>
      )}

      {query.error === "ALREADY_REVIEWED" && (
        <div className="mb-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Siz bu joyga allaqachon izoh qo'shgansiz.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="section-card overflow-hidden rounded-[2rem]">
          <div className="h-64 bg-[linear-gradient(135deg,rgba(27,108,168,0.92),rgba(22,124,116,0.76),rgba(212,166,61,0.6))]" />
          <div className="space-y-4 p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-teal)]">
              {place.regionName[locale]}
            </p>
            <h1 className="display-title text-5xl font-semibold text-[var(--color-ink)]">
              {place.name[locale]}
            </h1>
            <p className="text-sm leading-8 text-black/70">{place.description[locale]}</p>
            <div className="flex flex-wrap gap-2">
              {place.categoryTitles.map((category) => (
                <span
                  key={`${place.slug}-${category[locale]}`}
                  className="rounded-full border border-black/8 bg-[var(--color-mist)] px-3 py-1 text-xs font-semibold text-[var(--color-ink)]"
                >
                  {category[locale]}
                </span>
              ))}
            </div>
            <div className="pt-6">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)]">
                Xarita
              </p>
              <PlaceMap
                latitude={place.latitude}
                longitude={place.longitude}
                placeName={place.name[locale]}
              />
            </div>
          </div>
        </article>

        <div className="space-y-4">
          <article className="section-card rounded-[1.75rem] p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-gold)]">
              {messages.place.practicalInfo}
            </p>
            <div className="mt-5 grid gap-3">
              <InfoRow label={messages.place.regionLabel} value={place.regionName[locale]} />
              <InfoRow
                label={messages.place.categoryLabel}
                value={place.categoryTitles.map((item) => item[locale]).join(", ")}
              />
              {place.price && <InfoRow label={messages.place.priceLabel} value={place.price} />}
              {place.workingHours && (
                <InfoRow label={messages.place.hoursLabel} value={place.workingHours} />
              )}
              <InfoRow
                label={messages.place.ratingLabel}
                value={
                  reviews.length > 0
                    ? `${place.averageRating.toFixed(1)} / 5 · ${reviews.length} ta izoh`
                    : "Hali baholanmagan"
                }
              />
              {recommendPct !== null && (
                <InfoRow
                  label="Tavsiya qiladi"
                  value={`${recommendPct}% (${recommendCount}/${reviews.length})`}
                />
              )}
            </div>
          </article>

          <ReviewForm
            locale={locale}
            placeSlug={slug}
            isLoggedIn={!!session}
            alreadyReviewed={alreadyReviewed || query.error === "ALREADY_REVIEWED"}
          />
        </div>
      </div>

      {/* Real izohlar */}
      {reviews.length > 0 && (
        <div className="mt-10">
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-sky)]">
            Izohlar ({reviews.length})
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {reviews.map((review) => (
              <div key={review.id} className="section-card rounded-[1.5rem] p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[var(--color-ink)]">
                    {review.userName ?? "Anonim"}
                  </p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < review.rating ? "text-amber-400" : "text-black/15"}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-1 text-xs text-black/45">
                  {review.wouldRecommend ? "✓ Tavsiya qiladi" : "✗ Tavsiya etmaydi"}
                </p>
                <p className="mt-3 text-sm leading-6 text-black/70">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {relatedPlaces.length > 0 && (
        <div className="mt-10">
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-sky)]">
            {messages.place.relatedPlaces}
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {relatedPlaces.map((relatedPlace) => (
              <PlaceCard
                key={relatedPlace.slug}
                locale={locale}
                place={relatedPlace}
                ctaLabel={messages.explore.openDetails}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] bg-[var(--color-mist)] p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-black/45">{label}</p>
      <p className="mt-2 text-sm font-semibold text-[var(--color-ink)]">{value}</p>
    </div>
  );
}

export async function generateStaticParams() {
  const { getPlaces } = await import("@/lib/data/catalog-service");
  const places = await getPlaces();
  return locales.flatMap((locale) => places.map((place) => ({ locale, slug: place.slug })));
}
