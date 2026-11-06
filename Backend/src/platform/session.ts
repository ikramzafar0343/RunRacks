/**
 * HMAC-signed session cookie — current secret signs; current+previous verify.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export type SessionPayload = {
  whmcsClientId: number;
  exp: number;
};

function b64url(buf: Buffer): string {
  return buf.toString("base64url");
}

function signBody(body: string, secret: string): string {
  return createHmac("sha256", secret).update(body).digest("base64url");
}

function sigMatch(aRaw: string, bRaw: string): boolean {
  const a = Buffer.from(aRaw);
  const b = Buffer.from(bRaw);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function signSession(payload: SessionPayload, secret: string): string {
  const body = b64url(Buffer.from(JSON.stringify(payload), "utf8"));
  return `${body}.${signBody(body, secret)}`;
}

/** Verify with current secret, then optional previous (rotation window). */
export function verifySession(
  token: string,
  secret: string,
  previousSecret?: string | null,
): SessionPayload | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  if (!body || !sig) return null;

  const secrets = [secret];
  if (previousSecret && previousSecret.length >= 32) {
    secrets.push(previousSecret);
  }

  let matched = false;
  for (const key of secrets) {
    if (sigMatch(sig, signBody(body, key))) {
      matched = true;
      break;
    }
  }
  if (!matched) return null;

  try {
    const parsed = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as SessionPayload;
    if (!parsed.whmcsClientId || !parsed.exp) return null;
    if (Date.now() / 1000 > parsed.exp) return null;
    return parsed;
  } catch {
    return null;
  }
}
