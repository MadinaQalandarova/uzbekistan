import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { isLocale } from "@/lib/i18n";
import { USER_SESSION_COOKIE, readUserSession } from "@/lib/user-auth";
import { AuthBrand, AuthError, AuthField, AuthSubmit } from "@/components/auth-shell";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; next?: string }>;
};

const t = {
  uz: {
    title: "Kirish",
    subtitle: "O'zGezer hisobingizga kiring",
    email: "Elektron pochta",
    emailPlaceholder: "ali@example.com",
    password: "Parol",
    passwordPlaceholder: "••••••••",
    submit: "Kirish",
    noAccount: "Hisob yo'qmi?",
    register: "Ro'yxatdan o'ting",
    errors: {
      INVALID_CREDENTIALS: "Email yoki parol noto'g'ri.",
      INVALID_INPUT: "Email va parolni to'ldiring.",
      RATE_LIMITED: "Juda ko'p urinish. 15 daqiqadan so'ng urinib ko'ring.",
      DB_NOT_CONFIGURED: "Tizim vaqtincha ishlamayapti.",
      UNKNOWN: "Xatolik yuz berdi. Qayta urinib ko'ring.",
    },
  },
  ru: {
    title: "Вход",
    subtitle: "Войдите в аккаунт O'zGezer",
    email: "Электронная почта",
    emailPlaceholder: "ali@example.com",
    password: "Пароль",
    passwordPlaceholder: "••••••••",
    submit: "Войти",
    noAccount: "Нет аккаунта?",
    register: "Зарегистрироваться",
    errors: {
      INVALID_CREDENTIALS: "Неверный email или пароль.",
      INVALID_INPUT: "Заполните email и пароль.",
      RATE_LIMITED: "Слишком много попыток. Попробуйте через 15 минут.",
      DB_NOT_CONFIGURED: "Система временно недоступна.",
      UNKNOWN: "Произошла ошибка. Попробуйте снова.",
    },
  },
  en: {
    title: "Sign in",
    subtitle: "Sign in to your O'zGezer account",
    email: "Email address",
    emailPlaceholder: "ali@example.com",
    password: "Password",
    passwordPlaceholder: "••••••••",
    submit: "Sign in",
    noAccount: "No account?",
    register: "Register",
    errors: {
      INVALID_CREDENTIALS: "Incorrect email or password.",
      INVALID_INPUT: "Please fill in email and password.",
      RATE_LIMITED: "Too many attempts. Try again in 15 minutes.",
      DB_NOT_CONFIGURED: "Service temporarily unavailable.",
      UNKNOWN: "Something went wrong. Please try again.",
    },
  },
};

export const metadata: Metadata = { robots: { index: false } };

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
    <div className="flex justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <AuthBrand title={texts.title} subtitle={texts.subtitle} />

        <div className="section-card rounded-[2rem] p-7">
          <AuthError message={errorMsg} />

          <form action="/api/auth/login" method="post" className="space-y-4">
            <input type="hidden" name="locale" value={locale} />
            {query.next && <input type="hidden" name="next" value={query.next} />}

            <AuthField label={texts.email} type="email" name="email" required autoComplete="email" placeholder={texts.emailPlaceholder} />
            <AuthField
              label={texts.password}
              type="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder={texts.passwordPlaceholder}
            />

            <AuthSubmit label={texts.submit} />
          </form>

          <p className="mt-6 text-center text-sm text-[var(--color-ink)]/55">
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
