import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Star,
  ThumbsUp,
  ThumbsDown,
  MapPin,
  User,
} from "lucide-react";

import { PlaceCard } from "@/components/place-card";
import { PlaceMap } from "@/components/place-map";
import { ReviewForm } from "@/components/review-form";
import { TaxiButton } from "@/components/taxi-button";
import { ViewTracker } from "@/components/view-tracker";
import {
  getPlace,
  getPlaceReviews,
  getRelatedPlaces,
  isPlaceSavedByUser,
} from "@/lib/data/catalog-service";
import { getMessages, isLocale, locales } from "@/lib/i18n";
import { PLACE_IMAGES, PLACE_STORIES } from "@/lib/place-stories";
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

  const story = PLACE_STORIES[slug] ?? null;
  const imageUrl = PLACE_IMAGES[slug] ?? null;

  return (
    <div className="py-8">
      <ViewTracker slug={slug} />

      {/* ── Top bar ── */}
      <section className="container-shell pb-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={`/${locale}/explore`}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-sky)] hover:text-[var(--color-sky)]"
          >
            <ArrowLeft size={14} strokeWidth={2.2} />
            {messages.place.backToExplore}
          </Link>

          {session && (
            <form action="/api/places/save" method="post">
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="placeSlug" value={slug} />
              <button
                type="submit"
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  isSaved
                    ? "border-[var(--color-gold)] bg-amber-50 text-[var(--color-gold)]"
                    : "border-black/10 text-black/60 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
                }`}
              >
                {isSaved ? (
                  <BookmarkCheck size={14} strokeWidth={2} />
                ) : (
                  <Bookmark size={14} strokeWidth={2} />
                )}
                {isSaved ? "Saqlangan" : "Saqlash"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── Toast messages ── */}
      {query.reviewed && (
        <section className="container-shell pb-2">
          <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            Izohingiz qabul qilindi. Rahmat!
          </div>
        </section>
      )}
      {query.error === "ALREADY_REVIEWED" && (
        <section className="container-shell pb-2">
          <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            Siz bu joyga allaqachon izoh qo&apos;shgansiz.
          </div>
        </section>
      )}

      {/* ── Main grid ── */}
      <section className="container-shell pb-10">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Left column: hero + map */}
          <article className="section-card overflow-hidden rounded-[2rem]">
            {/* Hero banner — rasm yoki gradient */}
            <div className="relative min-h-[15rem] bg-[linear-gradient(140deg,#2D6B6B_0%,#5B8A6E_55%,#F59E0B_100%)]">
              {imageUrl && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={place.name[locale]}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
                </>
              )}
              {!imageUrl && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              )}

              <div className="relative flex h-full min-h-[15rem] flex-col justify-start p-6">
                {/* Kategoriya chiplari — yuqorida */}
                <div className="flex flex-wrap gap-2">
                  {place.categoryTitles.map((category) => (
                    <span
                      key={`${place.slug}-${category[locale]}`}
                      className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/20 backdrop-blur-sm"
                    >
                      {category[locale]}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 p-6">
              <div className="flex items-center gap-2 text-sm text-[var(--color-teal)]">
                <MapPin size={13} strokeWidth={2} />
                <span className="uppercase tracking-[0.24em]">{place.regionName[locale]}</span>
              </div>
              <h1 className="display-title text-3xl font-semibold leading-snug text-[var(--color-ink)] md:text-4xl">
                {place.name[locale]}
              </h1>
              {story && (
                <blockquote className="border-l-2 border-[var(--color-sky)]/40 pl-4">
                  <p className="font-serif text-base italic leading-7 text-black/55">
                    &ldquo;{story.quote[locale as "uz" | "ru" | "en"] ?? story.quote.uz}&rdquo;
                  </p>
                </blockquote>
              )}
              <p className="text-sm leading-7 text-black/65">{place.description[locale]}</p>

              <div className="border-t border-black/6 pt-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-black/40">
                  Xarita
                </p>
                <PlaceMap
                  latitude={place.latitude}
                  longitude={place.longitude}
                  placeName={place.name[locale]}
                />
              </div>

              <TaxiButton
                latitude={place.latitude}
                longitude={place.longitude}
                placeName={place.name[locale]}
              />
            </div>
          </article>

          {/* Right column: info + review form */}
          <div className="space-y-4">
            <article className="section-card rounded-[1.75rem] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-gold)]">
                {messages.place.practicalInfo}
              </p>
              <div className="mt-4 grid gap-3">
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
                    label="Tavsiya"
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
      </section>

      {/* ── Reviews ── */}
      {reviews.length > 0 && (
        <section className="container-shell pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-sky)]">
            Izohlar ({reviews.length})
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {reviews.map((review) => (
              <div key={review.id} className="section-card rounded-[1.5rem] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-mist)]">
                      <User size={14} strokeWidth={2} className="text-black/40" />
                    </div>
                    <p className="text-sm font-semibold text-[var(--color-ink)]">
                      {review.userName ?? "Anonim"}
                    </p>
                  </div>
                  {/* Star rating */}
                  <div className="flex flex-shrink-0 gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        strokeWidth={0}
                        fill={i < review.rating ? "#F59E0B" : "#00000026"}
                      />
                    ))}
                  </div>
                </div>

                {/* Recommend badge */}
                <div className="mt-3 inline-flex items-center gap-1.5">
                  {review.wouldRecommend ? (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 ring-1 ring-emerald-200">
                      <ThumbsUp size={10} strokeWidth={2.5} />
                      Tavsiya qiladi
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-500 ring-1 ring-red-200">
                      <ThumbsDown size={10} strokeWidth={2.5} />
                      Tavsiya etmaydi
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm leading-6 text-black/65">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Rich content — faqat story mavjud joylar uchun ── */}
      {story && (
        <section className="container-shell pb-10">
          <div className="section-card rounded-[2rem] overflow-hidden">
            {/* Section header */}
            <div className="border-b border-black/6 px-6 py-5 md:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-gold)]">
                Batafsil ma&apos;lumot
              </p>
              <h2 className="display-title mt-1 text-xl font-semibold text-[var(--color-ink)] md:text-2xl">
                🏛️ {place.name[locale]}: {story.heroTitle}
              </h2>
            </div>

            <div className="divide-y divide-black/5">
              {story.sections.map((section) => (
                <div key={section.heading} className="px-6 py-6 md:px-8">
                  <h3 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-sky)]">
                    <span>{section.emoji}</span>
                    <span>{section.heading}</span>
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {section.facts.map((fact) => (
                      <div
                        key={fact.title}
                        className="rounded-[1.25rem] bg-[var(--color-mist)] p-5"
                      >
                        <div className="mb-2 flex items-start gap-2">
                          <span className="mt-0.5 flex h-2 w-2 flex-shrink-0 rounded-full bg-[var(--color-sky)]" />
                          <p className="text-sm font-semibold text-[var(--color-ink)]">
                            {fact.title}
                          </p>
                        </div>
                        <p className="pl-4 text-sm leading-7 text-black/65">{fact.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Related places ── */}
      {relatedPlaces.length > 0 && (
        <section className="container-shell pb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-sky)]">
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
        </section>
      )}
    </div>
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
