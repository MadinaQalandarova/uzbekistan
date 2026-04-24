import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE, readAdminSession } from "@/lib/auth";
import { moderateReview } from "@/lib/data/catalog-service";

export async function POST(request: Request) {
  const formData = await request.formData();
  const locale = String(formData.get("locale") ?? "uz");
  const reviewId = String(formData.get("reviewId") ?? "").trim();
  const action = formData.get("action") === "REJECTED" ? "REJECTED" : "APPROVED";

  const cookieStore = await cookies();
  const session = readAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

  if (!session) {
    return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
  }

  try {
    await moderateReview(reviewId, action);
    return NextResponse.redirect(
      new URL(`/${locale}/admin/reviews?${action === "APPROVED" ? "approved=1" : "rejected=1"}`, request.url),
    );
  } catch (error) {
    const code = error instanceof Error ? error.message : "UNKNOWN";
    return NextResponse.redirect(
      new URL(`/${locale}/admin/reviews?error=${code}`, request.url),
    );
  }
}
