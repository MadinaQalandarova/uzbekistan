import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE, readAdminSession } from "@/lib/auth";
import { publishPlace, unpublishPlace } from "@/lib/data/catalog-service";

export async function POST(request: Request) {
  const formData = await request.formData();
  const locale = String(formData.get("locale") ?? "uz");
  const slug = String(formData.get("slug") ?? "").trim();
  const action = String(formData.get("action") ?? "publish");
  const cookieStore = await cookies();
  const session = readAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

  if (!session) {
    return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
  }

  try {
    if (action === "unpublish") {
      await unpublishPlace(slug);
    } else {
      await publishPlace(slug);
    }

    return NextResponse.redirect(
      new URL(`/${locale}/admin/places?published=1`, request.url),
    );
  } catch (error) {
    const code = error instanceof Error ? error.message : "UNKNOWN";
    return NextResponse.redirect(
      new URL(`/${locale}/admin/places?error=${code}`, request.url),
    );
  }
}
