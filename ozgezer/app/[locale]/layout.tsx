import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getMessages, isLocale } from "@/lib/i18n";
import { USER_SESSION_COOKIE, readUserSession } from "@/lib/user-auth";

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
