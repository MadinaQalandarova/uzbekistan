import { NextResponse } from "next/server";

import { createGuideStream, type GuideRequest } from "@/lib/ai-guide";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { isLocale, type Locale } from "@/lib/i18n";

export const runtime = "nodejs";

const MAX_QUERY_LENGTH = 500;

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "AI_NOT_CONFIGURED" }, { status: 503 });
  }

  // Rate limit: 10 ta so'rov / soat / IP
  const ipKey = `guide:${getClientIp(request)}`;
  if (!checkRateLimit(ipKey, 10, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const b = body as Partial<GuideRequest>;
  const q = String(b.q ?? "").trim();
  const mode = b.mode === "plan" ? "plan" : "place";
  const locale = isLocale(b.locale ?? "") ? (b.locale as Locale) : "uz";

  if (!q || q.length > MAX_QUERY_LENGTH) {
    return NextResponse.json({ error: "INVALID_QUERY" }, { status: 400 });
  }

  const days =
    b.mode === "plan" && typeof b.days === "number"
      ? Math.min(Math.max(Math.round(b.days), 1), 15)
      : undefined;

  const destination =
    b.mode === "plan" ? String(b.destination ?? "").trim().slice(0, 100) : undefined;

  const category =
    b.mode === "plan" ? String(b.category ?? "").trim().slice(0, 60) : undefined;

  try {
    return await createGuideStream({ q, mode, locale, days, destination, category });
  } catch (err) {
    console.error("[ai-guide] stream error:", err);
    return NextResponse.json({ error: "UNKNOWN" }, { status: 500 });
  }
}