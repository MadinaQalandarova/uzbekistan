import type { Metadata } from "next";
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
  Globe,
  Compass,
  Search,
} from "lucide-react";

import { PlaceCard } from "@/components/place-card";
import { GradientSearch } from "@/components/gradient-search";
import { getCategories, getPlaces, getRegions } from "@/lib/data/catalog-service";
import { getMessages, isLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const lang = locale as Locale;
  const titles: Record<Locale, string> = {
    uz: "Bosh sahifa — O'zbekiston sayohat atlasi",
    ru: "Главная — Атлас путешествий по Узбекистану",
    en: "Home — Uzbekistan Travel Atlas",
  };
  const descs: Record<Locale, string> = {
    uz: "Registon, Chimgan, Ichan-Qal'a va boshqa mashhur joylarni kashf eting. O'zbekiston bo'ylab eng yaxshi sayohat yo'nalishlari.",
    ru: "Откройте Регистан, Чимган, Ичан-Калу и другие знаковые места. Лучшие туристические направления по Узбекистану.",
    en: "Discover Registan, Chimgan, Ichon-Qala and more iconic spots. The best travel destinations across Uzbekistan.",
  };
  return {
    title: titles[lang],
    description: descs[lang],
    openGraph: {
      title: titles[lang],
      description: descs[lang],
      type: "website",
      images: [{ url: "/places/itchan-kala.jpg", width: 1200, height: 630, alt: "O'zGezer" }],
    },
  };
}



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
  "museums":    { photo: "/categories/tarixiy.avif",   tint: "bg-violet-950/45" },
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
        <div className="uzbek-hero relative overflow-hidden rounded-[2.5rem] border border-[var(--color-ink)]/8 px-5 py-8 md:px-10 md:py-12">
          {/* Dekorativ suzani orb — milliy naqsh */}
          <div className="suzani-orb pointer-events-none absolute -right-12 -top-12 h-56 w-56 opacity-[0.07] md:h-72 md:w-72" aria-hidden />
          <div className="suzani-orb pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 opacity-[0.05] md:h-80 md:w-80" style={{ animationDelay: "1.2s" }} aria-hidden />

          <div className="fade-up relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-6 md:space-y-7">

              {/* Eyebrow — milliy nuqta bilan */}
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-sky)] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white shadow-sm md:px-4 md:text-xs">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                {messages.home.eyebrow}
              </span>

              {/* H1 — gradient accent bilan */}
              <div className="space-y-4">
                <h1 className="display-title text-[1.7rem] font-semibold leading-[1.15] text-[var(--color-ink)] sm:text-3xl md:text-4xl lg:text-[2.85rem]">
                  {messages.home.title}
                  <span className="bg-gradient-to-r from-[var(--color-sky)] to-[var(--color-gold)] bg-clip-text text-transparent">
                    {messages.home.titleAccent}
                  </span>
                </h1>
                <div className="flex gap-3">
                  <div className="mt-1 h-10 w-[3px] flex-shrink-0 rounded-full bg-gradient-to-b from-[var(--color-sky)] to-[var(--color-gold)]" aria-hidden />
                  <p className="max-w-lg text-sm leading-7 text-[var(--color-ink)]/65">
                    {messages.home.description}
                  </p>
                </div>
              </div>

              {/* Hero search — glass premium container */}
              <div className="rounded-[1.75rem] border border-[var(--color-ink)]/5 bg-white/75 p-3 shadow-[0_8px_28px_rgba(14,31,31,0.06)] backdrop-blur-md">
                <p className="mb-2 flex items-center gap-1.5 px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ink)]/35">
                  <Search size={11} strokeWidth={2.2} />
                  Tezkor qidiruv
                </p>
                <GradientSearch
                  locale={locale}
                  variant="hero"
                  placeholder={messages.home.searchPlaceholder}
                />
                <div className="mt-3 flex flex-wrap items-center gap-1.5 px-1">
                  <span className="text-xs font-medium text-[var(--color-ink)]/35">Mashhur:</span>
                  {[
                    { label: "Registon", q: "Registon" },
                    { label: "Chimgan", q: "Chimgan" },
                    { label: "Xiva", q: "Xiva" },
                  ].map((tag) => (
                    <Link
                      key={tag.q}
                      href={`/${locale}/explore?q=${encodeURIComponent(tag.q)}`}
                      className="rounded-full bg-[var(--color-mist)] px-3 py-1 text-xs font-medium text-[var(--color-ink)]/60 transition hover:bg-[var(--color-sky)] hover:text-white"
                    >
                      {tag.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile-only compact stats row — 4 ustun (desktop bilan mos) */}
              <div className="grid grid-cols-4 gap-2 lg:hidden">
                <div className="rounded-[1rem] bg-[var(--color-sky)]/10 px-2 py-2.5 text-center">
                  <p className="text-base font-semibold text-[var(--color-sky)]">{regions.length}</p>
                  <p className="text-[9px] leading-tight text-[var(--color-ink)]/50">{messages.home.statsRegions}</p>
                </div>
                <div className="rounded-[1rem] bg-[var(--color-teal)]/10 px-2 py-2.5 text-center">
                  <p className="text-base font-semibold text-[var(--color-teal)]">{featuredPlaces.length}</p>
                  <p className="text-[9px] leading-tight text-[var(--color-ink)]/50">{messages.home.statsPlaces}</p>
                </div>
                <div className="rounded-[1rem] bg-[var(--color-gold)]/10 px-2 py-2.5 text-center">
                  <p className="text-base font-semibold text-[var(--color-gold)]">{categories.length}</p>
                  <p className="text-[9px] leading-tight text-[var(--color-ink)]/50">{messages.home.statsCategories}</p>
                </div>
                <div className="rounded-[1rem] bg-[var(--color-ink)]/5 px-2 py-2.5 text-center">
                  <p className="text-base font-semibold text-[var(--color-ink)]">3</p>
                  <p className="text-[9px] leading-tight text-[var(--color-ink)]/50">{messages.home.statsLanguages}</p>
                </div>
              </div>
            </div>

            {/* Stats card — desktop only — glass premium */}
            <div className="hidden lg:block">
              <div className="relative overflow-hidden rounded-[2rem] border border-[var(--color-ink)]/5 bg-white/80 p-6 shadow-[0_16px_40px_rgba(14,31,31,0.08)] backdrop-blur-xl">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-[var(--color-sky)]/12 to-[var(--color-gold)]/14 blur-2xl" aria-hidden />
                <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-gradient-to-tr from-[var(--color-teal)]/10 to-transparent blur-2xl" aria-hidden />
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-sky)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" />
                  O&apos;zGezer
                </p>
                <h2 className="display-title mt-2 text-2xl font-semibold leading-tight text-[var(--color-ink)]">
                  {messages.home.statsTitle}
                </h2>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="group rounded-2xl border border-[var(--color-ink)]/5 bg-[var(--color-mist)]/60 p-4 transition hover:border-[var(--color-sky)]/20 hover:bg-white hover:shadow-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-sky)] text-white shadow-sm">
                      <MapPin size={14} strokeWidth={2} />
                    </div>
                    <p className="mt-3 text-2xl font-bold leading-none text-[var(--color-ink)]">{regions.length}</p>
                    <p className="mt-1 text-xs font-medium text-[var(--color-ink)]/50">{messages.home.statsRegions}</p>
                  </div>
                  <div className="group rounded-2xl border border-[var(--color-ink)]/5 bg-[var(--color-mist)]/60 p-4 transition hover:border-[var(--color-teal)]/20 hover:bg-white hover:shadow-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-teal)] text-white shadow-sm">
                      <Compass size={14} strokeWidth={2} />
                    </div>
                    <p className="mt-3 text-2xl font-bold leading-none text-[var(--color-ink)]">{featuredPlaces.length}</p>
                    <p className="mt-1 text-xs font-medium text-[var(--color-ink)]/50">{messages.home.statsPlaces}</p>
                  </div>
                  <div className="group rounded-2xl border border-[var(--color-ink)]/5 bg-[var(--color-mist)]/60 p-4 transition hover:border-[var(--color-gold)]/20 hover:bg-white hover:shadow-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-gold)] text-white shadow-sm">
                      <Layers size={14} strokeWidth={2} />
                    </div>
                    <p className="mt-3 text-2xl font-bold leading-none text-[var(--color-ink)]">{categories.length}</p>
                    <p className="mt-1 text-xs font-medium text-[var(--color-ink)]/50">{messages.home.statsCategories}</p>
                  </div>
                  <div className="group rounded-2xl border border-[var(--color-ink)]/5 bg-[var(--color-mist)]/60 p-4 transition hover:border-[var(--color-ink)]/15 hover:bg-white hover:shadow-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-ink)] text-white shadow-sm">
                      <Globe size={14} strokeWidth={2} />
                    </div>
                    <p className="mt-3 text-2xl font-bold leading-none text-[var(--color-ink)]">3</p>
                    <p className="mt-1 text-xs font-medium text-[var(--color-ink)]/50">{messages.home.statsLanguages}</p>
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
            className="hidden shrink-0 rounded-full border border-[var(--color-ink)]/10 px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-sky)] hover:text-[var(--color-sky)] md:block"
          >
            {messages.home.seeAllPlaces}
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {categories.map((category, i) => {
            const Icon = CATEGORY_ICONS[category.slug] ?? MapPin;
            const visual = CATEGORY_VISUALS[category.slug] ?? CATEGORY_VISUALS["nature"];

            return (
              <Link
                key={category.slug}
                href={`/${locale}/explore?category=${category.slug}`}
                style={{ animationDelay: `${i * 75}ms` }}
                className="milliy-card group relative flex min-h-[220px] flex-col overflow-hidden rounded-[1.5rem]"
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
            className="hidden shrink-0 rounded-full border border-[var(--color-ink)]/10 px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-sky)] hover:text-[var(--color-sky)] md:block"
          >
            {messages.home.seeAllPlaces}
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featuredPlaces.map((place, i) => (
            <div key={place.slug} className="milliy-card" style={{ animationDelay: `${i * 70}ms` }}>
              <PlaceCard
                locale={locale}
                place={place}
                ctaLabel={messages.home.featuredButton}
              />
            </div>
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
            <p className="max-w-xl text-sm leading-7 text-[var(--color-ink)]/60">
              {messages.home.regionsDescription}
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {regions.slice(0, 12).map((region, i) => (
              <Link
                key={region.slug}
                href={`/${locale}/regions/${region.slug}`}
                style={{ animationDelay: `${i * 55}ms` }}
                className="milliy-card card-rise rounded-[1.2rem] border border-[var(--color-ink)]/8 bg-[var(--color-mist)] px-4 py-4 text-left"
              >
                <p className="text-sm font-semibold text-[var(--color-ink)]">{region.name[locale]}</p>
                <p className="mt-2 text-xs leading-6 text-[var(--color-ink)]/55">{region.focus[locale]}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
