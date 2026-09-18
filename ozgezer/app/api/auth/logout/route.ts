import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { normalizeLocale } from "@/lib/i18n";
import { USER_SESSION_COOKIE } from "@/lib/user-auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const locale = normalizeLocale(formData.get("locale"));
  const cookieStore = await cookies();
  cookieStore.delete(USER_SESSION_COOKIE);
  return NextResponse.redirect(new URL(`/${locale}`, request.url));
}
