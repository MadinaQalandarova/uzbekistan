"use client";

import { useState, useEffect } from "react";

import type { Locale } from "@/lib/i18n";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "ozgezer-theme";

const labels: Record<Locale, { light: string; dark: string }> = {
  uz: { light: "Kunduzgi rejim", dark: "Tungi rejim" },
  ru: { light: "Дневной режим", dark: "Ночной режим" },
  en: { light: "Light mode", dark: "Dark mode" },
};

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
  // Inline script allaqachon data-theme ni o'rnatgan — shu qiymatni o'qiymiz (tez, placeholder siz) — default tungi
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document !== "undefined") {
      const ds = document.documentElement.dataset.theme as Theme | undefined;
      if (ds === "light" || ds === "dark") return ds;
    }
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
      if (stored === "light" || stored === "dark") return stored;
      return "dark";
    }
    return "dark";
  });

  // Faqat boshqa tabda tema o'zgarsa tinglash — tizim avtomatik almashinmaydi (default tungi)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY && (e.newValue === "light" || e.newValue === "dark")) {
        document.documentElement.dataset.theme = e.newValue;
        setTheme(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    // Og'ir background gradient transitionni vaqtincha o'chirish — qotishni oldini oladi
    const html = document.documentElement;
    html.style.transition = "none";
    html.dataset.theme = next;
    localStorage.setItem(THEME_STORAGE_KEY, next);
    setTheme(next);
    // Keyingi frame da transitionni qaytarish
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        html.style.transition = "";
      });
    });
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
