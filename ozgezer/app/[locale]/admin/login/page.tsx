import { notFound } from "next/navigation";

import { canUseAdminAuth } from "@/lib/auth";
import { getMessages, isLocale } from "@/lib/i18n";

type AdminLoginPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; setup?: string }>;
};

export default async function AdminLoginPage({
  params,
  searchParams,
}: AdminLoginPageProps) {
  const { locale } = await params;
  const query = await searchParams;

  if (!isLocale(locale)) {
    notFound();
  }

  const messages = getMessages(locale);
  const isConfigured = canUseAdminAuth();

  return (
    <section className="container-shell py-10 pb-14">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-[var(--color-ink)]/8 bg-white/80 p-8 shadow-[0_20px_60px_rgba(17,32,49,0.08)]">
        <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-teal)]">Admin only</p>
        <h1 className="display-title mt-3 text-3xl font-semibold text-[var(--color-ink)] md:text-4xl">
          {messages.admin.loginTitle}
        </h1>
        <p className="mt-4 text-sm leading-7 text-[var(--color-ink)]/70">{messages.admin.loginDescription}</p>

        {!isConfigured || query.setup ? (
          <div className="mt-6 rounded-[1.5rem] border border-amber-200/60 bg-amber-50 p-5 text-sm leading-7 text-[var(--color-ink)]">
            `.env.local` fayliga `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SECRET` qo&apos;shing.
          </div>
        ) : null}

        {query.error ? (
          <div className="mt-6 rounded-[1.5rem] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {messages.admin.invalid}
          </div>
        ) : null}

        <form action="/api/admin/login" method="post" className="mt-8 space-y-4">
          <input type="hidden" name="locale" value={locale} />
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[var(--color-ink)]">
              {messages.admin.emailLabel}
            </span>
            <input
              type="email"
              name="email"
              required
              className="h-12 w-full rounded-[1rem] border border-[var(--color-ink)]/10 bg-[var(--color-mist)] px-4 outline-none focus:border-[var(--color-sky)]"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[var(--color-ink)]">
              {messages.admin.passwordLabel}
            </span>
            <input
              type="password"
              name="password"
              required
              className="h-12 w-full rounded-[1rem] border border-[var(--color-ink)]/10 bg-[var(--color-mist)] px-4 outline-none focus:border-[var(--color-sky)]"
            />
          </label>
          <button
            type="submit"
            className="h-12 rounded-full bg-[var(--color-sky)] px-5 text-sm font-semibold text-white shadow-sm shadow-[var(--color-sky)]/20 transition hover:opacity-90"
          >
            {messages.admin.submit}
          </button>
        </form>
      </div>
    </section>
  );
}
