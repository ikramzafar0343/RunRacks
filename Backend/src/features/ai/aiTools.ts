/**
 * Allowlisted AI tools — typed freshness, no invented amounts.
 */
import type { Db } from "../../platform/db.js";
import { getPublishedCatalog } from "./catalog/publishedCatalog.js";

export type ToolResult = {
  name: string;
  ok: boolean;
  payload: Record<string, unknown>;
};

function getPublishedPlans(args: Record<string, unknown>): ToolResult {
  const limitRaw = typeof args.limit === "number" ? args.limit : 20;
  const limit = Math.min(20, Math.max(1, Math.floor(limitRaw)));
  const family =
    typeof args.family === "string" && args.family.trim()
      ? args.family.trim()
      : undefined;
  return {
    name: "get_public_plans",
    ok: true,
    payload: {
      source: "published_catalog",
      freshness: "demo",
      items: getPublishedCatalog(family, limit),
      note: "published_catalog",
    },
  };
}

export async function runAiTool(
  db: Db | null,
  name: string,
  argsJson: string,
): Promise<ToolResult> {
  let args: Record<string, unknown> = {};
  try {
    args = JSON.parse(argsJson) as Record<string, unknown>;
  } catch {
    return { name, ok: false, payload: { error: "Invalid tool arguments JSON" } };
  }

  if (name === "get_public_plans") {
    if (!db) return getPublishedPlans(args);
    return getPublicPlans(db, args);
  }
  if (name === "get_content_section") {
    if (!db) {
      return {
        name: "get_content_section",
        ok: true,
        payload: { found: false, id: args.id ?? "" },
      };
    }
    return getContentSection(db, args);
  }
  return {
    name,
    ok: false,
    payload: { error: `Tool ${name} is not allowlisted` },
  };
}

async function getPublicPlans(
  db: Db,
  args: Record<string, unknown>,
): Promise<ToolResult> {
  const limitRaw = typeof args.limit === "number" ? args.limit : 10;
  const limit = Math.min(20, Math.max(1, Math.floor(limitRaw)));
  const family =
    typeof args.family === "string" && args.family.trim()
      ? args.family.trim()
      : undefined;

  try {
    const res = family
      ? await db.query<{
          name: string;
          family: string;
          description: string;
          prices: unknown;
          synced_at: Date | null;
        }>(
          `SELECT p.name, p.family, p.description, p.synced_at,
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
      : await db.query<{
          name: string;
          family: string;
          description: string;
          prices: unknown;
          synced_at: Date | null;
        }>(
          `SELECT p.name, p.family, p.description, p.synced_at,
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

    if (res.rows.length === 0) return getPublishedPlans(args);

    const synced = res.rows[0]?.synced_at;
    const ageMs = synced ? Date.now() - synced.getTime() : null;
    const freshness =
      ageMs != null && ageMs > 7 * 24 * 3600 * 1000 ? "stale" : "fresh";

    return {
      name: "get_public_plans",
      ok: true,
      payload: {
        source: freshness === "stale" ? "stale" : "whmcs_cache",
        freshness,
        syncedAt: synced?.toISOString() ?? null,
        items: res.rows.map((r) => ({
          name: r.name,
          family: r.family,
          description: r.description,
          prices: normalizePrices(r.prices),
        })),
      },
    };
  } catch {
    return getPublishedPlans(args);
  }
}

function normalizePrices(raw: unknown): unknown {
  if (!Array.isArray(raw)) return [];
  return raw.map((p) => {
    const row = p as { amountMinor?: unknown; currency?: string; cycle?: string };
    const amount =
      typeof row.amountMinor === "number" && Number.isFinite(row.amountMinor)
        ? row.amountMinor
        : null;
    // Never coerce missing to 0 / free
    return {
      currency: row.currency,
      cycle: row.cycle,
      amountMinor: amount,
    };
  });
}

async function getContentSection(
  db: Db,
  args: Record<string, unknown>,
): Promise<ToolResult> {
  const id = typeof args.id === "string" ? args.id.trim() : "";
  if (!id) {
    return { name: "get_content_section", ok: false, payload: { error: "id required" } };
  }
  try {
    const res = await db.query<{ id: string; title: string; body: unknown }>(
      "SELECT id, title, body FROM content_sections WHERE id = $1",
      [id],
    );
    const row = res.rows[0];
    if (!row) {
      return {
        name: "get_content_section",
        ok: true,
        payload: { found: false, id },
      };
    }
    return {
      name: "get_content_section",
      ok: true,
      payload: {
        found: true,
        sourceId: row.id,
        title: row.title,
        body: row.body,
      },
    };
  } catch {
    return {
      name: "get_content_section",
      ok: true,
      payload: { found: false, id },
    };
  }
}
