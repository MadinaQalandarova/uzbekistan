"use client";

import { useState } from "react";
import { Shuffle } from "lucide-react";

type RandomPlaceButtonProps = {
  locale: string;
  slugs: string[];
  label: string;
};

export function RandomPlaceButton({ locale, slugs, label }: RandomPlaceButtonProps) {
  const [busy, setBusy] = useState(false);

  const handleClick = () => {
    if (busy || slugs.length === 0) return;
    const next = slugs[Math.floor(Math.random() * slugs.length)];
    if (!next) return;
    setBusy(true);
    window.location.href = `/${locale}/places/${next}`;
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="hidden items-center gap-2 rounded-full bg-[var(--color-gold)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] shadow-sm transition hover:opacity-90 active:scale-[0.98] lg:flex"
    >
      <Shuffle size={14} strokeWidth={2} />
      {label}
    </button>
  );
}