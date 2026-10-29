/**
 * Lowest monthly-equivalent price for a catalog family (hero “from” line).
 */
import { selectPlanPrice } from "@/features/vps-pricing/lib/selectPlanPrice";
import { formatMoneyMinor } from "@/features/vps-pricing/model/formatPrice";
import type {
  VpsCatalogPayload,
  VpsFamily,
} from "@/features/vps-pricing/model/types";

export type StartingPrice = {
  label: string;
  compareLabel: string | null;
  currency: string;
};

export function getStartingPrice(
  catalog: VpsCatalogPayload,
  family: VpsFamily,
  locationId: string | null,
): StartingPrice | null {
  const plans = catalog.plans.filter((p) => p.family === family);
  let best: {
    monthly: number;
    compare: number | null;
    currency: string;
  } | null = null;

  for (const plan of plans) {
    const price = selectPlanPrice(plan, 1, locationId);
    if (!price) continue;
    const monthly = price.monthlyEquivalentMinor ?? price.amountMinor;
    const compare = price.compareAtMonthlyMinor ?? null;
    if (!best || monthly < best.monthly) {
      best = {
        monthly,
        compare: compare != null && compare > monthly ? compare : null,
        currency: price.currency,
      };
    }
  }

  if (!best) return null;
  return {
    label: formatMoneyMinor(best.monthly, best.currency),
    compareLabel:
      best.compare != null
        ? formatMoneyMinor(best.compare, best.currency)
        : null,
    currency: best.currency,
  };
}
