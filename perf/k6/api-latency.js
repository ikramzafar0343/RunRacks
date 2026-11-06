/**
 * API latency evidence. Numbers only from a real k6 run.
 */
import http from "k6/http";
import { check, sleep } from "k6";
import { Trend } from "k6/metrics";

const base = __ENV.BASE_URL || "http://127.0.0.1:4000";
const ttfb = new Trend("ttfb_ms");

export const options = {
  vus: 5,
  duration: "30s",
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<1000", "p(99)<2000"],
  },
};

export default function () {
  const res = http.get(`${base}/health`);
  ttfb.add(res.timings.waiting);
  check(res, { "health 200": (r) => r.status === 200 });
  sleep(0.5);
}

export function handleSummary(data) {
  const p99 = data.metrics.http_req_duration?.values?.["p(99)"] ?? null;
  const p95 = data.metrics.http_req_duration?.values?.["p(95)"] ?? null;
  const body = {
    ranAt: new Date().toISOString(),
    scenario: "api-latency",
    baseUrl: base,
    p95Ms: p95,
    p99Ms: p99,
    failedRate: data.metrics.http_req_failed?.values?.rate ?? null,
  };
  return {
    "ops/evidence/perf-last-run.json": JSON.stringify(body, null, 2),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}

function textSummary(data) {
  return `api-latency p95=${data.metrics.http_req_duration?.values?.["p(95)"]} p99=${data.metrics.http_req_duration?.values?.["p(99)"]}\n`;
}
