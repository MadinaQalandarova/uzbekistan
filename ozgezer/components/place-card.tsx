import Link from "next/link";

import type { PlaceRecord } from "@/lib/data/catalog";
import type { Locale } from "@/lib/i18n";

type PlaceCardProps = {
  locale: Locale;
  place: PlaceRecord;
  ctaLabel: string;
};

export function PlaceCard({ locale, place, ctaLabel }: PlaceCardProps) {
  return (
    <article className="section-card card-rise overflow-hidden rounded-[1.75rem]">
      <div className="h-44 bg-[linear-gradient(135deg,rgba(27,108,168,0.92),rgba(22,124,116,0.76),rgba(212,166,61,0.6))]" />
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-4">
          <p className="rounded-full bg-[var(--color-sand)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-ink)]">
            {place.regionName[locale]}
          </p>
          <p className="text-sm font-semibold text-[var(--color-teal)]">
            {place.averageRating.toFixed(1)} / 5
          </p>
        </div>
        <h3 className="text-2xl font-semibold text-[var(--color-ink)]">{place.name[locale]}</h3>
        <p className="text-sm leading-7 text-black/65">{place.description[locale]}</p>
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
        <Link
          href={`/${locale}/places/${place.slug}`}
          className="group inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-[var(--color-ink)] bg-white/50 transition-all hover:-translate-y-0.5 hover:border-[var(--color-sky)] hover:text-[var(--color-sky)] hover:bg-white hover:shadow-md"
        >
          <span>{ctaLabel}</span>
          <img src="https://emojicdn.elk.sh/➡️?style=apple" alt="Go" className="h-3 w-3 drop-shadow-sm transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
