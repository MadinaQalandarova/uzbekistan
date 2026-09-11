import { LiquidNavbar } from "@/components/liquid-navbar";
import { places as staticPlaces } from "@/lib/data/catalog";
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

export function SiteHeader({ locale, nav, user }: SiteHeaderProps) {
  const randomSlug = staticPlaces.length ? staticPlaces[Math.floor(Math.random() * staticPlaces.length)]!.slug : null;
  return (
    <header className="sticky top-0 z-40 flex justify-center px-4 py-3 pointer-events-none backdrop-blur-sm">
      <div className="pointer-events-auto w-full flex justify-center">
        <LiquidNavbar locale={locale} nav={nav} user={user} randomSlug={randomSlug} variant="header" />
      </div>
    </header>
  );
}
