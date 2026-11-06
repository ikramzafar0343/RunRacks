/**
 * Local /health latency sample when k6 is unavailable.
 * Writes ops/evidence/perf-last-run.json from measured timings only.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const base = process.env.BASE_URL ?? "http://127.0.0.1:4000";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const outDir = path.join(root, "ops/evidence");
fs.mkdirSync(outDir, { recursive: true });

const samples = [];
for (let i = 0; i < 30; i++) {
  const t0 = performance.now();
  const res = await fetch(`${base}/health`);
  const ms = performance.now() - t0;
  if (!res.ok) {
    console.error(`health failed: ${res.status}`);
    process.exit(1);
  }
  samples.push(ms);
}

samples.sort((a, b) => a - b);
const pct = (p) => samples[Math.min(samples.length - 1, Math.floor((p / 100) * samples.length))];
const body = {
  ranAt: new Date().toISOString(),
  scenario: "api-health-node-sample",
  tool: "scripts/ops/perf-health-sample.mjs",
  baseUrl: base,
  samples: samples.length,
  p95Ms: pct(95),
  p99Ms: pct(99),
  note: "Node sample for local evidence; prefer perf/k6/api-latency.js in CI",
};
fs.writeFileSync(path.join(outDir, "perf-last-run.json"), JSON.stringify(body, null, 2));
console.log(JSON.stringify(body));
