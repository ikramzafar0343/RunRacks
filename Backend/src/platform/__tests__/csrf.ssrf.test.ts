import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildApp } from "../../app/buildApp.js";
import type { AppContext } from "../../app/context.js";
import type { AppConfig } from "../config.js";
import { createWhmcsClient } from "../../features/whmcs/whmcsClient.js";

function cfg(overrides: Partial<AppConfig> = {}): AppConfig {
  return {
    host: "127.0.0.1",
    port: 0,
    nodeEnv: "production",
    corsOrigins: ["http://localhost:3000"],
    trustProxy: false,
    sessionHmacSecret: "dev-only-session-hmac-secret-min-32-chars",
    sessionHmacSecretPrevious: undefined,
    databaseUrl: undefined,
    dbPoolMax: 2,
    dbStatementTimeoutMs: 2000,
    dbLockTimeoutMs: 1000,
    whmcsApiUrl: "http://insecure.example/includes/api.php",
    whmcsApiIdentifier: "id",
    whmcsApiSecret: "secret",
    whmcsTimeoutMs: 2000,
    aiProvider: "owned",
    aiApiKey: undefined,
    aiBaseUrl: "",
    aiModel: "owned-agent",
    aiTimeoutMs: 5000,
    aiMaxInputChars: 4000,
    otelExporterOtlpEndpoint: undefined,
    alertWebhookUrl: undefined,
    ...overrides,
  };
}

describe("CSRF and WHMCS SSRF guards", () => {
  it("rejects disallowed Origin on POST", async () => {
    const context: AppContext = {
      config: cfg({ nodeEnv: "test" }),
      db: null,
      whmcs: createWhmcsClient(cfg({ nodeEnv: "test" })),
    };
    const app = await buildApp(context);
    const res = await app.inject({
      method: "POST",
      url: "/v1/ai/handoff",
      headers: { origin: "https://evil.example" },
      payload: {},
    });
    assert.equal(res.statusCode, 403);
    await app.close();
  });

  it("blocks non-https WHMCS URL in production", async () => {
    const client = createWhmcsClient(cfg());
    const result = await client.call("GetClients");
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.reason, "not_configured");
      assert.match(result.detail, /https/i);
    }
  });
});
