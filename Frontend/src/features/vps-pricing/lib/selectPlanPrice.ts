/**
 * Resolve the display price for a plan given location + billing term.
 */
import type {
  BillingTermMonths,
  VpsPlan,
  VpsPriceRecord,
} from "@/features/vps-pricing/model/types";

export function selectPlanPrice(
  plan: VpsPlan,
  term: BillingTermMonths,
  locationId: string | null,
): VpsPriceRecord | null {
  const forTerm = plan.pricing.filter((p) => p.billingTermMonths === term);
  if (forTerm.length === 0) return null;

  if (locationId) {
    const regional = forTerm.find((p) => p.regionId === locationId);
    if (regional) return regional;
  }

  const global = forTerm.find((p) => p.regionId === null);
  return global ?? forTerm[0] ?? null;
}
