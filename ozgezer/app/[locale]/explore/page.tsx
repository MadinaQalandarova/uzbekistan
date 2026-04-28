import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { PlaceCard } from "@/components/place-card";
import {
  getCategories,
  getPlaces,
  getRegions,
  type PlaceFilters,
} from "@/lib/data/catalog-service";
import { getMessages, isLocale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    uz: "Joylarni izlash | O'zGezer",
    ru: "Поиск мест | O'zGezer",
    en: "Explore Places | O'zGezer",
  };
  return { title: titles[locale] ?? titles.uz };
}

type ExplorePageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; region?: string; category?: string }>;
};

export default async function ExplorePage({ params, searchParams }: ExplorePageProps) {
  const { locale } = await params;
  const query = await searchParams;

  if (!isLocale(locale)) {
    notFound();
  }

  const filters: PlaceFilters = {
    q: query.q,
    region: query.region,
    category: query.category,
  };

  const messages = getMessages(locale);
  const [places, regions, categories] = await Promise.all([
    getPlaces(filters),
    getRegions(),
    getCategories(),
  ]);

  const activeRegion = regions.find((r) => r.slug === query.region);
  const activeCategory = categories.find((c) => c.slug === query.category);
  const hasFilters = !!(query.q || query.region || query.category);

  return (
    <div className="py-8">
      {/* ── Hero ── */}
      <section className="container-shell pb-2">
        <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-teal)]">
          {messages.nav.explore}
        </p>
        <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <h1 className="display-title text-4xl font-semibold text-[var(--color-ink)] md:text-5xl">
            {messages.explore.title}
          </h1>
          <p className="max-w-md text-sm leading-7 text-black/60">
            {messages.explore.description}
          </p>
        </div>
      </section>

      {/* ── Filter bar ── */}
      <section className="container-shell py-6">
        <form className="filter-card section-card rounded-[1.75rem] p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
            {/* Search input */}
            <div className="relative">
              <Search
                size={15}
                strokeWidth={2}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
              />
              <input
                type="text"
                name="q"
                defaultValue={query.q ?? ""}
                placeholder={messages.explore.searchPlaceholder}
                className="h-12 w-full rounded-[1rem] border border-black/10 bg-[var(--color-mist)] pl-10 pr-4 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-sky)] focus:ring-2 focus:ring-[var(--color-sky)]/10 placeholder:text-black/35"
              />
            </div>

            {/* Region select */}
            <select
              name="region"
              defaultValue={query.region ?? ""}
              className="h-12 rounded-[1rem] border border-black/10 bg-[var(--color-mist)] px-4 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-sky)] min-w-[160px]"
            >
              <option value="">{messages.explore.allRegions}</option>
              {regions.map((region) => (
                <option key={region.slug} value={region.slug}>
                  {region.name[locale]}
                </option>
              ))}
            </select>

            {/* Category select */}
            <select
              name="category"
              defaultValue={query.category ?? ""}
              className="h-12 rounded-[1rem] border border-black/10 bg-[var(--color-mist)] px-4 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-sky)] min-w-[160px]"
            >
              <option value="">{messages.explore.allCategories}</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.title[locale]}
                </option>
              ))}
            </select>

            {/* Submit */}
            <button
              type="submit"
              className="flex h-12 items-center gap-2 rounded-[1rem] bg-[var(--color-sky)] px-6 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <SlidersHorizontal size={14} strokeWidth={2.2} />
              {messages.explore.searchButton}
            </button>
          </div>
        </form>
      </section>

      {/* ── Results header ── */}
      <section className="container-shell pb-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Count */}
          <span className="rounded-full bg-[var(--color-sky)]/10 px-3.5 py-1.5 text-xs font-semibold text-[var(--color-sky)]">
            {places.length} {messages.explore.resultCount}
          </span>

          {/* Active filter chips */}
          {query.q && (
            <ActiveChip
              label={`"${query.q}"`}
              href={buildResetUrl(locale, query, "q")}
            />
          )}
          {activeRegion && (
            <ActiveChip
              label={activeRegion.name[locale]}
              href={buildResetUrl(locale, query, "region")}
            />
          )}
          {activeCategory && (
            <ActiveChip
              label={activeCategory.title[locale]}
              href={buildResetUrl(locale, query, "category")}
            />
          )}

          {/* Reset all */}
          {hasFilters && (
            <Link
              href={`/${locale}/explore`}
              className="ml-auto flex items-center gap-1.5 rounded-full border border-black/10 px-3.5 py-1.5 text-xs font-semibold text-black/55 transition hover:border-red-300 hover:text-red-500"
            >
              <X size={12} strokeWidth={2.5} />
              {messages.explore.resetFilters}
            </Link>
          )}
        </div>
      </section>

      {/* ── Place cards ── */}
      <section className="container-shell pb-14">
        {places.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {places.map((place) => (
              <PlaceCard
                key={place.slug}
                locale={locale}
                place={place}
                ctaLabel={messages.explore.openDetails}
              />
            ))}
          </div>
        ) : (
          <div className="section-card flex flex-col items-center gap-4 rounded-[1.75rem] px-8 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-mist)]">
              <Search size={28} strokeWidth={1.5} className="text-black/30" />
            </div>
            <div>
              <p className="font-semibold text-[var(--color-ink)]">{messages.explore.noResults}</p>
              <Link
                href={`/${locale}/explore`}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-sky)] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {messages.explore.resetFilters}
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

/* ── Helpers ── */

function ActiveChip({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 rounded-full border border-[var(--color-sky)]/30 bg-[var(--color-sky)]/8 px-3 py-1.5 text-xs font-semibold text-[var(--color-sky)] transition hover:bg-[var(--color-sky)]/15"
    >
      {label}
      <X size={11} strokeWidth={2.5} />
    </Link>
  );
}

function buildResetUrl(
  locale: string,
  query: { q?: string; region?: string; category?: string },
  remove: "q" | "region" | "category"
): string {
  const params = new URLSearchParams();
  if (query.q && remove !== "q") params.set("q", query.q);
  if (query.region && remove !== "region") params.set("region", query.region);
  if (query.category && remove !== "category") params.set("category", query.category);
  const qs = params.toString();
  return `/${locale}/explore${qs ? `?${qs}` : ""}`;
}
