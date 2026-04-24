import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { USER_SESSION_COOKIE } from "@/lib/user-auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const locale = String(formData.get("locale") ?? "uz");
  const cookieStore = await cookies();
  cookieStore.delete(USER_SESSION_COOKIE);
  return NextResponse.redirect(new URL(`/${locale}`, request.url));
}
