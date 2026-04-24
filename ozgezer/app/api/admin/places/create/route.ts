import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE, readAdminSession } from "@/lib/auth";
import { createPlace } from "@/lib/data/catalog-service";

export async function POST(request: Request) {
  const formData = await request.formData();
  const locale = String(formData.get("locale") ?? "uz");
  const cookieStore = await cookies();
  const session = readAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

  if (!session) {
    return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
  }

  try {
    const categorySlugs = String(formData.get("categorySlugs") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    await createPlace({
      slug: String(formData.get("slug") ?? "").trim(),
      regionSlug: String(formData.get("regionSlug") ?? "").trim(),
      categorySlugs,
      nameUz: String(formData.get("nameUz") ?? "").trim(),
      nameRu: String(formData.get("nameRu") ?? "").trim(),
      nameEn: String(formData.get("nameEn") ?? "").trim(),
      descriptionUz: String(formData.get("descriptionUz") ?? "").trim(),
      descriptionRu: String(formData.get("descriptionRu") ?? "").trim(),
      descriptionEn: String(formData.get("descriptionEn") ?? "").trim(),
      latitude: parseFloat(String(formData.get("latitude") ?? "0")),
      longitude: parseFloat(String(formData.get("longitude") ?? "0")),
      price: String(formData.get("price") ?? "").trim(),
      workingHours: String(formData.get("workingHours") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      website: String(formData.get("website") ?? "").trim(),
      addressUz: String(formData.get("addressUz") ?? "").trim(),
      addressRu: String(formData.get("addressRu") ?? "").trim(),
      addressEn: String(formData.get("addressEn") ?? "").trim(),
      howToGetUz: String(formData.get("howToGetUz") ?? "").trim(),
      howToGetRu: String(formData.get("howToGetRu") ?? "").trim(),
      howToGetEn: String(formData.get("howToGetEn") ?? "").trim(),
    });

    return NextResponse.redirect(new URL(`/${locale}/admin/places?created=1`, request.url));
  } catch (error) {
    const code = error instanceof Error ? error.message : "UNKNOWN";
    return NextResponse.redirect(
      new URL(`/${locale}/admin/places/new?error=${code}`, request.url),
    );
  }
}
