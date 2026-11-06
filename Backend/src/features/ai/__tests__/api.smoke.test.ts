/**
 * HTTP smoke — health/ready/plans/ai/config fail closed without inventing WHMCS.
 */
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { buildApp } from "../../../app/buildApp.js";
import type { AppContext } from "../../../app/context.js";
import type { AppConfig } from "../../../platform/config.js";
import type { WhmcsClient } from "../../whmcs/whmcsClient.js";

function baseConfig(overrides: Partial<AppConfig> = {}): AppConfig {
  return {
    host: "127.0.0.1",
    port: 0,
    nodeEnv: "test",
    corsOrigins: ["http://localhost:3000"],
    trustProxy: false,
    sessionHmacSecret: "dev-only-session-hmac-secret-min-32-chars",
    sessionHmacSecretPrevious: undefined,
    databaseUrl: undefined,
    otelExporterOtlpEndpoint: undefined,
    alertWebhookUrl: undefined,
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
    ...overrides,
  };
}

function whmcsOff(): WhmcsClient {
  return {
    configured: false,
    async call() {
      return {
        ok: false,
        reason: "not_configured",
        detail: "WHMCS API credentials are not configured",
      };
    },
  };
}

describe("api smoke without database", () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  before(async () => {
    const ctx: AppContext = {
      config: baseConfig(),
      db: null,
      whmcs: whmcsOff(),
    };
    app = await buildApp(ctx);
    await app.ready();
  });

  after(async () => {
    await app.close();
  });

  it("GET /health is ok", async () => {
    const res = await app.inject({ method: "GET", url: "/health" });
    assert.equal(res.statusCode, 200);
    const body = res.json() as { status?: string };
    assert.equal(body.status, "ok");
  });

  it("GET /ready is 503 without DATABASE_URL", async () => {
    const res = await app.inject({ method: "GET", url: "/ready" });
    assert.equal(res.statusCode, 503);
    const body = res.json() as { code?: string; aiConfigured?: boolean };
    assert.equal(body.code, "NOT_CONFIGURED");
    assert.equal(body.aiConfigured, true);
  });

  it("GET /v1/ai/config is ready when AI_PROVIDER=owned", async () => {
    const res = await app.inject({ method: "GET", url: "/v1/ai/config" });
    assert.equal(res.statusCode, 200);
    const body = res.json() as { ok?: boolean; data?: { status?: string } };
    assert.equal(body.ok, true);
    assert.equal(body.data?.status, "ready");
  });

  it("GET /v1/plans is 503 without database", async () => {
    const res = await app.inject({ method: "GET", url: "/v1/plans" });
    assert.equal(res.statusCode, 503);
    const body = res.json() as { code?: string };
    assert.equal(body.code, "NOT_CONFIGURED");
  });

  it("POST /v1/catalog/sync is 503 without WHMCS", async () => {
    const res = await app.inject({ method: "POST", url: "/v1/catalog/sync" });
    assert.equal(res.statusCode, 503);
    const body = res.json() as { code?: string };
    assert.equal(body.code, "NOT_CONFIGURED");
  });

  it("POST /v1/orders is 503 without WHMCS", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/orders",
      payload: { clientRequestId: "smoke-order-0001" },
    });
    assert.equal(res.statusCode, 503);
    const body = res.json() as { code?: string };
    assert.equal(body.code, "NOT_CONFIGURED");
  });

  it("POST /v1/ai/conversations and messages full conversation flow", async () => {
    const createRes = await app.inject({
      method: "POST",
      url: "/v1/ai/conversations",
      payload: { topic: "vps", locale: "en" },
    });
    assert.equal(createRes.statusCode, 201);
    const createBody = createRes.json() as {
      ok: boolean;
      data: { id: string; store: string };
    };
    assert.equal(createBody.ok, true);
    const convoId = createBody.data.id;
    assert.ok(convoId);

    const rawCookie = createRes.headers["set-cookie"];
    const cookie = Array.isArray(rawCookie) ? rawCookie[0] : rawCookie;
    const authHeaders = cookie ? { cookie } : {};

    const msgRes = await app.inject({
      method: "POST",
      url: `/v1/ai/conversations/${convoId}/messages`,
      headers: authHeaders,
      payload: {
        clientRequestId: "req-smoke-test-001",
        message: "what is runrack",
        locale: "en",
        context: { topic: "vps" },
      },
    });
    assert.equal(msgRes.statusCode, 200);
    assert.match(msgRes.headers["content-type"] ?? "", /text\/event-stream/);
    assert.match(msgRes.body, /response\.delta|response\.complete/);
    assert.match(msgRes.body, /Linux VPS|RunRacks/i);

    const getRes = await app.inject({
      method: "GET",
      url: `/v1/ai/conversations/${convoId}`,
      headers: authHeaders,
    });
    assert.equal(getRes.statusCode, 200);
    const getBody = getRes.json() as { ok: boolean; data: { id: string } };
    assert.equal(getBody.ok, true);
    assert.equal(getBody.data.id, convoId);

    const listRes = await app.inject({
      method: "GET",
      url: "/v1/ai/conversations",
      headers: authHeaders,
    });
    assert.equal(listRes.statusCode, 200);
    const listBody = listRes.json() as {
      ok: boolean;
      data: { chats: { id: string; title: string }[] };
    };
    assert.equal(listBody.ok, true);
    const listed = listBody.data.chats.find((chat) => chat.id === convoId);
    assert.ok(listed);
    assert.equal(listed?.title, "what is runrack");

    const otherRes = await app.inject({
      method: "GET",
      url: "/v1/ai/conversations",
    });
    assert.equal(otherRes.statusCode, 200);
    const otherBody = otherRes.json() as {
      data: { chats: { id: string }[] };
    };
    assert.equal(
      otherBody.data.chats.some((chat) => chat.id === convoId),
      false,
    );

    const deleteRes = await app.inject({
      method: "DELETE",
      url: `/v1/ai/conversations/${convoId}`,
      headers: authHeaders,
    });
    assert.equal(deleteRes.statusCode, 200);
    const afterRes = await app.inject({
      method: "GET",
      url: "/v1/ai/conversations",
      headers: authHeaders,
    });
    const afterBody = afterRes.json() as { data: { chats: { id: string }[] } };
    assert.equal(
      afterBody.data.chats.some((chat) => chat.id === convoId),
      false,
    );

    const handoffRes = await app.inject({
      method: "POST",
      url: "/v1/ai/handoff",
      headers: authHeaders,
      payload: {
        conversationId: convoId,
        reason: "need human support",
      },
    });
    assert.equal(handoffRes.statusCode, 503);
    const handoffBody = handoffRes.json() as {
      ok: boolean;
      error: { code: string; details?: { supportHref?: string } };
    };
    assert.equal(handoffBody.ok, false);
    assert.equal(handoffBody.error.code, "NOT_CONFIGURED");
    assert.equal(handoffBody.error.details?.supportHref, "/contact");
  });
});

describe("api smoke AI disabled", () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  before(async () => {
    const ctx: AppContext = {
      config: baseConfig({ aiProvider: "disabled" }),
      db: null,
      whmcs: whmcsOff(),
    };
    app = await buildApp(ctx);
    await app.ready();
  });

  after(async () => {
    await app.close();
  });

  it("GET /v1/ai/config is not_configured when disabled", async () => {
    const res = await app.inject({ method: "GET", url: "/v1/ai/config" });
    assert.equal(res.statusCode, 200);
    const body = res.json() as {
      ok?: boolean;
      data?: { status?: string };
    };
    assert.equal(body.ok, true);
    assert.equal(body.data?.status, "not_configured");
  });
});
