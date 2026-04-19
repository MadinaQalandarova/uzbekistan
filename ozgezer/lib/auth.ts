import { createHmac, timingSafeEqual } from "node:crypto";

type AdminSessionPayload = {
  email: string;
  expiresAt: number;
};

export const ADMIN_SESSION_COOKIE = "ozgezer_admin_session";

const SESSION_DURATION_MS = 1000 * 60 * 60 * 12;

function getAdminConfig() {
  return {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    secret: process.env.ADMIN_SECRET,
  };
}

function signValue(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function canUseAdminAuth() {
  const config = getAdminConfig();
  return Boolean(config.email && config.password && config.secret);
}

export function createAdminSession(email: string) {
  const { secret } = getAdminConfig();

  if (!secret) {
    throw new Error("Missing ADMIN_SECRET");
  }

  const payload: AdminSessionPayload = {
    email,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signValue(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

export function verifyAdminCredentials(email: string, password: string) {
  const config = getAdminConfig();
  return email === config.email && password === config.password;
}

export function readAdminSession(sessionValue?: string | null): AdminSessionPayload | null {
  const { secret, email } = getAdminConfig();

  if (!sessionValue || !secret || !email) {
    return null;
  }

  const [encodedPayload, signature] = sessionValue.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signValue(encodedPayload, secret);

  if (
    signature.length !== expectedSignature.length ||
    !timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as AdminSessionPayload;

    if (payload.email !== email || payload.expiresAt < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
