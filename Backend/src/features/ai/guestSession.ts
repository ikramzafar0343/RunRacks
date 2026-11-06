/**
 * Opaque guest AI session — HMAC cookie with dual-secret verify.
 */
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import type { FastifyReply, FastifyRequest } from "fastify";

const COOKIE = "rr_ai_sess";
const TTL_SEC = 60 * 60 * 24 * 14;

export type GuestSecrets = {
  current: string;
  previous?: string | null | undefined;
};

export function readAiGuestSession(
  req: FastifyRequest,
  secrets: string | GuestSecrets,
): string | null {
  const raw = req.headers.cookie;
  if (!raw) return null;
  const part = raw
    .split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${COOKIE}=`));
  if (!part) return null;
  const token = decodeURIComponent(part.slice(COOKIE.length + 1));
  const bag =
    typeof secrets === "string"
      ? { current: secrets, previous: null }
      : secrets;
  return verifyGuestToken(token, bag.current, bag.previous);
}

export function issueAiGuestSession(
  reply: FastifyReply,
  secret: string,
  existingId?: string | null,
): string {
  const id = existingId && existingId.length >= 8 ? existingId : randomUUID();
  const token = signGuestToken(id, secret);
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  reply.header(
    "Set-Cookie",
    `${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${TTL_SEC}${secure}`,
  );
  return id;
}

function signGuestToken(sessionId: string, secret: string): string {
  const exp = Math.floor(Date.now() / 1000) + TTL_SEC;
  const body = Buffer.from(
    JSON.stringify({ sid: sessionId, exp }),
    "utf8",
  ).toString("base64url");
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verifyGuestToken(
  token: string,
  secret: string,
  previous?: string | null,
): string | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const keys = [secret];
  if (previous && previous.length >= 32) keys.push(previous);
  let matched = false;
  for (const key of keys) {
    const expected = createHmac("sha256", key).update(body).digest("base64url");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length === b.length && timingSafeEqual(a, b)) {
      matched = true;
      break;
    }
  }
  if (!matched) return null;
  try {
    const parsed = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as { sid?: string; exp?: number };
    if (!parsed.sid || !parsed.exp) return null;
    if (Date.now() / 1000 > parsed.exp) return null;
    return parsed.sid;
  } catch {
    return null;
  }
}
