/**
 * smoke-api — hits readiness + catalog seams after a server is up.
 *
 * Usage: BASE_URL=http://127.0.0.1:3000 node scripts/smoke-api.mjs
 * Expects: ready → 503 NOT_CONFIGURED; catalog → ok + source:demo
 */
const base = (process.env.BASE_URL ?? "http://127.0.0.1:3000").replace(
  /\/$/,
  "",
);

async function getJson(path) {
  const res = await fetch(`${base}${path}`);
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error(`${path}: non-JSON (${res.status}): ${text.slice(0, 120)}`);
  }
  return { res, body };
}

const failures = [];

{
  const { res, body } = await getJson("/api/v1/ready");
  if (res.status !== 503) {
    failures.push(`ready: expected 503, got ${res.status}`);
  }
  if (body?.ok !== false || body?.error?.code !== "NOT_CONFIGURED") {
    failures.push(
      `ready: expected NOT_CONFIGURED error, got ${JSON.stringify(body)}`,
    );
  }
  if (body?.error?.details?.status === "ready") {
    failures.push("ready: details.status must not be ready");
  }
  console.log(
    `ready: ${res.status} code=${body?.error?.code ?? "?"} isReady-path-blocked=ok`,
  );
}

{
  const { res, body } = await getJson("/api/v1/vps/catalog");
  if (!res.ok) {
    failures.push(`catalog: expected 200, got ${res.status}`);
  }
  if (body?.ok !== true) {
    failures.push(`catalog: expected ok:true, got ${JSON.stringify(body)}`);
  }
  if (body?.data?.source !== "demo") {
    failures.push(`catalog: expected source:demo, got ${body?.data?.source}`);
  }
  if (body?.data?.checkoutConfigured !== false) {
    failures.push("catalog: checkoutConfigured must be false for demo");
  }
  const headerSource = res.headers.get("x-runracks-data-source");
  if (headerSource !== "demo") {
    failures.push(
      `catalog: X-RunRacks-Data-Source expected demo, got ${headerSource}`,
    );
  }
  console.log(
    `catalog: ${res.status} source=${body?.data?.source} plans=${body?.data?.plans?.length ?? 0}`,
  );
}

if (failures.length > 0) {
  console.error("smoke-api FAILED:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log("smoke-api OK");
