import type { ReactNode } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getMessages, isLocale, type Locale } from "@/lib/i18n";
import { USER_SESSION_COOKIE, readUserSession } from "@/lib/user-auth";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const lang = locale as Locale;
  const titles: Record<Locale, string> = {
    uz: "O'zGezer — O'zbekiston sayohat atlasi",
    ru: "O'zGezer — Атлас путешествий по Узбекистану",
    en: "O'zGezer — Uzbekistan Travel Atlas",
  };
  const descs: Record<Locale, string> = {
    uz: "O'zbekiston bo'ylab tarixiy, tabiiy va mahalliy sayohat joylarini kashf eting.",
    ru: "Откройте для себя исторические, природные и местные достопримечательности Узбекистана.",
    en: "Discover historical, natural, and local travel spots across Uzbekistan.",
  };
  return {
    title: titles[lang],
    description: descs[lang],
    openGraph: { title: titles[lang], description: descs[lang], locale: lang },
  };
}

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const cookieStore = await cookies();
  const session = readUserSession(cookieStore.get(USER_SESSION_COOKIE)?.value);
  const messages = getMessages(locale);

  return (
    <>
      <SiteHeader
        locale={locale}
        nav={messages.nav}
        user={session ? { name: session.name, email: session.email } : null}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={locale} description={messages.footer.description} />
    </>
  );
}

export function generateStaticParams() {
  return [{ locale: "uz" }, { locale: "ru" }, { locale: "en" }];
}
