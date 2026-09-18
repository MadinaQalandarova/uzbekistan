"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { MapPin } from "lucide-react";
import type { PlaceRecord } from "@/lib/data/catalog";
import type { Locale } from "@/lib/i18n";

const loadingLabels: Record<Locale, string> = {
  uz: "Xarita yuklanmoqda…",
  ru: "Загрузка карты…",
  en: "Loading map…",
};

function MapLoading() {
  const params = useParams<{ locale?: string }>();
  const localeParam = params?.locale;
  const locale: Locale = localeParam === "ru" || localeParam === "en" ? localeParam : "uz";
  return (
    <div className="h-full w-full animate-pulse rounded-[2rem] bg-[var(--color-mist)]">
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[var(--color-ink)]/30">
          <MapPin size={36} strokeWidth={1.2} />
          <p className="text-sm">{loadingLabels[locale]}</p>
        </div>
      </div>
    </div>
  );
}

const PlacesMapClient = dynamic(() => import("@/components/places-map-client"), {
  ssr: false,
  loading: () => <MapLoading />,
});

type Props = { places: PlaceRecord[]; locale: Locale };

export function PlacesMapWrapper({ places, locale }: Props) {
  return <PlacesMapClient places={places} locale={locale} />;
}
