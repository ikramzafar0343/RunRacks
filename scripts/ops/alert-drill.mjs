/**
 * Local webhook receiver + optional POST to ALERT_WEBHOOK_URL.
 * Records evidence; does not invent delivery when webhook unset.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const evidenceDir = path.join(root, "ops/evidence");
const webhook = process.env.ALERT_WEBHOOK_URL?.trim();

fs.mkdirSync(evidenceDir, { recursive: true });

if (!webhook) {
  const out = {
    ranAt: new Date().toISOString(),
    configured: false,
    delivered: false,
    detail: "ALERT_WEBHOOK_URL unset — config-ready only, not active delivery",
  };
  fs.writeFileSync(
    path.join(evidenceDir, "alert-last-drill.json"),
    JSON.stringify(out, null, 2),
  );
  console.log(JSON.stringify(out));
  process.exit(0);
}

const payload = {
  alerts: [
    {
      status: "firing",
      labels: { alertname: "RunRacksAlertDrill" },
      annotations: { summary: "Synthetic alert delivery drill" },
    },
  ],
};

const res = await fetch(webhook, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
const out = {
  ranAt: new Date().toISOString(),
  configured: true,
  delivered: res.ok,
  status: res.status,
  detail: res.ok ? "webhook accepted drill" : "webhook rejected drill",
};
fs.writeFileSync(
  path.join(evidenceDir, "alert-last-drill.json"),
  JSON.stringify(out, null, 2),
);
console.log(JSON.stringify(out));
process.exit(res.ok ? 0 : 1);
