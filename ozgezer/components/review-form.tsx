"use client";

import { useState } from "react";

type ReviewFormProps = {
  locale: string;
};

export function ReviewForm({ locale }: ReviewFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [recommend, setRecommend] = useState<boolean | null>(null);

  const texts = {
    uz: {
      title: "Fikr qoldirish",
      subtitle: "Bu joyga borishni tavsiya qilasizmi?",
      yes: "Ha, albatta",
      no: "Yo'q, tavsiya etmayman",
      rating: "Baho (1-5)",
      comment: "Taassurotlaringizni yozing...",
      submit: "Jo'natish",
      thanks: "Fikringiz saqlandi! Hozircha DB ulanmagan (Faza 2 MOCK).",
    },
    ru: {
      title: "Оставить отзыв",
      subtitle: "Рекомендуете ли вы поехать сюда?",
      yes: "Да, конечно",
      no: "Нет, не рекомендую",
      rating: "Оценка (1-5)",
      comment: "Напишите ваши впечатления...",
      submit: "Отправить",
      thanks: "Отзыв сохранен! Пока база не подключена (Фаза 2 MOCK).",
    },
    en: {
      title: "Leave a review",
      subtitle: "Would you recommend visiting this place?",
      yes: "Yes, absolutely",
      no: "No, I do not",
      rating: "Rating (1-5)",
      comment: "Write your impressions...",
      submit: "Submit",
      thanks: "Review saved! DB not connected yet (Phase 2 MOCK).",
    },
  };

  const t = texts[locale as keyof typeof texts] || texts.uz;

  if (isSubmitted) {
    return (
      <div className="rounded-[1.75rem] border border-[var(--color-teal)] bg-white/60 p-6 text-center text-[var(--color-teal)]">
        <p className="font-semibold">{t.thanks}</p>
      </div>
    );
  }

  return (
    <div className="section-card rounded-[1.75rem] p-6">
      <h3 className="display-title text-2xl font-semibold text-[var(--color-ink)]">{t.title}</h3>
      <p className="mt-2 text-sm text-black/60">{t.subtitle}</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsSubmitted(true);
        }}
        className="mt-6 flex flex-col gap-5"
      >
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setRecommend(true)}
            className={`flex-1 rounded-[1.2rem] border py-3 text-sm font-semibold transition ${
              recommend === true
                ? "border-[var(--color-teal)] bg-[var(--color-teal)] text-white shadow-lg"
                : "border-black/10 bg-white/60 text-black/70 hover:border-[var(--color-teal)] hover:text-[var(--color-teal)]"
            }`}
          >
            👍 {t.yes}
          </button>
          <button
            type="button"
            onClick={() => setRecommend(false)}
            className={`flex-1 rounded-[1.2rem] border py-3 text-sm font-semibold transition ${
              recommend === false
                ? "border-red-500 bg-red-500 text-white shadow-lg"
                : "border-black/10 bg-white/60 text-black/70 hover:border-red-500 hover:text-red-500"
            }`}
          >
            👎 {t.no}
          </button>
        </div>

        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-black/50">
            {t.rating}
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`flex h-12 w-12 items-center justify-center rounded-xl border text-xl transition ${
                  rating >= star
                    ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-white"
                    : "border-black/10 bg-[var(--color-mist)] text-black/30 hover:border-[var(--color-gold)]"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <textarea
            required
            rows={4}
            placeholder={t.comment}
            className="w-full resize-none rounded-[1.2rem] border border-black/10 bg-[var(--color-mist)] p-4 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-sky)]"
          />
        </div>

        <button
          type="submit"
          className="rounded-[1.2rem] bg-[var(--color-ink)] py-4 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-[var(--color-sky)] hover:shadow-lg"
        >
          {t.submit}
        </button>
      </form>
    </div>
  );
}
