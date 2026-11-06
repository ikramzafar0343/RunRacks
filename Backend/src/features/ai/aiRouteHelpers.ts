/**
 * Shared helpers for AI HTTP routes.
 */
import type { FastifyReply, FastifyRequest } from "fastify";
import type { AppContext } from "../../app/context.js";
import { isAiConfigured } from "../../platform/config.js";
import {
  issueAiGuestSession,
  readAiGuestSession,
} from "./guestSession.js";

export function apiError(
  reply: FastifyReply,
  status: number,
  code: string,
  message: string,
  details?: Record<string, unknown>,
) {
  return reply.status(status).send({
    ok: false,
    error: { code, message, ...(details ? { details } : {}) },
  });
}

export function requireAi(ctx: AppContext, reply: FastifyReply): boolean {
  if (!isAiConfigured(ctx.config)) {
    apiError(
      reply,
      503,
      "NOT_CONFIGURED",
      "RunRacks AI is disabled. Use Contact or Pricing for now.",
      { supportHref: "/contact", pricingHref: "/pricing" },
    );
    return false;
  }
  return true;
}

export function ensureGuest(
  ctx: AppContext,
  req: FastifyRequest,
  reply: FastifyReply,
): string {
  const existing = readAiGuestSession(req, {
    current: ctx.config.sessionHmacSecret,
    previous: ctx.config.sessionHmacSecretPrevious ?? null,
  });
  return issueAiGuestSession(reply, ctx.config.sessionHmacSecret, existing);
}

export function openSse(reply: FastifyReply) {
  const pending = reply.getHeader("set-cookie");
  const setCookies = Array.isArray(pending)
    ? pending.map(String)
    : pending != null
      ? [String(pending)]
      : [];

  reply.hijack();
  const headers: Record<string, string | string[]> = {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  };
  if (setCookies.length === 1) {
    headers["Set-Cookie"] = setCookies[0]!;
  } else if (setCookies.length > 1) {
    headers["Set-Cookie"] = setCookies;
  }
  reply.raw.writeHead(200, headers);
  return {
    write(event: string, data: Record<string, unknown>) {
      reply.raw.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    },
    end() {
      reply.raw.end();
    },
  };
}
