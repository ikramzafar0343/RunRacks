import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { AppContext } from "../../app/context.js";
import { sessionCookie } from "../../platform/auth.js";
import { notConfigured, problem } from "../../platform/errors.js";
import { signSession } from "../../platform/session.js";

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(200),
});

export async function registerIdentityRoutes(
  app: FastifyInstance,
  ctx: AppContext,
): Promise<void> {
  app.post("/v1/auth/login", async (req, reply) => {
    if (!ctx.whmcs.configured) {
      return reply
        .status(503)
        .send(notConfigured("WHMCS is not configured for authentication"));
    }
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply
        .status(400)
        .send(problem(400, "VALIDATION_ERROR", "Invalid login payload"));
    }

    // WHMCS ValidateLogin (or equivalent) — never invent a session without upstream OK.
    const result = await ctx.whmcs.call("ValidateLogin", {
      email: parsed.data.email,
      password2: parsed.data.password,
    });
    if (!result.ok) {
      const status = result.reason === "not_configured" ? 503 : 401;
      const code =
        result.reason === "not_configured" ? "NOT_CONFIGURED" : "UNAUTHORIZED";
      return reply
        .status(status)
        .send(problem(status, code, result.detail));
    }

    const data = result.data as { userid?: number | string };
    const clientId = Number(data.userid);
    if (!Number.isFinite(clientId) || clientId <= 0) {
      return reply
        .status(502)
        .send(
          problem(
            502,
            "UPSTREAM_UNAVAILABLE",
            "WHMCS login response missing userid",
          ),
        );
    }

    if (ctx.db) {
      await ctx.db.query(
        `INSERT INTO customers_cache (whmcs_client_id, email, synced_at)
         VALUES ($1, $2, now())
         ON CONFLICT (whmcs_client_id) DO UPDATE
           SET email = EXCLUDED.email, synced_at = now()`,
        [clientId, parsed.data.email],
      );
    }

    const token = signSession(
      {
        whmcsClientId: clientId,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      },
      ctx.config.sessionHmacSecret,
    );
    reply.header(
      "Set-Cookie",
      sessionCookie(token, ctx.config.nodeEnv === "production"),
    );
    return {
      ok: true,
      data: { whmcsClientId: clientId },
    };
  });

  app.post("/v1/auth/logout", async (_req, reply) => {
    reply.header(
      "Set-Cookie",
      "rr_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
    );
    return { ok: true, data: { status: "logged_out" as const } };
  });
}
