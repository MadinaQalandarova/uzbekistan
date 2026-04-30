"use client";

import { Car, ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";

type TaxiButtonProps = {
  latitude: number;
  longitude: number;
  placeName: string;
  locale: Locale;
};

const labels: Record<Locale, { title: string; sub: string; aria: string }> = {
  uz: {
    title: "Yandex Go orqali borish",
    sub: "Taxi buyurtma qilish",
    aria: "Yandex Go orqali borishni buyurtma qiling",
  },
  ru: {
    title: "Поехать через Yandex Go",
    sub: "Заказать такси",
    aria: "Заказать такси через Yandex Go",
  },
  en: {
    title: "Ride with Yandex Go",
    sub: "Book a taxi",
    aria: "Book a taxi via Yandex Go",
  },
};

export function TaxiButton({ latitude, longitude, placeName, locale }: TaxiButtonProps) {
  const deeplink = `https://3.redirect.appmetrica.yandex.com/route?end-lat=${latitude}&end-lon=${longitude}&appmetrica_tracking_id=1178268795219463874`;
  const t = labels[locale];

  return (
    <a
      href={deeplink}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-[1.25rem] border border-amber-200 bg-amber-50 px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-[var(--color-gold)] hover:bg-amber-100 hover:shadow-lg hover:shadow-amber-900/10"
      aria-label={`${t.aria}: ${placeName}`}
    >
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--color-gold)] text-white shadow-md shadow-amber-500/30 transition-transform duration-300 group-hover:scale-110">
        <Car size={20} strokeWidth={1.75} />
      </span>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-[var(--color-ink)]">{t.title}</p>
        <p className="mt-0.5 truncate text-xs text-[var(--color-ink)]/50">
          {placeName} • {t.sub}
        </p>
      </div>

      <ArrowRight
        size={16}
        strokeWidth={2}
        className="ml-auto flex-shrink-0 text-[var(--color-gold)] transition-transform duration-300 group-hover:translate-x-1"
      />
    </a>
  );
}
