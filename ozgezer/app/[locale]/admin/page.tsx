import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { ADMIN_SESSION_COOKIE, canUseAdminAuth, readAdminSession } from "@/lib/auth";
import { getRegions } from "@/lib/data/catalog-service";
import { getMessages, isLocale } from "@/lib/i18n";

type AdminPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  if (!canUseAdminAuth()) {
    redirect(`/${locale}/admin/login?setup=1`);
  }

  const cookieStore = await cookies();
  const session = readAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

  if (!session) {
    redirect(`/${locale}/admin/login`);
  }

  const messages = getMessages(locale);
  const regions = await getRegions();

  return (
    <section className="container-shell py-10 pb-14">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-teal)]">
            Admin only
          </p>
          <h1 className="display-title mt-2 text-5xl font-semibold text-[var(--color-ink)]">
            {messages.admin.dashboardTitle}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-black/70">
            {messages.admin.dashboardDescription}
          </p>
        </div>
        <form action="/api/admin/logout" method="post">
          <input type="hidden" name="locale" value={locale} />
          <button
            type="submit"
            className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-sky)] hover:text-[var(--color-sky)]"
          >
            {messages.admin.signOut}
          </button>
        </form>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_0.95fr]">
        <article className="section-card rounded-[1.75rem] p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-gold)]">
            {messages.admin.policyTitle}
          </p>
          <p className="mt-4 text-sm leading-7 text-black/70">
            {messages.admin.policyDescription}
          </p>
          <div className="mt-6 rounded-[1.5rem] bg-[var(--color-mist)] p-5">
            <p className="text-sm leading-7 text-black/70">
              Admin session: <span className="font-semibold text-[var(--color-ink)]">{session.email}</span>
            </p>
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-black/8 bg-[var(--color-ink)] p-6 text-white">
          <p className="text-sm uppercase tracking-[0.28em] text-white/55">Current scope</p>
          <h2 className="display-title mt-3 text-3xl font-semibold">
            Keyingi qadamda shu dashboard orqali real CRUD ulaymiz
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/70">
            Hozircha public katalog statik qatlamda ishlayapti. Siz ma&apos;lumot berganingiz sari
            men uni Prisma model va admin formalariga ko&apos;chiraman.
          </p>
          <Link
            href={`/${locale}/admin/regions`}
            className="mt-6 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:-translate-y-0.5"
          >
            Region management
          </Link>
        </article>
      </div>

      <article className="section-card mt-8 rounded-[1.75rem] p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-sky)]">
              Region dataset
            </p>
            <h2 className="display-title mt-2 text-3xl font-semibold text-[var(--color-ink)]">
              Joriy katalogda {regions.length} ta region yozuvi bor
            </h2>
          </div>
          <Link
            href={`/${locale}/regions`}
            className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-sky)] hover:text-[var(--color-sky)]"
          >
            Public ko&apos;rinishni ochish
          </Link>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {regions.map((region) => (
            <div key={region.slug} className="rounded-[1.25rem] bg-[var(--color-mist)] p-4">
              <p className="text-lg font-semibold text-[var(--color-ink)]">{region.name[locale]}</p>
              <p className="mt-2 text-sm leading-7 text-black/65">{region.focus[locale]}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
