import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, ArrowRight } from "lucide-react";

import { getRegions } from "@/lib/data/catalog-service";
import { getMessages, isLocale } from "@/lib/i18n";

type RegionsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function RegionsPage({ params }: RegionsPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const messages = getMessages(locale);
  const regions = await getRegions();

  return (
    <div className="py-8">
      {/* ── Hero ── */}
      <section className="container-shell pb-8">
        <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-gold)]">
          {messages.regions.title}
        </p>
        <h1 className="display-title mt-2 text-4xl font-semibold text-[var(--color-ink)] md:text-5xl">
          {messages.regions.description}
        </h1>
      </section>

      {/* ── Region cards ── */}
      <section className="container-shell pb-14">
        <div className="grid gap-4 lg:grid-cols-2">
          {regions.map((region) => (
            <article
              key={region.slug}
              className="section-card group rounded-[1.75rem] p-6 transition-shadow hover:shadow-lg hover:shadow-black/6"
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--color-teal)]">
                    <MapPin size={11} strokeWidth={2.5} />
                    <span className="uppercase tracking-[0.24em]">{messages.regions.statsFocus}</span>
                  </div>
                  <h2 className="display-title mt-1.5 text-2xl font-semibold text-[var(--color-ink)]">
                    {region.name[locale]}
                  </h2>
                </div>
                <span className="shrink-0 rounded-full bg-[var(--color-sky)]/10 px-3.5 py-1.5 text-xs font-semibold text-[var(--color-sky)]">
                  {region.samplePlaces} {messages.regions.statsPlaces}
                </span>
              </div>

              {/* Focus tag */}
              <p className="mt-3 text-xs font-semibold text-[var(--color-sky)]">
                {region.focus[locale]}
              </p>

              {/* Summary */}
              <p className="mt-3 text-sm leading-7 text-black/65">{region.summary[locale]}</p>

              {/* Highlights */}
              {region.highlights.length > 0 && (
                <ul className="mt-4 space-y-1.5">
                  {region.highlights.slice(0, 2).map((highlight) => (
                    <li
                      key={highlight[locale]}
                      className="flex items-start gap-2 text-sm leading-6 text-black/55"
                    >
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-teal)]" />
                      {highlight[locale]}
                    </li>
                  ))}
                </ul>
              )}

              {/* CTA */}
              <Link
                href={`/${locale}/regions/${region.slug}`}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-sky)] hover:text-[var(--color-sky)]"
              >
                {messages.regions.exploreRegion}
                <ArrowRight size={13} strokeWidth={2.2} />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
