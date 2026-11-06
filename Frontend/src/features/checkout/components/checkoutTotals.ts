/**
 * Sum cart lines for checkout summary.
 */
import { familyLabel } from "@/features/cart";
import type { CartBillingTerm, CartLine } from "@/features/cart";
import { selectPlanPrice } from "@/features/vps-pricing";
import { formatMoneyMinor } from "@/features/vps-pricing";
import type { VpsCatalogPayload, VpsFamily } from "@/features/vps-pricing";

export type CheckoutLineRow = {
  id: string;
  name: string;
  familyLabel: string;
  family: VpsFamily;
  isCustom: boolean;
  amountLabel: string;
  term: CartBillingTerm;
  coupon: string;
};

function pricedLine(entry: CartLine, catalog: VpsCatalogPayload | null) {
  if (entry.custom) {
    return {
      monthly: entry.custom.monthlyMinor,
      termTotal: entry.custom.termTotalMinor,
      currency: entry.custom.currency,
    };
  }
  const plan = catalog?.plans.find((p) => p.id === entry.planId) ?? null;
  if (!plan) return null;
  const price = selectPlanPrice(plan, entry.term, entry.locationId);
  if (!price) return null;
  return {
    monthly: price.monthlyEquivalentMinor ?? price.amountMinor,
    termTotal: price.amountMinor,
    currency: price.currency,
  };
}

export function buildCheckoutTotals(
  lines: CartLine[],
  catalog: VpsCatalogPayload | null,
) {
  let monthly = 0;
  let termTotal = 0;
  let currency = "USD";

  const rows: CheckoutLineRow[] = lines.map((entry) => {
    const plan = catalog?.plans.find((p) => p.id === entry.planId) ?? null;
    const family: VpsFamily = plan?.family ?? entry.custom?.family ?? "linux";
    const priced = pricedLine(entry, catalog);
    if (priced) {
      monthly += priced.monthly;
      termTotal += priced.termTotal;
      currency = priced.currency;
    }
    return {
      id: entry.id,
      name: entry.custom?.label ?? plan?.name ?? familyLabel(family),
      familyLabel: familyLabel(family),
      family,
      isCustom: Boolean(entry.custom),
      amountLabel:
        priced != null
          ? formatMoneyMinor(priced.monthly, priced.currency)
          : "—",
      term: entry.term,
      coupon: entry.coupon,
    };
  });

  return {
    rows,
    count: lines.length,
    amountLabel: formatMoneyMinor(monthly, currency),
    termTotalLabel: formatMoneyMinor(termTotal, currency),
    setupLabel: formatMoneyMinor(0, currency),
  };
}
