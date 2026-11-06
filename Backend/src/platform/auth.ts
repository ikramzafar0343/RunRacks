/**
 * Extract verified session from cookie — never trust body clientId.
 */
import type { FastifyRequest } from "fastify";
import type { AppConfig } from "./config.js";
import { verifySession, type SessionPayload } from "./session.js";

const COOKIE = "rr_session";

export function readSession(
  req: FastifyRequest,
  cfg: AppConfig,
): SessionPayload | null {
  const raw = req.headers.cookie;
  if (!raw) return null;
  const match = raw
    .split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith(`${COOKIE}=`));
  if (!match) return null;
  const token = match.slice(COOKIE.length + 1);
  return verifySession(
    decodeURIComponent(token),
    cfg.sessionHmacSecret,
    cfg.sessionHmacSecretPrevious,
  );
}

export function sessionCookie(token: string, secure: boolean): string {
  const parts = [
    `${COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${60 * 60 * 24 * 7}`,
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export { COOKIE as SESSION_COOKIE_NAME };
