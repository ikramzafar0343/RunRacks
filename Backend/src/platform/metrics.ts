/**
 * Process-local Prometheus text metrics. No invented upstream success.
 */
import { monitorEventLoopDelay } from "node:perf_hooks";
import { listBreakers } from "./circuitBreaker.js";

type Hist = { count: number; sum: number; buckets: Map<number, number> };

const BOUNDARIES = [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000];

const httpDuration: Hist = {
  count: 0,
  sum: 0,
  buckets: new Map(BOUNDARIES.map((b) => [b, 0])),
};
const httpRequests = new Map<string, number>();
const httpErrors = new Map<string, number>();
let poolWaiting = 0;
let poolTotal = 0;

const elDelay = monitorEventLoopDelay({ resolution: 20 });
elDelay.enable();

function inc(map: Map<string, number>, key: string, n = 1): void {
  map.set(key, (map.get(key) ?? 0) + n);
}

export function observeHttp(
  method: string,
  route: string,
  statusCode: number,
  durationMs: number,
): void {
  const key = `${method}|${route}|${statusCode}`;
  inc(httpRequests, key);
  if (statusCode >= 500) inc(httpErrors, key);
  httpDuration.count += 1;
  httpDuration.sum += durationMs;
  for (const b of BOUNDARIES) {
    if (durationMs <= b) {
      httpDuration.buckets.set(b, (httpDuration.buckets.get(b) ?? 0) + 1);
    }
  }
}

export function setPoolStats(waiting: number, total: number): void {
  poolWaiting = waiting;
  poolTotal = total;
}

function esc(label: string): string {
  return label.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export function renderPrometheus(): string {
  const lines: string[] = [];
  lines.push("# HELP http_requests_total HTTP requests");
  lines.push("# TYPE http_requests_total counter");
  for (const [key, n] of httpRequests) {
    const [method, route, status] = key.split("|");
    lines.push(
      `http_requests_total{method="${esc(method ?? "")}",route="${esc(route ?? "")}",status="${esc(status ?? "")}"} ${n}`,
    );
  }
  lines.push("# HELP http_request_duration_ms HTTP latency histogram");
  lines.push("# TYPE http_request_duration_ms histogram");
  for (const b of BOUNDARIES) {
    lines.push(
      `http_request_duration_ms_bucket{le="${b}"} ${httpDuration.buckets.get(b) ?? 0}`,
    );
  }
  lines.push(
    `http_request_duration_ms_bucket{le="+Inf"} ${httpDuration.count}`,
  );
  lines.push(`http_request_duration_ms_sum ${httpDuration.sum}`);
  lines.push(`http_request_duration_ms_count ${httpDuration.count}`);

  lines.push("# HELP process_event_loop_delay_seconds Event loop delay");
  lines.push("# TYPE process_event_loop_delay_seconds gauge");
  lines.push(
    `process_event_loop_delay_seconds{quantile="0.99"} ${elDelay.percentile(99) / 1e9}`,
  );

  lines.push("# HELP db_pool_waiting Waiting clients");
  lines.push("# TYPE db_pool_waiting gauge");
  lines.push(`db_pool_waiting ${poolWaiting}`);
  lines.push("# HELP db_pool_total Pool size");
  lines.push("# TYPE db_pool_total gauge");
  lines.push(`db_pool_total ${poolTotal}`);

  lines.push("# HELP circuit_breaker_state 0=closed 1=half_open 2=open");
  lines.push("# TYPE circuit_breaker_state gauge");
  for (const snap of listBreakers()) {
    const v =
      snap.state === "closed" ? 0 : snap.state === "half_open" ? 1 : 2;
    lines.push(
      `circuit_breaker_state{name="${esc(snap.name)}"} ${v}`,
    );
    lines.push(
      `circuit_breaker_failures{name="${esc(snap.name)}"} ${snap.failures}`,
    );
  }
  lines.push("");
  return lines.join("\n");
}
