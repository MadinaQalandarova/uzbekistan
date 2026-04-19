import Link from "next/link";
import { notFound } from "next/navigation";

import { PlaceCard } from "@/components/place-card";
import {
  getCategories,
  getPlaces,
  getRegions,
  type PlaceFilters,
} from "@/lib/data/catalog-service";
import { getMessages, isLocale } from "@/lib/i18n";

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

  return (
    <section className="container-shell py-10 pb-14">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-teal)]">
          {messages.nav.explore}
        </p>
        <h1 className="display-title mt-2 text-5xl font-semibold text-[var(--color-ink)]">
          {messages.explore.title}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-black/70">
          {messages.explore.description}
        </p>
      </div>

      <form className="section-card mb-8 grid gap-3 rounded-[1.75rem] p-4 md:grid-cols-[1.4fr_1fr_1fr_auto]">
        <input
          type="text"
          name="q"
          defaultValue={query.q ?? ""}
          placeholder={messages.explore.searchPlaceholder}
          className="h-13 rounded-[1rem] border border-black/10 bg-[var(--color-mist)] px-4 text-sm outline-none focus:border-[var(--color-sky)]"
        />
        <select
          name="region"
          defaultValue={query.region ?? ""}
          className="h-13 rounded-[1rem] border border-black/10 bg-[var(--color-mist)] px-4 text-sm outline-none focus:border-[var(--color-sky)]"
        >
          <option value="">{messages.explore.allRegions}</option>
          {regions.map((region) => (
            <option key={region.slug} value={region.slug}>
              {region.name[locale]}
            </option>
          ))}
        </select>
        <select
          name="category"
          defaultValue={query.category ?? ""}
          className="h-13 rounded-[1rem] border border-black/10 bg-[var(--color-mist)] px-4 text-sm outline-none focus:border-[var(--color-sky)]"
        >
          <option value="">{messages.explore.allCategories}</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.title[locale]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="h-13 rounded-[1rem] bg-[var(--color-ink)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--color-sky)]"
        >
          {messages.explore.searchButton}
        </button>
      </form>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-semibold text-[var(--color-ink)]">
          {places.length} {messages.explore.resultCount}
        </p>
        <Link
          href={`/${locale}/explore`}
          className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-sky)] hover:text-[var(--color-sky)]"
        >
          {messages.explore.resetFilters}
        </Link>
      </div>

      {places.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-3">
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
        <div className="section-card rounded-[1.75rem] p-8 text-center text-sm leading-7 text-black/70">
          {messages.explore.noResults}
        </div>
      )}
    </section>
  );
}
