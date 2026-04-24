import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { USER_SESSION_COOKIE, readUserSession } from "@/lib/user-auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const locale = String(formData.get("locale") ?? "uz");
  const placeSlug = String(formData.get("placeSlug") ?? "").trim();
  const type = formData.get("type") === "VISITED" ? "VISITED" : "WANT_TO_GO";

  const cookieStore = await cookies();
  const session = readUserSession(cookieStore.get(USER_SESSION_COOKIE)?.value);

  if (!session) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  if (!prisma) {
    return NextResponse.json({ error: "DB_NOT_CONFIGURED" }, { status: 503 });
  }

  try {
    const place = await prisma.place.findUnique({
      where: { slug: placeSlug },
      select: { id: true },
    });

    if (!place) {
      return NextResponse.json({ error: "PLACE_NOT_FOUND" }, { status: 404 });
    }

    const existing = await prisma.savedPlace.findUnique({
      where: { userId_placeId: { userId: session.userId, placeId: place.id } },
    });

    if (existing) {
      // Saqlangan bo'lsa — o'chirish (toggle)
      await prisma.savedPlace.delete({
        where: { userId_placeId: { userId: session.userId, placeId: place.id } },
      });
      return NextResponse.json({ saved: false });
    } else {
      await prisma.savedPlace.create({
        data: { userId: session.userId, placeId: place.id, type },
      });
      return NextResponse.json({ saved: true, type });
    }
  } catch {
    return NextResponse.json({ error: "UNKNOWN" }, { status: 500 });
  }
}
