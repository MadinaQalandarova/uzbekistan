import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Landmark,
  Mountain,
  TreePine,
  UtensilsCrossed,
  ShoppingBag,
  Library,
  Star,
  Bike,
  Layers,
  Building2,
  MapPin,
} from "lucide-react";

import { PlaceCard } from "@/components/place-card";
import { SearchForm } from "@/components/search-form";
import { getCategories, getPlaces, getRegions } from "@/lib/data/catalog-service";
import { getMessages, isLocale } from "@/lib/i18n";

const SEARCH_EXAMPLES: Record<string, string[]> = {
  uz: ["Registon maydoni", "Chimgan tog'i", "Ichan-Qal'a", "Amir Temur maqbarasi", "Shodlik bozori"],
  ru: ["Площадь Регистан", "Горы Чимган", "Ичан-Кала", "Мавзолей Тамерлана", "Базар Чорсу"],
  en: ["Registan Square", "Chimgan Mountains", "Ichon-Qala", "Tamerlane Mausoleum", "Chorsu Bazaar"],
};

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

type LucideIcon = React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;

/** Kategoriya slug → Lucide icon komponenti */
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "historical":  Landmark,
  "nature":      Mountain,
  "leisure":     TreePine,
  "food":        UtensilsCrossed,
  "markets":     ShoppingBag,
  "museums":     Library,
  "religious":   Star,
  "sport":       Bike,
  "archaeology": Layers,
  "urban":       Building2,
};

/**
 * Har bir kategoriya uchun rasm ma'lumotlari:
 * - photo: Unsplash URL
 * - tint: rang qatlami (foto bir xil ko'rinsa ham farq bo'lsin)
 */
