/**
 * Helpers to pick peer plans / family defaults for cart configure.
 */
import { selectPlanPrice } from "@/features/vps-pricing";
import type {
  BillingTermMonths,
  VpsFamily,
  VpsPlan,
} from "@/features/vps-pricing";
import type { CartBillingTerm } from "@/features/cart/model/cartTypes";

export function plansForFamily(
  plans: readonly VpsPlan[],
  family: VpsFamily,
): VpsPlan[] {
  return plans
    .filter((plan) => plan.family === family)
    .slice()
    .sort((a, b) => a.ramGb - b.ramGb || a.vcpu - b.vcpu);
}

export function planSupportsRegion(plan: VpsPlan, locationId: string): boolean {
  return plan.availableRegionIds.includes(locationId);
}

/** Prefer similar RAM band; else featured; else mid tier. */
export function pickPlanForFamily(
  plans: readonly VpsPlan[],
  family: VpsFamily,
  locationId: string,
  preferRamGb?: number,
): VpsPlan | null {
  const peers = plansForFamily(plans, family).filter((plan) =>
    planSupportsRegion(plan, locationId),
  );
  if (peers.length === 0) {
    return plansForFamily(plans, family)[0] ?? null;
  }
  if (preferRamGb != null) {
    let best = peers[0]!;
    let bestDelta = Math.abs(best.ramGb - preferRamGb);
    for (const plan of peers) {
      const delta = Math.abs(plan.ramGb - preferRamGb);
      if (delta < bestDelta) {
        best = plan;
        bestDelta = delta;
      }
    }
    return best;
  }
  return (
    peers.find((plan) => plan.featured) ??
    peers[Math.floor(peers.length / 2)] ??
    peers[0]!
  );
}

export function monthlyLabelForPlan(
  plan: VpsPlan,
  term: CartBillingTerm,
  locationId: string,
): string | null {
  const price = selectPlanPrice(plan, term as BillingTermMonths, locationId);
  if (!price) return null;
  const minor = price.monthlyEquivalentMinor ?? price.amountMinor;
  return String(minor);
}

export function termSavePercent(
  plan: VpsPlan,
  term: CartBillingTerm,
  locationId: string,
): number | null {
  if (term === 1) return null;
  const monthly = selectPlanPrice(plan, 1, locationId);
  const selected = selectPlanPrice(plan, term as BillingTermMonths, locationId);
  if (!monthly || !selected) return null;
  const monthEq = monthly.monthlyEquivalentMinor ?? monthly.amountMinor;
  const selEq = selected.monthlyEquivalentMinor ?? selected.amountMinor / term;
  if (monthEq <= 0 || selEq >= monthEq) return null;
  return Math.round(((monthEq - selEq) / monthEq) * 100);
}

export function familyLabel(family: VpsFamily): string {
  if (family === "windows") return "Windows VPS";
  if (family === "windows-admin-rdp") return "Admin RDP";
  return "Linux VPS";
}
