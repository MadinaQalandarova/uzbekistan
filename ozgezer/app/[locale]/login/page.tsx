import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
};

const authTexts = {
  uz: {
    welcome: "Hush kelibsiz",
    subtitle: "O'zGezer profiliga kirish (Faza 2 Mock)",
    email: "Elektron pochta",
    password: "Maxfiy so'z",
    continue: "Davom etish",
    google: "Google orqali kirish",
    noAccount: "Akkauntingiz yo'qmi?",
    register: "Ro'yxatdan o'tish",
    back: "X",
  },
  ru: {
    welcome: "Добро пожаловать",
    subtitle: "Вход в профиль O'zGezer (Фаза 2 Mock)",
    email: "Электронная почта",
    password: "Пароль",
    continue: "Продолжить",
    google: "Войти через Google",
    noAccount: "Нет аккаунта?",
    register: "Зарегистрироваться",
    back: "Х",
  },
  en: {
    welcome: "Welcome back",
    subtitle: "Sign in to O'zGezer (Phase 2 Mock)",
    email: "Email address",
    password: "Password",
    continue: "Continue",
    google: "Sign in with Google",
    noAccount: "Don't have an account?",
    register: "Create one",
    back: "X",
  },
};

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const t = authTexts[locale as keyof typeof authTexts] || authTexts.uz;

  return (
    <div className="relative flex min-h-[85vh] items-center justify-center p-4">
      {/* Dynamic Background Elements */}
      <div className="suzani-orb float-gentle fixed right-10 top-1/4 h-64 w-64 opacity-50 blur-[80px]" />
      <div className="suzani-orb float-gentle-delay fixed bottom-1/4 left-10 h-72 w-72 opacity-40 blur-[80px] bg-gradient-to-r from-[var(--color-sky)] to-[var(--color-teal)]" />

      {/* Main Glassmorphism Card */}
      <div className="section-card fade-up relative z-10 w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white/70 p-8 shadow-[0_40px_100px_rgba(27,108,168,0.15)] ring-1 ring-white/50 backdrop-blur-2xl md:p-12">
        <Link
          href={`/${locale}`}
          className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-sm font-bold text-black/40 transition hover:bg-black/10 hover:text-black/80"
        >
          {t.back}
        </Link>

        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-sky),var(--color-teal))] text-2xl font-bold text-white shadow-xl shadow-sky-900/20">
            OZ
          </div>
          <h1 className="display-title text-3xl font-semibold text-[var(--color-ink)] md:text-4xl">
            {t.welcome}
          </h1>
          <p className="mt-3 text-sm text-[var(--color-sky)] font-medium tracking-wide">
            {t.subtitle}
          </p>
        </div>

        <form className="space-y-5">
          <div>
            <label className="mb-2 block pl-2 text-xs uppercase tracking-widest text-black/50">
              {t.email}
            </label>
            <input
              type="email"
              placeholder="sayyoh@example.com"
              className="h-14 w-full rounded-[1.2rem] border border-black/10 bg-white/50 px-5 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-sky)] focus:bg-white focus:ring-4 focus:ring-sky-500/10"
            />
          </div>

          <div>
            <label className="mb-2 block pl-2 text-xs uppercase tracking-widest text-black/50">
              {t.password}
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="h-14 w-full rounded-[1.2rem] border border-black/10 bg-white/50 px-5 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-sky)] focus:bg-white focus:ring-4 focus:ring-sky-500/10"
            />
          </div>

          <button
            type="button"
            className="mt-2 h-14 w-full rounded-[1.2rem] bg-[var(--color-ink)] text-sm font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[var(--color-sky)] hover:shadow-sky-900/25"
          >
            {t.continue}
          </button>
        </form>

        <div className="my-8 flex items-center justify-center gap-4">
          <div className="h-px flex-1 bg-black/5" />
          <span className="text-xs font-semibold uppercase tracking-widest text-black/20">
            OR
          </span>
          <div className="h-px flex-1 bg-black/5" />
        </div>

        <button
          type="button"
          className="flex h-14 w-full items-center justify-center gap-3 rounded-[1.2rem] border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:border-black/20 hover:shadow-md"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-sm font-semibold text-black/70">{t.google}</span>
        </button>

        <p className="mt-8 text-center text-sm text-black/60">
          {t.noAccount}{" "}
          <button className="font-semibold text-[var(--color-sky)] transition hover:underline">
            {t.register}
          </button>
        </p>
      </div>
    </div>
  );
}
