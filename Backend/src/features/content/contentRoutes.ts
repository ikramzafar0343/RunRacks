import type { FastifyInstance } from "fastify";
import type { AppContext } from "../../app/context.js";
import { notConfigured, problem } from "../../platform/errors.js";

export async function registerContentRoutes(
  app: FastifyInstance,
  ctx: AppContext,
): Promise<void> {
  app.get("/v1/content/:id", async (req, reply) => {
    if (!ctx.db) {
      return reply.status(503).send(notConfigured("Database is not configured"));
    }
    const { id } = req.params as { id: string };
    const res = await ctx.db.query<{
      id: string;
      title: string;
      body: unknown;
      updated_at: Date;
    }>("SELECT id, title, body, updated_at FROM content_sections WHERE id = $1", [
      id,
    ]);
    const row = res.rows[0];
    if (!row) {
      return reply
        .status(404)
        .send(problem(404, "NOT_FOUND", `Content section ${id} not found`));
    }
    return {
      ok: true,
      data: {
        id: row.id,
        title: row.title,
        body: row.body,
        updatedAt: row.updated_at.toISOString(),
      },
    };
  });
}
