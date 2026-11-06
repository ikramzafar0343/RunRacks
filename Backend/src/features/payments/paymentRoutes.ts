import { createHash, randomUUID } from "node:crypto";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { AppContext } from "../../app/context.js";
import { readSession } from "../../platform/auth.js";
import { notConfigured, problem } from "../../platform/errors.js";

const orderSchema = z.object({
  idempotencyKey: z.string().trim().min(8).max(128),
  cartIntentId: z.string().uuid(),
});

export async function registerPaymentRoutes(
  app: FastifyInstance,
  ctx: AppContext,
): Promise<void> {
  app.post("/v1/orders", async (req, reply) => {
    if (!ctx.whmcs.configured) {
      return reply
        .status(503)
        .send(notConfigured("WHMCS is not configured for orders"));
    }
    if (!ctx.db) {
      return reply.status(503).send(notConfigured("Database is not configured"));
    }
    const session = readSession(req, ctx.config);
    if (!session) {
      return reply
        .status(401)
        .send(problem(401, "UNAUTHORIZED", "Authentication required"));
    }
    const parsed = orderSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply
        .status(400)
        .send(problem(400, "VALIDATION_ERROR", "Invalid order payload"));
    }

    const cart = await ctx.db.query<{
      id: string;
      fingerprint: string;
      total_minor: number;
      currency: string;
      whmcs_client_id: number | null;
      lines: unknown;
    }>(`SELECT * FROM cart_intents WHERE id = $1`, [parsed.data.cartIntentId]);
    const intent = cart.rows[0];
    if (!intent) {
      return reply
        .status(404)
        .send(problem(404, "NOT_FOUND", "Cart intent not found"));
    }
    if (
      intent.whmcs_client_id !== null &&
      intent.whmcs_client_id !== session.whmcsClientId
    ) {
      return reply
        .status(403)
        .send(problem(403, "FORBIDDEN", "Cart intent belongs to another client"));
    }

    const fingerprint = createHash("sha256")
      .update(
        JSON.stringify({
          cartIntentId: intent.id,
          clientId: session.whmcsClientId,
          total: intent.total_minor,
        }),
      )
      .digest("hex");

    const prior = await ctx.db.query(
      `SELECT id, status, whmcs_order_id, fingerprint
       FROM payment_operations WHERE idempotency_key = $1`,
      [parsed.data.idempotencyKey],
    );
    const existing = prior.rows[0] as
      | { id: string; status: string; whmcs_order_id: number | null; fingerprint: string }
      | undefined;
    if (existing) {
      if (existing.fingerprint !== fingerprint) {
        return reply
          .status(409)
          .send(
            problem(
              409,
              "IDEMPOTENCY_CONFLICT",
              "Order idempotency key reused with different intent",
            ),
          );
      }
      return { ok: true, data: existing };
    }

    // Durable pending op first — then WHMCS. Never mark paid without WHMCS confirmation.
    const opId = randomUUID();
    await ctx.db.query(
      `INSERT INTO payment_operations
         (id, whmcs_client_id, idempotency_key, fingerprint, status, amount_minor, currency)
       VALUES ($1, $2, $3, $4, 'pending_whmcs', $5, $6)`,
      [
        opId,
        session.whmcsClientId,
        parsed.data.idempotencyKey,
        fingerprint,
        intent.total_minor,
        intent.currency,
      ],
    );

    const upstream = await ctx.whmcs.call("AddOrder", {
      clientid: session.whmcsClientId,
      paymentmethod: "mailin",
    });
    if (!upstream.ok) {
      await ctx.db.query(
        `UPDATE payment_operations SET status = 'failed', updated_at = now() WHERE id = $1`,
        [opId],
      );
      return reply
        .status(503)
        .send(problem(503, "UPSTREAM_UNAVAILABLE", upstream.detail));
    }

    const orderId = Number((upstream.data as { orderid?: number | string }).orderid);
    await ctx.db.query(
      `UPDATE payment_operations
       SET status = 'submitted', whmcs_order_id = $2, updated_at = now()
       WHERE id = $1`,
      [opId, Number.isFinite(orderId) ? orderId : null],
    );

    return reply.status(202).send({
      ok: true,
      data: {
        id: opId,
        status: "submitted",
        whmcsOrderId: Number.isFinite(orderId) ? orderId : null,
        detail: "Order submitted to WHMCS — confirm invoice/payment via WHMCS",
      },
    });
  });
}
