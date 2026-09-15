import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { USER_SESSION_COOKIE, readUserSession } from "@/lib/user-auth";

const MAX_COMMENT_LENGTH = 1000;

export async function POST(request: Request) {
  const formData = await request.formData();
  const locale = String(formData.get("locale") ?? "uz");
  const placeSlug = String(formData.get("placeSlug") ?? "").trim();
  const rating = parseInt(String(formData.get("rating") ?? "0"), 10);
  const comment = String(formData.get("comment") ?? "").trim();
  const wouldRecommend = formData.get("wouldRecommend") !== "false";

  const redirect = (path: string) =>
    NextResponse.redirect(new URL(path, request.url));

  const cookieStore = await cookies();
  const session = readUserSession(cookieStore.get(USER_SESSION_COOKIE)?.value);

  if (!session) {
    return redirect(`/${locale}/login?next=/places/${placeSlug}`);
  }

  // Rate limit: 3 ta izoh / soat / foydalanuvchi
  const reviewKey = `review:${session.userId}`;
  if (!checkRateLimit(reviewKey, 3, 60 * 60 * 1000)) {
    return redirect(`/${locale}/places/${placeSlug}?error=RATE_LIMITED`);
  }

  if (!placeSlug || rating < 1 || rating > 5 || !comment) {
    return redirect(`/${locale}/places/${placeSlug}?error=INVALID_REVIEW`);
  }

  if (comment.length > MAX_COMMENT_LENGTH) {
    return redirect(`/${locale}/places/${placeSlug}?error=COMMENT_TOO_LONG`);
  }

  if (!process.env.DATABASE_URL) {
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

    // Izoh qo'sh — moderatsiya uchun PENDING
    await prisma.review.create({
      data: {
        rating,
        comment: comment.replace(/<[^>]*>/g, ""), // HTML teglarni tozalash
        wouldRecommend,
        status: "PENDING",
        userId: session.userId,
        placeId: place.id,
      },
    });

    return redirect(`/${locale}/places/${placeSlug}?reviewed=1`);
  } catch {
    return redirect(`/${locale}/places/${placeSlug}?error=UNKNOWN`);
  }
}
