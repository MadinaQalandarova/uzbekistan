import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { USER_SESSION_COOKIE, readUserSession } from "@/lib/user-auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const locale = String(formData.get("locale") ?? "uz");
  const placeSlug = String(formData.get("placeSlug") ?? "").trim();
  const rating = parseInt(String(formData.get("rating") ?? "0"), 10);
  const comment = String(formData.get("comment") ?? "").trim();
  const wouldRecommend = formData.get("wouldRecommend") === "true";

  const redirect = (path: string) =>
    NextResponse.redirect(new URL(path, request.url));

  const cookieStore = await cookies();
  const session = readUserSession(cookieStore.get(USER_SESSION_COOKIE)?.value);

  if (!session) {
    return redirect(`/${locale}/login?next=/places/${placeSlug}`);
  }

  if (!placeSlug || rating < 1 || rating > 5 || !comment) {
    return redirect(`/${locale}/places/${placeSlug}?error=INVALID_REVIEW`);
  }

  if (!prisma) {
    return redirect(`/${locale}/places/${placeSlug}?error=DB_NOT_CONFIGURED`);
  }

  try {
    const place = await prisma.place.findUnique({
      where: { slug: placeSlug },
      select: { id: true },
    });

    if (!place) {
      return redirect(`/${locale}/places/${placeSlug}?error=PLACE_NOT_FOUND`);
    }

    // Avval izoh bor-yo'qligini tekshir
    const existing = await prisma.review.findUnique({
      where: { userId_placeId: { userId: session.userId, placeId: place.id } },
    });

    if (existing) {
      return redirect(`/${locale}/places/${placeSlug}?error=ALREADY_REVIEWED`);
    }

    // Izoh qo'sh (avtomatik tasdiqlash)
    await prisma.review.create({
      data: {
        rating,
        comment,
        wouldRecommend,
        status: "APPROVED",
        userId: session.userId,
        placeId: place.id,
      },
    });

    // O'rtacha reyting va izohlar sonini yangilash
    const stats = await prisma.review.aggregate({
      where: { placeId: place.id, status: "APPROVED" },
      _avg: { rating: true },
      _count: { id: true },
    });

    await prisma.place.update({
      where: { id: place.id },
      data: {
        averageRating: stats._avg.rating ?? 0,
        reviewCount: stats._count.id,
      },
    });

    return redirect(`/${locale}/places/${placeSlug}?reviewed=1`);
  } catch {
    return redirect(`/${locale}/places/${placeSlug}?error=UNKNOWN`);
  }
}
