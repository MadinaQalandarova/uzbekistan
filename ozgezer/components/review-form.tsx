"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Star, CheckCircle } from "lucide-react";

type ReviewFormProps = {
  locale: string;
  placeSlug: string;
  isLoggedIn: boolean;
  alreadyReviewed: boolean;
};

const texts = {
  uz: {
    title: "Fikr qoldirish",
    subtitle: "Bu joyga borishni tavsiya qilasizmi?",
    yes: "Ha, tavsiya qilaman",
    no: "Yo'q, tavsiya etmayman",
    rating: "Baho bering",
    comment: "Taassurotlaringizni yozing...",
    submit: "Jo'natish",
    loginRequired: "Fikr qoldirish uchun tizimga kiring.",
    loginBtn: "Kirish",
    alreadyReviewed: "Siz bu joyga allaqachon baho qo'shdingiz.",
    errors: {
      INVALID_REVIEW: "Iltimos, baho va izohni to'ldiring.",
      ALREADY_REVIEWED: "Siz bu joyga allaqachon baho qo'shdingiz.",
      UNKNOWN: "Xatolik yuz berdi. Qayta urinib ko'ring.",
    },
  },
  ru: {
    title: "Оставить отзыв",
    subtitle: "Рекомендуете ли вы это место?",
    yes: "Да, рекомендую",
    no: "Нет, не рекомендую",
    rating: "Поставьте оценку",
    comment: "Напишите ваши впечатления...",
    submit: "Отправить",
    loginRequired: "Войдите, чтобы оставить отзыв.",
    loginBtn: "Войти",
    alreadyReviewed: "Вы уже оставили отзыв на это место.",
    errors: {
      INVALID_REVIEW: "Пожалуйста, заполните оценку и комментарий.",
      ALREADY_REVIEWED: "Вы уже оставили отзыв.",
      UNKNOWN: "Произошла ошибка. Попробуйте снова.",
    },
  },
  en: {
    title: "Leave a review",
    subtitle: "Would you recommend this place?",
    yes: "Yes, I recommend it",
    no: "No, I don't recommend",
    rating: "Give a rating",
    comment: "Write your impressions...",
    submit: "Submit",
    loginRequired: "Sign in to leave a review.",
    loginBtn: "Sign in",
    alreadyReviewed: "You have already reviewed this place.",
    errors: {
      INVALID_REVIEW: "Please fill in the rating and comment.",
      ALREADY_REVIEWED: "You have already reviewed this place.",
      UNKNOWN: "Something went wrong. Please try again.",
    },
  },
};

export function ReviewForm({ locale, placeSlug, isLoggedIn, alreadyReviewed }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [recommend, setRecommend] = useState<boolean | null>(true);

  const t = texts[locale as keyof typeof texts] ?? texts.uz;

  if (!isLoggedIn) {
    return (
      <div className="section-card rounded-[1.75rem] p-6">
        <h3 className="display-title text-xl font-semibold text-[var(--color-ink)]">{t.title}</h3>
        <p className="mt-3 text-sm text-[var(--color-ink)]/55">{t.loginRequired}</p>
        <a
          href={`/${locale}/login?next=/places/${placeSlug}`}
          className="mt-4 inline-flex h-11 items-center rounded-full bg-[var(--color-sky)] px-5 text-sm font-semibold text-white shadow-sm shadow-[var(--color-sky)]/20 transition hover:opacity-90"
        >
          {t.loginBtn}
        </a>
      </div>
    );
  }

  if (alreadyReviewed) {
    return (
      <div className="section-card rounded-[1.75rem] p-6">
        <h3 className="display-title text-xl font-semibold text-[var(--color-ink)]">{t.title}</h3>
        <div className="mt-3 flex items-center gap-2 text-sm text-[var(--color-teal)]">
          <CheckCircle size={16} strokeWidth={2} />
          {t.alreadyReviewed}
        </div>
      </div>
    );
  }

  return (
    <div className="section-card rounded-[1.75rem] p-6">
      <h3 className="display-title text-xl font-semibold text-[var(--color-ink)]">{t.title}</h3>
      <p className="mt-1.5 text-sm text-[var(--color-ink)]/55">{t.subtitle}</p>

      <form action="/api/reviews/submit" method="post" className="mt-5 space-y-4">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="placeSlug" value={placeSlug} />
        <input type="hidden" name="wouldRecommend" value={String(recommend === null ? true : recommend)} />
        <input type="hidden" name="rating" value={String(rating)} />

        {/* Tavsiya tugmalari */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setRecommend(true)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-[1.2rem] border py-3 text-sm font-semibold transition-all ${
              recommend === true
                ? "border-[var(--color-teal)] bg-[var(--color-teal)] text-white shadow-md"
                : "border-[var(--color-ink)]/10 bg-[var(--color-mist)] text-[var(--color-ink)]/60 hover:border-[var(--color-teal)] hover:text-[var(--color-teal)]"
            }`}
          >
            <ThumbsUp size={15} strokeWidth={2} />
            {t.yes}
          </button>
          <button
            type="button"
            onClick={() => setRecommend(false)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-[1.2rem] border py-3 text-sm font-semibold transition-all ${
              recommend === false
                ? "border-red-500 bg-red-500 text-white shadow-md"
                : "border-[var(--color-ink)]/10 bg-[var(--color-mist)] text-[var(--color-ink)]/60 hover:border-red-400 hover:text-red-500"
            }`}
          >
            <ThumbsDown size={15} strokeWidth={2} />
            {t.no}
          </button>
        </div>

        {/* Yulduz baho */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)]/40">
            {t.rating}
          </p>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => {
              const filled = star <= (hovered || rating);
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all ${
                    filled
                      ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10 scale-110"
                      : "border-[var(--color-ink)]/10 bg-[var(--color-mist)] opacity-50 hover:opacity-80"
                  }`}
                >
                  <Star
                    size={18}
                    strokeWidth={filled ? 0 : 1.5}
                    fill={filled ? "#F59E0B" : "currentColor"}
                    className={filled ? "" : "text-[var(--color-ink)]/20"}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Izoh */}
        <textarea
          name="comment"
          required
          rows={4}
          placeholder={t.comment}
          className="w-full resize-none rounded-[1.2rem] border border-[var(--color-ink)]/10 bg-[var(--color-mist)] p-4 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-sky)] focus:ring-2 focus:ring-[var(--color-sky)]/10 placeholder:text-[var(--color-ink)]/35"
        />

        <button
          type="submit"
          disabled={rating === 0}
          className="h-12 w-full rounded-full bg-[var(--color-sky)] text-sm font-semibold text-white shadow-sm shadow-[var(--color-sky)]/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t.submit}
        </button>
      </form>
    </div>
  );
}
