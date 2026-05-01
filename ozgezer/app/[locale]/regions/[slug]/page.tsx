import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { getRegion, getRegions } from "@/lib/data/catalog-service";
import { getMessages, isLocale, locales } from "@/lib/i18n";

type RegionDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: RegionDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const region = await getRegion(slug);
  if (!region || !isLocale(locale)) return {};
  const name = region.name[locale as "uz" | "ru" | "en"] ?? region.name.uz;
  const desc = region.summary[locale as "uz" | "ru" | "en"] ?? region.summary.uz;
  return {
    title: name,
    description: desc,
    openGraph: { title: name, description: desc, type: "article" },
  };
}

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
    <div className="py-8">
      {/* ── Back button ── */}
      <section className="container-shell pb-6">
        <Link
          href={`/${locale}/regions`}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-ink)]/10 px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-sky)] hover:text-[var(--color-sky)]"
        >
          <ArrowLeft size={14} strokeWidth={2.2} />
          {messages.regions.backToRegions}
        </Link>
      </section>

      {/* ── Hero banner ── */}
      <section className="container-shell pb-6">
        <div className="uzbek-hero relative overflow-hidden rounded-[2rem] border border-[var(--color-ink)]/8 p-8 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-gold)]">
            {messages.regions.title}
          </p>
          <h1 className="display-title mt-3 text-3xl font-semibold text-[var(--color-ink)] md:text-4xl">
            {region.name[locale]}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-ink)]/65">
            {region.summary[locale]}
          </p>
        </div>
      </section>

      {/* ── Info grid ── */}
      <section className="container-shell pb-6">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Overview */}
          <article className="section-card rounded-[1.75rem] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-teal)]">
              {messages.regions.overview}
            </p>
            <h2 className="display-title mt-3 text-2xl font-semibold text-[var(--color-ink)]">
              {region.focus[locale]}
            </h2>
            <ul className="mt-5 space-y-3">
              {region.highlights.map((highlight) => (
                <li key={highlight[locale]} className="flex items-start gap-2.5 text-sm leading-7 text-[var(--color-ink)]/65">
                  <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-teal)]" />
                  {highlight[locale]}
                </li>
              ))}
            </ul>
          </article>

          {/* Stats */}
          <article className="section-card rounded-[1.75rem] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-sky)]">
              {messages.regions.practicalInfo}
            </p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-[1.25rem] bg-[var(--color-mist)] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-ink)]/40">
                  {messages.regions.statsPlaces}
                </p>
                <p className="mt-2 text-3xl font-semibold text-[var(--color-ink)]">
                  {region.samplePlaces}
                </p>
              </div>
              <div className="rounded-[1.25rem] bg-[var(--color-mist)] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-ink)]/40">
                  {messages.regions.statsFocus}
                </p>
                <p className="mt-2 text-base font-semibold text-[var(--color-ink)]">
                  {region.focus[locale]}
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ── Featured places ── */}
      {region.featuredPlaces.length > 0 && (
        <section className="container-shell pb-14">
          <div className="section-card rounded-[1.75rem] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-gold)]">
              {messages.regions.highlights}
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {region.featuredPlaces.map((place) => (
                <Link
                  key={place.slug}
                  href={`/${locale}/places/${place.slug}`}
                  className="card-rise group flex items-center justify-between gap-3 rounded-[1.5rem] bg-[var(--color-mist)] p-5"
                >
                  <div>
                    <h3 className="text-base font-semibold text-[var(--color-ink)]">
                      {place.title[locale]}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-[var(--color-ink)]/50">{place.type[locale]}</p>
                  </div>
                  <ArrowRight
                    size={16}
                    strokeWidth={2}
                    className="flex-shrink-0 text-[var(--color-sky)] opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
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
