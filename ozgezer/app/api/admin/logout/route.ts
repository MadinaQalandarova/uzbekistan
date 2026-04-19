import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const locale = String(formData.get("locale") ?? "uz");
  const cookieStore = await cookies();

  cookieStore.delete(ADMIN_SESSION_COOKIE);

  return NextResponse.redirect(new URL(`/${locale}`, request.url));
}
