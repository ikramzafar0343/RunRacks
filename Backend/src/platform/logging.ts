/**
 * Safe logger — never print secrets or passwords.
 */
const REDACT_KEYS = new Set([
  "password",
  "secret",
  "apikey",
  "api_key",
  "authorization",
  "token",
  "whmcs_api_secret",
  "sessionhmacsecret",
]);

export function redact(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(redact);
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (REDACT_KEYS.has(k.toLowerCase())) {
      out[k] = "[REDACTED]";
    } else {
      out[k] = redact(v);
    }
  }
  return out;
}

export function logInfo(msg: string, meta?: Record<string, unknown>): void {
  console.info(JSON.stringify({ level: "info", msg, ...(meta ? redact(meta) as object : {}) }));
}

export function logError(msg: string, meta?: Record<string, unknown>): void {
  console.error(JSON.stringify({ level: "error", msg, ...(meta ? redact(meta) as object : {}) }));
}
