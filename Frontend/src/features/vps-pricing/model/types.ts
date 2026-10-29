/**
 * VPS pricing catalog contracts (demo now; live later).
 */

export type VpsFamily = "linux" | "windows" | "windows-admin-rdp";

export type BillingTermMonths = 1 | 3 | 6 | 12;

export type VpsRegion = {
  id: string;
  name: string;
  /** ISO 3166-1 alpha-2 code; maps to `/flags/{code}.svg`. */
  countryCode: string;
};

export type VpsPriceRecord = {
  regionId: string | null;
  billingTermMonths: BillingTermMonths;
  currency: string;
  /** Total charge for the term, minor units (paisa). */
  amountMinor: number;
  monthlyEquivalentMinor?: number;
  /** Demo UI strikethrough monthly (minor units). */
  compareAtMonthlyMinor?: number;
  isStartingPrice?: boolean;
};

export type VpsPlanDetail = {
  label: string;
  value: string;
};

export type VpsPlan = {
  id: string;
  name: string;
  family: VpsFamily;
  vcpu: number;
  ramGb: number;
  nvmeGb: number;
  availableRegionIds: string[];
  details: VpsPlanDetail[];
  pricing: VpsPriceRecord[];
  purchasable: boolean;
  /** Short audience line under the plan name (card layout). */
  tagline?: string;
  /** Mid-tier highlight card. */
  featured?: boolean;
  /** Corner badge text (e.g. demo savings label). */
  badge?: string;
  /** Featured footer (“Why this plan?”). */
  whyPlan?: string;
};

export type VpsCatalogPayload = {
  source: "demo" | "live";
  notice: string;
  regions: VpsRegion[];
  plans: VpsPlan[];
  checkoutConfigured: boolean;
};
