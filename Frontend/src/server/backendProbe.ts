/**
 * Live Backend /ready probe — env alone never means ready.
 * In-process reuse within one tick avoids duplicate probes without Date.now
 * (Cache Components forbids unstable time during prerender).
 */
import "server-only";
import { getServerEnv } from "@/shared/config/env";

export type BackendProbeResult = {
  reachable: boolean;
  ready: boolean;
  /** From Backend /ready when reachable. */
  databaseConfigured: boolean | null;
  whmcsConfigured: boolean | null;
  /** Live AI provider probe from Backend /ready (null if unknown). */
  aiConfigured: boolean | null;
  detail: string;
};

let inFlight: Promise<BackendProbeResult> | null = null;

function miss(
  partial: Omit<BackendProbeResult, "databaseConfigured"> & {
    databaseConfigured?: boolean | null;
  },
): BackendProbeResult {
  return {
    ...partial,
    databaseConfigured: partial.databaseConfigured ?? null,
  };
}

async function probeOnce(timeoutMs: number): Promise<BackendProbeResult> {
  const base = getServerEnv().backendApiBaseUrl;
  if (!base) {
    return miss({
      reachable: false,
      ready: false,
      whmcsConfigured: null,
      aiConfigured: null,
      detail: "BACKEND_API_BASE_URL is not set",
    });
  }

  const url = `${base.replace(/\/$/, "")}/ready`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    });
    if (!res.ok) {
      let whmcsConfigured: boolean | null = null;
      let aiConfigured: boolean | null = null;
      let databaseConfigured: boolean | null = null;
      try {
        const errJson = (await res.json()) as {
          whmcsConfigured?: boolean;
          aiConfigured?: boolean;
          databaseConfigured?: boolean;
        };
        if (typeof errJson.whmcsConfigured === "boolean") {
          whmcsConfigured = errJson.whmcsConfigured;
        }
        if (typeof errJson.aiConfigured === "boolean") {
          aiConfigured = errJson.aiConfigured;
        }
        if (typeof errJson.databaseConfigured === "boolean") {
          databaseConfigured = errJson.databaseConfigured;
        }
      } catch {
        /* body optional on 503 */
      }
      return miss({
        reachable: true,
        ready: false,
        databaseConfigured,
        whmcsConfigured,
        aiConfigured,
        detail: `Backend /ready returned HTTP ${res.status}`,
      });
    }
    const json = (await res.json()) as {
      status?: string;
      databaseConfigured?: boolean;
      whmcsConfigured?: boolean;
      aiConfigured?: boolean;
    };
    return miss({
      reachable: true,
      ready: json.status === "ready",
      databaseConfigured:
        typeof json.databaseConfigured === "boolean"
          ? json.databaseConfigured
          : json.status === "ready"
            ? true
            : null,
      whmcsConfigured:
        typeof json.whmcsConfigured === "boolean" ? json.whmcsConfigured : null,
      aiConfigured:
        typeof json.aiConfigured === "boolean" ? json.aiConfigured : null,
      detail: "Backend ready",
    });
  } catch (err) {
    return miss({
      reachable: false,
      ready: false,
      whmcsConfigured: null,
      aiConfigured: null,
      detail: `Backend probe failed: ${String(err)}`,
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function probeBackendReady(
  timeoutMs = 2500,
): Promise<BackendProbeResult> {
  if (!inFlight) {
    inFlight = probeOnce(timeoutMs).finally(() => {
      inFlight = null;
    });
  }
  return inFlight;
}
