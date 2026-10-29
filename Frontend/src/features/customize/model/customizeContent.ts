/**
 * Customize page copy, FAQ, and slider ranges — demo configurator.
 */
import type { Route } from "next";
import type { VpsFamily } from "@/features/vps-pricing/model/types";

export const CUSTOMIZE = {
  metaTitle: "Customize hosting | RunRacks",
  metaDescription:
    "Build a demo VPS, Windows, or Admin RDP configuration with vCPU, RAM, NVMe, and bandwidth—then continue to Pricing when checkout is configured.",
  hero: {
    title: "Customize your hosting",
    lead: "Choose type, region, and capacity. Totals are demo pricing until checkout is configured.",
    cta: {
      label: "Build your plan",
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
    cta: { label: "View plans", href: "/pricing" as Route },
    secondary: {
      label: "Compare catalog plans",
      href: "/pricing" as Route,
    },
  },
  faq: {
    heading: "Customize questions",
    items: [
      {
        id: "cz-what",
        question: "What does this configurator calculate?",
        answer:
          "It applies a documented demo formula to your sliders and add-ons so you can explore capacity before checkout is configured. Totals are illustrative, not a live quote.",
      },
      {
        id: "cz-live",
        question: "Can I buy this configuration today?",
        answer:
          "Checkout is not configured yet. Compare fixed demo plans under Pricing.",
      },
      {
        id: "cz-region",
        question: "Does the country change the demo price?",
        answer:
          "Region selection is part of the configurator UX. Demo rates currently use a 1.0 coefficient for every catalog region so we do not invent geo premiums.",
      },
      {
        id: "cz-match",
        question: "How does this relate to catalog plans?",
        answer:
          "Catalog cards are fixed seeds. This page lets you dial resources continuously with a transparent demo formula calibrated near those seeds.",
      },
    ],
  },
} as const;
