/**
 * Demo Customize quote — MUST stay in sync with
 * Frontend/src/features/customize/model/customizePricing.ts
 * Not live commercial pricing; checkout is not configured.
 */

export type CustomizeFamily = "linux" | "windows" | "windows-admin-rdp";

export type CustomizeQuoteInput = {
  family: CustomizeFamily;
  vcpu: number;
  ramGb: number;
  nvmeGb: number;
  bandwidthTb: number;
  regionId?: string;
  billingTermMonths?: 1 | 3 | 6 | 12;
  dedicatedIpv4?: boolean;
  automatedBackups?: boolean;
};

export type CustomizeQuoteResult = {
  currency: "USD";
  monthlyMinor: number;
  termTotalMinor: number;
  monthlyMajor: number;
  priceLabel: string;
  notice: string;
};

type FamilyRates = {
  baseMajor: number;
  vcpuMajor: number;
  ramGbMajor: number;
  nvmeGbMajor: number;
  bandwidthTbMajor: number;
};

/** Same majors as Frontend calculateCustomizePrice. */
const FAMILY_RATES: Record<CustomizeFamily, FamilyRates> = {
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

const ADDON_IPV4_MAJOR = 0.5;
const ADDON_BACKUPS_MAJOR = 1.2;

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
  "These amounts use the same labeled demo Customize rates as /customize. Checkout is not orderable until billing is connected — confirm on Customize or Pricing.";

function toMinor(major: number): number {
  return Math.round(major * 100);
}

export function calculateCustomizeQuote(
  input: CustomizeQuoteInput,
): CustomizeQuoteResult {
  const family = input.family;
  const rates = FAMILY_RATES[family];
  const regionId = input.regionId ?? "us";
  const term = input.billingTermMonths ?? 1;
  const dedicatedIpv4 = input.dedicatedIpv4 ?? true;
  const automatedBackups = input.automatedBackups ?? false;
  const coef = REGION_COEF[regionId] ?? 1;

  let major =
    rates.baseMajor +
    input.vcpu * rates.vcpuMajor +
    input.ramGb * rates.ramGbMajor +
    input.nvmeGb * rates.nvmeGbMajor +
    input.bandwidthTb * rates.bandwidthTbMajor;

  if (dedicatedIpv4) major += ADDON_IPV4_MAJOR;
  if (automatedBackups) major += ADDON_BACKUPS_MAJOR;

  major = Math.max(0, Math.round(major * coef * 100) / 100);
  const monthlyMinor = toMinor(major);
  const termTotalMinor = monthlyMinor * term;

  return {
    currency: "USD",
    monthlyMinor,
    termTotalMinor,
    monthlyMajor: major,
    priceLabel: `$${major.toFixed(2)}/mo`,
    notice: CUSTOMIZE_DEMO_NOTICE,
  };
}

export function familyLabel(family: CustomizeFamily): string {
  if (family === "windows") return "Windows VPS";
  if (family === "windows-admin-rdp") return "Admin RDP";
  return "Linux VPS";
}
