"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import "./gradient-search.css";

type GradientSearchProps = {
  locale: Locale;
  placeholder?: string;
  onNavigate?: () => void;
};

const placeholders: Record<Locale, string> = {
  uz: "Qidirish...",
  ru: "Поиск...",
  en: "Search...",
};

export function GradientSearch({ locale, placeholder, onNavigate }: GradientSearchProps) {
  const [value, setValue] = useState("");
  const hasValue = value.trim().length > 0;
  const hint = placeholder ?? placeholders[locale] ?? placeholders.uz;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Bo'sh qidiruv — toza /explore ga olib boradi (?q= siz)
    if (!value.trim()) {
      e.preventDefault();
      window.location.href = `/${locale}/explore`;
    } else {
      onNavigate?.();
    }
  };

  return (
    <div className={`gs-wrapper ${hasValue ? "gs-has-value" : ""}`}>
      <form
        action={`/${locale}/explore`}
        method="GET"
        className="gs-box"
        role="search"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="q"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={hint}
          aria-label={hint}
          autoComplete="off"
          className="gs-input"
        />
        <button type="submit" className="gs-btn" aria-label={hint}>
          <Search size={16} strokeWidth={2.2} />
        </button>
      </form>
    </div>
  );
}
