import type { FastifyInstance } from "fastify";
import type { AppContext } from "./context.js";
import {
  isAiConfigured,
  isDatabaseConfigured,
  isWhmcsConfigured,
} from "../platform/config.js";
import { listBreakers } from "../platform/circuitBreaker.js";
import { pingDb } from "../platform/db.js";
import { setPoolStats, renderPrometheus } from "../platform/metrics.js";
import { notConfigured, problem } from "../platform/errors.js";
import { tracingEnabled } from "../platform/tracing.js";

export async function registerHealthRoutes(
  app: FastifyInstance,
  ctx: AppContext,
): Promise<void> {
  app.get("/health", async () => ({
    service: "backend",
    status: "ok",
    timestamp: new Date().toISOString(),
  }));

  app.get("/metrics", async (_req, reply) => {
    if (ctx.db) {
      setPoolStats(ctx.db.pool.waitingCount, ctx.db.pool.totalCount);
    }
    reply.header("Content-Type", "text/plain; version=0.0.4; charset=utf-8");
    return renderPrometheus();
  });

  app.get("/ready", async (_req, reply) => {
    const whmcsConfigured = isWhmcsConfigured(ctx.config);
    const aiConfigured = isAiConfigured(ctx.config);
    const dbConfigured = isDatabaseConfigured(ctx.config);
    const breakers = listBreakers();
    const tracing = tracingEnabled();
    const alertDeliveryConfigured = Boolean(ctx.config.alertWebhookUrl);

    if (!dbConfigured || !ctx.db) {
      return reply.status(503).send({
        ...notConfigured("DATABASE_URL is not configured"),
        aiConfigured,
        whmcsConfigured,
        tracingConfigured: tracing,
        alertDeliveryConfigured,
        circuitBreakers: breakers,
      });
    }
    try {
      const ok = await pingDb(ctx.db);
      if (!ok) {
        return reply.status(503).send({
          ...problem(503, "UPSTREAM_UNAVAILABLE", "Database ping failed"),
          aiConfigured,
          whmcsConfigured,
          tracingConfigured: tracing,
          alertDeliveryConfigured,
          circuitBreakers: breakers,
        });
      }
    } catch {
      return reply.status(503).send({
        ...problem(503, "UPSTREAM_UNAVAILABLE", "Database unreachable"),
        aiConfigured,
        whmcsConfigured,
        tracingConfigured: tracing,
        alertDeliveryConfigured,
        circuitBreakers: breakers,
      });
    }

    return {
      service: "backend",
      status: "ready",
      databaseConfigured: true as const,
      whmcsConfigured,
      aiConfigured,
      tracingConfigured: tracing,
      alertDeliveryConfigured,
      circuitBreakers: breakers,
      timestamp: new Date().toISOString(),
    };
  });
}
