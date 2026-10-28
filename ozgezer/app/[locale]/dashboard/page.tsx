import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BarChart3,
  Eye,
  MapPin,
  MessageSquare,
  Star,
  TrendingUp,
  Trophy,
} from "lucide-react";

import { PlaceCard } from "@/components/place-card";
import {
  getDashboardData,
  type DashboardPlace,
} from "@/lib/data/catalog-service";
import { getMessages, isLocale, type Locale } from "@/lib/i18n";
import { PLACE_IMAGES } from "@/lib/place-stories";

type DashboardPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: DashboardPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const titles: Record<Locale, string> = {
    uz: "Statistika paneli — O'zGezer",
    ru: "Панель статистики — O'zGezer",
    en: "Stats dashboard — O'zGezer",
  };
  const descs: Record<Locale, string> = {
    uz: "Eng yaxshi, eng ko'p borilgan va eng yaxshi sharh olgan joylar bir sahifada.",
    ru: "Лучшие, самые посещаемые и самые обсуждаемые места Узбекистана на одной странице.",
    en: "Best, most visited and best reviewed places in Uzbekistan on one page.",
  };

  return {
    title: titles[locale as Locale],
    description: descs[locale as Locale],
  };
}

function formatNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale).format(value);
}

/* Ikki ro'yxat (ko'p borilgan / ko'p sharh olgan) uchun umumiy komponent */
function RankedPlaces({
  locale,
  places,
  mode,
  viewsLabel,
  reviewsLabel,
  emptyLabel,
}: {
  locale: Locale;
  places: DashboardPlace[];
  mode: "views" | "reviews";
  viewsLabel: string;
  reviewsLabel: string;
  emptyLabel: string;
}) {
  if (places.length === 0) {
    return (
      <div className="section-card mt-4 rounded-[1.5rem] px-5 py-6 text-sm text-[var(--color-ink)]/50">
        {emptyLabel}
      </div>
    );
  }

  return (
    <ol className="mt-4 space-y-2.5">
      {places.map((place, index) => {
        const imageUrl = PLACE_IMAGES[place.slug];
        const value = mode === "views" ? place.viewCount : place.reviewCount;
        const label = mode === "views" ? viewsLabel : reviewsLabel;

        return (
          <li key={place.slug}>
            <Link
              href={`/${locale}/places/${place.slug}`}
              className="section-card group flex items-center gap-3.5 rounded-[1.4rem] py-2.5 pl-3 pr-4 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-mist)] text-xs font-semibold text-[var(--color-ink)]/50">
                {index + 1}
              </span>

              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[0.9rem] bg-[linear-gradient(135deg,rgba(111,78,55,0.9),rgba(110,86,149,0.6))]">
                {imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt={place.name[locale]}
                    width={48}
                    height={48}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-[var(--color-ink)]">
                  {place.name[locale]}
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-[var(--color-ink)]/45">
                  <MapPin size={11} strokeWidth={2} className="shrink-0" />
                  {place.regionName[locale]}
                </span>
              </span>

              <span className="shrink-0 text-right">
                <span className="block text-sm font-semibold text-[var(--color-sky)]">
                  {formatNumber(value, locale)}
                </span>
                <span className="block text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink)]/40">
                  {label}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const messages = getMessages(locale);
  const t = messages.dashboard;
  const data = await getDashboardData();

  const stats = [
    {
      label: t.statsPlaces,
      value: formatNumber(data.totalPlaces, locale),
      Icon: MapPin,
    },
    {
      label: t.statsViews,
      value: formatNumber(data.totalViews, locale),
      Icon: Eye,
    },
    {
      label: t.statsReviews,
      value: formatNumber(data.totalReviews, locale),
      Icon: MessageSquare,
    },
    {
      label: t.statsRating,
      value: data.averageRating.toFixed(1),
      Icon: Star,
    },
  ];

  return (
    <div className="py-8">
      {/* ── Sarlavha va umumiy raqamlar ── */}
      <section className="container-shell pb-6">
        <div className="section-card rounded-[2rem] p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-sky)] to-[var(--color-teal)] shadow-lg shadow-[var(--color-sky)]/20">
              <BarChart3 size={24} className="text-white" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-teal)]">
                {messages.nav.dashboard}
              </p>
              <h1 className="display-title mt-0.5 text-2xl font-semibold text-[var(--color-ink)] md:text-3xl">
                {t.title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-ink)]/55">
                {t.description}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map(({ label, value, Icon }) => (
              <div
                key={label}
                className="rounded-[1.25rem] border border-[var(--color-ink)]/8 bg-[var(--color-mist)] px-4 py-4"
              >
                <div className="flex items-center gap-2 text-[var(--color-sky)]">
                  <Icon size={14} strokeWidth={2} />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink)]/40">
                    {label}
                  </p>
                </div>
                <p className="display-title mt-2 text-2xl font-semibold text-[var(--color-ink)]">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Eng yaxshi joylar ── */}
      <section className="container-shell pb-10">
        <div className="mb-5 flex items-end justify-between gap-6">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-gold)]">
              <Trophy size={14} strokeWidth={2} />
              {t.bestTitle}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-ink)]/55">
              {t.bestDescription}
            </p>
          </div>
          <Link
            href={`/${locale}/explore`}
            className="hidden shrink-0 rounded-full border border-[var(--color-ink)]/10 px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-sky)] hover:text-[var(--color-sky)] md:block"
          >
            {t.openDetails}
          </Link>
        </div>

        {data.bestPlaces.length === 0 ? (
          <div className="section-card rounded-[1.75rem] px-6 py-10 text-center text-sm text-[var(--color-ink)]/50">
            {t.empty}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.bestPlaces.map((place) => (
              <PlaceCard
                key={place.slug}
                locale={locale}
                place={place}
                ctaLabel={t.openDetails}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Ko'p borilgan va ko'p sharh olgan joylar ── */}
      <section className="container-shell pb-14">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-sky)]">
              <TrendingUp size={14} strokeWidth={2} />
              {t.visitedTitle}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-ink)]/55">
              {t.visitedDescription}
            </p>
            <RankedPlaces
              locale={locale}
              places={data.mostVisited}
              mode="views"
              viewsLabel={t.viewsLabel}
              reviewsLabel={t.reviewsLabel}
              emptyLabel={t.empty}
            />
          </div>

          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-teal)]">
              <MessageSquare size={14} strokeWidth={2} />
              {t.reviewedTitle}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-ink)]/55">
              {t.reviewedDescription}
            </p>
            <RankedPlaces
              locale={locale}
              places={data.bestReviewed}
              mode="reviews"
              viewsLabel={t.viewsLabel}
              reviewsLabel={t.reviewsLabel}
              emptyLabel={t.empty}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
