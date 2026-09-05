import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { isLocale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { verifyPassword, createUserSession, USER_SESSION_COOKIE, isValidEmail } from "@/lib/user-auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const rawLocale = String(formData.get("locale") ?? "uz");
  const locale = isLocale(rawLocale) ? rawLocale : "uz";
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const redirect = (path: string) =>
    NextResponse.redirect(new URL(path, request.url));

  // Brute-force himoyasi: 5 ta urinish / 15 daqiqa / IP
  if (!checkRateLimit(`login:${getClientIp(request)}`, 5, 15 * 60 * 1000)) {
    return redirect(`/${locale}/login?error=RATE_LIMITED`);
  }

  const rawNext = String(formData.get("next") ?? "").trim();
  const safeNext = rawNext.startsWith("/") && !rawNext.startsWith("//") && !rawNext.includes("\\");
  const afterLogin = safeNext ? rawNext : `/${locale}`;

  if (!email || !password || !isValidEmail(email)) {
    return redirect(`/${locale}/login?error=INVALID_INPUT`);
  }

  if (!process.env.DATABASE_URL) {
    return redirect(`/${locale}/login?error=DB_NOT_CONFIGURED`);
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
      return redirect(`/${locale}/login?error=INVALID_CREDENTIALS`);
    }

    const token = createUserSession({ userId: user.id, email: user.email, name: user.name });
    const cookieStore = await cookies();
    cookieStore.set(USER_SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return redirect(afterLogin);
  } catch (err) {
    console.error("login error:", err);
    return redirect(`/${locale}/login?error=UNKNOWN`);
  }
}
