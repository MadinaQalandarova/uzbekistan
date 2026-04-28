import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyPassword, createUserSession, USER_SESSION_COOKIE } from "@/lib/user-auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const locale = String(formData.get("locale") ?? "uz");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const redirect = (path: string) =>
    NextResponse.redirect(new URL(path, request.url));

  const next = String(formData.get("next") ?? "").trim();
  const afterLogin = next && next.startsWith("/") ? next : `/${locale}`;

  if (!email || !password) {
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
  } catch {
    return redirect(`/${locale}/login?error=UNKNOWN`);
  }
}
