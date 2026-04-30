"use client";

import { useState, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { Star, X, Clock, Banknote, ArrowRight, MapPin } from "lucide-react";
import { PLACE_IMAGES } from "@/lib/place-stories";
import type { PlaceRecord } from "@/lib/data/catalog";
import type { Locale } from "@/lib/i18n";

/* ── Custom marker icon ─────────────────────────────────────────────────────── */
function makeIcon(selected: boolean) {
  const color = selected ? "#F59E0B" : "#2D6B6B";
  const glow = selected ? "#F59E0B" : "#2D6B6B";
  const w = selected ? 44 : 36;
  const h = selected ? 56 : 46;

  return L.divIcon({
    html: `
      <div style="position:relative;width:${w}px;height:${h}px;display:flex;align-items:flex-start;justify-content:center">
        ${selected ? `
          <div style="
            position:absolute;top:50%;left:50%;
            transform:translate(-50%,-65%);
            width:66px;height:66px;border-radius:50%;
            background:${glow}33;
            animation:mapPulse 1.6s ease-out infinite;
          "></div>
        ` : ""}
        <svg width="${w}" height="${h}" viewBox="0 0 44 56" xmlns="http://www.w3.org/2000/svg"
          style="filter:drop-shadow(0 6px 16px ${color}66);transition:all .25s">
          <path d="M22 0C9.85 0 0 9.85 0 22c0 5.6 2.1 10.7 5.56 14.6L22 56l16.44-19.4A21.93 21.93 0 0044 22C44 9.85 34.15 0 22 0z"
            fill="${color}"/>
          <circle cx="22" cy="22" r="11" fill="white" opacity="0.97"/>
          <circle cx="22" cy="22" r="5" fill="${color}"/>
        </svg>
      </div>`,
    className: "",
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
    popupAnchor: [0, -(h + 4)],
  });
}

/* ── Fly-to helper ──────────────────────────────────────────────────────────── */
function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], Math.max(map.getZoom(), 10), { duration: 0.9 });
  }, [lat, lng, map]);
  return null;
}

/* ── Main component ─────────────────────────────────────────────────────────── */
type Props = {
  places: PlaceRecord[];
  locale: Locale;
};

