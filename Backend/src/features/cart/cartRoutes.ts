import { createHash, randomUUID } from "node:crypto";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { AppContext } from "../../app/context.js";
import { readSession } from "../../platform/auth.js";
import { notConfigured, problem } from "../../platform/errors.js";

const lineSchema = z.object({
  whmcsProductId: z.number().int().positive(),
  qty: z.number().int().min(1).max(20),
});

const createSchema = z.object({
  idempotencyKey: z.string().trim().min(8).max(128),
  currency: z.string().trim().length(3),
  lines: z.array(lineSchema).min(1).max(20),
});

export async function registerCartRoutes(
  app: FastifyInstance,
  ctx: AppContext,
): Promise<void> {
  app.post("/v1/cart/intents", async (req, reply) => {
    if (!ctx.db) {
      return reply.status(503).send(notConfigured("Database is not configured"));
    }
    const session = readSession(req, ctx.config);
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply
        .status(400)
        .send(problem(400, "VALIDATION_ERROR", "Invalid cart intent"));
    }

    // Price only from WHMCS-backed catalog_prices — never trust browser totals.
    let totalMinor = 0;
    const priced: Array<{
      whmcsProductId: number;
      qty: number;
      unitMinor: number;
    }> = [];
    for (const line of parsed.data.lines) {
      const price = await ctx.db.query<{ amount_minor: number }>(
        `SELECT pr.amount_minor
         FROM catalog_products p
         JOIN catalog_prices pr ON pr.product_id = p.id
         WHERE p.whmcs_product_id = $1
           AND pr.currency = $2
         ORDER BY pr.cycle
         LIMIT 1`,
        [line.whmcsProductId, parsed.data.currency.toUpperCase()],
      );
      const unit = price.rows[0]?.amount_minor;
      if (unit === undefined) {
        if (!ctx.whmcs.configured) {
          return reply
            .status(503)
            .send(
              notConfigured(
                "WHMCS catalog cache has no price for this product — configure WHMCS and sync",
              ),
            );
        }
        return reply
          .status(409)
          .send(
            problem(
              409,
              "CONFLICT",
              `No cached WHMCS price for product ${line.whmcsProductId}`,
            ),
          );
      }
      totalMinor += unit * line.qty;
      priced.push({
        whmcsProductId: line.whmcsProductId,
        qty: line.qty,
        unitMinor: unit,
      });
    }

    const fingerprint = createHash("sha256")
      .update(JSON.stringify({ currency: parsed.data.currency, lines: priced }))
      .digest("hex");

    const existing = await ctx.db.query(
      `SELECT id, fingerprint, total_minor, currency, status, lines
       FROM cart_intents WHERE idempotency_key = $1`,
      [parsed.data.idempotencyKey],
    );
    const prior = existing.rows[0] as
      | {
          id: string;
          fingerprint: string;
          total_minor: number;
          currency: string;
          status: string;
          lines: unknown;
        }
      | undefined;
    if (prior) {
      if (prior.fingerprint !== fingerprint) {
        return reply
          .status(409)
          .send(
            problem(
              409,
              "IDEMPOTENCY_CONFLICT",
              "Cart idempotency key reused with different lines",
            ),
          );
      }
      return { ok: true, data: prior };
    }

    const id = randomUUID();
    await ctx.db.query(
      `INSERT INTO cart_intents
         (id, whmcs_client_id, idempotency_key, fingerprint, currency, lines, total_minor, status)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, 'open')`,
      [
        id,
        session?.whmcsClientId ?? null,
        parsed.data.idempotencyKey,
        fingerprint,
        parsed.data.currency.toUpperCase(),
        JSON.stringify(priced),
        totalMinor,
      ],
    );
    return reply.status(201).send({
      ok: true,
      data: {
        id,
        totalMinor,
        currency: parsed.data.currency.toUpperCase(),
        lines: priced,
        status: "open",
      },
    });
  });
}
