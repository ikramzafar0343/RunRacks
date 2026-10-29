/**
 * Demo-only customize formula — rates calibrated against demoCatalogSeeds.
 * Not live commercial pricing; checkout is not configured.
 */
import type {
  BillingTermMonths,
  VpsFamily,
} from "@/features/vps-pricing/model/types";

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
  currency: "PKR";
  /** Monthly equivalent in minor units (paisa). */
  monthlyMinor: number;
  /** Full term charge in minor units. */
  termTotalMinor: number;
  notice: string;
};

type FamilyRates = {
  /** Fixed platform major (PKR). */
  baseMajor: number;
  vcpuMajor: number;
  ramGbMajor: number;
  nvmeGbMajor: number;
  bandwidthTbMajor: number;
};

/**
 * Demo rates (PKR majors / month). Tuned so starter configs ≈ seed list prices.
 * Example: linux 1/1/20 + 1 TB ≈ PKR 4,500 vs VPS 1 seed 4,497.
 */
const FAMILY_RATES: Record<VpsFamily, FamilyRates> = {
  linux: {
    baseMajor: 800,
    vcpuMajor: 1500,
    ramGbMajor: 1000,
    nvmeGbMajor: 40,
    bandwidthTbMajor: 400,
  },
  windows: {
    baseMajor: 1000,
    vcpuMajor: 1500,
    ramGbMajor: 800,
    nvmeGbMajor: 40,
    bandwidthTbMajor: 400,
  },
  "windows-admin-rdp": {
    baseMajor: 1800,
    vcpuMajor: 1600,
    ramGbMajor: 850,
    nvmeGbMajor: 42,
    bandwidthTbMajor: 450,
  },
};

/** Demo add-on majors (PKR / month). */
const ADDON_IPV4_MAJOR = 500;
const ADDON_BACKUPS_MAJOR = 1200;

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

export const CUSTOMIZE_DEMO_NOTICE =
  "Demo pricing — not live checkout. Totals are illustrative until billing is configured.";

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

  major = Math.max(0, Math.round(major * coef));
  const monthlyMinor = toMinor(major);
  const termTotalMinor = monthlyMinor * config.billingTermMonths;

  return {
    currency: "PKR",
    monthlyMinor,
    termTotalMinor,
    notice: CUSTOMIZE_DEMO_NOTICE,
  };
}
