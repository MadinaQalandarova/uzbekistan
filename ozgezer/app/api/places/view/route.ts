import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const { slug } = await request.json() as { slug: string };
    if (!slug || typeof slug !== "string" || slug.length > 100) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // IP + slug bo'yicha throttle: 1 view / 5 daqiqa / IP
    const key = `view:${getClientIp(request)}:${slug}`;
    if (!checkRateLimit(key, 1, 5 * 60 * 1000)) {
      return NextResponse.json({ ok: true }); // silent skip
    }

    await prisma.place.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
