"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { locales, type Locale } from "@/lib/i18n";

type LocaleSwitcherProps = {
  locale: Locale;
  variant?: "pill" | "grid";
  onNavigate?: () => void;
};

/* Joriy sahifa yo'lini saqlagan holda tilni almashtiradi */
export function LocaleSwitcher({ locale, variant = "pill", onNavigate }: LocaleSwitcherProps) {
  const pathname = usePathname() ?? `/${locale}`;

  /* /uz/places/registon -> places/registon */
  const rest = pathname.split("/").slice(2).join("/");

  if (variant === "grid") {
    return (
      <div className="flex gap-2">
        {locales.map((value) => (
          <Link
            key={value}
            href={`/${value}${rest ? `/${rest}` : ""}`}
            onClick={onNavigate}
            className={`flex-1 rounded-xl py-2.5 text-center text-xs font-semibold uppercase tracking-[0.18em] transition ${
              value === locale
                ? "bg-[var(--color-sky)] text-white shadow-sm"
                : "border border-[var(--color-ink)]/10 text-[var(--color-ink)]/50 hover:border-[var(--color-sky)]/50 hover:text-[var(--color-sky)]"
            }`}
          >
            {value}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="locale-pill-wrap flex items-center rounded-full border border-[var(--color-ink)]/10 bg-white/70 p-0.5">
      {locales.map((value) => (
        <Link
          key={value}
          href={`/${value}${rest ? `/${rest}` : ""}`}
          className={`locale-pill rounded-full px-3 py-1.5 text-xs font-semibold tracking-[0.18em] uppercase transition ${
            value === locale
              ? "locale-pill-active bg-[var(--color-sky)] text-white"
              : "text-[var(--color-ink)]/55 hover:text-[var(--color-sky)]"
          }`}
        >
          {value.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
