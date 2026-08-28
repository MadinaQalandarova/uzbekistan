import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { isLocale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { hashPassword, createUserSession, USER_SESSION_COOKIE, isValidEmail } from "@/lib/user-auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const rawLocale = String(formData.get("locale") ?? "uz");
  const locale = isLocale(rawLocale) ? rawLocale : "uz";
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const redirect = (path: string) =>
    NextResponse.redirect(new URL(path, request.url));

  if (!checkRateLimit(`register:${getClientIp(request)}`, 3, 60 * 60 * 1000)) {
    return redirect(`/${locale}/register?error=RATE_LIMITED`);
  }

  if (!email || !password || password.length < 6 || !isValidEmail(email)) {
    return redirect(`/${locale}/register?error=INVALID_INPUT`);
  }

  if (!process.env.DATABASE_URL) {
    return redirect(`/${locale}/register?error=DB_NOT_CONFIGURED`);
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return redirect(`/${locale}/register?error=EMAIL_TAKEN`);
    }

    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        passwordHash: hashPassword(password),
      },
    });

    const token = createUserSession({ userId: user.id, email: user.email, name: user.name });
    const cookieStore = await cookies();
    cookieStore.set(USER_SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return redirect(`/${locale}`);
  } catch {
    return redirect(`/${locale}/register?error=UNKNOWN`);
  }
}
