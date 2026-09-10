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
    <header className="sticky top-0 z-40 flex justify-center px-4 pt-4 pb-2 pointer-events-none">
      <div className="pointer-events-auto">
        <LiquidNavbar locale={locale} nav={nav} user={user} randomSlug={randomSlug} variant="header" />
      </div>
    </header>
  );
}
