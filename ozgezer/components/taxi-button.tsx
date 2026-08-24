"use client";

import { Car, Map } from "lucide-react";
import type { Locale } from "@/lib/i18n";

type TaxiButtonProps = {
  latitude: number;
  longitude: number;
  placeName: string;
  locale: Locale;
};

const labels: Record<Locale, { taxi: string; maps: string; sub: string }> = {
  uz: { taxi: "Yandex Go — Taxi", maps: "Google Maps — Yo'l", sub: "Taxi buyurtma qilish" },
  ru: { taxi: "Yandex Go — Такси", maps: "Google Maps — Маршрут", sub: "Заказать такси" },
  en: { taxi: "Yandex Go — Taxi", maps: "Google Maps — Directions", sub: "Book a taxi" },
};

export function TaxiButton({ latitude, longitude, placeName, locale }: TaxiButtonProps) {
  /* Yandex Go rasmiy AppMetrica universal havolasi:
     - ilova o'rnatilgan bo'lsa → Yandex Go ilovasi (marshrut oldindan to'ldirilgan)
     - ilova yo'q bo'lsa → Yandex Go veb-sayti (tracking_id: 25395763362139037)
     Manba: https://yandex.com/support/taxi-distr/en/api/deeplinks */
  const yandexLink =
    `https://3.redirect.appmetrica.yandex.com/route` +
    `?end-lat=${latitude}&end-lon=${longitude}` +
    `&tariffClass=econom&ref=ozgezer` +
    `&appmetrica_tracking_id=25395763362139037&lang=${locale}`;

  /* Google Maps — har doim ishlaydi */
  const googleLink = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  const t = labels[locale];

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Yandex Go — Yandex tavsiyasiga ko'ra target="_blank" ishlatilmaydi */}
      <a
        href={yandexLink}
        aria-label={`${t.taxi}: ${placeName}`}
        className="group flex flex-col items-center gap-2 rounded-[1.25rem] border border-amber-200 bg-amber-50 px-4 py-4 text-center transition-all hover:-translate-y-0.5 hover:border-[var(--color-gold)] hover:bg-amber-100 hover:shadow-lg hover:shadow-amber-900/10"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-gold)] text-white shadow-md shadow-amber-500/25 transition-transform duration-300 group-hover:scale-110">
          <Car size={19} strokeWidth={1.75} />
        </span>
        <div>
          <p className="text-xs font-semibold leading-tight text-[var(--color-ink)]">{t.taxi}</p>
          <p className="mt-0.5 text-[10px] text-[var(--color-ink)]/45">{t.sub}</p>
        </div>
      </a>

      {/* Google Maps */}
      <a
        href={googleLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${t.maps}: ${placeName}`}
        className="group flex flex-col items-center gap-2 rounded-[1.25rem] border border-emerald-200 bg-emerald-50 px-4 py-4 text-center transition-all hover:-translate-y-0.5 hover:border-[var(--color-sky)] hover:bg-emerald-100 hover:shadow-lg hover:shadow-emerald-900/10"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-sky)] text-white shadow-md shadow-[var(--color-sky)]/25 transition-transform duration-300 group-hover:scale-110">
          <Map size={19} strokeWidth={1.75} />
        </span>
        <div>
          <p className="text-xs font-semibold leading-tight text-[var(--color-ink)]">{t.maps}</p>
          <p className="mt-0.5 text-[10px] text-[var(--color-ink)]/45">{placeName}</p>
        </div>
      </a>
    </div>
  );
}
