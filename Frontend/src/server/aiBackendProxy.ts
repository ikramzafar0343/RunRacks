/**
 * Proxy Frontend /api/v1/ai/* → Backend /v1/ai/* when owned AI config is enabled.
 * Forwards Cookie / Set-Cookie so guest ownership survives SSE turns.
 */
import "server-only";
import { getServerEnv } from "@/shared/config/env";

export type AiProxyGate =
  { ok: true; baseUrl: string } | { ok: false; reason: string };

export async function gateAiBackendProxy(
  timeoutMs = 4000,
): Promise<AiProxyGate> {
  const base = getServerEnv().backendApiBaseUrl;
  if (!base) {
    return { ok: false, reason: "BACKEND_API_BASE_URL is not set" };
  }
  const baseUrl = base.replace(/\/$/, "");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${baseUrl}/v1/ai/config`, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    });
    if (!res.ok) {
      return {
        ok: false,
        reason: `Backend AI config HTTP ${res.status}`,
      };
    }
    const json = (await res.json()) as {
      ok?: boolean;
      data?: { enabled?: boolean; status?: string };
    };
    if (json.data?.enabled === true && json.data?.status === "ready") {
      return { ok: true, baseUrl };
    }
    return {
      ok: false,
      reason: "Backend AI config not enabled",
    };
  } catch (err) {
    return {
      ok: false,
      reason: `Backend AI unreachable: ${String(err)}`,
    };
  } finally {
    clearTimeout(timer);
  }
}

/** Merge inbound browser Cookie into outbound Backend headers. */
export function withForwardedCookies(
  incoming: Request,
  headers?: HeadersInit,
): Headers {
  const out = new Headers(headers);
  const cookie = incoming.headers.get("cookie");
  if (cookie) out.set("Cookie", cookie);
  const requestId =
    incoming.headers.get("x-request-id") ??
    incoming.headers.get("x-correlation-id");
  if (requestId) out.set("x-request-id", requestId);
  const traceparent = incoming.headers.get("traceparent");
  if (traceparent) out.set("traceparent", traceparent);
  return out;
}

export async function proxyAiRequest(
  backendPath: string,
  init: RequestInit = {},
  incoming?: Request,
): Promise<Response> {
  const gate = await gateAiBackendProxy();
  if (!gate.ok) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: {
          code: "NOT_CONFIGURED",
          message:
            "RunRacks AI isn’t connected yet. Use Contact or Pricing for now.",
          details: {
            supportHref: "/contact",
            pricingHref: "/pricing",
            reason: gate.reason,
          },
        },
      }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }

  const url = `${gate.baseUrl}${backendPath.startsWith("/") ? backendPath : `/${backendPath}`}`;
  const headers = incoming
    ? withForwardedCookies(incoming, init.headers)
    : new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const fetchInit: RequestInit = {
    method: init.method ?? "GET",
    headers,
    cache: "no-store",
  };
  if (init.body !== undefined) {
    fetchInit.body = init.body;
  }
  if (init.signal) {
    fetchInit.signal = init.signal;
  }

  return fetch(url, fetchInit);
}

function copySetCookies(upstream: Response, headers: Headers) {
  const getSetCookie = (
    upstream.headers as Headers & { getSetCookie?: () => string[] }
  ).getSetCookie;
  if (typeof getSetCookie === "function") {
    for (const value of getSetCookie.call(upstream.headers)) {
      headers.append("Set-Cookie", value);
    }
    return;
  }
  const single = upstream.headers.get("set-cookie");
  if (single) headers.append("Set-Cookie", single);
}

/** Forward upstream Response (including SSE + Set-Cookie) to the browser. */
export function forwardUpstream(upstream: Response): Response {
  const headers = new Headers();
  const contentType = upstream.headers.get("Content-Type");
  if (contentType) headers.set("Content-Type", contentType);
  const cacheControl = upstream.headers.get("Cache-Control");
  if (cacheControl) headers.set("Cache-Control", cacheControl);
  copySetCookies(upstream, headers);

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}
