import type { FastifyInstance } from "fastify";
import type { AppContext } from "../../app/context.js";
import { readSession } from "../../platform/auth.js";
import { notConfigured, problem } from "../../platform/errors.js";

export async function registerCustomerRoutes(
  app: FastifyInstance,
  ctx: AppContext,
): Promise<void> {
  app.get("/v1/me", async (req, reply) => {
    const session = readSession(req, ctx.config);
    if (!session) {
      return reply
        .status(401)
        .send(problem(401, "UNAUTHORIZED", "Authentication required"));
    }
    if (!ctx.db) {
      return reply.status(503).send(notConfigured("Database is not configured"));
    }
    const res = await ctx.db.query<{
      whmcs_client_id: number;
      email: string;
      first_name: string;
      last_name: string;
      status: string;
    }>(
      `SELECT whmcs_client_id, email, first_name, last_name, status
       FROM customers_cache
       WHERE whmcs_client_id = $1`,
      [session.whmcsClientId],
    );
    const row = res.rows[0];
    if (!row) {
      return {
        ok: true,
        data: {
          whmcsClientId: session.whmcsClientId,
          email: null,
          status: "unknown",
          source: "session" as const,
        },
      };
    }
    return {
      ok: true,
      data: {
        whmcsClientId: row.whmcs_client_id,
        email: row.email,
        firstName: row.first_name,
        lastName: row.last_name,
        status: row.status,
        source: "cache" as const,
      },
    };
  });
}
