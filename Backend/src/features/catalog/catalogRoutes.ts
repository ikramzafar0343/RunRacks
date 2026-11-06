import type { FastifyInstance } from "fastify";
import type { AppContext } from "../../app/context.js";
import { notConfigured, problem } from "../../platform/errors.js";

export async function registerCatalogRoutes(
  app: FastifyInstance,
  ctx: AppContext,
): Promise<void> {
  app.get("/v1/regions", async (_req, reply) => {
    if (!ctx.db) {
      return reply.status(503).send(notConfigured("Database is not configured"));
    }
    const res = await ctx.db.query<{
      id: string;
      label: string;
      country_code: string;
      group_id: string;
    }>(
      `SELECT id, label, country_code, group_id
       FROM region_meta
       ORDER BY group_id, label
       LIMIT 100`,
    );
    return {
      ok: true,
      data: {
        items: res.rows.map((r) => ({
          id: r.id,
          label: r.label,
          countryCode: r.country_code,
          groupId: r.group_id,
        })),
      },
    };
  });

  app.get("/v1/plans", async (req, reply) => {
    if (!ctx.db) {
      return reply.status(503).send(notConfigured("Database is not configured"));
    }
    const q = req.query as { family?: string; limit?: string };
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(q.limit ?? "20", 10) || 20),
    );
    const family = q.family?.trim();
    const res = family
      ? await ctx.db.query(
          `SELECT p.whmcs_product_id, p.family, p.name, p.description,
                  COALESCE(
                    json_agg(json_build_object(
                      'currency', pr.currency,
                      'cycle', pr.cycle,
                      'amountMinor', pr.amount_minor
                    ) ORDER BY pr.currency, pr.cycle)
                    FILTER (WHERE pr.id IS NOT NULL),
                    '[]'::json
                  ) AS prices
           FROM catalog_products p
           LEFT JOIN catalog_prices pr ON pr.product_id = p.id
           WHERE p.family = $1
           GROUP BY p.id
           ORDER BY p.name
           LIMIT $2`,
          [family, limit],
        )
      : await ctx.db.query(
          `SELECT p.whmcs_product_id, p.family, p.name, p.description,
                  COALESCE(
                    json_agg(json_build_object(
                      'currency', pr.currency,
                      'cycle', pr.cycle,
                      'amountMinor', pr.amount_minor
                    ) ORDER BY pr.currency, pr.cycle)
                    FILTER (WHERE pr.id IS NOT NULL),
                    '[]'::json
                  ) AS prices
           FROM catalog_products p
           LEFT JOIN catalog_prices pr ON pr.product_id = p.id
           GROUP BY p.id
           ORDER BY p.family, p.name
           LIMIT $1`,
          [limit],
        );

    if (!ctx.whmcs.configured && res.rows.length === 0) {
      return reply
        .status(503)
        .send(
          notConfigured(
            "WHMCS is not configured and catalog cache is empty — demo Frontend fallback remains until sync",
          ),
        );
    }

    return {
      ok: true,
      data: {
        source: "cache" as const,
        whmcsConfigured: ctx.whmcs.configured,
        items: res.rows,
      },
    };
  });

  app.post("/v1/catalog/sync", async (_req, reply) => {
    if (!ctx.whmcs.configured) {
      return reply
        .status(503)
        .send(notConfigured("WHMCS API credentials are not configured"));
    }
    if (!ctx.db) {
      return reply.status(503).send(notConfigured("Database is not configured"));
    }
    const result = await ctx.whmcs.call("GetProducts");
    if (!result.ok) {
      return reply
        .status(503)
        .send(problem(503, "UPSTREAM_UNAVAILABLE", result.detail));
    }
    // Do not invent catalog_products rows. Mapping is incomplete until live fixtures land.
    return {
      ok: true,
      data: {
        status: "accepted_not_persisted" as const,
        persisted: false as const,
        detail:
          "WHMCS GetProducts succeeded, but product→catalog_* mapping is not implemented — catalog cache was not updated",
        upstreamKeys: Object.keys(result.data as object).slice(0, 20),
      },
    };
  });
}
