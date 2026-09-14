import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { USER_SESSION_COOKIE, readUserSession } from "@/lib/user-auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const locale = String(formData.get("locale") ?? "uz");
  const cookieStore = await cookies();
  const session = readUserSession(cookieStore.get(USER_SESSION_COOKIE)?.value);

  if (!session) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.redirect(new URL(`/${locale}/profile?error=DB_NOT_CONFIGURED`, request.url));
  }

  try {
    await prisma.user.delete({ where: { id: session.userId } });
    cookieStore.delete(USER_SESSION_COOKIE);
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  } catch (err) {
    console.error("delete account error:", err);
    return NextResponse.redirect(new URL(`/${locale}/profile?error=UNKNOWN`, request.url));
  }
}
