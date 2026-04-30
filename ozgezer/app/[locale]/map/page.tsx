import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";

import { getPlaces } from "@/lib/data/catalog-service";
import { isLocale, type Locale } from "@/lib/i18n";
import { PlacesMapWrapper } from "@/components/places-map-wrapper";

type MapPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: MapPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const titles: Record<Locale, string> = {
    uz: "Interaktiv xarita — O'zbekiston",
    ru: "Интерактивная карта — Узбекистан",
    en: "Interactive Map — Uzbekistan",
  };
  const descs: Record<Locale, string> = {
    uz: "Barcha sayohat joylarini xaritada ko'ring — marker bosib batafsil ma'lumot oling.",
    ru: "Смотрите все достопримечательности на карте — нажмите на маркер для подробностей.",
    en: "View all travel spots on the map — tap a marker for details.",
  };
  return {
    title: titles[locale as Locale],
    description: descs[locale as Locale],
  };
}

export default async function MapPage({ params }: MapPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const places = await getPlaces();

  const headings: Record<Locale, { title: string; sub: string }> = {
    uz: {
      title: "Interaktiv xarita",
      sub: `${places.length} ta joy — markerga bosing`,
    },
    ru: {
      title: "Интерактивная карта",
      sub: `${places.length} мест — нажмите на маркер`,
    },
    en: {
      title: "Interactive Map",
      sub: `${places.length} places — tap a marker`,
    },
  };
  const h = headings[locale as Locale];

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col">
      {/* ── Header strip ── */}
      <div className="container-shell flex items-center justify-between py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full
            bg-gradient-to-br from-[var(--color-sky)] to-[var(--color-teal)]">
            <MapPin size={16} className="text-white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="display-title text-base font-semibold text-[var(--color-ink)]">
              {h.title}
            </h1>
            <p className="text-[11px] text-[var(--color-ink)]/45">{h.sub}</p>
          </div>
        </div>
      </div>

      {/* ── Map — fills remaining height ── */}
      <div className="container-shell flex-1 pb-4">
        <div className="h-full">
          <PlacesMapWrapper places={places} locale={locale as Locale} />
        </div>
      </div>
    </div>
  );
}
