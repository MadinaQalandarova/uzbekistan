import Link from "next/link";
import { Globe } from "lucide-react";

import { LiquidNavbar } from "@/components/liquid-navbar";
import { getPlaces } from "@/lib/data/catalog-service";
import type { Locale } from "@/lib/i18n";

type SiteHeaderProps = {
  locale: Locale;
  nav: {
    home: string;
    explore: string;
    regions: string;
    randomPlace: string;
    map: string;
    signIn: string;
    signOut: string;
  };
  user: { name: string | null; email: string } | null;
};

export async function SiteHeader({ locale, nav, user }: SiteHeaderProps) {
  const places = await getPlaces();
  const randomSlug = places.length ? places[Math.floor(Math.random() * places.length)]!.slug : null;
  return (
    <header className="sticky top-4 z-40 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto">

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

        <LiquidNavbar locale={locale} nav={nav} user={user} randomSlug={randomSlug} variant="header" />
      </div>
    </header>
  );
}
