/**
 * Origin allowlist check for cookie-authenticated mutations (CSRF).
 */
import type { FastifyReply, FastifyRequest } from "fastify";
import type { AppConfig } from "./config.js";
import { problem } from "./errors.js";

export function assertTrustedOrigin(
  req: FastifyRequest,
  reply: FastifyReply,
  cfg: AppConfig,
): boolean {
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
    return true;
  }
  const origin = req.headers.origin;
  if (!origin) {
    // Same-site navigations may omit Origin; require for browser credentialed POSTs.
    return true;
  }
  if (!cfg.corsOrigins.includes(origin)) {
    void reply
      .status(403)
      .send(problem(403, "FORBIDDEN", "Origin is not allowed"));
    return false;
  }
  return true;
}
