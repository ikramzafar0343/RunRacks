/**
 * Customize quote draft: asked specs vs clamped build, plus type / region / term.
 */
import type {
  CustomQuoteDraft,
  CustomQuoteNumbers,
  CustomQuoteTerm,
} from "../types/state.js";
import {
  clampToCustomizeRanges,
  detectCustomizeFamily,
  parseHardwareSpecs,
  type HardwareSpecNeed,
} from "./specPlanMatch.js";

export const QUOTE_REGIONS = [
  {
    id: "us",
    name: "United States",
    countryCode: "us",
    re: /\bunited states\b|\busa\b/,
  },
  {
    id: "gb",
    name: "United Kingdom",
    countryCode: "gb",
    re: /\bunited kingdom\b|\buk\b|\bbritain\b/,
  },
  { id: "ca", name: "Canada", countryCode: "ca", re: /\bcanada\b/ },
  {
    id: "nl",
    name: "Netherlands",
    countryCode: "nl",
    re: /\bnetherlands\b|\bholland\b/,
  },
  { id: "de", name: "Germany", countryCode: "de", re: /\bgermany\b/ },
  { id: "sg", name: "Singapore", countryCode: "sg", re: /\bsingapore\b/ },
  { id: "au", name: "Australia", countryCode: "au", re: /\baustralia\b/ },
  { id: "jp", name: "Japan", countryCode: "jp", re: /\bjapan\b/ },
] as const;

export const TYPE_CHIPS = [
  { id: "linux", label: "Linux VPS" },
  { id: "windows", label: "Windows VPS" },
  { id: "admin-rdp", label: "Admin RDP" },
];

export const REGION_CHIPS = QUOTE_REGIONS.map((region) => ({
  id: region.id,
  label: region.name,
}));

export const TERM_CHIPS = [
  { id: "term-1", label: "1 month" },
  { id: "term-3", label: "3 months" },
  { id: "term-6", label: "6 months" },
  { id: "term-12", label: "12 months" },
];

const MISSING_LABEL = {
  vcpu: "CPU (vCPU cores)",
  ramGb: "RAM (GB)",
  nvmeGb: "NVMe SSD (GB)",
  bandwidthTb: "Bandwidth (TB)",
} as const;

export type QuoteStep = "hardware" | "type" | "region" | "term" | "ready";

export function specsFilled(need: HardwareSpecNeed | null): number {
  if (!need) return 0;
  return [need.vcpu, need.ramGb, need.nvmeGb, need.bandwidthTb].filter(
    (n) => n != null,
  ).length;
}

export function detectQuoteRegion(matching: string): string | null {
  const hit = QUOTE_REGIONS.find((region) => region.re.test(matching));
  return hit?.id ?? null;
}

export function detectQuoteTerm(matching: string): CustomQuoteTerm | null {
  if (/\b12\s+months?\b|\byear(?:ly)?\b|\bannual(?:ly)?\b/.test(matching)) {
    return 12;
  }
  if (/\b6\s+months?\b|\bsemi annual\b|\bsemiannual\b/.test(matching)) return 6;
  if (/\b3\s+months?\b|\bquarter(?:ly)?\b/.test(matching)) return 3;
  if (/\b1\s+months?\b|\bmonthly\b/.test(matching)) return 1;
  return null;
}

export function quoteRegion(id: string) {
  return QUOTE_REGIONS.find((region) => region.id === id) ?? null;
}

export function missingHardwareLabels(draft: CustomQuoteDraft): string[] {
  const keys = ["vcpu", "ramGb", "nvmeGb", "bandwidthTb"] as const;
  return keys
    .filter((key) => draft.requested[key] == null)
    .map((key) => MISSING_LABEL[key]);
}

export function quoteStep(draft: CustomQuoteDraft): QuoteStep {
  if (missingHardwareLabels(draft).length > 0) return "hardware";
  if (!draft.family) return "type";
  if (!draft.regionId || !quoteRegion(draft.regionId)) return "region";
  if (!draft.billingTermMonths) return "term";
  return "ready";
}

export function draftFromMessage(
  need: HardwareSpecNeed,
  matching: string,
  previous?: CustomQuoteDraft,
): CustomQuoteDraft {
  const family = detectCustomizeFamily(matching) ?? previous?.family ?? null;
  const regionId = detectQuoteRegion(matching) ?? previous?.regionId ?? null;
  const billingTermMonths =
    detectQuoteTerm(matching) ?? previous?.billingTermMonths ?? null;
  const clamped = clampToCustomizeRanges(need, family);
  const hardwareMissing =
    need.vcpu == null ||
    need.ramGb == null ||
    need.nvmeGb == null ||
    need.bandwidthTb == null;
  return {
    requested: {
      vcpu: need.vcpu,
      ramGb: need.ramGb,
      nvmeGb: need.nvmeGb,
      bandwidthTb: need.bandwidthTb,
    },
    clamped: {
      vcpu: clamped.vcpu,
      ramGb: clamped.ramGb,
      nvmeGb: clamped.nvmeGb,
      bandwidthTb: clamped.bandwidthTb,
    },
    clamps: hardwareMissing ? [] : clamped.clamps,
    family,
    regionId,
    billingTermMonths,
  };
}

export function mergeDraft(
  draft: CustomQuoteDraft,
  matching: string,
): CustomQuoteDraft {
  const extra = parseHardwareSpecs(matching);
  const need: HardwareSpecNeed = {
    vcpu: extra?.vcpu ?? draft.requested.vcpu,
    ramGb: extra?.ramGb ?? draft.requested.ramGb,
    nvmeGb: extra?.nvmeGb ?? draft.requested.nvmeGb,
    bandwidthTb: extra?.bandwidthTb ?? draft.requested.bandwidthTb,
  };
  return draftFromMessage(need, matching, draft);
}

function describeRequested(need: CustomQuoteNumbers): string {
  const parts: string[] = [];
  if (need.vcpu != null) parts.push(`${need.vcpu} vCPU`);
  if (need.ramGb != null) parts.push(`${need.ramGb} GB RAM`);
  if (need.nvmeGb != null) parts.push(`${need.nvmeGb} GB storage`);
  if (need.bandwidthTb != null) parts.push(`${need.bandwidthTb} TB bandwidth`);
  return parts.join(", ");
}

function paren(requested: number | null, actual: number, text: string): string {
  return requested != null && requested !== actual ? ` ${text}` : "";
}

export function askedVsBuilt(draft: CustomQuoteDraft): string {
  const asked = describeRequested(draft.requested);
  const built = [
    `${draft.clamped.vcpu} vCPU${paren(draft.requested.vcpu, draft.clamped.vcpu, "(Customize range)")}`,
    `${draft.clamped.ramGb} GB RAM${paren(draft.requested.ramGb, draft.clamped.ramGb, "(Customize range)")}`,
    `${draft.clamped.nvmeGb} GB NVMe${paren(draft.requested.nvmeGb, draft.clamped.nvmeGb, "(storage steps by 20)")}`,
    `${draft.clamped.bandwidthTb} TB bandwidth${paren(draft.requested.bandwidthTb, draft.clamped.bandwidthTb, "(max is 20 TB)")}`,
  ].join(", ");
  if (draft.clamps.length === 0) {
    return `You asked for ${asked}. Customize can build that as-is: ${built}.`;
  }
  return `You asked for ${asked}. Customize can build ${built}.`;
}

export function describeKnownSpecs(draft: CustomQuoteDraft): string {
  return describeRequested(draft.requested);
}
