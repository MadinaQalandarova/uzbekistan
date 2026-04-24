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
  user: { name: string | null; email: string } | null;
};

export function SiteHeader({ locale, nav, user }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-[rgba(246,241,229,0.82)] backdrop-blur-xl">
      <div className="container-shell flex items-center justify-between gap-4 py-4">
        {/* Logo */}
        <Link href={`/${locale}`} className="group flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-sky)] to-[var(--color-teal)] shadow-lg shadow-sky-900/40 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
            <img src="https://emojicdn.elk.sh/🌍?style=apple" alt="O'zGezer Logo" className="h-7 w-7 drop-shadow-md transition-transform duration-500 group-hover:-rotate-12" />
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

        {/* Nav */}
        <nav className="hidden items-center gap-6 text-sm text-black/70 lg:flex">
          <Link href={`/${locale}`} className="group flex items-center gap-1.5 transition hover:text-[var(--color-sky)]">
            <img src="https://emojicdn.elk.sh/🏠?style=apple" alt="" className="h-4 w-4 transition-transform duration-300 group-hover:scale-125 group-hover:-translate-y-0.5" />
            <span>{nav.home}</span>
          </Link>
          <Link href={`/${locale}/explore`} className="group flex items-center gap-1.5 transition hover:text-[var(--color-sky)]">
            <img src="https://emojicdn.elk.sh/🧭?style=apple" alt="" className="h-4 w-4 transition-transform duration-300 group-hover:scale-125 group-hover:-translate-y-0.5" />
            <span>{nav.explore}</span>
          </Link>
          <Link href={`/${locale}/regions`} className="group flex items-center gap-1.5 transition hover:text-[var(--color-sky)]">
            <img src="https://emojicdn.elk.sh/📍?style=apple" alt="" className="h-4 w-4 transition-transform duration-300 group-hover:scale-125 group-hover:-translate-y-0.5" />
            <span>{nav.regions}</span>
          </Link>
        </nav>

        {/* O'ng tomon */}
        <div className="hidden items-center gap-2 md:flex">
          {/* Til tanlash */}
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

          {/* Explore tugmasi */}
          <Link
            href={`/${locale}/explore`}
            className="group flex items-center gap-2 rounded-full bg-[var(--color-gold)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <span>{nav.openExplore}</span>
            <img src="https://emojicdn.elk.sh/✨?style=apple" alt="" className="h-4 w-4 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12" />
          </Link>

          {/* Foydalanuvchi */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href={`/${locale}/profile`}
                className="flex h-10 items-center gap-2 rounded-full border border-black/10 bg-white px-3 shadow-sm transition hover:border-[var(--color-sky)]"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-sky)] text-xs font-bold text-white">
                  {(user.name ?? user.email)[0].toUpperCase()}
                </span>
                <span className="max-w-[80px] truncate text-xs font-semibold text-[var(--color-ink)]">
                  {user.name ?? user.email.split("@")[0]}
                </span>
              </Link>
              <form action="/api/auth/logout" method="post">
                <input type="hidden" name="locale" value={locale} />
                <button
                  type="submit"
                  className="h-10 rounded-full border border-black/10 bg-white px-3 text-xs font-semibold text-black/60 shadow-sm transition hover:border-red-300 hover:text-red-500"
                >
                  Chiqish
                </button>
              </form>
            </div>
          ) : (
            <Link
              href={`/${locale}/login`}
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-[var(--color-sky)] hover:shadow-lg"
            >
              <img src="https://emojicdn.elk.sh/🧑🏻‍💻?style=apple" alt="Kirish" className="h-6 w-6 transition-transform duration-300 group-hover:scale-125" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
