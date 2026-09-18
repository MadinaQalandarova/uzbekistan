import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE } from "@/lib/auth";
import { normalizeLocale } from "@/lib/i18n";

export async function POST(request: Request) {
  const formData = await request.formData();
  const locale = normalizeLocale(formData.get("locale"));
  const cookieStore = await cookies();

  cookieStore.delete(ADMIN_SESSION_COOKIE);

  return NextResponse.redirect(new URL(`/${locale}`, request.url));
}
