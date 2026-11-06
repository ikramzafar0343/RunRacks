/**
 * Customize page copy, FAQ, and slider ranges — demo configurator.
 */
import type { Route } from "next";
import type { BillingTermMonths, VpsFamily } from "@/features/vps-pricing";
import { DEMO_PRICING_ANSWER } from "@/shared/content/demoPricingCopy";

export const CUSTOMIZE = {
  metaTitle: "Customize hosting | RunRacks",
  metaDescription:
    "Size a demo Linux VPS, Windows VPS, or Admin RDP build with vCPU, RAM, NVMe, and bandwidth—then continue to Pricing.",
  hero: {
    title: "Size a hosting build",
    lead: "Pick family, region, and capacity. Totals are labeled demo pricing until checkout is connected.",
    cta: {
      label: "Open configurator",
      href: "#cz-config",
    },
    trust: {
      label: "8 catalog regions · demo pricing",
      avatars: [
        { src: "/flags/us.svg", alt: "United States" },
        { src: "/flags/gb.svg", alt: "United Kingdom" },
        { src: "/flags/de.svg", alt: "Germany" },
        { src: "/flags/sg.svg", alt: "Singapore" },
        { src: "/flags/au.svg", alt: "Australia" },
      ],
    },
  },
  families: [
    { id: "linux" as const, label: "Linux VPS" },
    { id: "windows" as const, label: "Windows VPS" },
    { id: "windows-admin-rdp" as const, label: "Admin RDP" },
  ] satisfies readonly { id: VpsFamily; label: string }[],
  terms: [
    { months: 1 as const, label: "Monthly" },
    { months: 3 as const, label: "3 Months" },
    { months: 6 as const, label: "6 Months" },
    { months: 12 as const, label: "12 Months" },
  ],
  defaults: {
    family: "linux" as VpsFamily,
    vcpu: 2,
    ramGb: 4,
    nvmeGb: 80,
    bandwidthTb: 2,
    dedicatedIpv4: true,
    automatedBackups: false,
    billingTermMonths: 1 as const,
  },
  sliders: {
    vcpu: { min: 1, max: 24, step: 1, label: "vCPU", unit: "cores" },
    ramGb: { min: 1, max: 64, step: 1, label: "RAM", unit: "GB" },
    /** GB RAM per vCPU — keeps memory attached to cores (2 cores → 4 GB). */
    ramGbPerVcpu: 2,
    nvmeGb: { min: 20, max: 1280, step: 20, label: "NVMe SSD", unit: "GB" },
    bandwidthTb: {
      min: 1,
      max: 20,
      step: 1,
      label: "Bandwidth",
      unit: "TB",
    },
  },
  addons: {
    dedicatedIpv4: {
      id: "dedicatedIpv4",
      label: "Dedicated IPv4",
      hint: "Demo add-on — one public IPv4 address",
    },
    automatedBackups: {
      id: "automatedBackups",
      label: "Automated backups",
      hint: "Demo add-on — scheduled disk snapshots",
    },
  },
  summary: {
    monthlyLabel: "Monthly equivalent",
    termLabel: "Term total",
    cta: { label: "Choose plan", href: "/pricing" as Route },
    secondary: {
      label: "Compare catalog plans",
      href: "/pricing" as Route,
    },
  },
  faq: {
    heading: "Configurator FAQs",
    items: [
      {
        id: "cz-what",
        question: "What does this configurator calculate?",
        answer:
          "A documented demo formula from your sliders and add-ons so you can explore capacity. Totals are illustrative—not a live quote.",
      },
      {
        id: "cz-live",
        question: "Can I buy this configuration today?",
        answer: DEMO_PRICING_ANSWER,
      },
      {
        id: "cz-region",
        question: "Does the country change the demo price?",
        answer:
          "Region is part of the configurator UX. Demo rates use a 1.0 coefficient for every catalog region so we do not invent geo premiums.",
      },
      {
        id: "cz-match",
        question: "How does this relate to catalog plans?",
        answer:
          "Catalog cards are fixed seeds. This page dials resources continuously with a transparent demo formula calibrated near those seeds.",
      },
    ],
  },
} as const;

/** Minimum sensible RAM for a vCPU count (2 GB/core, clamped to slider bounds). */
export function attachedRamGb(vcpu: number): number {
  const { ramGb, ramGbPerVcpu } = CUSTOMIZE.sliders;
  const raw = Math.ceil(vcpu * ramGbPerVcpu);
  const stepped =
    Math.round((raw - ramGb.min) / ramGb.step) * ramGb.step + ramGb.min;
  return Math.min(ramGb.max, Math.max(ramGb.min, stepped));
}

function clampStepped(
  value: number,
  min: number,
  max: number,
  step: number,
): number {
  const capped = Math.min(max, Math.max(min, value));
  const steps = Math.round((capped - min) / step);
  return Math.min(max, min + steps * step);
}

/** Clamp a raw number into a Customize slider range. */
export function clampCustomizeSlider(
  key: "vcpu" | "ramGb" | "nvmeGb" | "bandwidthTb",
  value: number,
): number {
  const range = CUSTOMIZE.sliders[key];
  return clampStepped(value, range.min, range.max, range.step);
}

const FAMILIES: readonly VpsFamily[] = [
  "linux",
  "windows",
  "windows-admin-rdp",
];

const REGION_IDS = ["us", "gb", "ca", "nl", "de", "sg", "au", "jp"] as const;
const TERMS: readonly BillingTermMonths[] = [1, 3, 6, 12];

/** Parse /customize?vcpu&ram&nvme&bw&family&region&term for AI / deep links. */
export function parseCustomizeSearchParams(
  params: URLSearchParams,
): {
  family?: VpsFamily;
  vcpu?: number;
  ramGb?: number;
  nvmeGb?: number;
  bandwidthTb?: number;
  regionId?: string;
  billingTermMonths?: BillingTermMonths;
} {
  const out: {
    family?: VpsFamily;
    vcpu?: number;
    ramGb?: number;
    nvmeGb?: number;
    bandwidthTb?: number;
    regionId?: string;
    billingTermMonths?: BillingTermMonths;
  } = {};

  const familyRaw = params.get("family");
  if (familyRaw && (FAMILIES as readonly string[]).includes(familyRaw)) {
    out.family = familyRaw as VpsFamily;
  }

  const vcpu = Number.parseInt(params.get("vcpu") ?? "", 10);
  if (Number.isFinite(vcpu) && vcpu > 0) {
    out.vcpu = clampCustomizeSlider("vcpu", vcpu);
  }

  const ram = Number.parseInt(params.get("ram") ?? "", 10);
  if (Number.isFinite(ram) && ram > 0) {
    out.ramGb = clampCustomizeSlider("ramGb", ram);
  }

  const nvme = Number.parseInt(params.get("nvme") ?? "", 10);
  if (Number.isFinite(nvme) && nvme > 0) {
    out.nvmeGb = clampCustomizeSlider("nvmeGb", nvme);
  }

  const bw = Number.parseInt(
    params.get("bw") ?? params.get("bandwidth") ?? "",
    10,
  );
  if (Number.isFinite(bw) && bw > 0) {
    out.bandwidthTb = clampCustomizeSlider("bandwidthTb", bw);
  }

  const region = params.get("region");
  if (region && (REGION_IDS as readonly string[]).includes(region)) {
    out.regionId = region;
  }

  const term = Number.parseInt(params.get("term") ?? "", 10);
  if ((TERMS as readonly number[]).includes(term)) {
    out.billingTermMonths = term as BillingTermMonths;
  }

  return out;
}
