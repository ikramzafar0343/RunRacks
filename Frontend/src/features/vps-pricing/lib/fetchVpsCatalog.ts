/**
 * Client fetch for VPS catalog (supports AbortSignal for filter races).
 */
import type { ApiResponse } from "@/shared/lib/apiContracts";
import type { VpsCatalogPayload } from "@/features/vps-pricing/model/types";

export async function fetchVpsCatalog(
  signal?: AbortSignal,
): Promise<VpsCatalogPayload> {
  const response = await fetch("/api/v1/vps/catalog", {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "force-cache",
    ...(signal ? { signal } : {}),
  });

  const json = (await response.json()) as ApiResponse<VpsCatalogPayload>;

  if (!response.ok || !json.ok) {
    const message =
      !json.ok && json.error?.message
        ? json.error.message
        : "Unable to load VPS plans.";
    throw new Error(message);
  }

  return json.data;
}