export default function PlacesMapClient({ places, locale }: Props) {
  const [selected, setSelected] = useState<PlaceRecord | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  /* Unique category slugs */
  const categories = Array.from(
    new Set(places.flatMap((p) => p.categoryTitles.map((c) => c[locale])))
  );

  const filtered =
    activeCategory === "all"
      ? places
      : places.filter((p) =>
          p.categoryTitles.some((c) => c[locale] === activeCategory)
        );

  const handleMarker = useCallback((place: PlaceRecord) => {
    setSelected((prev) => (prev?.slug === place.slug ? null : place));
  }, []);

  const imageUrl = selected ? PLACE_IMAGES[selected.slug] ?? null : null;

  const labels: Record<Locale, { all: string; view: string; close: string }> = {
    uz: { all: "Barchasi", view: "Ko'rish", close: "Yopish" },
    ru: { all: "Все",      view: "Открыть", close: "Закрыть" },
    en: { all: "All",      view: "View",    close: "Close" },
  };
  const t = labels[locale];

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[2rem]">

      {/* ── Leaflet Map ─────────────────────────────────────────────── */}
      <MapContainer
        center={[41.0, 63.5]}
        zoom={6}
        zoomControl={false}
        attributionControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Beautiful CartoDB Voyager tile */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com">CARTO</a>'
          maxZoom={19}
        />

        {/* Fly camera when place selected */}
        {selected && (
          <FlyTo lat={selected.latitude} lng={selected.longitude} />
        )}

        {/* Markers */}
        {filtered.map((place) => (
          <Marker
            key={place.slug}
            position={[place.latitude, place.longitude]}
            icon={makeIcon(selected?.slug === place.slug)}
            eventHandlers={{ click: () => handleMarker(place) }}
          />
        ))}
      </MapContainer>

      {/* ── Category filter pills ─────────────────────────────────── */}
      <div className="pointer-events-none absolute left-0 right-0 top-4 z-[800] flex justify-center px-4">
        <div className="pointer-events-auto flex max-w-full flex-wrap justify-center gap-2
          rounded-[2rem] bg-white/85 p-2 shadow-xl shadow-black/10 backdrop-blur-xl">
          <button
            onClick={() => { setActiveCategory("all"); setSelected(null); }}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              activeCategory === "all"
                ? "bg-[var(--color-sky)] text-white shadow-sm"
                : "text-[var(--color-ink)]/55 hover:bg-[var(--color-mist)] hover:text-[var(--color-sky)]"
            }`}
          >
            {t.all} ({places.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setSelected(null); }}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                activeCategory === cat
                  ? "bg-[var(--color-sky)] text-white shadow-sm"
                  : "text-[var(--color-ink)]/55 hover:bg-[var(--color-mist)] hover:text-[var(--color-sky)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Place card (bottom) ───────────────────────────────────── */}
      <div
        className={`pointer-events-none absolute bottom-0 left-0 right-0 z-[900]
          flex justify-center pb-5 px-4 transition-all duration-400 ease-out
          ${selected ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
      >
        {selected && (
          <div className="pointer-events-auto w-full max-w-sm overflow-hidden
            rounded-[1.75rem] bg-white/92 shadow-2xl shadow-black/20 backdrop-blur-2xl
            ring-1 ring-white/60">

            {/* Image */}
            {imageUrl && (
              <div className="relative h-36 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={selected.name[locale]}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {/* Close button */}
                <button
                  onClick={() => setSelected(null)}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center
                    rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/55"
                  aria-label={t.close}
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
                {/* Region chip */}
                <span className="absolute bottom-3 left-3 rounded-full bg-[var(--color-sky)]/90
                  px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                  {selected.regionName[locale]}
                </span>
              </div>
            )}

            {/* No image — just close button */}
            {!imageUrl && (
              <div className="flex justify-end px-4 pt-4">
                <button
                  onClick={() => setSelected(null)}
                  aria-label={t.close}
                  className="flex h-7 w-7 items-center justify-center rounded-full
                    bg-[var(--color-mist)] text-[var(--color-ink)]/50 transition hover:bg-[var(--color-sand)]"
                >
                  <X size={13} strokeWidth={2.5} />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="px-5 pb-5 pt-3">
              {/* Name + rating */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="display-title text-lg font-semibold leading-snug text-[var(--color-ink)]">
                  {selected.name[locale]}
                </h3>
                {selected.averageRating > 0 && (
                  <div className="flex flex-shrink-0 items-center gap-1 rounded-full
                    bg-amber-50 px-2.5 py-1 ring-1 ring-amber-200">
                    <Star size={11} strokeWidth={0} fill="#F59E0B" className="text-amber-400" />
                    <span className="text-xs font-semibold text-amber-600">
                      {selected.averageRating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {/* Meta row */}
              <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-[var(--color-ink)]/50">
                {selected.price && (
                  <span className="flex items-center gap-1">
                    <Banknote size={12} strokeWidth={1.8} />
                    {selected.price}
                  </span>
                )}
                {selected.workingHours && (
                  <span className="flex items-center gap-1">
                    <Clock size={12} strokeWidth={1.8} />
                    {selected.workingHours}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <MapPin size={12} strokeWidth={1.8} />
                  {selected.latitude.toFixed(4)}, {selected.longitude.toFixed(4)}
                </span>
              </div>

              {/* Categories */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {selected.categoryTitles.slice(0, 3).map((cat) => (
                  <span key={cat[locale]}
                    className="rounded-full border border-[var(--color-ink)]/8
                      bg-[var(--color-mist)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--color-ink)]/70">
                    {cat[locale]}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={`/${locale}/places/${selected.slug}`}
                className="mt-4 flex items-center justify-center gap-2 rounded-full
                  bg-[var(--color-sky)] py-2.5 text-sm font-semibold text-white
                  shadow-md shadow-[var(--color-sky)]/30 transition hover:opacity-90 active:scale-[0.98]"
              >
                {t.view}
                <ArrowRight size={14} strokeWidth={2.2} />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ── Attribution ──────────────────────────────────────────── */}
      <div className="pointer-events-none absolute bottom-3 right-4 z-[700]
        rounded-full bg-white/70 px-2 py-0.5 text-[9px] text-[var(--color-ink)]/40 backdrop-blur-sm">
        © OpenStreetMap · CARTO
      </div>
    </div>
  );
}
