import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Bookmark, LogOut, User } from "lucide-react";

import { PlaceCard } from "@/components/place-card";
import { getUserSavedPlaces } from "@/lib/data/catalog-service";
import { getMessages, isLocale } from "@/lib/i18n";
import { USER_SESSION_COOKIE, readUserSession } from "@/lib/user-auth";

type ProfilePageProps = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = { robots: { index: false } };

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const cookieStore = await cookies();
  const session = readUserSession(cookieStore.get(USER_SESSION_COOKIE)?.value);
  if (!session) redirect(`/${locale}/login`);

  const messages = getMessages(locale);
  const savedPlaces = await getUserSavedPlaces(session.userId);

  const displayName = session.name ?? session.email.split("@")[0];
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="py-8">
      {/* Profile hero */}
      <section className="container-shell pb-6">
        <div className="section-card rounded-[2rem] p-6 md:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-sky)] to-[var(--color-teal)] shadow-lg shadow-[var(--color-sky)]/20">
                <span className="display-title text-xl font-semibold text-white">{initials}</span>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-teal)]">
                  {locale === "ru" ? "Профиль" : locale === "en" ? "Profile" : "Profil"}
                </p>
                <h1 className="display-title mt-0.5 text-2xl font-semibold text-[var(--color-ink)]">
                  {displayName}
                </h1>
                <p className="mt-0.5 text-sm text-[var(--color-ink)]/50">{session.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-[1.2rem] bg-[var(--color-sky)]/10 px-4 py-3 text-center">
                <p className="text-xl font-semibold text-[var(--color-sky)]">{savedPlaces.length}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink)]/45">
                  {locale === "ru" ? "Сохранено" : locale === "en" ? "Saved" : "Saqlangan"}
                </p>
              </div>
              <form action="/api/auth/logout" method="post">
                <input type="hidden" name="locale" value={locale} />
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-[1.2rem] border border-[var(--color-ink)]/10 px-4 py-3 text-sm font-semibold text-[var(--color-ink)]/60 transition hover:border-red-300 hover:bg-red-50 hover:text-red-500"
                >
                  <LogOut size={14} strokeWidth={2} />
                  {locale === "ru" ? "Выйти" : locale === "en" ? "Sign out" : "Chiqish"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Saved places */}
      <section className="container-shell pb-14">
        <div className="mb-5 flex items-center gap-2">
          <Bookmark size={15} strokeWidth={2} className="text-[var(--color-gold)]" />
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-gold)]">
            {locale === "ru" ? "Сохранённые места" : locale === "en" ? "Saved places" : "Saqlangan joylar"}
          </p>
        </div>

        {savedPlaces.length === 0 ? (
          <div className="section-card flex flex-col items-center gap-4 rounded-[1.75rem] px-8 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-mist)]">
              <User size={26} strokeWidth={1.5} className="text-[var(--color-ink)]/30" />
            </div>
            <div>
              <p className="font-semibold text-[var(--color-ink)]">
                {locale === "ru" ? "Нет сохранённых мест" : locale === "en" ? "No saved places yet" : "Hali joy saqlanmagan"}
              </p>
              <p className="mt-1.5 text-sm text-[var(--color-ink)]/50">
                {locale === "ru"
                  ? "Исследуйте и сохраняйте понравившиеся места"
                  : locale === "en"
                  ? "Explore and save your favourite places"
                  : "Joylarni ko'rib, yoqqanlarini saqlang"}
              </p>
            </div>
            <Link
              href={`/${locale}/explore`}
              className="mt-1 inline-flex rounded-full bg-[var(--color-sky)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {messages.explore.title}
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {savedPlaces.map((place) => (
              <PlaceCard
                key={place.slug}
                locale={locale}
                place={place}
                ctaLabel={messages.explore.openDetails}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
