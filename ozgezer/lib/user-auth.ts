import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export const USER_SESSION_COOKIE = "ozgezer_user_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30 kun

type UserSessionPayload = {
  userId: string;
  email: string;
  name: string | null;
  expiresAt: number;
};

function getSecret(): string {
  return process.env.ADMIN_SECRET ?? "fallback-dev-secret-change-in-prod";
}

// ─── Parol xeshlash ───────────────────────────────────────────────────────────

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  try {
    const inputHash = scryptSync(password, salt, 64).toString("hex");
    return timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(inputHash, "hex"));
  } catch {
    return false;
  }
}

// ─── Sessiya ──────────────────────────────────────────────────────────────────

export function createUserSession(payload: Omit<UserSessionPayload, "expiresAt">): string {
  const secret = getSecret();
  const full: UserSessionPayload = {
    ...payload,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };
  const encoded = Buffer.from(JSON.stringify(full)).toString("base64url");
  const sig = createHmac("sha256", secret).update(encoded).digest("hex");
  return `${encoded}.${sig}`;
}

export function readUserSession(value?: string | null): UserSessionPayload | null {
  if (!value) return null;
  const secret = getSecret();
  const [encoded, sig] = value.split(".");
  if (!encoded || !sig) return null;

  const expected = createHmac("sha256", secret).update(encoded).digest("hex");
  if (
    sig.length !== expected.length ||
    !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as UserSessionPayload;
    if (payload.expiresAt < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
