/**
 * Apply an advisor addToCart block to the configure cart.
 */
import type { BillingTermMonths, VpsFamily } from "@/features/vps-pricing";

const FAMILIES = new Set<string>(["linux", "windows", "windows-admin-rdp"]);
const TERMS = new Set<number>([1, 3, 6, 12]);

export type AdvisorCartAdd = {
  planId: string;
  planName: string;
  family: VpsFamily;
  locationId: string;
  term: BillingTermMonths;
};

export function readCartBlock(
  block: Record<string, unknown>,
): AdvisorCartAdd | null {
  if (block.type !== "addToCart") return null;
  if (typeof block.planId !== "string" || !block.planId) return null;
  if (typeof block.planName !== "string" || !block.planName) return null;
  if (typeof block.family !== "string" || !FAMILIES.has(block.family)) {
    return null;
  }
  if (typeof block.term !== "number" || !TERMS.has(block.term)) return null;
  const locationId =
    typeof block.locationId === "string" && block.locationId
      ? block.locationId
      : "us";
  return {
    planId: block.planId,
    planName: block.planName,
    family: block.family as VpsFamily,
    locationId,
    term: block.term as BillingTermMonths,
  };
}
