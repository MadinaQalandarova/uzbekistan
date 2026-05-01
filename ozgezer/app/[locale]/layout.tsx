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
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://uzbekistan-y1yg.vercel.app"),
    title: { default: titles[lang], template: `%s | O'zGezer` },
    description: descs[lang],
    keywords:
      lang === "ru"
        ? ["Узбекистан", "туризм", "путешествия", "достопримечательности", "Самарканд", "Бухара", "Хива"]
        : lang === "en"
        ? ["Uzbekistan", "travel", "tourism", "places", "Samarkand", "Bukhara", "Khiva"]
        : ["O'zbekiston", "sayohat", "turizm", "joylar", "Samarqand", "Buxoro", "Xiva"],
    openGraph: {
      title: titles[lang],
      description: descs[lang],
      locale: lang,
      type: "website",
      siteName: "O'zGezer",
      images: [{ url: "/places/itchan-kala.jpg", width: 1200, height: 630, alt: "O'zGezer" }],
    },
    twitter: {
      card: "summary_large_image",
      title: titles[lang],
      description: descs[lang],
      images: ["/places/itchan-kala.jpg"],
    },
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
