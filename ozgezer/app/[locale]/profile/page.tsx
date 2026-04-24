import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { PlaceCard } from "@/components/place-card";
import { getUserSavedPlaces } from "@/lib/data/catalog-service";
import { getMessages, isLocale } from "@/lib/i18n";
import { USER_SESSION_COOKIE, readUserSession } from "@/lib/user-auth";

type ProfilePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const cookieStore = await cookies();
  const session = readUserSession(cookieStore.get(USER_SESSION_COOKIE)?.value);
  if (!session) redirect(`/${locale}/login`);

  const messages = getMessages(locale);
  const savedPlaces = await getUserSavedPlaces(session.userId);

  return (
    <section className="container-shell py-10 pb-14">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-teal)]">
            Profil
          </p>
          <h1 className="display-title mt-2 text-5xl font-semibold text-[var(--color-ink)]">
            {session.name ?? session.email.split("@")[0]}
          </h1>
          <p className="mt-2 text-sm text-black/55">{session.email}</p>
        </div>

        <form action="/api/auth/logout" method="post">
          <input type="hidden" name="locale" value={locale} />
          <button
            type="submit"
            className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-black/60 transition hover:border-red-300 hover:text-red-500"
          >
            Chiqish
          </button>
        </form>
      </div>

      <div className="section-card rounded-[1.75rem] p-6">
        <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-gold)]">
          Saqlangan joylar
        </p>

        {savedPlaces.length === 0 ? (
          <div className="mt-6 text-center py-10">
            <p className="text-sm text-black/50">Hali hech qanday joy saqlanmagan.</p>
            <Link
              href={`/${locale}/explore`}
              className="mt-4 inline-flex rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-sky)]"
            >
              Joylarni ko&apos;rish
            </Link>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
      </div>
    </section>
  );
}
