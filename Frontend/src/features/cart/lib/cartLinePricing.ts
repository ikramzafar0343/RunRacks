/**
 * Price helpers for multi-line cart summaries.
 */
import { familyLabel } from "@/features/cart/lib/cartPlanHelpers";
import type { CartLine } from "@/features/cart/model/cartTypes";
import { selectPlanPrice } from "@/features/vps-pricing";
import { formatMoneyMinor } from "@/features/vps-pricing";
import type { VpsCatalogPayload, VpsPlan } from "@/features/vps-pricing";

export type CartLineSummary = {
  id: string;
  name: string;
  familyLabel: string;
  amountLabel: string;
  termTotalMinor: number;
  currency: string;
};

export function resolveCartPlan(
  catalog: VpsCatalogPayload | null,
  entry: CartLine | null,
): VpsPlan | null {
  if (!catalog || !entry) return null;
  return catalog.plans.find((plan) => plan.id === entry.planId) ?? null;
}

export function linePrice(
  entry: CartLine,
  catalog: VpsCatalogPayload | null,
): { monthly: number; termTotal: number; currency: string } | null {
  if (entry.custom) {
    return {
      monthly: entry.custom.monthlyMinor,
      termTotal: entry.custom.termTotalMinor,
      currency: entry.custom.currency,
    };
  }
  const plan = resolveCartPlan(catalog, entry);
  if (!plan) return null;
  const price = selectPlanPrice(plan, entry.term, entry.locationId);
  if (!price) return null;
  return {
    monthly: price.monthlyEquivalentMinor ?? price.amountMinor,
    termTotal: price.amountMinor,
    currency: price.currency,
  };
}

export function summarizeCartLines(
  lines: CartLine[],
  catalog: VpsCatalogPayload | null,
): CartLineSummary[] {
  return lines.map((entry) => {
    const resolved = resolveCartPlan(catalog, entry);
    const family = resolved?.family ?? entry.custom?.family ?? "linux";
    const priced = linePrice(entry, catalog);
    return {
      id: entry.id,
      name: entry.custom?.label ?? resolved?.name ?? familyLabel(family),
      familyLabel: familyLabel(family),
      amountLabel:
        priced != null
          ? formatMoneyMinor(priced.monthly, priced.currency)
          : "—",
      termTotalMinor: priced?.termTotal ?? 0,
      currency: priced?.currency ?? "USD",
    };
  });
}
