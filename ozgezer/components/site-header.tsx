import Link from "next/link";

import type { Locale } from "@/lib/i18n";

type SiteHeaderProps = {
  locale: Locale;
  nav: {
    home: string;
    explore: string;
    regions: string;
    admin: string;
    openExplore: string;
  };
};

export function SiteHeader({ locale, nav }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-[rgba(246,241,229,0.82)] backdrop-blur-xl">
      <div className="container-shell flex items-center justify-between gap-4 py-4">
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-sky)] text-sm font-semibold text-white shadow-lg shadow-sky-900/20">
            O&apos;Z
          </div>
          <div>
            <p className="display-title text-2xl font-semibold tracking-[0.08em] text-[var(--color-ink)]">
              O&apos;zGezer
            </p>
            <p className="text-xs uppercase tracking-[0.28em] text-black/45">
              Uzbekistan Travel Atlas
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-black/70 lg:flex">
          <Link href={`/${locale}`} className="transition hover:text-[var(--color-sky)]">
            {nav.home}
          </Link>
          <Link href={`/${locale}/explore`} className="transition hover:text-[var(--color-sky)]">
            {nav.explore}
          </Link>
          <Link href={`/${locale}/regions`} className="transition hover:text-[var(--color-sky)]">
            {nav.regions}
          </Link>
          <Link href={`/${locale}/admin`} className="transition hover:text-[var(--color-sky)]">
            {nav.admin}
          </Link>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <div className="flex rounded-full border border-black/10 bg-white/75 p-1 shadow-lg shadow-slate-900/5">
            {(["uz", "ru", "en"] as const).map((value) => (
              <Link
                key={value}
                href={`/${value}`}
                className={`locale-pill rounded-full px-3 py-1.5 text-xs font-semibold tracking-[0.22em] uppercase ${
                  value === locale
                    ? "locale-pill-active bg-[var(--color-sky)] text-white ring-2 ring-white/80"
                    : "bg-transparent text-black/60 transition hover:bg-white hover:text-[var(--color-sky)]"
                }`}
              >
                {value.toUpperCase()}
              </Link>
            ))}
          </div>
          <Link
            href={`/${locale}/explore`}
            className="rounded-full bg-[var(--color-gold)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:-translate-y-0.5"
          >
            {nav.openExplore}
          </Link>
          <Link
            href={`/${locale}/login`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-ink)] text-white transition hover:-translate-y-0.5 hover:bg-[var(--color-sky)] hover:shadow-lg hover:shadow-sky-900/20"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
