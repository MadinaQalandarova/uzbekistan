"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useCallback } from "react";
import { Home, Compass, Map, MapPin, Shuffle, User, Globe } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import "./liquid-navbar.css";

// Icons 18px stroke 2 — First-Navbar navbar.html exact spec

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
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const isActive = useCallback((href: string) => {
    if (href === `/${locale}`) return pathname === `/${locale}` || pathname === `/${locale}/`;
    return pathname?.startsWith(href);
  }, [pathname, locale]);

  const updatePill = useCallback((smooth = true) => {
    const navEl = navRef.current;
    const pill = pillRef.current;
    if (!navEl || !pill) return;
    const active = navEl.querySelector<HTMLElement>(".nav-btn.active");
    if (!active) return;
    const navRect = navEl.getBoundingClientRect();
    const btnRect = active.getBoundingClientRect();
    const left = btnRect.left - navRect.left;
    requestAnimationFrame(() => {
      pill.style.transition = smooth ? "transform .26s cubic-bezier(0.32,1,.68,1), width .26s cubic-bezier(0.32,1,.68,1)" : "none";
      pill.style.width = `${btnRect.width}px`;
      pill.style.transform = `translate3d(${left}px,0,0)`;
    });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => updatePill(false), 60);
    const onResize = () => updatePill(false);
    window.addEventListener("resize", onResize);
    return () => { clearTimeout(t); window.removeEventListener("resize", onResize); };
  }, [updatePill, pathname]);

  useEffect(() => {
    // pillni active o'zgarganda surish — span yoyilgach o'lchaymiz (80px 0.32s)
    const t = setTimeout(() => updatePill(true), 180);
    return () => clearTimeout(t);
  }, [pathname, updatePill]);

  const toggleTheme = () => {
    const html = document.documentElement;
    const isDark = html.dataset.theme === "dark";
    const next = isDark ? "light" : "dark";
    html.style.transition = "none";
    html.dataset.theme = next;
    localStorage.setItem("ozgezer-theme", next);
    requestAnimationFrame(() => requestAnimationFrame(() => { html.style.transition = ""; }));
  };

  const rafRef = useRef<number | null>(null);
  const onMouseMove = (e: React.MouseEvent) => {
    // rAF throttled — First-Navbar glare without freeze
    if (rafRef.current) return;
    const clientX = e.clientX; const clientY = e.clientY;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const navEl = navRef.current;
      const glare = glareRef.current;
      if (!navEl || !glare) return;
      const rect = navEl.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      glare.style.setProperty("--mx", `${x}%`);
      glare.style.setProperty("--my", `${y}%`);
    });
  };

  const homeHref = `/${locale}`;
  const exploreHref = `/${locale}/explore`;
  const regionsHref = `/${locale}/regions`;
  const mapHref = `/${locale}/map`;
  const profileHref = user ? `/${locale}/profile` : `/${locale}/login`;
  const randomHref = randomSlug ? `/${locale}/places/${randomSlug}` : exploreHref;

  // locale switch — keep current path
  const localeHref = (l: Locale) => {
    const withoutLocale = pathname?.replace(/^\/(uz|ru|en)/, "") || "";
    return `/${l}${withoutLocale || ""}`;
  };

  return (
    <nav ref={navRef} className={`liquid-navbar ${variant === "header" ? "liquid-navbar--header" : ""}`} onMouseMove={onMouseMove}>
      <div ref={glareRef} className="glare" />
      <div ref={pillRef} className="active-pill" />

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
