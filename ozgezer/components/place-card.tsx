import Link from "next/link";
import { Star } from "lucide-react";

import type { PlaceRecord } from "@/lib/data/catalog";
import type { Locale } from "@/lib/i18n";
import { PLACE_IMAGES, PLACE_STORIES } from "@/lib/place-stories";

type PlaceCardProps = {
  locale: Locale;
  place: PlaceRecord;
  ctaLabel: string;
};

export function PlaceCard({ locale, place, ctaLabel }: PlaceCardProps) {
  const imageUrl = PLACE_IMAGES[place.slug];
  const story = PLACE_STORIES[place.slug];
  const quote = story?.quote[locale] ?? null;

  return (
    <article className="section-card card-rise overflow-hidden rounded-[1.75rem]">
      {/* Banner — real rasm yoki gradient */}
      <div className="relative h-44 overflow-hidden">
        {imageUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={place.name[locale]}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </>
        ) : (
          <div className="h-full bg-[linear-gradient(135deg,rgba(45,107,107,0.9),rgba(91,138,110,0.75),rgba(245,158,11,0.55))]" />
        )}
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-4">
          <p className="rounded-full bg-[var(--color-sky)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-sky)]">
            {place.regionName[locale]}
          </p>
          {place.averageRating > 0 && (
            <p className="flex items-center gap-1 text-sm font-semibold text-[var(--color-teal)]">
              <Star size={13} strokeWidth={0} fill="#F59E0B" className="text-[#F59E0B]" />
              {place.averageRating.toFixed(1)}
            </p>
          )}
        </div>
        <h3 className="text-xl font-semibold leading-snug text-[var(--color-ink)]">
          {place.name[locale]}
        </h3>
        {quote ? (
          <p className="line-clamp-2 font-serif text-sm italic leading-6 text-black/55">
            &ldquo;{quote}&rdquo;
          </p>
        ) : (
          <p className="line-clamp-2 text-sm leading-6 text-black/60">
            {place.description[locale]}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {place.categoryTitles.slice(0, 2).map((category) => (
            <span
              key={`${place.slug}-${category[locale]}`}
              className="rounded-full border border-black/8 bg-[var(--color-mist)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-ink)]"
            >
              {category[locale]}
            </span>
          ))}
        </div>
        <Link
          href={`/${locale}/places/${place.slug}`}
          className="group inline-flex items-center gap-2 rounded-full border border-black/10 bg-transparent px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-sky)] hover:text-[var(--color-sky)]"
        >
          <span>{ctaLabel}</span>
          <svg
            width="13"
            height="13"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden
          >
            <line x1="3" y1="8" x2="13" y2="8" />
            <polyline points="9 4 13 8 9 12" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
