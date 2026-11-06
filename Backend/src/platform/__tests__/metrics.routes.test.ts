import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildApp } from "../../app/buildApp.js";
import type { AppContext } from "../../app/context.js";
import type { AppConfig } from "../config.js";
import { createWhmcsClient } from "../../features/whmcs/whmcsClient.js";
import { getBreaker } from "../circuitBreaker.js";

function cfg(): AppConfig {
  return {
    host: "127.0.0.1",
    port: 0,
    nodeEnv: "test",
    corsOrigins: ["http://localhost:3000"],
    trustProxy: false,
    sessionHmacSecret: "dev-only-session-hmac-secret-min-32-chars",
    sessionHmacSecretPrevious: undefined,
    databaseUrl: undefined,
    dbPoolMax: 2,
    dbStatementTimeoutMs: 2000,
    dbLockTimeoutMs: 1000,
    whmcsApiUrl: undefined,
    whmcsApiIdentifier: undefined,
    whmcsApiSecret: undefined,
    whmcsTimeoutMs: 2000,
    aiProvider: "owned",
    aiApiKey: undefined,
    aiBaseUrl: "",
    aiModel: "owned-agent",
    aiTimeoutMs: 5000,
    aiMaxInputChars: 4000,
    otelExporterOtlpEndpoint: undefined,
    alertWebhookUrl: undefined,
  };
}

describe("metrics and request context", () => {
  it("exposes Prometheus text and x-request-id", async () => {
    getBreaker("whmcs");
    const context: AppContext = {
      config: cfg(),
      db: null,
      whmcs: createWhmcsClient(cfg()),
    };
    const app = await buildApp(context);
    const health = await app.inject({ method: "GET", url: "/health" });
    assert.equal(health.statusCode, 200);
    assert.ok(health.headers["x-request-id"]);
    const metrics = await app.inject({ method: "GET", url: "/metrics" });
    assert.equal(metrics.statusCode, 200);
    assert.match(metrics.body, /http_requests_total/);
    assert.match(metrics.body, /circuit_breaker_state/);
    await app.close();
  });
});
