/**
 * Admin RDP USA — all-in-one vs piecemeal compare (layout only).
 * No invented dollar savings, discounts, or competitor prices.
 */
import type { Route } from "next";

export type CompareStackIcon =
  "server" | "support" | "panel" | "backup" | "monitor" | "time";

export type CompareStackItem = {
  id: string;
  icon: CompareStackIcon;
  title: string;
  body: string;
  tag: string;
};

export const ADMIN_RDP_USA_COMPARE = {
  headingId: "admin-rdp-usa-compare-heading",
  heading: "USA Admin RDP without the vendor stack",
  lead: "Administrator desktops, NVMe plan cards, and a United States catalog filter—compare labeled demo tiers without piecing together separate tools for the basics.",
  featured: {
    brand: "RunRacks",
    eyebrow: "Admin RDP · United States",
    planName: "USA Admin RDP",
    summary:
      "Full administrator access and NVMe-backed plans in the United States catalog—demo prices labeled until checkout is live.",
    features: [
      "Desktop-style administrator access",
      "United States catalog region by default",
      "NVMe storage on plan cards",
      "vCPU and RAM listed per tier",
      "Family locked to Admin RDP on this page",
      "Switch regions in plan filters anytime",
      "Honest demo pricing labels",
      "Engineer help via Contact",
      "No invented uptime or PoP claims",
      "You keep guest OS and credentials",
    ],
    priceLabel: "From demo catalog",
    priceNote:
      "Compare live tiers above — prices stay labeled demo until billing is configured.",
    badge: "Demo pricing",
    primaryCta: {
      label: "View USA plans",
      href: "#admin-rdp-usa-plans" as Route,
    },
    secondaryCta: {
      label: "View plans",
      href: "/pricing" as Route,
    },
  },
  vsLabel: "VS",
  stack: [
    {
      id: "hosting",
      icon: "server",
      title: "Bare hosting alone",
      body: "A machine without Admin RDP framing—you still assemble access, tools, and region fit yourself.",
      tag: "Separate setup",
    },
    {
      id: "support",
      icon: "support",
      title: "Ad-hoc sysadmin help",
      body: "Hiring or pinging specialists whenever something breaks on an unmanaged box.",
      tag: "Extra cost",
    },
    {
      id: "panel",
      icon: "panel",
      title: "Panel and tooling licenses",
      body: "Control panels and admin utilities often billed on top of a basic VPS line item.",
      tag: "Add-on",
    },
    {
      id: "backup",
      icon: "backup",
      title: "Backup and recovery add-ons",
      body: "Snapshots and restores that sit outside a bare plan unless you wire them in.",
      tag: "Add-on",
    },
    {
      id: "monitor",
      icon: "monitor",
      title: "Monitoring and alerts",
      body: "Uptime checks and dashboards you configure separately from the guest desktop.",
      tag: "Extra stack",
    },
    {
      id: "time",
      icon: "time",
      title: "Your time",
      body: "Hours spent stitching vendors, credentials, and regions instead of using the remote desktop.",
      tag: "Priceless",
    },
  ] satisfies readonly CompareStackItem[],
  stackTotalLabel: "Many moving parts",
  stackTotalNote:
    "Illustrative stack—not a priced competitor quote. RunRacks does not invent third-party monthly totals.",
  disclaimer:
    "*No dollar “savings” claim here. Use the USA Admin RDP plan cards above for current demo labels.",
} as const;
