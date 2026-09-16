"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Map, MapPin, Shuffle, User, Globe, Menu, X, LogOut, Sparkles } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
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
    aiGuide: string;
    signIn: string;
    signOut: string;
  };
  user: { name: string | null; email: string } | null;
  randomSlug?: string | null;
  variant?: "fixed" | "header";
};

/* A11y label lar — locale bo'yicha */
const uiLabels: Record<Locale, { theme: string; menu: string; close: string }> = {
  uz: { theme: "Temani almashtirish", menu: "Menyu", close: "Yopish" },
  ru: { theme: "Переключить тему", menu: "Меню", close: "Закрыть" },
  en: { theme: "Toggle theme", menu: "Menu", close: "Close" },
};

export function LiquidNavbar({ locale, nav, user, randomSlug, variant = "fixed" }: Props) {
  const pathname = usePathname();
  const labels = uiLabels[locale];
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef(0);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time portal mount
  useEffect(() => { setMounted(true); }, []);
  const close = useCallback(() => setDrawerOpen(false), []);

  // Scroll lock iOS-safe
  useEffect(() => {
    if (!mounted) return;
    if (drawerOpen) {
      scrollRef.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollRef.current}px`;
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll";
    } else {
      const y = scrollRef.current;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
      if (y) window.scrollTo(0, y);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
    };
  }, [drawerOpen, mounted]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen, close]);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) close(); };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [close]);

  const isActive = (href: string) => {
    if (href === `/${locale}`) return pathname === `/${locale}` || pathname === `/${locale}/`;
    return pathname?.startsWith(href) ?? false;
  };

  const toggleTheme = () => {
    const html = document.documentElement;
    const next = html.dataset.theme === "dark" ? "light" : "dark";
    html.style.transition = "none";
    html.dataset.theme = next;
    localStorage.setItem("ozgezer-theme", next);
    requestAnimationFrame(() => requestAnimationFrame(() => { html.style.transition = ""; }));
  };

  const homeHref = `/${locale}`;
  const exploreHref = `/${locale}/explore`;
  const regionsHref = `/${locale}/regions`;
  const mapHref = `/${locale}/map`;
  const aiGuideHref = `/${locale}/ai-guide`;
  const profileHref = user ? `/${locale}/profile` : `/${locale}/login`;
  const randomHref = randomSlug ? `/${locale}/places/${randomSlug}` : exploreHref;
  const localeHref = (l: Locale) => {
    const withoutLocale = pathname?.replace(/^\/(uz|ru|en)/, "") || "";
    return `/${l}${withoutLocale || ""}`;
  };

  return (
    <>
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

      <Link href={aiGuideHref} className={`nav-btn ${isActive(aiGuideHref) ? "active" : ""}`}>
        <Sparkles size={19} strokeWidth={2.1} />
        <span>{nav.aiGuide}</span>
      </Link>

      <Link href={randomHref} className="nav-btn" aria-label={nav.randomPlace}>
        <Shuffle size={19} strokeWidth={2.1} />
        <span>{nav.randomPlace}</span>
      </Link>

      <Link href={profileHref} className={`nav-btn nav-hide-mobile ${isActive(profileHref) ? "active" : ""}`}>
        <User size={19} strokeWidth={2.1} />
        <span>{user ? (user.name ?? user.email.split("@")[0]) : nav.signIn}</span>
      </Link>

      <div className="nav-sep nav-hide-mobile" />
      <div className="nav-locale nav-hide-mobile">
        {(["uz", "ru", "en"] as const).map((l) => (
          <Link key={l} href={localeHref(l)} className={`locale-mini ${l === locale ? "active" : ""}`}>{l.toUpperCase()}</Link>
        ))}
      </div>

      <button type="button" onClick={toggleTheme} className="nav-btn theme-toggle nav-hide-mobile" aria-label={labels.theme}>
        <svg className="icon-sun" xmlns="http://www.w3.org/2000/svg" width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
        <svg className="icon-moon" xmlns="http://www.w3.org/2000/svg" width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
      </button>

    </nav>
    {/* Hamburger — alohida, faqat telefonda */}
    <button type="button" onClick={() => setDrawerOpen(true)} className="lg:hidden ml-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-ink)]/10 bg-white/90 text-[var(--color-ink)] shadow-md backdrop-blur-md transition hover:bg-white sm:ml-2 sm:h-10 sm:w-10 md:h-11 md:w-11 dark:border-white/15 dark:bg-[rgba(14,32,24,0.92)] dark:text-white" aria-label={labels.menu}>
      <Menu size={16} strokeWidth={2.2} className="sm:hidden" />
      <Menu size={18} strokeWidth={2.2} className="hidden sm:block" />
    </button>

    {/* ── Drawer portal — full nav + Kirish + locale + theme ── */}
    {mounted && createPortal(
      <>
        <div
          aria-hidden
          onClick={close}
          style={{ touchAction: "none" }}
          className={`fixed inset-0 z-[9998] bg-black/55 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label={labels.menu}
          className={`fixed right-0 top-0 z-[9999] flex h-full w-[300px] max-w-[86vw] flex-col bg-[var(--background)] shadow-2xl transition-transform duration-300 ease-out will-change-transform lg:hidden ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex flex-shrink-0 items-center justify-between border-b border-[var(--color-ink)]/6 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-sky)] to-[var(--color-teal)]">
                <Globe size={15} className="text-white" strokeWidth={2} />
              </div>
              <span className="text-base font-semibold tracking-[0.04em] text-[var(--color-ink)]">O&apos;zGezer</span>
            </div>
            <button onClick={close} aria-label={labels.close} className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-ink)]/10 text-[var(--color-ink)]/40 transition hover:bg-[var(--color-mist)] hover:text-[var(--color-ink)]">
              <X size={15} strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex flex-1 flex-col overflow-y-auto overscroll-contain">
            <nav className="flex flex-col gap-1 px-3 py-4">
              <Link href={homeHref} onClick={close} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive(homeHref) ? "bg-[var(--color-mist)] text-[var(--color-sky)]" : "text-[var(--color-ink)]/60 hover:bg-[var(--color-mist)] hover:text-[var(--color-sky)]"}`}>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-mist)] text-[var(--color-sky)]"><Home size={15} strokeWidth={2} /></span>{nav.home}
              </Link>
              <Link href={exploreHref} onClick={close} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive(exploreHref) && !isActive(regionsHref) && !isActive(mapHref) ? "bg-[var(--color-mist)] text-[var(--color-sky)]" : "text-[var(--color-ink)]/60 hover:bg-[var(--color-mist)] hover:text-[var(--color-sky)]"}`}>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-mist)] text-[var(--color-sky)]"><Compass size={15} strokeWidth={2} /></span>{nav.explore}
              </Link>
              <Link href={regionsHref} onClick={close} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive(regionsHref) ? "bg-[var(--color-mist)] text-[var(--color-sky)]" : "text-[var(--color-ink)]/60 hover:bg-[var(--color-mist)] hover:text-[var(--color-sky)]"}`}>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-mist)] text-[var(--color-sky)]"><Map size={15} strokeWidth={2} /></span>{nav.regions}
              </Link>
              <Link href={mapHref} onClick={close} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive(mapHref) ? "bg-[var(--color-mist)] text-[var(--color-sky)]" : "text-[var(--color-ink)]/60 hover:bg-[var(--color-mist)] hover:text-[var(--color-sky)]"}`}>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-mist)] text-[var(--color-sky)]"><MapPin size={15} strokeWidth={2} /></span>{nav.map}
              </Link>
              <Link href={randomHref} onClick={close} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-[var(--color-ink)]/60 transition hover:bg-[var(--color-mist)] hover:text-[var(--color-sky)]">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-mist)] text-[var(--color-sky)]"><Shuffle size={15} strokeWidth={2} /></span>{nav.randomPlace}
              </Link>
            </nav>

            <div className="mx-4 border-t border-[var(--color-ink)]/6" />

            <div className="px-5 py-4">
              <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-ink)]/35">Til / Язык / Language</p>
              <div className="flex gap-2">
                {(["uz", "ru", "en"] as const).map((l) => (
                  <Link key={l} href={localeHref(l)} onClick={close} className={`flex-1 rounded-xl py-2.5 text-center text-xs font-semibold uppercase tracking-[0.18em] transition ${l === locale ? "bg-[var(--color-sky)] text-white shadow-sm" : "border border-[var(--color-ink)]/10 text-[var(--color-ink)]/50 hover:border-[var(--color-sky)]/50 hover:text-[var(--color-sky)]"}`}>{l}</Link>
                ))}
              </div>
            </div>

            <div className="px-5 pb-4">
              <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-ink)]/35">{locale === "ru" ? "Тема" : locale === "en" ? "Theme" : "Mavzu"}</p>
              <button onClick={() => { toggleTheme(); close(); }} className="flex w-full items-center gap-3 rounded-2xl border border-[var(--color-ink)]/10 px-4 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-sky)]/30 hover:text-[var(--color-sky)]">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-mist)] text-[var(--color-sky)]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /></svg>
                </span>
                {locale === "uz" ? "Tungi rejim" : locale === "ru" ? "Ночной режим" : "Dark mode"}
              </button>
            </div>
          </div>

          <div className="flex-shrink-0 border-t border-[var(--color-ink)]/6 px-4 py-4">
            {user ? (
              <div className="space-y-2">
                <Link href={`/${locale}/profile`} onClick={close} className="flex items-center gap-3 rounded-2xl border border-[var(--color-ink)]/8 bg-[var(--color-mist)] px-4 py-3 transition hover:border-[var(--color-sky)]/40">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-sky)]"><User size={14} className="text-white" strokeWidth={2.5} /></span>
                  <div className="min-w-0"><p className="truncate text-sm font-semibold text-[var(--color-ink)]">{user.name ?? user.email.split("@")[0]}</p><p className="truncate text-[10px] text-[var(--color-ink)]/40">{user.email}</p></div>
                </Link>
                <form action="/api/auth/logout" method="post"><input type="hidden" name="locale" value={locale} /><button type="submit" className="flex w-full items-center gap-2 rounded-2xl border border-[var(--color-ink)]/8 px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)]/50 transition hover:border-red-300 hover:text-red-500"><LogOut size={13} strokeWidth={2} />{nav.signOut}</button></form>
              </div>
            ) : (
              <Link href={`/${locale}/login`} onClick={close} className="flex items-center justify-center rounded-2xl bg-[var(--color-sky)] py-3 text-sm font-semibold text-white shadow-md shadow-[var(--color-sky)]/20 transition hover:opacity-90">{nav.signIn}</Link>
            )}
          </div>
        </aside>
      </>,
      document.body
    )}
    </>
  );
}
