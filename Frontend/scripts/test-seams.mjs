/**
 * test-seams — contract checks for demo catalog + readiness honesty
 * (no TS test runner yet; source-level guards until unit harness lands).
 */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

async function readSrc(rel) {
  return readFile(path.join(root, rel), "utf8");
}

const demoSrc = await readSrc("src/features/vps-pricing/model/demoCatalog.ts");
const envSrc = await readSrc("src/shared/config/env.ts");
const readySrc = await readSrc("src/app/api/v1/ready/route.ts");
const catalogSrc = await readSrc("src/app/api/v1/vps/catalog/route.ts");

assert.match(
  demoSrc,
  /source:\s*"demo"/,
  "demo catalog must label source:demo",
);
assert.match(
  demoSrc,
  /checkoutConfigured:\s*false/,
  "demo catalog must disable checkout",
);
assert.match(
  envSrc,
  /isReady:\s*false/,
  "integration status must not claim ready from env alone",
);
assert.match(
  readySrc,
  /status:\s*503/,
  "ready route must return 503 while probes are missing",
);
assert.match(
  readySrc,
  /NOT_CONFIGURED/,
  "ready route must use NOT_CONFIGURED code",
);
assert.match(
  catalogSrc,
  /X-RunRacks-Data-Source/,
  "catalog route must expose demo source header",
);
assert.match(
  catalogSrc,
  /getCatalogForPage/,
  "catalog route must use catalog gateway (demo fallback until mapped cache)",
);

const aiClientSrc = await readSrc(
  "src/features/ai-advisor/services/aiClient.ts",
);
assert.match(
  aiClientSrc,
  /export function parseSseChunk/,
  "SSE parse exported",
);
assert.match(aiClientSrc, /replace\(\/\\r\\n\/g/, "SSE normalizes CRLF");
assert.match(aiClientSrc, /response\.block/, "client handles response.block");
assert.match(
  aiClientSrc,
  /message\.accepted|response\.complete/,
  "SSE complete path",
);

const proxySrc = await readSrc("src/server/aiBackendProxy.ts");
assert.match(proxySrc, /withForwardedCookies/, "BFF forwards inbound Cookie");
assert.match(proxySrc, /Set-Cookie/, "BFF forwards Set-Cookie");

const aiCss = await readSrc(
  "src/features/ai-advisor/components/ai-advisor.css",
);
assert.match(
  aiCss,
  /margin-top:\s*var\(--ai-header-offset\)/,
  "advisor clears fixed header",
);

const chatCss = await readSrc(
  "src/features/ai-advisor/components/ai-advisor-chat.css",
);
assert.match(chatCss, /max-width:\s*min\(1040px/, "chat column capped");
assert.match(chatCss, /75ch/, "bubble measure capped");

const hookSrc = await readSrc(
  "src/features/ai-advisor/hooks/useAiConversation.ts",
);
assert.match(hookSrc, /lastRequestRef/, "retry reuses clientRequestId");
assert.match(hookSrc, /AbortController/, "stop/abort wired");

console.log("test-seams OK");
