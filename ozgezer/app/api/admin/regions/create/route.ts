import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE, readAdminSession } from "@/lib/auth";
import { createRegion } from "@/lib/data/catalog-service";

export async function POST(request: Request) {
  const formData = await request.formData();
  const locale = String(formData.get("locale") ?? "uz");
  const cookieStore = await cookies();
  const session = readAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

  if (!session) {
    return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
  }

  try {
    await createRegion({
      slug: String(formData.get("slug") ?? "").trim(),
      nameUz: String(formData.get("nameUz") ?? "").trim(),
      nameRu: String(formData.get("nameRu") ?? "").trim(),
      nameEn: String(formData.get("nameEn") ?? "").trim(),
      summaryUz: String(formData.get("summaryUz") ?? "").trim(),
      summaryRu: String(formData.get("summaryRu") ?? "").trim(),
      summaryEn: String(formData.get("summaryEn") ?? "").trim(),
      focusUz: String(formData.get("focusUz") ?? "").trim(),
      focusRu: String(formData.get("focusRu") ?? "").trim(),
      focusEn: String(formData.get("focusEn") ?? "").trim(),
    });

    return NextResponse.redirect(new URL(`/${locale}/admin/regions?created=1`, request.url));
  } catch (error) {
    const code = error instanceof Error ? error.message : "UNKNOWN";
    return NextResponse.redirect(
      new URL(`/${locale}/admin/regions?error=${code}`, request.url),
    );
  }
}
