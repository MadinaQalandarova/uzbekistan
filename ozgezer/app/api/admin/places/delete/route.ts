import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE, readAdminSession } from "@/lib/auth";
import { deletePlace } from "@/lib/data/catalog-service";
import { normalizeLocale } from "@/lib/i18n";

export async function POST(request: Request) {
  const formData = await request.formData();
  const locale = normalizeLocale(formData.get("locale"));
  const slug = String(formData.get("slug") ?? "").trim();
  const cookieStore = await cookies();
  const session = readAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

  if (!session) {
    return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
  }

  try {
    await deletePlace(slug);
    return NextResponse.redirect(new URL(`/${locale}/admin/places?deleted=1`, request.url));
  } catch (error) {
    const code = error instanceof Error ? error.message : "UNKNOWN";
    return NextResponse.redirect(
      new URL(`/${locale}/admin/places?error=${code}`, request.url),
    );
  }
}
