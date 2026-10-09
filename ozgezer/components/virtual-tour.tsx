"use client";

import { useEffect, useRef, useState } from "react";
import pannellum from "pannellum";
import { Orbit } from "lucide-react";

export type PanoramaScene = { src: string; title: string };

type Props = {
  scenes: PanoramaScene[];
  hint: string;
};

/* 360° panoramani 3D shar ko'rinishida aylantirib ko'rsatadi (Pannellum).
   Rasm 2:1 equirectangular formatda bo'lishi kerak (/public/panoramas/). */
export function VirtualTour({ scenes, hint }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const key = scenes.map((s) => s.src).join("|");

  useEffect(() => {
    const host = hostRef.current;
    const scene = scenes[active];
    if (!host || !scene) return;
    const viewer = pannellum.viewer(host, {
      type: "equirectangular",
      panorama: scene.src,
      autoLoad: true,
      autoRotate: -2,
      compass: false,
      showZoomCtrl: true,
      mouseZoom: true,
    });
    return () => {
      viewer.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, key]);

  if (!scenes.length) return null;

  return (
    <div>
      <div
        ref={hostRef}
        className="h-72 w-full overflow-hidden rounded-[1.5rem] bg-black/90 sm:h-80"
      />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-[11px] text-[var(--color-ink)]/50">
          <Orbit size={13} strokeWidth={2} />
          {hint}
        </span>
        {scenes.length > 1 && (
          <span className="flex flex-wrap gap-1.5">
            {scenes.map((s, i) => (
              <button
                key={s.src}
                type="button"
                onClick={() => setActive(i)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  i === active
                    ? "bg-[var(--color-sky)] text-white shadow-sm"
                    : "border border-[var(--color-ink)]/10 text-[var(--color-ink)]/60 hover:border-[var(--color-sky)]/50 hover:text-[var(--color-sky)]"
                }`}
              >
                {s.title}
              </button>
            ))}
          </span>
        )}
      </div>
    </div>
  );
}
