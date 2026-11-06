/**
 * WHMCS API adapter — allowlisted URL, timeouts, circuit breaker, no mock success.
 */
import type { AppConfig } from "../../platform/config.js";
import { isWhmcsConfigured } from "../../platform/config.js";
import { getBreaker } from "../../platform/circuitBreaker.js";
import { logError } from "../../platform/logging.js";

export type WhmcsResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      reason:
        | "not_configured"
        | "upstream"
        | "invalid_response"
        | "circuit_open";
      detail: string;
    };

type WhmcsEnvelope = {
  result?: string;
  message?: string;
  [key: string]: unknown;
};

export type WhmcsClient = {
  configured: boolean;
  call: <T = WhmcsEnvelope>(
    action: string,
    params?: Record<string, string | number | boolean>,
  ) => Promise<WhmcsResult<T>>;
};

export function createWhmcsClient(cfg: AppConfig): WhmcsClient {
  const configured = isWhmcsConfigured(cfg);
  const breaker = getBreaker("whmcs", {
    failureThreshold: 5,
    openMs: 30_000,
  });

  return {
    configured,
    async call<T = WhmcsEnvelope>(
      action: string,
      params: Record<string, string | number | boolean> = {},
    ) {
      if (
        !configured ||
        !cfg.whmcsApiUrl ||
        !cfg.whmcsApiIdentifier ||
        !cfg.whmcsApiSecret
      ) {
        return {
          ok: false,
          reason: "not_configured",
          detail: "WHMCS API credentials are not configured",
        };
      }

      let url: URL;
      try {
        url = new URL(cfg.whmcsApiUrl);
      } catch {
        return {
          ok: false,
          reason: "not_configured",
          detail: "WHMCS_API_URL is not a valid absolute URL",
        };
      }
      if (url.protocol !== "https:" && cfg.nodeEnv === "production") {
        return {
          ok: false,
          reason: "not_configured",
          detail: "WHMCS_API_URL must use https in production",
        };
      }

      const gate = breaker.enter();
      if (gate.kind === "open") {
        return {
          ok: false,
          reason: "circuit_open",
          detail: "WHMCS circuit is open after repeated upstream failures",
        };
      }

      const body = new URLSearchParams();
      body.set("identifier", cfg.whmcsApiIdentifier);
      body.set("secret", cfg.whmcsApiSecret);
      body.set("action", action);
      body.set("responsetype", "json");
      for (const [k, v] of Object.entries(params)) {
        body.set(k, String(v));
      }

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), cfg.whmcsTimeoutMs);
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
          signal: controller.signal,
        });
        if (!res.ok) {
          gate.finish(false);
          return {
            ok: false,
            reason: "upstream",
            detail: `WHMCS HTTP ${res.status}`,
          };
        }
        const json = (await res.json()) as WhmcsEnvelope;
        if (json.result === "error") {
          gate.finish(false);
          return {
            ok: false,
            reason: "upstream",
            detail:
              typeof json.message === "string" ? json.message : "WHMCS error",
          };
        }
        gate.finish(true);
        return { ok: true, data: json as T };
      } catch (err) {
        gate.finish(false);
        logError("whmcs_call_failed", { action, err: String(err) });
        return {
          ok: false,
          reason: "upstream",
          detail: "WHMCS request failed or timed out",
        };
      } finally {
        clearTimeout(timer);
      }
    },
  };
}
