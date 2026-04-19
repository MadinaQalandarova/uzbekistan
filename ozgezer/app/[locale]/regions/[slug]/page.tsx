import Link from "next/link";
import { notFound } from "next/navigation";

import { getRegion, getRegions } from "@/lib/data/catalog-service";
import { getMessages, isLocale, locales } from "@/lib/i18n";

type RegionDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function RegionDetailPage({ params }: RegionDetailPageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const region = await getRegion(slug);

  if (!region) {
    notFound();
  }

  const messages = getMessages(locale);

  return (
    <section className="container-shell py-10 pb-14">
      <Link
        href={`/${locale}/regions`}
        className="mb-6 inline-flex rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-sky)] hover:text-[var(--color-sky)]"
      >
        {messages.regions.backToRegions}
      </Link>

      <div className="mesh-panel overflow-hidden rounded-[2rem] border border-black/8 p-8">
        <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-gold)]">
          {messages.regions.title}
        </p>
        <h1 className="display-title mt-3 text-5xl font-semibold text-[var(--color-ink)]">
          {region.name[locale]}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-black/70">
          {region.summary[locale]}
        </p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="section-card rounded-[1.75rem] p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-teal)]">
            {messages.regions.overview}
          </p>
          <h2 className="display-title mt-3 text-3xl font-semibold text-[var(--color-ink)]">
            {region.focus[locale]}
          </h2>
          <div className="mt-5 space-y-3">
            {region.highlights.map((highlight) => (
              <p key={highlight[locale]} className="text-sm leading-7 text-black/70">
                {highlight[locale]}
              </p>
            ))}
          </div>
        </article>

        <article className="section-card rounded-[1.75rem] p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-sky)]">
            {messages.regions.practicalInfo}
          </p>
          <div className="mt-5 grid gap-3">
            <div className="rounded-[1.25rem] bg-[var(--color-mist)] p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-black/45">
                {messages.regions.statsPlaces}
              </p>
              <p className="mt-2 text-2xl font-semibold text-[var(--color-ink)]">
                {region.samplePlaces}
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-[var(--color-mist)] p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-black/45">
                {messages.regions.statsFocus}
              </p>
              <p className="mt-2 text-lg font-semibold text-[var(--color-ink)]">
                {region.focus[locale]}
              </p>
            </div>
          </div>
        </article>
      </div>

      <article className="section-card mt-8 rounded-[1.75rem] p-6">
        <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-gold)]">
          {messages.regions.highlights}
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {region.featuredPlaces.map((place) => (
            <Link
              key={place.slug}
              href={`/${locale}/places/${place.slug}`}
              className="card-rise rounded-[1.5rem] bg-[var(--color-mist)] p-5"
            >
              <h3 className="text-2xl font-semibold text-[var(--color-ink)]">
                {place.title[locale]}
              </h3>
              <p className="mt-2 text-sm leading-7 text-black/65">{place.type[locale]}</p>
            </Link>
          ))}
        </div>
      </article>
    </section>
  );
}

export function generateStaticParams() {
  return getRegions().then((regions) =>
    locales.flatMap((locale) =>
      regions.map((region) => ({
        locale,
        slug: region.slug,
      })),
    ),
  );
}
