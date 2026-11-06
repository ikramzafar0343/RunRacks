/**
 * Catalog gateway — Backend cache when enabled + ready; else labeled demo.
 * Never invents live WHMCS prices in the Frontend.
 */
import "server-only";
import { getDemoVpsCatalog } from "@/features/vps-pricing/model/demoCatalog";
import type { VpsCatalogPayload } from "@/features/vps-pricing/model/types";
import { getServerEnv } from "@/shared/config/env";
import { probeBackendReady } from "@/server/backendProbe";

function catalogEnabled(): boolean {
  return process.env.BACKEND_CATALOG_ENABLED?.trim() === "1";
}

function demoWithNotice(notice: string): VpsCatalogPayload {
  const demo = getDemoVpsCatalog();
  return { ...demo, notice, source: "demo" };
}

export async function getCatalogForPage(): Promise<VpsCatalogPayload> {
  const demo = getDemoVpsCatalog();
  if (!catalogEnabled()) return demo;

  const base = getServerEnv().backendApiBaseUrl;
  if (!base) return demo;

  const probe = await probeBackendReady();
  if (!probe.ready) {
    return demoWithNotice(
      `${demo.notice} Backend catalog unavailable (${probe.detail}).`,
    );
  }

  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/v1/plans?limit=100`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return demoWithNotice(
        `${demo.notice} Backend /v1/plans returned HTTP ${res.status}; showing labeled demo.`,
      );
    }
    const json = (await res.json()) as {
      ok?: boolean;
      data?: { items?: unknown[]; whmcsConfigured?: boolean };
    };
    if (!json.ok || !json.data?.items?.length) {
      return demoWithNotice(
        `${demo.notice} Backend catalog cache is empty; WHMCS sync not mapped yet.`,
      );
    }
    // Keep demo UI shape until WHMCS product → VpsCatalogPayload mapping lands.
    // Do not invent amounts from unmapped rows.
    return {
      ...demo,
      notice: json.data.whmcsConfigured
        ? "Backend returned catalog rows, but UI mapping is not complete — labeled demo prices remain until mapping ships."
        : `${demo.notice} Backend cache has rows without WHMCS; demo UI prices remain.`,
      source: "demo",
    };
  } catch (err) {
    return demoWithNotice(
      `${demo.notice} Catalog fetch failed (${String(err)}).`,
    );
  }
}
