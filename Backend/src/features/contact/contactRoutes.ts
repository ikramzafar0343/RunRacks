import { createHash } from "node:crypto";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { AppContext } from "../../app/context.js";
import { notConfigured, problem } from "../../platform/errors.js";

const bodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  topic: z.enum(["engineers", "plans", "migration", "abuse", "other"]),
  message: z.string().trim().min(1).max(5000),
  idempotencyKey: z.string().trim().min(8).max(128),
});

export async function registerContactRoutes(
  app: FastifyInstance,
  ctx: AppContext,
): Promise<void> {
  app.post(
    "/v1/contact",
    { config: { rateLimit: { max: 5, timeWindow: "10 minutes" } } },
    async (req, reply) => {
      if (!ctx.db) {
        return reply.status(503).send(notConfigured("Database is not configured"));
      }
      const parsed = bodySchema.safeParse(req.body);
      if (!parsed.success) {
        return reply
          .status(400)
          .send(
            problem(400, "VALIDATION_ERROR", "Invalid contact payload", "Invalid"),
          );
      }
      const input = parsed.data;
      const fingerprint = createHash("sha256")
        .update(
          JSON.stringify({
            name: input.name,
            email: input.email,
            topic: input.topic,
            message: input.message,
          }),
        )
        .digest("hex");

      const existing = await ctx.db.query<{
        id: string;
        fingerprint: string;
        result: unknown;
        status: string;
      }>(
        `SELECT key_digest AS id, fingerprint, result, status
         FROM idempotency_keys
         WHERE scope = 'contact' AND key_digest = $1`,
        [input.idempotencyKey],
      );
      const prior = existing.rows[0];
      if (prior) {
        if (prior.fingerprint !== fingerprint) {
          return reply
            .status(409)
            .send(
              problem(
                409,
                "IDEMPOTENCY_CONFLICT",
                "Idempotency key reused with different payload",
              ),
            );
        }
        return { ok: true, data: prior.result };
      }

      const inserted = await ctx.db.withClient(async (client) => {
        await client.query("BEGIN");
        try {
          const row = await client.query<{ id: string }>(
            `INSERT INTO contact_inquiries
               (idempotency_key, name, email, topic, message)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id::text`,
            [
              input.idempotencyKey,
              input.name,
              input.email,
              input.topic,
              input.message,
            ],
          );
          const id = row.rows[0]?.id;
          const result = { id, status: "accepted" as const };
          await client.query(
            `INSERT INTO idempotency_keys
               (scope, key_digest, fingerprint, status, result)
             VALUES ('contact', $1, $2, 'completed', $3::jsonb)`,
            [input.idempotencyKey, fingerprint, JSON.stringify(result)],
          );
          await client.query("COMMIT");
          return result;
        } catch (err) {
          await client.query("ROLLBACK");
          throw err;
        }
      });

      return reply.status(201).send({ ok: true, data: inserted });
    },
  );
}
