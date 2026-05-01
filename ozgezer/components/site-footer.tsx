import Link from "next/link";
import { Globe, Compass, Map, MapPin } from "lucide-react";

import type { Locale } from "@/lib/i18n";

type SiteFooterProps = {
  locale: Locale;
  description: string;
};

const footerT: Record<Locale, { home: string; regions: string; map: string; rights: string }> = {
  uz: { home: "Bosh sahifa", regions: "Viloyatlar", map: "Xarita", rights: "Barcha huquqlar himoyalangan." },
  ru: { home: "Главная",     regions: "Регионы",    map: "Карта",  rights: "Все права защищены."         },
  en: { home: "Home",        regions: "Regions",    map: "Map",    rights: "All rights reserved."        },
};

export function SiteFooter({ locale, description }: SiteFooterProps) {
  const year = new Date().getFullYear();
  const t = footerT[locale];

  return (
    <footer className="footer-surface border-t border-[var(--color-ink)]/5">
      <div className="container-shell py-10">
        <div className="grid gap-8 md:grid-cols-[1fr_auto]">
          {/* Brand */}
          <div className="max-w-sm">
            <Link href={`/${locale}`} className="group flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-sky)] to-[var(--color-teal)] shadow-md">
                <Globe size={17} className="text-white" strokeWidth={1.8} />
              </div>
              <div>
                <p className="display-title text-lg font-semibold tracking-[0.06em] text-[var(--color-ink)]">
                  O&apos;zGezer
                </p>
                <p className="text-[9px] uppercase tracking-[0.24em] text-[var(--color-ink)]/40">
                  Travel Atlas
                </p>
              </div>
            </Link>
            <p className="mt-4 text-sm leading-7 text-[var(--color-ink)]/55">{description}</p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-2">
            <FooterLink href={`/${locale}`} icon={<Globe size={13} strokeWidth={2} />}>
              {t.home}
            </FooterLink>
            <FooterLink href={`/${locale}/explore`} icon={<Compass size={13} strokeWidth={2} />}>
              Explore
            </FooterLink>
            <FooterLink href={`/${locale}/regions`} icon={<Map size={13} strokeWidth={2} />}>
              {t.regions}
            </FooterLink>
            <FooterLink href={`/${locale}/map`} icon={<MapPin size={13} strokeWidth={2} />}>
              {t.map}
            </FooterLink>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[var(--color-ink)]/6 pt-6 text-xs text-[var(--color-ink)]/40 md:flex-row">
          <p>© {year} O&apos;zGezer. {t.rights}</p>
          <div className="flex gap-1">
            {(["uz", "ru", "en"] as const).map((value) => (
              <Link
                key={value}
                href={`/${value}`}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] transition ${
                  value === locale
                    ? "bg-[var(--color-sky)] text-white"
                    : "text-[var(--color-ink)]/40 hover:text-[var(--color-sky)]"
                }`}
              >
                {value.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 text-sm text-[var(--color-ink)]/55 transition hover:text-[var(--color-sky)]"
    >
      <span className="text-[var(--color-sky)]/60">{icon}</span>
      {children}
    </Link>
  );
}
