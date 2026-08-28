import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["uz", "ru", "en"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    const res = NextResponse.next();
    res.headers.set("X-Content-Type-Options", "nosniff");
    return res;
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/uz", request.url));
  }

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (!hasLocale) {
    return NextResponse.redirect(new URL(`/uz${pathname}`, request.url));
  }

  const res = NextResponse.next();
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
