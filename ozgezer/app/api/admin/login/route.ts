import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { isLocale } from "@/lib/i18n";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSession,
  verifyAdminCredentials,
} from "@/lib/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const rawLocale = String(formData.get("locale") ?? "uz");
  const locale = isLocale(rawLocale) ? rawLocale : "uz";
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!checkRateLimit(`admin:${getClientIp(request)}`, 5, 15 * 60 * 1000)) {
    return NextResponse.redirect(new URL(`/${locale}/admin/login?error=1`, request.url));
  }

  if (!verifyAdminCredentials(email, password)) {
    return NextResponse.redirect(new URL(`/${locale}/admin/login?error=1`, request.url));
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, createAdminSession(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
}
