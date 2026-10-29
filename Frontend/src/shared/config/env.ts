/**
 * Environment config (server-only).
 *
 * Why this file exists:
 * - Central place to read process.env so features don't scatter env access.
 * - Separates public (browser-safe) vs server (secret) values.
 * - Reports whether backend/DB are configured — without pretending they work.
 *
 * `import "server-only"` makes Next.js fail the build if a Client Component
 * imports this file (secrets must never ship to the browser).
 *
 * Variable names are documented in Frontend/.env.example (values stay local).
 */
import "server-only";

/** Values safe to expose conceptually (still only read on the server here). */
export type PublicEnv = {
  appName: string;
};

/** Secrets / infra URLs — only used in server code. */
export type ServerEnv = {
  databaseUrl: string | undefined;
  backendApiBaseUrl: string | undefined;
  aiProvider: string | undefined;
  aiApiKey: string | undefined;
};

/**
 * AI advisor flags — env presence alone never means chat is ready.
 * Live model + backend probes required before claiming ready.
 */
export type AiIntegrationStatus = {
  providerConfigured: boolean;
  apiKeyConfigured: boolean;
  isConfigured: boolean;
  /** Always false until real provider health checks exist. */
  isReady: boolean;
};

/**
 * Honest flags:
 * - configured = env var present
 * - isReady = real probes passed (not implemented yet → always false)
 */
export type IntegrationStatus = {
  backendConfigured: boolean;
  databaseConfigured: boolean;
  isConfigured: boolean;
  isReady: boolean;
};

/** Empty string after trim counts as missing (avoids silent "" config). */
function readOptional(name: string): string | undefined {
  const value = process.env[name];
  if (value === undefined) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function getPublicEnv(): PublicEnv {
  return {
    appName: readOptional("NEXT_PUBLIC_APP_NAME") ?? "RunRacks",
  };
}

export function getServerEnv(): ServerEnv {
  return {
    databaseUrl: readOptional("DATABASE_URL"),
    backendApiBaseUrl: readOptional("BACKEND_API_BASE_URL"),
    aiProvider: readOptional("AI_PROVIDER"),
    aiApiKey: readOptional("AI_API_KEY"),
  };
}

/**
 * Used by /api/v1/ai/* seams.
 * Keys alone never set isReady — live provider probes required later.
 */
export function getAiIntegrationStatus(): AiIntegrationStatus {
  const serverEnv = getServerEnv();
  const providerConfigured = serverEnv.aiProvider !== undefined;
  const apiKeyConfigured = serverEnv.aiApiKey !== undefined;
  const isConfigured = providerConfigured && apiKeyConfigured;

  return {
    providerConfigured,
    apiKeyConfigured,
    isConfigured,
    // STOP: do not claim AI ready until real model health checks exist.
    isReady: false,
  };
}

/**
 * Used by /api/v1/ready.
 * Env presence alone never sets isReady — live DB/backend probes required later.
 */
export function getIntegrationStatus(): IntegrationStatus {
  const serverEnv = getServerEnv();
  const backendConfigured = serverEnv.backendApiBaseUrl !== undefined;
  const databaseConfigured = serverEnv.databaseUrl !== undefined;
  const isConfigured = backendConfigured && databaseConfigured;

  return {
    backendConfigured,
    databaseConfigured,
    isConfigured,
    // STOP: do not claim ready until real health/ping checks exist.
    isReady: false,
  };
}
