"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, Home, Compass, Map, Globe, LogOut, User } from "lucide-react";
import type { Locale } from "@/lib/i18n";

type MobileNavProps = {
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

export function MobileNav({ locale, nav, user }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef(0);

  // Mount once on client — needed for createPortal
  useEffect(() => { setMounted(true); }, []);

  const close = useCallback(() => setOpen(false), []);

  // ── Scroll lock (iOS-safe) ──────────────────────────────────────────────────
  useEffect(() => {
    if (!mounted) return;
    if (open) {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ── Close on Escape ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  // ── Close when viewport >= lg (1024px) ──────────────────────────────────────
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) close(); };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [close]);

  return (
    <>
      {/* ── Hamburger button — only on mobile ── */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Menyuni ochish"
        aria-expanded={open}
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-black/10 bg-white/80 text-[var(--color-ink)] shadow-sm transition hover:bg-[var(--color-mist)] lg:hidden"
      >
        <Menu size={18} strokeWidth={2.2} />
      </button>

      {/*
        ── Portal: rendered directly on document.body ──
        This bypasses the header's stacking context (sticky + backdrop-filter),
        ensuring truly viewport-fixed positioning and correct z-ordering.
      */}
      {mounted && createPortal(
        <>
          {/* Backdrop */}
          <div
            aria-hidden
            onClick={close}
            style={{ touchAction: "none" }}
            className={`fixed inset-0 z-[9998] bg-black/55 backdrop-blur-sm transition-opacity duration-300 ${
              open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          />

          {/* Drawer */}
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Navigatsiya menyusi"
            className={`fixed right-0 top-0 z-[9999] flex h-full w-[290px] flex-col bg-[var(--background)] shadow-2xl transition-transform duration-300 ease-out will-change-transform ${
              open ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* ── Drawer header ── */}
            <div className="flex flex-shrink-0 items-center justify-between border-b border-black/6 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-sky)] to-[var(--color-teal)]">
                  <Globe size={15} className="text-white" strokeWidth={2} />
                </div>
                <span className="display-title text-base font-semibold tracking-[0.06em] text-[var(--color-ink)]">
                  O&apos;zGezer
                </span>
              </div>
              <button
                onClick={close}
                aria-label="Menyuni yopish"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-black/40 transition hover:bg-[var(--color-mist)] hover:text-[var(--color-ink)]"
              >
                <X size={15} strokeWidth={2.5} />
              </button>
            </div>

            {/* ── Scrollable body ── */}
            <div className="flex flex-1 flex-col overflow-y-auto overscroll-contain">
              {/* Nav links */}
              <nav className="flex flex-col gap-1 px-3 py-4">
                <NavLink href={`/${locale}`} icon={<Home size={15} strokeWidth={2} />} onClick={close}>
                  {nav.home}
                </NavLink>
                <NavLink href={`/${locale}/explore`} icon={<Compass size={15} strokeWidth={2} />} onClick={close}>
                  {nav.explore}
                </NavLink>
                <NavLink href={`/${locale}/regions`} icon={<Map size={15} strokeWidth={2} />} onClick={close}>
                  {nav.regions}
                </NavLink>
              </nav>

              <div className="mx-4 border-t border-black/6" />

              {/* Locale switcher */}
              <div className="px-5 py-4">
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-black/35">
                  Til / Language
                </p>
                <div className="flex gap-2">
                  {(["uz", "ru", "en"] as const).map((value) => (
                    <Link
                      key={value}
                      href={`/${value}`}
                      onClick={close}
                      className={`flex-1 rounded-xl py-2.5 text-center text-xs font-semibold uppercase tracking-[0.18em] transition ${
                        value === locale
                          ? "bg-[var(--color-sky)] text-white shadow-sm"
                          : "border border-black/10 text-black/50 hover:border-[var(--color-sky)]/50 hover:text-[var(--color-sky)]"
                      }`}
                    >
                      {value}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Auth — pinned bottom ── */}
            <div className="flex-shrink-0 border-t border-black/6 px-4 py-4">
              {user ? (
                <div className="space-y-2">
                  <Link
                    href={`/${locale}/profile`}
                    onClick={close}
                    className="flex items-center gap-3 rounded-[1.25rem] border border-black/8 bg-[var(--color-mist)] px-4 py-3 transition hover:border-[var(--color-sky)]/40"
                  >
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-sky)]">
                      <User size={14} className="text-white" strokeWidth={2.5} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--color-ink)]">
                        {user.name ?? user.email.split("@")[0]}
                      </p>
                      <p className="truncate text-[10px] text-black/40">{user.email}</p>
                    </div>
                  </Link>
                  <form action="/api/auth/logout" method="post">
                    <input type="hidden" name="locale" value={locale} />
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2 rounded-[1.25rem] border border-black/8 px-4 py-2.5 text-sm font-semibold text-black/50 transition hover:border-red-300 hover:text-red-500"
                    >
                      <LogOut size={13} strokeWidth={2} />
                      Chiqish
                    </button>
                  </form>
                </div>
              ) : (
                <Link
                  href={`/${locale}/login`}
                  onClick={close}
                  className="flex items-center justify-center rounded-[1.25rem] bg-[var(--color-sky)] py-3 text-sm font-semibold text-white shadow-md shadow-[var(--color-sky)]/20 transition hover:opacity-90"
                >
                  Kirish
                </Link>
              )}
            </div>
          </aside>
        </>,
        document.body
      )}
    </>
  );
}

function NavLink({
  href,
  icon,
  onClick,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-[1.25rem] px-4 py-3 text-sm font-medium text-black/60 transition hover:bg-[var(--color-mist)] hover:text-[var(--color-sky)]"
    >
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--color-mist)] text-[var(--color-sky)]">
        {icon}
      </span>
      {children}
    </Link>
  );
}
