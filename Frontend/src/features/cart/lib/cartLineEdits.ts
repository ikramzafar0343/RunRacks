/**
 * Pure cart-line patches and display copy for the configure page.
 */
import {
  familyLabel,
  pickPlanForFamily,
} from "@/features/cart/lib/cartPlanHelpers";
import {
  customPlanId,
  type CartBillingTerm,
  type CartCustomSpec,
  type CartLine,
} from "@/features/cart/model/cartTypes";
import {
  PROVISION_DEMO_NOTE,
  defaultProvisionForFamily,
  getOsOptions,
} from "@/features/cart/model/provisionCatalog";
import { CUSTOMIZE } from "@/features/customize";
import { calculateCustomizePrice } from "@/features/customize";
import { formatMoneyMinor } from "@/features/vps-pricing";
import type { VpsFamily, VpsPlan } from "@/features/vps-pricing";

type CustomEdit = Partial<{
  locationId: string;
  term: CartBillingTerm;
  family: VpsFamily;
}>;

type DisplayPrice = {
  monthlyEquivalentMinor?: number;
  amountMinor: number;
  currency: string;
};

export const CART_TERMS: readonly CartBillingTerm[] = [1, 3, 6, 12];

export function cartTermTitle(term: CartBillingTerm): string {
  if (term === 1) return "1 month";
  if (term === 3) return "3 months";
  if (term === 6) return "6 months";
  return "12 months";
}

export function repriceCustomLine(
  line: CartLine,
  next: CustomEdit,
): CartCustomSpec | null {
  if (!line.custom) return null;
  const family = next.family ?? line.custom.family;
  const locationId = next.locationId ?? line.locationId;
  const term = next.term ?? line.term;
  const priced = calculateCustomizePrice({
    family,
    regionId: locationId,
    billingTermMonths: term,
    vcpu: line.custom.vcpu,
    ramGb: line.custom.ramGb,
    nvmeGb: line.custom.nvmeGb,
    bandwidthTb: line.custom.bandwidthTb,
    dedicatedIpv4: line.custom.dedicatedIpv4,
    automatedBackups: line.custom.automatedBackups,
  });
  const label =
    CUSTOMIZE.families.find((entry) => entry.id === family)?.label ??
    line.custom.label;
  return {
    ...line.custom,
    family,
    label,
    monthlyMinor: priced.monthlyMinor,
    termTotalMinor: priced.termTotalMinor,
    currency: priced.currency,
  };
}

export function patchForRegion(
  line: CartLine,
  plans: readonly VpsPlan[],
  locationId: string,
): Partial<CartLine> | null {
  if (line.custom) {
    const custom = repriceCustomLine(line, { locationId });
    return { locationId, ...(custom ? { custom } : {}) };
  }
  const plan = plans.find((entry) => entry.id === line.planId);
  if (!plan) return null;
  let nextPlan: VpsPlan = plan;
  if (!plan.availableRegionIds.includes(locationId)) {
    const picked = pickPlanForFamily(
      plans,
      plan.family,
      locationId,
      plan.ramGb,
    );
    if (picked) nextPlan = picked;
  }
  return {
    locationId,
    ...(nextPlan.id !== plan.id ? { planId: nextPlan.id } : {}),
  };
}

export function patchForServerType(
  line: CartLine,
  plans: readonly VpsPlan[],
  family: VpsFamily,
  preferRamGb?: number,
): Partial<CartLine> | null {
  if (line.custom) {
    const custom = repriceCustomLine(line, { family });
    return {
      ...(custom ? { custom, planId: customPlanId(family) } : {}),
      ...defaultProvisionForFamily(family),
    };
  }
  const next =
    preferRamGb == null
      ? pickPlanForFamily(plans, family, line.locationId)
      : pickPlanForFamily(plans, family, line.locationId, preferRamGb);
  if (!next) return null;
  return {
    planId: next.id,
    custom: null,
    ...defaultProvisionForFamily(family),
  };
}

export function patchForCatalogPlan(
  plans: readonly VpsPlan[],
  planId: string,
): Partial<CartLine> | null {
  const next = plans.find((entry) => entry.id === planId);
  if (!next) return null;
  return {
    planId: next.id,
    custom: null,
    ...defaultProvisionForFamily(next.family),
  };
}

export function patchForTerm(
  line: CartLine,
  term: CartBillingTerm,
): Partial<CartLine> {
  if (!line.custom) return { term };
  const custom = repriceCustomLine(line, { term });
  return { term, ...(custom ? { custom } : {}) };
}

export function patchForOs(family: VpsFamily, osId: string): Partial<CartLine> {
  const os = getOsOptions(family).find((entry) => entry.id === osId);
  return {
    osId,
    osVersion: os?.versions[0] ?? null,
    appId: null,
  };
}

export function describeReadyCart(input: {
  line: CartLine;
  plan: VpsPlan | null;
  activeFamily: VpsFamily;
  selectedOsName: string | null;
  price: DisplayPrice | null;
  catalogNotice: string;
}): {
  amountLabel: string;
  termTotalLabel: string;
  setupLabel: string;
  selectedLabel: string;
  isLinux: boolean;
  sshHelper: string;
  productName: string;
  productBadge: string | null;
  productTagline: string | null;
  specs: string[];
  demoNote: string;
} {
  const { line, plan, activeFamily, selectedOsName, price, catalogNotice } =
    input;
  const displayMinor =
    price?.monthlyEquivalentMinor ?? price?.amountMinor ?? null;
  const amountLabel =
    displayMinor != null && price
      ? formatMoneyMinor(displayMinor, price.currency)
      : "—";
  const isLinux = activeFamily === "linux";
  return {
    amountLabel,
    termTotalLabel:
      price != null ? formatMoneyMinor(price.amountMinor, price.currency) : "—",
    setupLabel: price ? formatMoneyMinor(0, price.currency) : "$0.00",
    selectedLabel: selectedOsName
      ? `${selectedOsName}${line.osVersion ? ` ${line.osVersion}` : ""}`
      : "None",
    isLinux,
    sshHelper: isLinux
      ? "Without a key a root password is shown once in your panel."
      : "Administrator / RDP access details are issued after provisioning — no password is generated on this demo page.",
    productName: line.custom?.label ?? plan?.name ?? familyLabel(activeFamily),
    productBadge: line.custom ? "Custom build" : (plan?.badge ?? null),
    productTagline: line.custom
      ? "Configured on Customize"
      : (plan?.tagline?.replace(/\|/g, " ") ?? null),
    specs: specsFor(line, plan),
    demoNote: `${PROVISION_DEMO_NOTE} ${catalogNotice}`,
  };
}

function specsFor(line: CartLine, plan: VpsPlan | null): string[] {
  if (line.custom) {
    const custom = line.custom;
    return [
      `${custom.vcpu} vCPU`,
      `${custom.ramGb} GB RAM`,
      `${custom.nvmeGb} GB NVMe`,
      `${custom.bandwidthTb} TB bandwidth`,
      ...(custom.dedicatedIpv4 ? [CUSTOMIZE.addons.dedicatedIpv4.label] : []),
      ...(custom.automatedBackups
        ? [CUSTOMIZE.addons.automatedBackups.label]
        : []),
    ];
  }
  if (!plan) return [];
  return [
    `${plan.vcpu} vCPU`,
    `${plan.ramGb} GB RAM`,
    `${plan.nvmeGb} GB NVMe`,
    ...(plan.trafficTb != null ? [`${plan.trafficTb} TB bandwidth`] : []),
  ];
}
