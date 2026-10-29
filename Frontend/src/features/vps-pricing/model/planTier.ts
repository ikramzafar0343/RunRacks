/**
 * Map plan size to decorative isometric art tier (1–4).
 */
import type { VpsPlan } from "@/features/vps-pricing/model/types";

export type PlanTier = 1 | 2 | 3 | 4;

export function planTierFromPlan(plan: VpsPlan): PlanTier {
  const n = plan.vcpu;
  if (n <= 2) return 1;
  if (n <= 4) return 2;
  if (n <= 8) return 3;
  return 4;
}
