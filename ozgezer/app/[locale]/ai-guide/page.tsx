import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AiGuideClient } from "@/components/ai-guide-client";
import { getCategories, getRegions } from "@/lib/data/catalog-service";
import { getMessages, isLocale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const titles: Record<string, string> = {
    uz: "AI Gid — O'zGezer",
    ru: "AI Гид — O'zGezer",
    en: "AI Guide — O'zGezer",
  };
  const descs: Record<string, string> = {
    uz: "Sayohat rejangizni tuzing yoki istalgan joy haqida AI asistentdan bilib oling.",
    ru: "Составьте план путешествия или узнайте о любом месте с помощью AI-ассистента.",
    en: "Plan your trip or learn about any place with an AI assistant.",
  };
  return {
    title: titles[locale] ?? "AI Gid",
    description: descs[locale] ?? "",
  };
}

export default async function AiGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const messages = getMessages(locale);
  const [categories, regions] = await Promise.all([getCategories(), getRegions()]);

  return (
    <div className="py-4 sm:py-8">
      <div className="container-shell py-3 sm:py-4">
        <div className="section-card overflow-hidden rounded-[2rem]">
          <div className="border-b border-[var(--color-ink)]/6 bg-gradient-to-br from-[#2D6B6B]/10 via-transparent to-[#F59E0B]/10 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-teal)]">
              O&apos;zGezer AI
            </p>
            <h1 className="display-title mt-2 text-3xl font-semibold text-[var(--color-ink)] md:text-4xl">
              {messages.aiGuide.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-ink)]/60">
              {messages.aiGuide.subtitle}
            </p>
          </div>

          <div className="p-5 sm:p-8">
            <AiGuideClient
              locale={locale}
              t={messages.aiGuide}
              categories={categories.map((c) => c.title[locale])}
              regions={regions.map((r) => r.name[locale])}
            />
          </div>
        </div>
      </div>
    </div>
  );
}