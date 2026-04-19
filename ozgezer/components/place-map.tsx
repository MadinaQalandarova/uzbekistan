"use client";

import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./map/map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-[1.75rem] border border-black/10 bg-[var(--color-mist)]">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-sky)] border-t-transparent"></div>
    </div>
  ),
});

type PlaceMapProps = {
  latitude: number;
  longitude: number;
  placeName: string;
};

export function PlaceMap({ latitude, longitude, placeName }: PlaceMapProps) {
  return (
    <div className="h-72 w-full overflow-hidden rounded-[1.75rem] shadow-sm shadow-slate-900/5">
      <MapComponent latitude={latitude} longitude={longitude} placeName={placeName} />
    </div>
  );
}
