import Link from "next/link";
import { Globe, Map, Compass, LogOut, User } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/mobile-nav";
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
  user: { name: string | null; email: string } | null;
};

export function SiteHeader({ locale, nav, user }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-ink)]/5 bg-[rgba(240,247,244,0.88)] backdrop-blur-xl transition-colors duration-300">
      <div className="container-shell flex items-center justify-between py-3">

        {/* ── Logo ── */}
        <Link href={`/${locale}`} className="group flex flex-shrink-0 items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-sky)] to-[var(--color-teal)] shadow-md transition-transform duration-300 group-hover:scale-105">
            <Globe size={18} className="text-white" strokeWidth={1.8} />
          </div>
          <div className="hidden sm:block">
            <p className="display-title text-lg font-semibold tracking-[0.06em] text-[var(--color-ink)]">
              O&apos;zGezer
            </p>
          </div>
        </Link>

        {/* ── Desktop nav — lg+ only ── */}
        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            href={`/${locale}`}
            className="rounded-full px-4 py-2 text-sm text-[var(--color-ink)]/60 transition hover:bg-[var(--color-mist)] hover:text-[var(--color-sky)]"
          >
            {nav.home}
          </Link>
          <Link
            href={`/${locale}/explore`}
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm text-[var(--color-ink)]/60 transition hover:bg-[var(--color-mist)] hover:text-[var(--color-sky)]"
          >
            <Compass size={14} strokeWidth={2} />
            {nav.explore}
          </Link>
          <Link
            href={`/${locale}/regions`}
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm text-[var(--color-ink)]/60 transition hover:bg-[var(--color-mist)] hover:text-[var(--color-sky)]"
          >
            <Map size={14} strokeWidth={2} />
            {nav.regions}
          </Link>
        </nav>

        {/* ── Right side ── */}
        <div className="flex items-center gap-2">

          {/* Locale switcher — desktop only */}
          <div className="locale-pill-wrap hidden items-center rounded-full border border-[var(--color-ink)]/10 bg-white/70 p-0.5 lg:flex">
            {(["uz", "ru", "en"] as const).map((value) => (
              <Link
                key={value}
                href={`/${value}`}
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

          {/* Explore CTA — desktop only */}
          <Link
            href={`/${locale}/explore`}
            className="hidden items-center gap-2 rounded-full bg-[var(--color-gold)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] shadow-sm transition hover:opacity-90 lg:flex"
          >
            {nav.openExplore}
            <ArrowRight size={14} />
          </Link>

          {/* User auth — desktop only */}
          {user ? (
            <div className="hidden items-center gap-1.5 lg:flex">
              <Link
                href={`/${locale}/profile`}
                className="flex h-9 items-center gap-2 rounded-full border border-[var(--color-ink)]/10 bg-white px-3 shadow-sm transition hover:border-[var(--color-sky)]"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-sky)]">
                  <User size={13} className="text-white" strokeWidth={2.5} />
                </span>
                <span className="max-w-[72px] truncate text-xs font-semibold text-[var(--color-ink)]">
                  {user.name ?? user.email.split("@")[0]}
                </span>
              </Link>
              <form action="/api/auth/logout" method="post">
                <input type="hidden" name="locale" value={locale} />
                <button
                  type="submit"
                  className="flex h-9 items-center gap-1.5 rounded-full border border-[var(--color-ink)]/10 bg-white px-3 text-xs font-semibold text-[var(--color-ink)]/55 shadow-sm transition hover:border-red-300 hover:text-red-500"
                >
                  <LogOut size={13} strokeWidth={2} />
                  Chiqish
                </button>
              </form>
            </div>
          ) : (
            <Link
              href={`/${locale}/login`}
              className="hidden h-9 items-center rounded-full border border-[var(--color-ink)]/10 bg-white px-4 text-xs font-semibold text-[var(--color-ink)] shadow-sm transition hover:border-[var(--color-sky)] hover:text-[var(--color-sky)] lg:flex"
            >
              Kirish
            </Link>
          )}

          {/* Theme toggle — always visible */}
          <ThemeToggle />

          {/* Hamburger — hidden on lg+ (MobileNav itself renders lg:hidden) */}
          <MobileNav locale={locale} nav={nav} user={user} />
        </div>
      </div>
    </header>
  );
}

function ArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="3" y1="8" x2="13" y2="8" />
      <polyline points="9 4 13 8 9 12" />
    </svg>
  );
}
