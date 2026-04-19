import Link from "next/link";
import { notFound } from "next/navigation";

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
    <section className="container-shell py-10 pb-14">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-gold)]">
          {messages.regions.title}
        </p>
        <h1 className="display-title mt-2 text-5xl font-semibold text-[var(--color-ink)]">
          {messages.regions.description}
        </h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {regions.map((region) => (
          <article key={region.slug} className="section-card rounded-[1.75rem] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-teal)]">
                  {messages.regions.statsFocus}
                </p>
                <h2 className="display-title mt-2 text-3xl font-semibold text-[var(--color-ink)]">
                  {region.name[locale]}
                </h2>
              </div>
              <div className="rounded-full bg-[var(--color-sand)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)]">
                {region.samplePlaces} {messages.regions.statsPlaces}
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-black/70">{region.summary[locale]}</p>
            <p className="mt-4 text-sm font-semibold text-[var(--color-sky)]">
              {region.focus[locale]}
            </p>

            <div className="mt-5 space-y-2">
              {region.highlights.slice(0, 2).map((highlight) => (
                <p key={highlight[locale]} className="text-sm leading-7 text-black/60">
                  {highlight[locale]}
                </p>
              ))}
            </div>

            <Link
              href={`/${locale}/regions/${region.slug}`}
              className="mt-6 inline-flex rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-sky)] hover:text-[var(--color-sky)]"
            >
              {messages.regions.exploreRegion}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
