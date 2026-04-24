import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { slug } = await request.json() as { slug: string };
    if (!slug || !prisma) return NextResponse.json({ ok: false });

    await prisma.place.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
