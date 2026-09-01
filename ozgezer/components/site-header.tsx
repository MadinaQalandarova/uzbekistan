import Link from "next/link";
import { Globe, Map, Compass, LogOut, User, MapPin } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/mobile-nav";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { RandomPlaceButton } from "@/components/random-place-button";
import { getPlaces } from "@/lib/data/catalog-service";
import type { Locale } from "@/lib/i18n";

type SiteHeaderProps = {
  locale: Locale;
  nav: {
    home: string;
    explore: string;
    regions: string;
    admin: string;
    randomPlace: string;
    map: string;
    signIn: string;
    signOut: string;
  };
  user: { name: string | null; email: string } | null;
};

export async function SiteHeader({ locale, nav, user }: SiteHeaderProps) {
  const placeSlugs = (await getPlaces()).map((place) => place.slug);
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
          <Link
            href={`/${locale}/map`}
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm text-[var(--color-ink)]/60 transition hover:bg-[var(--color-mist)] hover:text-[var(--color-sky)]"
          >
            <MapPin size={14} strokeWidth={2} />
            {nav.map}
          </Link>
        </nav>

        {/* ── Right side ── */}
        <div className="flex items-center gap-2">
          {/* Locale switcher — desktop only (joriy sahifani saqlaydi) */}
          <div className="hidden lg:block">
            <LocaleSwitcher locale={locale} />
          </div>

          {/* Random place — desktop only (Explore CTA o'rniga) */}
          <RandomPlaceButton locale={locale} slugs={placeSlugs} label={nav.randomPlace} />

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
                  {nav.signOut}
                </button>
              </form>
            </div>
          ) : (
            <Link
              href={`/${locale}/login`}
              className="hidden h-9 items-center rounded-full border border-[var(--color-ink)]/10 bg-white px-4 text-xs font-semibold text-[var(--color-ink)] shadow-sm transition hover:border-[var(--color-sky)] hover:text-[var(--color-sky)] lg:flex"
            >
              {nav.signIn}
            </Link>
          )}

          {/* Theme toggle — always visible */}
          <ThemeToggle locale={locale} />

          {/* Hamburger — hidden on lg+ (MobileNav itself renders lg:hidden) */}
          <MobileNav locale={locale} nav={nav} user={user} />
        </div>
      </div>
    </header>
  );
}
