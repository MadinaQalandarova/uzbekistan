import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { isLocale } from "@/lib/i18n";
import { USER_SESSION_COOKIE, readUserSession } from "@/lib/user-auth";

type RegisterPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
};

const t = {
  uz: {
    title: "Ro'yxatdan o'tish",
    subtitle: "O'zGezer da hisob yarating",
    name: "Ism (ixtiyoriy)",
    email: "Elektron pochta",
    password: "Parol (kamida 6 ta belgi)",
    submit: "Hisob yaratish",
    haveAccount: "Hisobingiz bormi?",
    login: "Kirish",
    errors: {
      INVALID_INPUT: "Email va parolni to'g'ri to'ldiring (parol kamida 6 ta belgi).",
      EMAIL_TAKEN: "Bu email allaqachon ro'yxatdan o'tgan.",
      DB_NOT_CONFIGURED: "Tizim vaqtincha ishlamayapti.",
      UNKNOWN: "Xatolik yuz berdi. Qayta urinib ko'ring.",
    },
  },
  ru: {
    title: "Регистрация",
    subtitle: "Создайте аккаунт в O'zGezer",
    name: "Имя (необязательно)",
    email: "Электронная почта",
    password: "Пароль (минимум 6 символов)",
    submit: "Создать аккаунт",
    haveAccount: "Уже есть аккаунт?",
    login: "Войти",
    errors: {
      INVALID_INPUT: "Заполните email и пароль (минимум 6 символов).",
      EMAIL_TAKEN: "Этот email уже зарегистрирован.",
      DB_NOT_CONFIGURED: "Сервис временно недоступен.",
      UNKNOWN: "Произошла ошибка. Попробуйте снова.",
    },
  },
  en: {
    title: "Register",
    subtitle: "Create your O'zGezer account",
    name: "Name (optional)",
    email: "Email address",
    password: "Password (min 6 characters)",
    submit: "Create account",
    haveAccount: "Already have an account?",
    login: "Sign in",
    errors: {
      INVALID_INPUT: "Please fill in email and password (min 6 chars).",
      EMAIL_TAKEN: "This email is already registered.",
      DB_NOT_CONFIGURED: "Service temporarily unavailable.",
      UNKNOWN: "Something went wrong. Please try again.",
    },
  },
};

export const metadata: Metadata = { robots: { index: false } };

export default async function RegisterPage({ params, searchParams }: RegisterPageProps) {
  const { locale } = await params;
  const query = await searchParams;

  if (!isLocale(locale)) notFound();

  const cookieStore = await cookies();
  const session = readUserSession(cookieStore.get(USER_SESSION_COOKIE)?.value);
  if (session) redirect(`/${locale}`);

  const texts = t[locale as keyof typeof t] ?? t.uz;
  const errorMsg = query.error
    ? (texts.errors[query.error as keyof typeof texts.errors] ?? texts.errors.UNKNOWN)
    : null;

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand mark */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-sky)] to-[var(--color-teal)] shadow-lg shadow-[var(--color-sky)]/20">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
          <h1 className="display-title text-3xl font-semibold text-[var(--color-ink)]">
            {texts.title}
          </h1>
          <p className="mt-1.5 text-sm text-[var(--color-ink)]/55">{texts.subtitle}</p>
        </div>

        <div className="section-card rounded-[2rem] p-7">
          {errorMsg && (
            <div className="mb-5 rounded-[1.2rem] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          <form action="/api/auth/register" method="post" className="space-y-4">
            <input type="hidden" name="locale" value={locale} />

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)]/45">
                {texts.name}
              </span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                className="h-12 w-full rounded-[1rem] border border-[var(--color-ink)]/10 bg-[var(--color-mist)] px-4 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-sky)] focus:ring-2 focus:ring-[var(--color-sky)]/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)]/45">
                {texts.email}
              </span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="h-12 w-full rounded-[1rem] border border-[var(--color-ink)]/10 bg-[var(--color-mist)] px-4 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-sky)] focus:ring-2 focus:ring-[var(--color-sky)]/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)]/45">
                {texts.password}
              </span>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                autoComplete="new-password"
                className="h-12 w-full rounded-[1rem] border border-[var(--color-ink)]/10 bg-[var(--color-mist)] px-4 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-sky)] focus:ring-2 focus:ring-[var(--color-sky)]/10"
              />
            </label>

            <button
              type="submit"
              className="mt-2 h-12 w-full rounded-full bg-[var(--color-sky)] text-sm font-semibold text-white shadow-md shadow-[var(--color-sky)]/25 transition hover:opacity-90"
            >
              {texts.submit}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--color-ink)]/55">
            {texts.haveAccount}{" "}
            <Link
              href={`/${locale}/login`}
              className="font-semibold text-[var(--color-sky)] transition hover:underline"
            >
              {texts.login}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
