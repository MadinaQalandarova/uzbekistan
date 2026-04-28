import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { USER_SESSION_COOKIE, readUserSession } from "@/lib/user-auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const locale = String(formData.get("locale") ?? "uz");
  const placeSlug = String(formData.get("placeSlug") ?? "").trim();

  const back = new URL(`/${locale}/places/${placeSlug}`, request.url);
  const redirect = (url: URL) => NextResponse.redirect(url);

  const cookieStore = await cookies();
  const session = readUserSession(cookieStore.get(USER_SESSION_COOKIE)?.value);

  if (!session) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  if (!process.env.DATABASE_URL) {
    back.searchParams.set("error", "DB_NOT_CONFIGURED");
    return redirect(back);
  }

  try {
    const place = await prisma.place.findUnique({
      where: { slug: placeSlug },
      select: { id: true },
    });

    if (!place) {
      back.searchParams.set("error", "PLACE_NOT_FOUND");
      return redirect(back);
    }

    const existing = await prisma.savedPlace.findUnique({
      where: { userId_placeId: { userId: session.userId, placeId: place.id } },
    });

    if (existing) {
      // Saqlangan bo'lsa — o'chirish (toggle)
      await prisma.savedPlace.delete({
        where: { userId_placeId: { userId: session.userId, placeId: place.id } },
      });
    } else {
      await prisma.savedPlace.create({
        data: { userId: session.userId, placeId: place.id, type: "WANT_TO_GO" },
      });
    }

    return redirect(back);
  } catch {
    back.searchParams.set("error", "UNKNOWN");
    return redirect(back);
  }
}
