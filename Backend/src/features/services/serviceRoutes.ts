import type { FastifyInstance } from "fastify";
import type { AppContext } from "../../app/context.js";
import { readSession } from "../../platform/auth.js";
import { notConfigured, problem } from "../../platform/errors.js";

export async function registerServiceRoutes(
  app: FastifyInstance,
  ctx: AppContext,
): Promise<void> {
  app.get("/v1/me/services", async (req, reply) => {
    const session = readSession(req, ctx.config);
    if (!session) {
      return reply
        .status(401)
        .send(problem(401, "UNAUTHORIZED", "Authentication required"));
    }
    if (!ctx.db) {
      return reply.status(503).send(notConfigured("Database is not configured"));
    }

    // Tenant scope: only this client's services (IDOR-safe).
    const res = await ctx.db.query<{
      whmcs_service_id: number;
      whmcs_product_id: number | null;
      domain: string;
      status: string;
      synced_at: Date;
    }>(
      `SELECT whmcs_service_id, whmcs_product_id, domain, status, synced_at
       FROM services_cache
       WHERE whmcs_client_id = $1
       ORDER BY whmcs_service_id
       LIMIT 100`,
      [session.whmcsClientId],
    );

    return {
      ok: true,
      data: {
        items: res.rows.map((r) => ({
          whmcsServiceId: r.whmcs_service_id,
          whmcsProductId: r.whmcs_product_id,
          domain: r.domain,
          status: r.status,
          syncedAt: r.synced_at.toISOString(),
        })),
        whmcsConfigured: ctx.whmcs.configured,
      },
    };
  });

  app.get("/v1/me/services/:serviceId", async (req, reply) => {
    const session = readSession(req, ctx.config);
    if (!session) {
      return reply
        .status(401)
        .send(problem(401, "UNAUTHORIZED", "Authentication required"));
    }
    if (!ctx.db) {
      return reply.status(503).send(notConfigured("Database is not configured"));
    }
    const serviceId = Number.parseInt(
      (req.params as { serviceId: string }).serviceId,
      10,
    );
    if (!Number.isFinite(serviceId)) {
      return reply
        .status(400)
        .send(problem(400, "VALIDATION_ERROR", "Invalid service id"));
    }
    const res = await ctx.db.query(
      `SELECT whmcs_service_id, domain, status, synced_at
       FROM services_cache
       WHERE whmcs_service_id = $1 AND whmcs_client_id = $2`,
      [serviceId, session.whmcsClientId],
    );
    const row = res.rows[0];
    if (!row) {
      return reply
        .status(404)
        .send(problem(404, "NOT_FOUND", "Service not found for this account"));
    }
    return { ok: true, data: row };
  });
}
