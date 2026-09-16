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
    aiGuide: string;
    signIn: string;
    signOut: string;
  };
  user: { name: string | null; email: string } | null;
};

export function SiteHeader({ locale, nav, user }: SiteHeaderProps) {
  // Serverda doimo birinchi slug — hydration mismatch oldini oladi.
  // ClientMounted da random tanlash LiquidNavbar ichida.
  const randomSlug = staticPlaces.length ? staticPlaces[0]!.slug : null;
  return (
    <header className="sticky top-0 z-40 flex justify-center px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 pointer-events-none backdrop-blur-sm">
      <div className="pointer-events-auto flex w-full max-w-full items-center justify-center gap-0 min-w-0">
        <LiquidNavbar locale={locale} nav={nav} user={user} randomSlug={randomSlug} variant="header" />
      </div>
    </header>
  );
}
