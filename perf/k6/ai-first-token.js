/**
 * AI first-token timing via SSE. Requires AI ready on BASE_URL.
 */
import http from "k6/http";
import { check } from "k6";
import { Trend } from "k6/metrics";

const base = __ENV.BASE_URL || "http://127.0.0.1:4000";
const firstToken = new Trend("ai_first_token_ms");

export const options = {
  vus: 1,
  iterations: 5,
  thresholds: {
    ai_first_token_ms: ["p(95)<5000"],
  },
};

export default function () {
  const create = http.post(
    `${base}/v1/ai/conversations`,
    JSON.stringify({ locale: "en", topic: "vps" }),
    { headers: { "Content-Type": "application/json" } },
  );
  check(create, { "create 201": (r) => r.status === 201 });
  if (create.status !== 201) return;
  const id = create.json("data.id");
  const cookie = create.headers["Set-Cookie"] || "";
  const started = Date.now();
  const msg = http.post(
    `${base}/v1/ai/conversations/${id}/messages`,
    JSON.stringify({
      clientRequestId: `k6-${__ITER}-${Date.now()}`,
      message: "what is linux vps",
      locale: "en",
    }),
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        Cookie: cookie.split(";")[0],
      },
      timeout: "45s",
    },
  );
  const idx = msg.body.indexOf("response.delta");
  if (idx >= 0) firstToken.add(Date.now() - started);
  check(msg, { "stream ok": (r) => r.status === 200 });
}

export function handleSummary(data) {
  const body = {
    ranAt: new Date().toISOString(),
    scenario: "ai-first-token",
    baseUrl: base,
    firstTokenP95Ms: data.metrics.ai_first_token_ms?.values?.["p(95)"] ?? null,
  };
  return {
    "ops/evidence/perf-ai-first-token.json": JSON.stringify(body, null, 2),
    stdout: `ai-first-token p95=${body.firstTokenP95Ms}\n`,
  };
}
