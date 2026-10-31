/**
 * Demo-only customize formula — rates calibrated against demoCatalogSeeds.
 * Not live commercial pricing; checkout is not configured.
 */
import type {
  BillingTermMonths,
  VpsFamily,
} from "@/features/vps-pricing/model/types";
import { DEMO_PRICING_ANSWER } from "@/shared/content/demoPricingCopy";

export type CustomizeConfig = {
  family: VpsFamily;
  regionId: string;
  billingTermMonths: BillingTermMonths;
  vcpu: number;
  ramGb: number;
  nvmeGb: number;
  bandwidthTb: number;
  dedicatedIpv4: boolean;
  automatedBackups: boolean;
};

export type CustomizePriceResult = {
  currency: "USD";
  /** Monthly equivalent in minor units (cents). */
  monthlyMinor: number;
  /** Full term charge in minor units. */
  termTotalMinor: number;
  notice: string;
};

type FamilyRates = {
  /** Fixed platform major (USD). */
  baseMajor: number;
  vcpuMajor: number;
  ramGbMajor: number;
  nvmeGbMajor: number;
  bandwidthTbMajor: number;
};

/**
 * Demo rates (USD majors / month). Tuned so starter configs ≈ seed list prices.
 * Example: linux 1/1/20 + 1 TB ≈ $4.50 vs VPS 1 seed $4.49.
 */
const FAMILY_RATES: Record<VpsFamily, FamilyRates> = {
  linux: {
    baseMajor: 0.8,
    vcpuMajor: 1.5,
    ramGbMajor: 1,
    nvmeGbMajor: 0.04,
    bandwidthTbMajor: 0.4,
  },
  windows: {
    baseMajor: 1,
    vcpuMajor: 1.5,
    ramGbMajor: 0.8,
    nvmeGbMajor: 0.04,
    bandwidthTbMajor: 0.4,
  },
  "windows-admin-rdp": {
    baseMajor: 1.8,
    vcpuMajor: 1.6,
    ramGbMajor: 0.85,
    nvmeGbMajor: 0.042,
    bandwidthTbMajor: 0.45,
  },
};

/** Demo add-on majors (USD / month). */
const ADDON_IPV4_MAJOR = 0.5;
const ADDON_BACKUPS_MAJOR = 1.2;

/**
 * Region coefficients — demo UX only. Catalog seeds use null region;
 * keep 1.0 so country does not invent geo premiums.
 */
const REGION_COEF: Record<string, number> = {
  us: 1,
  gb: 1,
  ca: 1,
  nl: 1,
  de: 1,
  sg: 1,
  au: 1,
  jp: 1,
};

export const CUSTOMIZE_DEMO_NOTICE = DEMO_PRICING_ANSWER;

function toMinor(major: number): number {
  return Math.round(major * 100);
}

export function calculateCustomizePrice(
  config: CustomizeConfig,
): CustomizePriceResult {
  const rates = FAMILY_RATES[config.family];
  const coef = REGION_COEF[config.regionId] ?? 1;

  let major =
    rates.baseMajor +
    config.vcpu * rates.vcpuMajor +
    config.ramGb * rates.ramGbMajor +
    config.nvmeGb * rates.nvmeGbMajor +
    config.bandwidthTb * rates.bandwidthTbMajor;

  if (config.dedicatedIpv4) major += ADDON_IPV4_MAJOR;
  if (config.automatedBackups) major += ADDON_BACKUPS_MAJOR;

  major = Math.max(0, Math.round(major * coef * 100) / 100);
  const monthlyMinor = toMinor(major);
  const termTotalMinor = monthlyMinor * config.billingTermMonths;

  return {
    currency: "USD",
    monthlyMinor,
    termTotalMinor,
    notice: CUSTOMIZE_DEMO_NOTICE,
  };
}
