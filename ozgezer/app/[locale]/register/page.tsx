import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { isLocale } from "@/lib/i18n";
import { USER_SESSION_COOKIE, readUserSession } from "@/lib/user-auth";
import { AuthBrand, AuthError, AuthField, AuthSubmit } from "@/components/auth-shell";

type RegisterPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
};

const t = {
  uz: {
    title: "Ro'yxatdan o'tish",
    subtitle: "O'zGezer da hisob yarating",
    name: "Ism (ixtiyoriy)",
    namePlaceholder: "Ali Valiyev",
    email: "Elektron pochta",
    emailPlaceholder: "ali@example.com",
    password: "Parol (kamida 6 ta belgi)",
    passwordPlaceholder: "••••••••",
    submit: "Hisob yaratish",
    haveAccount: "Hisobingiz bormi?",
    login: "Kirish",
    errors: {
      INVALID_INPUT: "Email va parolni to'g'ri to'ldiring (parol kamida 6 ta belgi).",
      EMAIL_TAKEN: "Bu email allaqachon ro'yxatdan o'tgan.",
      RATE_LIMITED: "Juda ko'p urinish. 1 soatdan so'ng urinib ko'ring.",
      DB_NOT_CONFIGURED: "Tizim vaqtincha ishlamayapti.",
      UNKNOWN: "Xatolik yuz berdi. Qayta urinib ko'ring.",
    },
  },
  ru: {
    title: "Регистрация",
    subtitle: "Создайте аккаунт в O'zGezer",
    name: "Имя (необязательно)",
    namePlaceholder: "Али Валиев",
    email: "Электронная почта",
    emailPlaceholder: "ali@example.com",
    password: "Пароль (минимум 6 символов)",
    passwordPlaceholder: "••••••••",
    submit: "Создать аккаунт",
    haveAccount: "Уже есть аккаунт?",
    login: "Войти",
    errors: {
      INVALID_INPUT: "Заполните email и пароль (минимум 6 символов).",
      EMAIL_TAKEN: "Этот email уже зарегистрирован.",
      RATE_LIMITED: "Слишком много попыток. Попробуйте через час.",
      DB_NOT_CONFIGURED: "Сервис временно недоступен.",
      UNKNOWN: "Произошла ошибка. Попробуйте снова.",
    },
  },
  en: {
    title: "Register",
    subtitle: "Create your O'zGezer account",
    name: "Name (optional)",
    namePlaceholder: "Ali Valiyev",
    email: "Email address",
    emailPlaceholder: "ali@example.com",
    password: "Password (min 6 characters)",
    passwordPlaceholder: "••••••••",
    submit: "Create account",
    haveAccount: "Already have an account?",
    login: "Sign in",
    errors: {
      INVALID_INPUT: "Please fill in email and password (min 6 chars).",
      EMAIL_TAKEN: "This email is already registered.",
      RATE_LIMITED: "Too many attempts. Try again in an hour.",
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
    <div className="flex justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <AuthBrand title={texts.title} subtitle={texts.subtitle} />

        <div className="section-card rounded-[2rem] p-7">
          <AuthError message={errorMsg} />

          <form action="/api/auth/register" method="post" className="space-y-4">
            <input type="hidden" name="locale" value={locale} />

            <AuthField label={texts.name} name="name" autoComplete="name" placeholder={texts.namePlaceholder} />
            <AuthField label={texts.email} type="email" name="email" required autoComplete="email" placeholder={texts.emailPlaceholder} />
            <AuthField
              label={texts.password}
              type="password"
              name="password"
              required
              minLength={6}
              autoComplete="new-password"
              placeholder={texts.passwordPlaceholder}
            />

            <AuthSubmit label={texts.submit} />
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
