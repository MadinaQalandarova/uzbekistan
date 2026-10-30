"use client";

import { useCallback, useSyncExternalStore } from "react";
import { Check } from "lucide-react";

export type PaletteId = "mocha" | "cerulean" | "glacier" | "porcelain";

type Palette = {
  id: PaletteId;
  name: string;
  /* [background, primary, accent] — faqat ko'rgazma uchun */
  swatches: [string, string, string];
};

export const PALETTES: Palette[] = [
  { id: "mocha", name: "Mocha Atelier", swatches: ["#E5E4E2", "#6F4E37", "#6E5695"] },
  { id: "cerulean", name: "Neon Cerulean", swatches: ["#F2F6F9", "#007BA7", "#FF2D95"] },
  { id: "glacier", name: "Glacier Blue", swatches: ["#BFE9FF", "#6F3DFF", "#B7B7B7"] },
  { id: "porcelain", name: "Porcelain Beige", swatches: ["#F3E6D7", "#9B7ED6", "#E4FF3B"] },
];

const STORAGE_KEY = "ozgezer-palette";

function isPaletteId(value: string | undefined): value is PaletteId {
  return PALETTES.some((item) => item.id === value);
}

/* <html data-palette> ni kuzatamiz — mavzuni inline skript ham, shu komponent ham o'zgartiradi */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-palette"] });
  window.addEventListener("storage", onChange);
  return () => {
    observer.disconnect();
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): PaletteId {
  const current = document.documentElement.dataset.palette;
  return isPaletteId(current) ? current : "mocha";
}

function getServerSnapshot(): PaletteId {
  return "mocha";
}

export function PalettePicker({ title }: { title: string }) {
  const active = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const select = useCallback((id: PaletteId) => {
    document.documentElement.dataset.palette = id;
    localStorage.setItem(STORAGE_KEY, id);
  }, []);

  return (
    <div className="px-5 pb-4">
      <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-ink)]/35">{title}</p>
      <div className="grid grid-cols-2 gap-2">
        {PALETTES.map((palette) => {
          const isActive = palette.id === active;
          return (
            <button
              key={palette.id}
              type="button"
              onClick={() => select(palette.id)}
              aria-pressed={isActive}
              className={`flex flex-col gap-2 rounded-2xl border p-2.5 text-left transition ${
                isActive
                  ? "border-[var(--color-sky)] bg-[var(--color-sand)] shadow-sm"
                  : "border-[var(--color-ink)]/10 hover:border-[var(--color-sky)]/40 hover:bg-[var(--color-mist)]/60"
              }`}
            >
              <span className="flex items-center gap-1.5">
                {palette.swatches.map((color) => (
                  <span
                    key={color}
                    className="h-5 w-5 rounded-full border border-black/10 shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
                {isActive && <Check size={13} strokeWidth={3} className="ml-auto text-[var(--color-sky-text)]" />}
              </span>
              <span className="truncate text-[11px] font-semibold leading-tight text-[var(--color-ink)]">
                {palette.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
