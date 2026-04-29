"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ChevronDown } from "lucide-react";

type SearchFormProps = {
  locale: string;
  regions: { slug: string; name: { uz: string; ru: string; en: string } }[];
  labels: {
    placeholder: string;
    regionPlaceholder: string;
    searchButton: string;
  };
  examples: string[];
};

export function SearchForm({ locale, regions, labels, examples }: SearchFormProps) {
  const [displayText, setDisplayText] = useState("");
  const [exampleIndex, setExampleIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pause" | "erasing">("typing");
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Typewriter effekti — faqat input bo'sh va focus bo'lmasa
  useEffect(() => {
    if (isFocused || inputValue) return;

    const current = examples[exampleIndex] ?? "";

    const tick = () => {
      if (phase === "typing") {
        setDisplayText((prev) => {
          const next = current.slice(0, prev.length + 1);
          if (next === current) {
            frameRef.current = setTimeout(() => setPhase("pause"), 3500);
          } else {
            frameRef.current = setTimeout(tick, 160);
          }
          return next;
        });
      } else if (phase === "pause") {
        frameRef.current = setTimeout(() => setPhase("erasing"), 1800);
      } else if (phase === "erasing") {
        setDisplayText((prev) => {
          const next = prev.slice(0, -1);
          if (next === "") {
            setExampleIndex((i) => (i + 1) % examples.length);
            frameRef.current = setTimeout(() => setPhase("typing"), 900);
          } else {
            frameRef.current = setTimeout(tick, 100);
          }
          return next;
        });
      }
    };

    frameRef.current = setTimeout(tick, phase === "typing" ? 160 : 0);
    return () => {
      if (frameRef.current) clearTimeout(frameRef.current);
    };
  }, [phase, exampleIndex, isFocused, inputValue, examples]);

  const placeholder = isFocused || inputValue ? labels.placeholder : displayText || labels.placeholder;

  return (
    <form
      action={`/${locale}/explore`}
      className={`search-form relative rounded-[1.25rem] border bg-white/85 p-2 transition-all duration-300 ${
        isFocused
          ? "border-[var(--color-sky)]/40 shadow-[0_0_0_3px_rgba(45,107,107,0.10)] ring-1 ring-[var(--color-sky)]/15"
          : "border-[var(--color-ink)]/8 shadow-sm"
      }`}
    >
      {/* Mobile: input + button */}
      <div className="flex gap-2 md:hidden">
        <div className="relative flex-1">
          <Search
            size={14}
            strokeWidth={2}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink)]/30"
          />
          <input
            ref={inputRef}
            type="text"
            name="q"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="h-11 w-full rounded-[0.875rem] border-0 bg-transparent pl-8 pr-3 text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink)]/35"
          />
        </div>
        <button
          type="submit"
          className="group relative h-11 flex-shrink-0 overflow-hidden rounded-[0.875rem] bg-[var(--color-sky)] px-4 text-xs font-semibold text-white transition hover:opacity-90"
        >
          <span className="relative z-10">{labels.searchButton}</span>
          {/* Shine sweep */}
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
        </button>
      </div>

      {/* Desktop: 3-column */}
      <div className="hidden md:grid md:grid-cols-[1fr_auto_auto] md:gap-2">
        <div className="relative">
          <Search
            size={15}
            strokeWidth={2}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink)]/30"
          />
          <input
            ref={inputRef}
            type="text"
            name="q"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="h-12 w-full rounded-[1rem] border-0 bg-transparent pl-10 pr-4 text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink)]/35"
          />
        </div>

        <div className="relative">
          <select
            name="region"
            className="h-12 appearance-none rounded-[1rem] border border-[var(--color-ink)]/8 bg-[var(--color-mist)] pl-4 pr-9 text-sm text-[var(--color-ink)]/65 outline-none transition focus:border-[var(--color-sky)]"
          >
            <option value="">{labels.regionPlaceholder}</option>
            {regions.map((region) => (
              <option key={region.slug} value={region.slug}>
                {region.name[locale as "uz" | "ru" | "en"]}
              </option>
            ))}
          </select>
          <ChevronDown
            size={13}
            strokeWidth={2}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink)]/35"
          />
        </div>

        <button
          type="submit"
          className="group relative h-12 overflow-hidden rounded-[1rem] bg-[var(--color-sky)] px-6 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <span className="relative z-10">{labels.searchButton}</span>
          {/* Shine sweep */}
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
        </button>
      </div>
    </form>
  );
}
