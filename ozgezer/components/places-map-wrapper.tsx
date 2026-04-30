"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import type { PlaceRecord } from "@/lib/data/catalog";
import type { Locale } from "@/lib/i18n";

const PlacesMapClient = dynamic(() => import("@/components/places-map-client"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-[2rem] bg-[var(--color-mist)]">
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[var(--color-ink)]/30">
          <MapPin size={36} strokeWidth={1.2} />
          <p className="text-sm">Xarita yuklanmoqda…</p>
        </div>
      </div>
    </div>
  ),
});

type Props = { places: PlaceRecord[]; locale: Locale };

export function PlacesMapWrapper({ places, locale }: Props) {
  return <PlacesMapClient places={places} locale={locale} />;
}
