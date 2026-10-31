/**
 * Demo VPS catalog builders — UI development only, not live checkout.
 */
import type {
  BillingTermMonths,
  VpsFamily,
  VpsPlan,
  VpsPriceRecord,
} from "@/features/vps-pricing/model/types";

export const REGIONS = [
  { id: "us", name: "United States", countryCode: "us" },
  { id: "gb", name: "United Kingdom", countryCode: "gb" },
  { id: "ca", name: "Canada", countryCode: "ca" },
  { id: "nl", name: "Netherlands", countryCode: "nl" },
  { id: "de", name: "Germany", countryCode: "de" },
  { id: "sg", name: "Singapore", countryCode: "sg" },
  { id: "au", name: "Australia", countryCode: "au" },
  { id: "jp", name: "Japan", countryCode: "jp" },
] as const;

const REGION_IDS = REGIONS.map((r) => r.id);
const REGION_LABEL =
  "United States, United Kingdom, Canada, Netherlands, Germany, Singapore, Australia, Japan";

export type PlanSeed = {
  id: string;
  name: string;
  family: VpsFamily;
  vcpu: number;
  ramGb: number;
  nvmeGb: number;
  trafficTb?: number;
  deliveryMinutes?: number;
  monthlyMajor: number;
  compareAtMajor: number;
  osHint: string;
  tagline: string;
  badge: string;
  featured?: boolean;
  whyPlan?: string;
};

function termPrices(
  monthlyMajor: number,
  compareAtMajor: number,
): VpsPriceRecord[] {
  const monthlyMinor = Math.round(monthlyMajor * 100);
  const compareAtMonthlyMinor = Math.round(compareAtMajor * 100);
  const terms: Array<{ term: BillingTermMonths; months: number }> = [
    { term: 1, months: 1 },
    { term: 3, months: 3 },
    { term: 6, months: 6 },
    { term: 12, months: 12 },
  ];
  return terms.map(({ term, months }) => ({
    regionId: null,
    billingTermMonths: term,
    currency: "USD",
    amountMinor: monthlyMinor * months,
    monthlyEquivalentMinor: monthlyMinor,
    compareAtMonthlyMinor,
    isStartingPrice: false,
  }));
}

function accessDetail(family: VpsFamily): string {
  if (family === "linux") return "Full root access";
  return "Full root / administrator access";
}

export function buildPlan(seed: PlanSeed): VpsPlan {
  const details: VpsPlan["details"] = [
    { label: "Access", value: accessDetail(seed.family) },
    { label: "Storage", value: "NVMe SSD" },
    { label: "Network", value: "Dedicated IPv4 address" },
  ];
  if (seed.trafficTb != null) {
    details.push({ label: "Traffic", value: `${seed.trafficTb} TB volume` });
  }
  if (seed.deliveryMinutes != null) {
    details.push({
      label: "Delivery",
      value: `${seed.deliveryMinutes} min`,
    });
  }
  details.push(
    { label: "Operating systems", value: seed.osHint },
    { label: "Regions", value: REGION_LABEL },
  );

  const plan: VpsPlan = {
    id: seed.id,
    name: seed.name,
    family: seed.family,
    vcpu: seed.vcpu,
    ramGb: seed.ramGb,
    nvmeGb: seed.nvmeGb,
    availableRegionIds: [...REGION_IDS],
    details,
    pricing: termPrices(seed.monthlyMajor, seed.compareAtMajor),
    purchasable: false,
    tagline: seed.tagline,
    badge: seed.badge,
  };
  if (seed.trafficTb != null) plan.trafficTb = seed.trafficTb;
  if (seed.deliveryMinutes != null) {
    plan.deliveryMinutes = seed.deliveryMinutes;
  }
  if (seed.featured) plan.featured = true;
  if (seed.whyPlan) plan.whyPlan = seed.whyPlan;
  return plan;
}

export const LINUX = "Linux distributions (Ubuntu, Debian, AlmaLinux)";
export const WIN = "Windows Server (image selected at order)";
export const RDP = "Windows Server with administrator RDP access";
