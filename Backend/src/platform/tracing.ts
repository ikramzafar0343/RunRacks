/**
 * Lightweight W3C traceparent + optional OTLP/HTTP export.
 * Unset OTEL_EXPORTER_OTLP_ENDPOINT → no export (not fake spans).
 */
import { randomBytes } from "node:crypto";

export type SpanHandle = {
  traceId: string;
  spanId: string;
  end: (statusCode?: number) => void;
};

type Active = {
  traceId: string;
  spanId: string;
  name: string;
  startNs: bigint;
  parentSpanId?: string;
};

const pending: Active[] = [];
let otlpEndpoint: string | undefined;

export function configureTracing(endpoint: string | undefined): void {
  otlpEndpoint = endpoint?.trim() || undefined;
}

export function tracingEnabled(): boolean {
  return Boolean(otlpEndpoint);
}

function hex(bytes: number): string {
  return randomBytes(bytes).toString("hex");
}

function parseTraceparent(header: string | undefined): {
  traceId: string;
  parentSpanId: string;
} | null {
  if (!header) return null;
  const parts = header.trim().split("-");
  if (parts.length < 4) return null;
  const [, traceId, parentSpanId] = parts;
  if (!traceId || traceId.length !== 32) return null;
  if (!parentSpanId || parentSpanId.length !== 16) return null;
  return { traceId, parentSpanId };
}

export function startServerSpan(
  name: string,
  traceparentHeader: string | undefined,
): SpanHandle {
  const parent = parseTraceparent(traceparentHeader);
  const traceId = parent?.traceId ?? hex(16);
  const spanId = hex(8);
  const active: Active = {
    traceId,
    spanId,
    name,
    startNs: process.hrtime.bigint(),
    ...(parent?.parentSpanId ? { parentSpanId: parent.parentSpanId } : {}),
  };
  pending.push(active);
  return {
    traceId,
    spanId,
    end(statusCode) {
      const idx = pending.indexOf(active);
      if (idx >= 0) pending.splice(idx, 1);
      const endNs = process.hrtime.bigint();
      void exportSpan(active, endNs, statusCode);
    },
  };
}

export function formatTraceparent(traceId: string, spanId: string): string {
  return `00-${traceId}-${spanId}-01`;
}

async function exportSpan(
  span: Active,
  endNs: bigint,
  statusCode?: number,
): Promise<void> {
  if (!otlpEndpoint) return;
  const startTimeUnixNano = span.startNs.toString();
  const endTimeUnixNano = endNs.toString();
  const body = {
    resourceSpans: [
      {
        resource: {
          attributes: [
            { key: "service.name", value: { stringValue: "runracks-backend" } },
          ],
        },
        scopeSpans: [
          {
            spans: [
              {
                traceId: span.traceId,
                spanId: span.spanId,
                ...(span.parentSpanId
                  ? { parentSpanId: span.parentSpanId }
                  : {}),
                name: span.name,
                kind: 2,
                startTimeUnixNano,
                endTimeUnixNano,
                attributes: statusCode
                  ? [
                      {
                        key: "http.status_code",
                        value: { intValue: statusCode },
                      },
                    ]
                  : [],
                status: {
                  code: statusCode && statusCode >= 500 ? 2 : 1,
                },
              },
            ],
          },
        ],
      },
    ],
  };
  try {
    await fetch(
      `${otlpEndpoint.replace(/\/$/, "")}/v1/traces`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );
  } catch {
    /* export best-effort — never fail the request */
  }
}
