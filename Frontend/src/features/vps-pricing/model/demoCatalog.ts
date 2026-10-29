/**
 * Labeled demo VPS catalog — UI development only, not live checkout.
 */
import type { VpsCatalogPayload } from "@/features/vps-pricing/model/types";
import {
  REGIONS,
  buildPlan,
} from "@/features/vps-pricing/model/demoCatalogBuilders";
import { SEEDS } from "@/features/vps-pricing/model/demoCatalogSeeds";

/** Module-level cache — demo catalog is static; avoid rebuild cost every call. */
let demoCatalogCache: VpsCatalogPayload | null = null;

export function getDemoVpsCatalog(): VpsCatalogPayload {
  if (demoCatalogCache) return demoCatalogCache;
  demoCatalogCache = {
    source: "demo",
    notice: "Demo pricing — not live checkout",
    regions: [...REGIONS],
    plans: SEEDS.map(buildPlan),
    checkoutConfigured: false,
  };
  return demoCatalogCache;
}
