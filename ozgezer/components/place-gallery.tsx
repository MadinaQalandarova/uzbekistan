"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PlaceGalleryProps = {
  images: string[];
  alt: string;
  /** Kategoriya chip-lari (hero ustiga chiqadi) */
  chips?: React.ReactNode;
};

export function PlaceGallery({ images, alt, chips }: PlaceGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const total = images.length;
  const isMultiple = total > 1;

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating || index === current) return;
      setIsAnimating(true);
      setCurrent((index + total) % total);
      setTimeout(() => setIsAnimating(false), 400);
    },
    [current, isAnimating, total]
  );

  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  /* Keyboard navigation */
  useEffect(() => {
    if (!isMultiple) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isMultiple, prev, next]);

  /* Touch / swipe */
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    /* Faqat gorizontal swipe — scroll bilan aralashmasin */
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx < 0 ? next() : prev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  }

  return (
    <div
      className="relative min-h-[22rem] overflow-hidden bg-[linear-gradient(140deg,#2D6B6B_0%,#5B8A6E_55%,#F59E0B_100%)]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-label="Rasm galereyasi"
    >
      {/* ── Slides ── */}
      {images.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-500 ${
            i === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-hidden={i !== current}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`${alt} ${i + 1}`}
            className="h-full w-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
        </div>
      ))}

      {/* Gradient (agar hech qanday rasm yo'q bo'lsa) */}
      {images.length === 0 && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      )}

      {/* ── Chips — yuqori chap ── */}
      {chips && (
        <div className="relative flex h-full min-h-[22rem] flex-col justify-start p-6">
          {chips}
        </div>
      )}

      {/* ── Navigation arrows ── */}
      {isMultiple && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Oldingi rasm"
          >
            <ChevronLeft size={18} strokeWidth={2.2} />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Keyingi rasm"
          >
            <ChevronRight size={18} strokeWidth={2.2} />
          </button>
        </>
      )}

      {/* ── Dot indicators ── */}
      {isMultiple && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                i === current
                  ? "w-5 bg-white"
                  : "w-1.5 bg-white/45 hover:bg-white/70"
              }`}
              aria-label={`Rasm ${i + 1}`}
              aria-current={i === current}
            />
          ))}
        </div>
      )}

      {/* ── Counter (faqat 2+ rasm bo'lsa) ── */}
      {isMultiple && (
        <div className="absolute right-3 bottom-3 rounded-full bg-black/35 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          {current + 1} / {total}
        </div>
      )}
    </div>
  );
}
