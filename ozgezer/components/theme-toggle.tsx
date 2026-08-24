"use client";

import { useEffect, useSyncExternalStore } from "react";

import type { Locale } from "@/lib/i18n";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "ozgezer-theme";
const SYSTEM_DARK_QUERY = "(prefers-color-scheme: dark)";

const labels: Record<Locale, { light: string; dark: string }> = {
  uz: { light: "Kunduzgi rejim", dark: "Tungi rejim" },
  ru: { light: "Дневной режим", dark: "Ночной режим" },
  en: { light: "Light mode", dark: "Dark mode" },
};

/* ── Tashqi tema manbasi (localStorage + tizim sozlamasi) ───────────────── */

const themeListeners = new Set<() => void>();

function readTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia(SYSTEM_DARK_QUERY).matches ? "dark" : "light";
}

function subscribeToTheme(onStoreChange: () => void) {
  themeListeners.add(onStoreChange);
  const media = window.matchMedia(SYSTEM_DARK_QUERY);
  media.addEventListener("change", onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    themeListeners.delete(onStoreChange);
    media.removeEventListener("change", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function applyTheme(theme: Theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  document.documentElement.dataset.theme = theme;
  themeListeners.forEach((listener) => listener());
}

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2"  x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="2"  y1="12" x2="5"  y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
      <line x1="4.93"  y1="4.93"  x2="7.05"  y2="7.05" />
      <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" />
      <line x1="4.93"  y1="19.07" x2="7.05"  y2="16.95" />
      <line x1="16.95" y1="7.05"  x2="19.07" y2="4.93" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function ThemeToggle({ locale = "uz" }: { locale?: Locale }) {
  /* Server render: null → placeholder (hydration mismatch oldini oladi) */
  const theme = useSyncExternalStore<Theme | null>(
    subscribeToTheme,
    readTheme,
    () => null
  );

  /* <html data-theme> ni joriy mavzu bilan sinxronlash */
  useEffect(() => {
    if (theme) {
      document.documentElement.dataset.theme = theme;
    }
  }, [theme]);

  if (!theme) {
    return <div className="h-9 w-9 rounded-full border border-[var(--color-ink)]/10" aria-hidden />;
  }

  const toggle = () => {
    applyTheme(theme === "dark" ? "light" : "dark");
  };

  const label = labels[locale][theme];

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-ink)]/10 bg-white/80 text-[var(--color-ink)] shadow-sm transition hover:border-[var(--color-sky)] hover:text-[var(--color-sky)]"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
