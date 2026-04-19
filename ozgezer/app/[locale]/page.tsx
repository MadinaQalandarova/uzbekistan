import Link from "next/link";
import { notFound } from "next/navigation";

import { PlaceCard } from "@/components/place-card";
import { getCategories, getPlaces, getRegions } from "@/lib/data/catalog-service";
import { getMessages, isLocale } from "@/lib/i18n";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocaleHomePage({ params }: LocalePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const messages = getMessages(locale);
  const [categories, regions, featuredPlaces] = await Promise.all([
    getCategories(),
    getRegions(),
    getPlaces(),
  ]);

  return (
    <div className="py-8">
      <section className="container-shell py-4 md:py-8">
        <div className="uzbek-hero suzani-grid relative overflow-hidden rounded-[2rem] border border-black/8 px-6 py-8 shadow-[0_30px_80px_rgba(17,32,49,0.12)] md:px-10 md:py-12">
          <div className="suzani-orb float-gentle -left-10 top-10 h-32 w-32 md:h-44 md:w-44" />
          <div className="suzani-orb float-gentle-delay -right-8 bottom-12 h-24 w-24 md:h-36 md:w-36" />
          <div className="national-band shimmer-in absolute right-6 top-6 hidden h-16 w-28 rounded-[1.4rem] md:block" />

          <div className="fade-up grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-6">
              <span className="inline-flex rounded-full border border-black/10 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-sky)]">
                {messages.home.eyebrow}
              </span>
              <div className="space-y-4">
                <h1 className="display-title max-w-4xl text-5xl leading-none font-semibold text-[var(--color-ink)] md:text-7xl">
                  {messages.home.title}
                  <span className="text-[var(--color-sky)]">{messages.home.titleAccent}</span>
                </h1>
                <p className="max-w-2xl text-base leading-8 text-black/70 md:text-lg">
                  {messages.home.description}
                </p>
              </div>

              <div className="fade-up-delay flex flex-wrap gap-3 text-sm text-[var(--color-ink)]">
                <div className="rounded-full border border-black/8 bg-white/80 px-4 py-2 shadow-sm shadow-slate-900/5">
                  14 region
                </div>
                <div className="rounded-full border border-black/8 bg-white/80 px-4 py-2 shadow-sm shadow-slate-900/5">
                  Admin-only control
                </div>
                <div className="rounded-full border border-black/8 bg-white/80 px-4 py-2 shadow-sm shadow-slate-900/5">
                  UZ / RU / EN
                </div>
              </div>

              <form
                action={`/${locale}/explore`}
                className="fade-up-delay grid gap-3 rounded-[1.75rem] bg-white/85 p-3 shadow-lg shadow-slate-900/5 md:grid-cols-[1.5fr_1fr_auto]"
              >
                <input
                  type="text"
                  name="q"
                  placeholder={messages.home.searchPlaceholder}
                  className="h-14 rounded-[1.2rem] border border-black/10 bg-[var(--color-mist)] px-5 text-sm outline-none transition placeholder:text-black/35 focus:border-[var(--color-sky)]"
                />
                <select
                  name="region"
                  className="h-14 rounded-[1.2rem] border border-black/10 bg-[var(--color-mist)] px-4 text-sm text-black/70 outline-none focus:border-[var(--color-sky)]"
                >
                  <option>{messages.home.regionPlaceholder}</option>
                  {regions.slice(0, 8).map((region) => (
                    <option key={region.slug} value={region.slug}>
                      {region.name[locale]}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="h-14 rounded-[1.2rem] bg-[var(--color-ink)] px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--color-sky)]"
                >
                  {messages.home.searchButton}
                </button>
              </form>
            </div>

            <div className="section-card float-gentle-delay rounded-[1.75rem] p-5">
              <div className="rounded-[1.5rem] bg-[linear-gradient(160deg,#1b6ca8_0%,#167c74_55%,#d4a63d_100%)] p-6 text-white">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">MVP</p>
                <h2 className="display-title mt-3 text-3xl font-semibold">
                  {messages.home.adminTitle}
                </h2>
                <div className="mt-6 space-y-3 text-sm">
                  {messages.home.adminPoints.map((point) => (
                    <div key={point} className="rounded-2xl bg-white/15 p-4">
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-8">
        <div className="mb-6 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-teal)]">
              {messages.home.categoriesEyebrow}
            </p>
            <h2 className="display-title text-4xl font-semibold text-[var(--color-ink)]">
              {messages.home.categoriesTitle}
            </h2>
          </div>
          <p className="hidden max-w-md text-sm leading-7 text-black/60 md:block">
            {messages.home.categoriesDescription}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category, index) => (
            <article
              key={category.title[locale]}
              className="section-card card-rise rounded-[1.5rem] p-5"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-mist)] text-xl text-[var(--color-sky)]">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-ink)]">
                {category.title[locale]}
              </h3>
              <p className="mt-3 text-sm leading-7 text-black/65">
                {category.description[locale]}
              </p>
              <p className="mt-6 text-sm font-semibold text-[var(--color-teal)]">
                {category.stat}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-shell py-8">
        <div className="mb-6 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-sky)]">
              {messages.home.featuredEyebrow}
            </p>
            <h2 className="display-title text-4xl font-semibold text-[var(--color-ink)]">
              {messages.home.featuredTitle}
            </h2>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {featuredPlaces.slice(0, 3).map((place) => (
            <PlaceCard
              key={place.slug}
              locale={locale}
              place={place}
              ctaLabel={messages.home.featuredButton}
            />
          ))}
        </div>
      </section>

      <section className="container-shell py-8">
        <div className="section-card rounded-[2rem] p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-gold)]">
                {messages.home.regionsEyebrow}
              </p>
              <h2 className="display-title text-4xl font-semibold text-[var(--color-ink)]">
                {messages.home.regionsTitle}
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-black/60">
              {messages.home.regionsDescription}
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {regions.slice(0, 12).map((region) => (
              <Link
                key={region.slug}
                href={`/${locale}/regions/${region.slug}`}
                className="card-rise rounded-[1.2rem] border border-black/8 bg-[var(--color-mist)] px-4 py-4 text-left"
              >
                <p className="text-sm font-semibold text-[var(--color-ink)]">{region.name[locale]}</p>
                <p className="mt-2 text-xs leading-6 text-black/55">{region.focus[locale]}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
