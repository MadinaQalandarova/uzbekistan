import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { isLocale } from "@/lib/i18n";
import { USER_SESSION_COOKIE, readUserSession } from "@/lib/user-auth";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; next?: string }>;
};

const t = {
  uz: {
    title: "Kirish",
    subtitle: "O'zGezer hisobingizga kiring",
    email: "Elektron pochta",
    password: "Parol",
    submit: "Kirish",
    noAccount: "Hisob yo'qmi?",
    register: "Ro'yxatdan o'ting",
    errors: {
      INVALID_CREDENTIALS: "Email yoki parol noto'g'ri.",
      INVALID_INPUT: "Email va parolni to'ldiring.",
      DB_NOT_CONFIGURED: "Tizim vaqtincha ishlamayapti.",
      UNKNOWN: "Xatolik yuz berdi. Qayta urinib ko'ring.",
    },
  },
  ru: {
    title: "Вход",
    subtitle: "Войдите в аккаунт O'zGezer",
    email: "Электронная почта",
    password: "Пароль",
    submit: "Войти",
    noAccount: "Нет аккаунта?",
    register: "Зарегистрироваться",
    errors: {
      INVALID_CREDENTIALS: "Неверный email или пароль.",
      INVALID_INPUT: "Заполните email и пароль.",
      DB_NOT_CONFIGURED: "Система временно недоступна.",
      UNKNOWN: "Произошла ошибка. Попробуйте снова.",
    },
  },
  en: {
    title: "Sign in",
    subtitle: "Sign in to your O'zGezer account",
    email: "Email address",
    password: "Password",
    submit: "Sign in",
    noAccount: "No account?",
    register: "Register",
    errors: {
      INVALID_CREDENTIALS: "Incorrect email or password.",
      INVALID_INPUT: "Please fill in email and password.",
      DB_NOT_CONFIGURED: "Service temporarily unavailable.",
      UNKNOWN: "Something went wrong. Please try again.",
    },
  },
};

export default async function LoginPage({ params, searchParams }: LoginPageProps) {
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
          <p className="mt-1.5 text-sm text-black/55">{texts.subtitle}</p>
        </div>

        <div className="section-card rounded-[2rem] p-7">
          {errorMsg && (
            <div className="mb-5 rounded-[1.2rem] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          <form action="/api/auth/login" method="post" className="space-y-4">
            <input type="hidden" name="locale" value={locale} />
            {query.next && <input type="hidden" name="next" value={query.next} />}

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-black/45">
                {texts.email}
              </span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="h-12 w-full rounded-[1rem] border border-black/10 bg-[var(--color-mist)] px-4 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-sky)] focus:ring-2 focus:ring-[var(--color-sky)]/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-black/45">
                {texts.password}
              </span>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                className="h-12 w-full rounded-[1rem] border border-black/10 bg-[var(--color-mist)] px-4 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-sky)] focus:ring-2 focus:ring-[var(--color-sky)]/10"
              />
            </label>

            <button
              type="submit"
              className="mt-2 h-12 w-full rounded-full bg-[var(--color-sky)] text-sm font-semibold text-white shadow-md shadow-[var(--color-sky)]/25 transition hover:opacity-90"
            >
              {texts.submit}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-black/55">
            {texts.noAccount}{" "}
            <Link
              href={`/${locale}/register`}
              className="font-semibold text-[var(--color-sky)] transition hover:underline"
            >
              {texts.register}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