const CATEGORY_VISUALS: Record<string, { photo: string; tint: string }> = {
  "markets":    { photo: "/categories/bozorlar.avif",  tint: "bg-orange-950/40" },
  "leisure":    { photo: "/categories/dam-olish.avif", tint: "bg-emerald-950/40" },
  "food":       { photo: "/categories/ovqat.avif",     tint: "bg-red-950/40" },
  "nature":     { photo: "/categories/tabiat.avif",    tint: "bg-sky-950/35" },
  "historical": { photo: "/categories/tarixiy.avif",   tint: "bg-amber-950/40" },
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
        <div className="uzbek-hero relative overflow-hidden rounded-[2rem] border border-black/8 px-5 py-8 md:px-10 md:py-14">

          <div className="fade-up grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-5 md:space-y-7">

              {/* Eyebrow badge */}
              <span className="inline-flex rounded-full border border-[var(--color-sky)]/30 bg-[var(--color-sky)]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--color-sky)] md:px-4 md:py-1.5 md:text-xs">
                {messages.home.eyebrow}
              </span>

              {/* H1 — mobile: text-2xl, tablet: text-4xl, desktop: text-5xl */}
              <div className="space-y-3">
                <h1 className="display-title text-2xl font-semibold leading-tight text-[var(--color-ink)] sm:text-3xl md:text-4xl lg:text-5xl">
                  {messages.home.title}
                  <span className="text-[var(--color-sky)]">{messages.home.titleAccent}</span>
                </h1>
                <p className="max-w-lg text-xs leading-6 text-black/60 sm:text-sm sm:leading-7">
                  {messages.home.description}
                </p>
              </div>

              {/* Search form — animated typewriter + shimmer button */}
              <SearchForm
                locale={locale}
                regions={regions}
                labels={{
                  placeholder: messages.home.searchPlaceholder,
                  regionPlaceholder: messages.home.regionPlaceholder,
                  searchButton: messages.home.searchButton,
                }}
                examples={SEARCH_EXAMPLES[locale] ?? SEARCH_EXAMPLES.uz}
              />

              {/* Mobile-only compact stats row */}
              <div className="flex gap-3 lg:hidden">
                <div className="flex-1 rounded-[1rem] bg-[var(--color-sky)]/10 px-3 py-2.5 text-center">
                  <p className="text-lg font-semibold text-[var(--color-sky)]">{regions.length}</p>
                  <p className="text-[10px] text-black/50">{messages.home.statsRegions}</p>
                </div>
                <div className="flex-1 rounded-[1rem] bg-[var(--color-teal)]/10 px-3 py-2.5 text-center">
                  <p className="text-lg font-semibold text-[var(--color-teal)]">{featuredPlaces.length}+</p>
                  <p className="text-[10px] text-black/50">{messages.home.statsPlaces}</p>
                </div>
                <div className="flex-1 rounded-[1rem] bg-[var(--color-gold)]/10 px-3 py-2.5 text-center">
                  <p className="text-lg font-semibold text-[var(--color-gold)]">{categories.length}</p>
                  <p className="text-[10px] text-black/50">{messages.home.statsCategories}</p>
                </div>
              </div>
            </div>

            {/* Stats card — desktop only */}
            <div className="hidden lg:block">
              <div className="section-card rounded-[1.75rem] p-5">
                <div className="rounded-[1.5rem] bg-[linear-gradient(160deg,#2D6B6B_0%,#5B8A6E_55%,#F59E0B_100%)] p-6 text-white">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/70">O&apos;zGezer</p>
                  <h2 className="display-title mt-3 text-3xl font-semibold leading-snug">
                    {messages.home.statsTitle}
                  </h2>
                  <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-white/15 p-4">
                      <p className="text-2xl font-semibold">{regions.length}</p>
                      <p className="mt-1 text-xs text-white/70">{messages.home.statsRegions}</p>
                    </div>
                    <div className="rounded-2xl bg-white/15 p-4">
                      <p className="text-2xl font-semibold">{featuredPlaces.length}+</p>
                      <p className="mt-1 text-xs text-white/70">{messages.home.statsPlaces}</p>
                    </div>
                    <div className="rounded-2xl bg-white/15 p-4">
                      <p className="text-2xl font-semibold">{categories.length}</p>
                      <p className="mt-1 text-xs text-white/70">{messages.home.statsCategories}</p>
                    </div>
                    <div className="rounded-2xl bg-white/15 p-4">
                      <p className="text-2xl font-semibold">3</p>
                      <p className="mt-1 text-xs text-white/70">{messages.home.statsLanguages}</p>
                    </div>
                  </div>
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
            <h2 className="display-title text-2xl font-semibold text-[var(--color-ink)] md:text-3xl lg:text-4xl">
              {messages.home.categoriesTitle}
            </h2>
          </div>
          <Link
            href={`/${locale}/explore`}
            className="hidden shrink-0 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-sky)] hover:text-[var(--color-sky)] md:block"
          >
            {messages.home.seeAllPlaces}
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categories.slice(0, 5).map((category) => {
            const Icon = CATEGORY_ICONS[category.slug] ?? MapPin;
            const visual = CATEGORY_VISUALS[category.slug] ?? CATEGORY_VISUALS["nature"];

            return (
              <Link
                key={category.slug}
                href={`/${locale}/explore?category=${category.slug}`}
                className="group relative flex min-h-[220px] flex-col overflow-hidden rounded-[1.5rem]"
              >
                {/* ── 1-qatlam: real rasm (blur + zoom) ── */}
                <Image
                  src={visual.photo}
                  alt={category.title[locale]}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  className="object-cover scale-110 blur-[3px] transition-transform duration-700 group-hover:scale-125"
                />

                {/* ── 2-qatlam: kategoriyaga xos rang tinti ── */}
                <div className={`absolute inset-0 ${visual.tint}`} />

                {/* ── 3-qatlam: qora gradient (matn o'qilsin) ── */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

                {/* ── 4-qatlam: content ── */}
                <div className="relative z-10 flex flex-1 flex-col justify-between p-5">
                  {/* Icon */}
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/20 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/25 group-hover:scale-110">
                    <Icon size={20} strokeWidth={1.75} />
                  </div>

                  {/* Matn */}
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {category.title[locale]}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-white/70">
                      {category.description[locale]}
                    </p>
                    <p className="mt-3 inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/90 ring-1 ring-white/15 backdrop-blur-sm">
                      {category.stat} {messages.home.placesCount}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container-shell py-8">
        <div className="mb-6 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-sky)]">
              {messages.home.featuredEyebrow}
            </p>
            <h2 className="display-title text-2xl font-semibold text-[var(--color-ink)] md:text-3xl lg:text-4xl">
              {messages.home.featuredTitle}
            </h2>
          </div>
          <Link
            href={`/${locale}/explore`}
            className="hidden shrink-0 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-sky)] hover:text-[var(--color-sky)] md:block"
          >
            {messages.home.seeAllPlaces}
          </Link>
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
              <h2 className="display-title text-2xl font-semibold text-[var(--color-ink)] md:text-3xl lg:text-4xl">
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
