"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Map, MapPin, Shuffle, User, Globe } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import "./liquid-navbar.css";

type Props = {
  locale: Locale;
  nav: {
    home: string;
    explore: string;
    regions: string;
    map: string;
    randomPlace: string;
    signIn: string;
  };
  user: { name: string | null; email: string } | null;
  randomSlug?: string | null;
  variant?: "fixed" | "header";
};

export function LiquidNavbar({ locale, nav, user, randomSlug, variant = "fixed" }: Props) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === `/${locale}`) return pathname === `/${locale}` || pathname === `/${locale}/`;
    return pathname?.startsWith(href) ?? false;
  };

  const toggleTheme = () => {
    const html = document.documentElement;
    const next = html.dataset.theme === "dark" ? "light" : "dark";
    html.dataset.theme = next;
    localStorage.setItem("ozgezer-theme", next);
  };

  const homeHref = `/${locale}`;
  const exploreHref = `/${locale}/explore`;
  const regionsHref = `/${locale}/regions`;
  const mapHref = `/${locale}/map`;
  const profileHref = user ? `/${locale}/profile` : `/${locale}/login`;
  const randomHref = randomSlug ? `/${locale}/places/${randomSlug}` : exploreHref;
  const localeHref = (l: Locale) => {
    const withoutLocale = pathname?.replace(/^\/(uz|ru|en)/, "") || "";
    return `/${l}${withoutLocale || ""}`;
  };

  return (
    <nav className={`liquid-navbar ${variant === "header" ? "liquid-navbar--header" : ""}`}>
      <Link href={homeHref} className="nav-logo">
        <span className="nav-logo-icon"><Globe size={17} strokeWidth={2.1} /></span>
        <span>O&apos;zGezer</span>
      </Link>
      <div className="nav-sep" />

      <Link href={homeHref} className={`nav-btn ${isActive(homeHref) ? "active" : ""}`}>
        <Home size={19} strokeWidth={2.1} />
        <span>{nav.home}</span>
      </Link>

      <Link href={exploreHref} className={`nav-btn ${isActive(exploreHref) && !isActive(regionsHref) && !isActive(mapHref) ? "active" : ""}`}>
        <Compass size={19} strokeWidth={2.1} />
        <span>{nav.explore}</span>
      </Link>

      <Link href={regionsHref} className={`nav-btn ${isActive(regionsHref) ? "active" : ""}`}>
        <Map size={19} strokeWidth={2.1} />
        <span>{nav.regions}</span>
      </Link>

      <Link href={mapHref} className={`nav-btn ${isActive(mapHref) ? "active" : ""}`}>
        <MapPin size={19} strokeWidth={2.1} />
        <span>{nav.map}</span>
      </Link>

      <Link href={randomHref} className="nav-btn" aria-label={nav.randomPlace}>
        <Shuffle size={19} strokeWidth={2.1} />
        <span>{nav.randomPlace}</span>
      </Link>

      <Link href={profileHref} className={`nav-btn ${isActive(profileHref) ? "active" : ""}`}>
        <User size={19} strokeWidth={2.1} />
        <span>{user ? (user.name ?? user.email.split("@")[0]) : nav.signIn}</span>
      </Link>

      <div className="nav-sep" />
      <div className="nav-locale">
        {(["uz", "ru", "en"] as const).map((l) => (
          <Link key={l} href={localeHref(l)} className={`locale-mini ${l === locale ? "active" : ""}`}>{l.toUpperCase()}</Link>
        ))}
      </div>

      <button type="button" onClick={toggleTheme} className="nav-btn theme-toggle" aria-label="Temani almashtirish">
        <svg className="icon-sun" xmlns="http://www.w3.org/2000/svg" width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
        <svg className="icon-moon" xmlns="http://www.w3.org/2000/svg" width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
      </button>
    </nav>
  );
}
