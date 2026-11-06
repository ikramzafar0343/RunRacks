/**
 * Server env — fail closed on missing session secret in production.
 */
export type AppConfig = {
  host: string;
  port: number;
  nodeEnv: string;
  corsOrigins: string[];
  trustProxy: boolean;
  sessionHmacSecret: string;
  /** Prior signing key during rotation — verify only, never issue. */
  sessionHmacSecretPrevious: string | undefined;
  databaseUrl: string | undefined;
  dbPoolMax: number;
  dbStatementTimeoutMs: number;
  dbLockTimeoutMs: number;
  whmcsApiUrl: string | undefined;
  whmcsApiIdentifier: string | undefined;
  whmcsApiSecret: string | undefined;
  whmcsTimeoutMs: number;
  aiProvider: string | undefined;
  aiApiKey: string | undefined;
  aiBaseUrl: string;
  aiModel: string;
  aiTimeoutMs: number;
  aiMaxInputChars: number;
  otelExporterOtlpEndpoint: string | undefined;
  alertWebhookUrl: string | undefined;
};

function readOptional(name: string): string | undefined {
  const v = process.env[name]?.trim();
  return v && v.length > 0 ? v : undefined;
}

function readInt(name: string, fallback: number): number {
  const raw = readOptional(name);
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : fallback;
}

export function loadConfig(): AppConfig {
  const nodeEnv = readOptional("NODE_ENV") ?? "development";
  const sessionHmacSecret = readOptional("SESSION_HMAC_SECRET");
  if (!sessionHmacSecret || sessionHmacSecret.length < 32) {
    if (nodeEnv === "production") {
      throw new Error("SESSION_HMAC_SECRET must be set (≥32 chars) in production");
    }
  }

  const corsRaw = readOptional("CORS_ORIGINS") ?? "http://localhost:3000";
  return {
    host: readOptional("HOST") ?? "0.0.0.0",
    port: readInt("PORT", 4000),
    nodeEnv,
    corsOrigins: corsRaw.split(",").map((s) => s.trim()).filter(Boolean),
    trustProxy: (readOptional("TRUST_PROXY") ?? "false") === "true",
    sessionHmacSecret:
      sessionHmacSecret ?? "dev-only-session-hmac-secret-min-32-chars",
    sessionHmacSecretPrevious: readOptional("SESSION_HMAC_SECRET_PREVIOUS"),
    databaseUrl: readOptional("DATABASE_URL"),
    otelExporterOtlpEndpoint: readOptional("OTEL_EXPORTER_OTLP_ENDPOINT"),
    alertWebhookUrl: readOptional("ALERT_WEBHOOK_URL"),
    dbPoolMax: readInt("DB_POOL_MAX", 10),
    dbStatementTimeoutMs: readInt("DB_STATEMENT_TIMEOUT_MS", 5000),
    dbLockTimeoutMs: readInt("DB_LOCK_TIMEOUT_MS", 2000),
    whmcsApiUrl: readOptional("WHMCS_API_URL"),
    whmcsApiIdentifier: readOptional("WHMCS_API_IDENTIFIER"),
    whmcsApiSecret: readOptional("WHMCS_API_SECRET"),
    whmcsTimeoutMs: readInt("WHMCS_TIMEOUT_MS", 8000),
    aiProvider: readOptional("AI_PROVIDER") ?? "owned",
    aiApiKey: readOptional("AI_API_KEY"),
    aiBaseUrl: readOptional("AI_BASE_URL") ?? "",
    aiModel: readOptional("AI_MODEL") ?? "owned-agent",
    aiTimeoutMs: readInt("AI_TIMEOUT_MS", 45000),
    aiMaxInputChars: readInt("AI_MAX_INPUT_CHARS", 4000),
  };
}

export function isDatabaseConfigured(cfg: AppConfig): boolean {
  return cfg.databaseUrl !== undefined;
}

export function isWhmcsConfigured(cfg: AppConfig): boolean {
  return (
    cfg.whmcsApiUrl !== undefined &&
    cfg.whmcsApiIdentifier !== undefined &&
    cfg.whmcsApiSecret !== undefined
  );
}

/**
 * Owned in-process agent is the default. No API key required.
 * Set AI_PROVIDER=disabled to turn chat off.
 */
export function isAiConfigured(cfg: AppConfig): boolean {
  const provider = (cfg.aiProvider ?? "owned").toLowerCase();
  return provider === "owned";
}
