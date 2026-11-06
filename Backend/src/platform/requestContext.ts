/**
 * Request id + HTTP metrics + optional traceparent spans.
 */
import { randomUUID } from "node:crypto";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { observeHttp } from "./metrics.js";
import {
  formatTraceparent,
  startServerSpan,
  type SpanHandle,
} from "./tracing.js";

declare module "fastify" {
  interface FastifyRequest {
    requestId: string;
  }
}

type Timed = FastifyRequest & {
  _startedAt?: number;
  _span?: SpanHandle;
};

export function registerRequestContext(app: FastifyInstance): void {
  app.addHook("onRequest", async (req: FastifyRequest, reply: FastifyReply) => {
    const incoming =
      (typeof req.headers["x-request-id"] === "string" &&
        req.headers["x-request-id"].trim()) ||
      (typeof req.headers["x-correlation-id"] === "string" &&
        req.headers["x-correlation-id"].trim()) ||
      "";
    req.requestId = incoming || randomUUID();
    reply.header("x-request-id", req.requestId);

    const tp =
      typeof req.headers.traceparent === "string"
        ? req.headers.traceparent
        : undefined;
    const span = startServerSpan(`${req.method} ${req.url.split("?")[0]}`, tp);
    (req as Timed)._span = span;
    (req as Timed)._startedAt = performance.now();
    reply.header("traceparent", formatTraceparent(span.traceId, span.spanId));
  });

  app.addHook("onResponse", async (req, reply) => {
    const timed = req as Timed;
    timed._span?.end(reply.statusCode);
    const started = timed._startedAt ?? performance.now();
    const route =
      (req.routeOptions?.url as string | undefined) ??
      req.url.split("?")[0] ??
      "unknown";
    observeHttp(
      req.method,
      route,
      reply.statusCode,
      performance.now() - started,
    );
  });
}
