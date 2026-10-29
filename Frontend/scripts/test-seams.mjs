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
  /getDemoVpsCatalog/,
  "catalog route must serve demo catalog until live backend exists",
);

console.log("test-seams OK");
