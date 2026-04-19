import Link from "next/link";

import type { Locale } from "@/lib/i18n";

type SiteFooterProps = {
  locale: Locale;
  description: string;
};

export function SiteFooter({ locale, description }: SiteFooterProps) {
  return (
    <footer className="border-t border-black/5 bg-white/40">
      <div className="container-shell flex flex-col gap-4 py-8 text-sm text-black/65 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="display-title text-2xl font-semibold text-[var(--color-ink)]">
            O&apos;zGezer
          </p>
          <p>{description}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href={`/${locale}`} className="transition hover:text-[var(--color-sky)]">
            Home
          </Link>
          <Link href={`/${locale}/explore`} className="transition hover:text-[var(--color-sky)]">
            Explore
          </Link>
          <Link href={`/${locale}/regions`} className="transition hover:text-[var(--color-sky)]">
            Regions
          </Link>
          <Link href={`/${locale}/admin`} className="transition hover:text-[var(--color-sky)]">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
