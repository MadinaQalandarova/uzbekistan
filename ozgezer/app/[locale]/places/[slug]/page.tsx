import Link from "next/link";
import { notFound } from "next/navigation";

import { PlaceCard } from "@/components/place-card";
import { PlaceMap } from "@/components/place-map";
import { ReviewForm } from "@/components/review-form";
import { getPlace, getRelatedPlaces } from "@/lib/data/catalog-service";
import { getMessages, isLocale, locales } from "@/lib/i18n";

type PlaceDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function PlaceDetailPage({ params }: PlaceDetailPageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const place = await getPlace(slug);

  if (!place) {
    notFound();
  }

  const relatedPlaces = await getRelatedPlaces(place);
  const messages = getMessages(locale);

  return (
    <section className="container-shell py-10 pb-14">
      <Link
        href={`/${locale}/explore`}
        className="mb-6 inline-flex rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-sky)] hover:text-[var(--color-sky)]"
      >
        {messages.place.backToExplore}
      </Link>

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
              <InfoRow label={messages.place.priceLabel} value={place.price} />
              <InfoRow label={messages.place.hoursLabel} value={place.workingHours} />
              <InfoRow
                label={messages.place.ratingLabel}
                value={`${place.averageRating.toFixed(1)} / 5`}
              />
              <InfoRow
                label={messages.place.coordinatesLabel}
                value={`${place.latitude}, ${place.longitude}`}
              />
            </div>
          </article>

          <ReviewForm locale={locale} />
        </div>
      </div>

      {relatedPlaces.length > 0 ? (
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
      ) : null}
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

  return locales.flatMap((locale) =>
    places.map((place) => ({
      locale,
      slug: place.slug,
    })),
  );
}
