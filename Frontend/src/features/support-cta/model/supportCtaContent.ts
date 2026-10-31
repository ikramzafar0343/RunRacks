/**
 * Dual support / migration CTA — real routes, project-owned demo imagery.
 * Each surface owns its own cards so pages do not share identical marketing copy.
 */
import type { Route } from "next";

export type SupportCtaCard = {
  id: string;
  heading: string;
  body: string;
  emphasis?: string;
  ctaLabel: string;
  href: Route;
  imageSrc: string;
  imageAlt: string;
};

const DEMO_ENGINEER_ALT =
  "Demo portrait of an engineer at a laptop — not a verified staff photo";
const DEMO_WORKSPACE_ALT =
  "Demo portrait in a workspace — not a verified staff photo";

/** Homepage — cross-product entry. */
export const SUPPORT_CTA = {
  cards: [
    {
      id: "support",
      heading: "Talk to RunRacks engineers",
      body: "Plan fit, migrations, and product questions go to people who know the fleet—not a chatbot loop.",
      emphasis: "engineers",
      ctaLabel: "Contact us",
      href: "/contact" as Route,
      imageSrc: "/media/customer-stories/demo-01/portrait.jpg",
      imageAlt: DEMO_ENGINEER_ALT,
    },
    {
      id: "migrate",
      heading: "Moving an existing workload?",
      body: "We can walk through family choice, region, and administrator access so your move onto RunRacks stays clear.",
      ctaLabel: "Try RunRacks AI",
      href: "/ai" as Route,
      imageSrc: "/media/customer-stories/demo-02/portrait.jpg",
      imageAlt: DEMO_WORKSPACE_ALT,
    },
  ] satisfies readonly SupportCtaCard[],
} as const;

/** /pricing — catalog comparison focus. */
export const SUPPORT_CTA_PRICING = {
  cards: [
    {
      id: "support",
      heading: "Stuck between catalog tiers?",
      body: "Ask engineers which Linux, Windows, or Admin RDP size matches your workload before you treat demo prices as a live quote.",
      emphasis: "engineers",
      ctaLabel: "Contact us",
      href: "/contact" as Route,
      imageSrc: "/media/customer-stories/demo-01/portrait.jpg",
      imageAlt: DEMO_ENGINEER_ALT,
    },
    {
      id: "migrate",
      heading: "Need a second opinion on filters?",
      body: "RunRacks AI can narrow family, region, and capacity using the same catalog language you see on this page.",
      ctaLabel: "Try RunRacks AI",
      href: "/ai" as Route,
      imageSrc: "/media/customer-stories/demo-02/portrait.jpg",
      imageAlt: DEMO_WORKSPACE_ALT,
    },
  ] satisfies readonly SupportCtaCard[],
} as const;

/** /products/vps — Linux VPS. */
export const SUPPORT_CTA_LINUX_VPS = {
  cards: [
    {
      id: "support",
      heading: "Questions about Linux VPS?",
      body: "Talk through root access, distro choice, and NVMe tier fit with engineers who work Linux guests day to day.",
      emphasis: "engineers",
      ctaLabel: "Contact us",
      href: "/contact" as Route,
      imageSrc: "/media/customer-stories/demo-01/portrait.jpg",
      imageAlt: DEMO_ENGINEER_ALT,
    },
    {
      id: "migrate",
      heading: "Bringing a Linux stack over?",
      body: "Map SSH keys, images, and region before you leave shared hosting—then continue on Pricing with Linux still in focus.",
      ctaLabel: "Try RunRacks AI",
      href: "/ai" as Route,
      imageSrc: "/media/customer-stories/demo-02/portrait.jpg",
      imageAlt: DEMO_WORKSPACE_ALT,
    },
  ] satisfies readonly SupportCtaCard[],
} as const;

/** /products/admin-rdp. */
export const SUPPORT_CTA_ADMIN_RDP = {
  cards: [
    {
      id: "support",
      heading: "Questions about Admin RDP?",
      body: "Ask about desktop sizing, administrator rights, and how Admin RDP differs from Windows VPS server plans.",
      emphasis: "engineers",
      ctaLabel: "Contact us",
      href: "/contact" as Route,
      imageSrc: "/media/customer-stories/demo-01/portrait.jpg",
      imageAlt: DEMO_ENGINEER_ALT,
    },
    {
      id: "migrate",
      heading: "Moving operators onto Admin RDP?",
      body: "Size remote desktop tiers for support desks or agencies, then continue on Pricing without mixing in server-only Windows VPS.",
      ctaLabel: "Try RunRacks AI",
      href: "/ai" as Route,
      imageSrc: "/media/customer-stories/demo-02/portrait.jpg",
      imageAlt: DEMO_WORKSPACE_ALT,
    },
  ] satisfies readonly SupportCtaCard[],
} as const;

/** /customize. */
export const SUPPORT_CTA_CUSTOMIZE = {
  cards: [
    {
      id: "support",
      heading: "Does this demo build match a plan?",
      body: "Engineers can map your slider totals to nearby catalog seeds so the configurator stays a planning tool, not a fake checkout.",
      emphasis: "engineers",
      ctaLabel: "Contact us",
      href: "/contact" as Route,
      imageSrc: "/media/customer-stories/demo-01/portrait.jpg",
      imageAlt: DEMO_ENGINEER_ALT,
    },
    {
      id: "migrate",
      heading: "Prefer guided sizing?",
      body: "Describe the workload to RunRacks AI and get a family and capacity suggestion aligned with documented demo tiers.",
      ctaLabel: "Try RunRacks AI",
      href: "/ai" as Route,
      imageSrc: "/media/customer-stories/demo-02/portrait.jpg",
      imageAlt: DEMO_WORKSPACE_ALT,
    },
  ] satisfies readonly SupportCtaCard[],
} as const;

/** /contact. */
export const SUPPORT_CTA_CONTACT = {
  cards: [
    {
      id: "support",
      heading: "Prefer pricing before you write?",
      body: "Open the catalog to compare Linux, Windows, and Admin RDP tiers with demo labels, then come back when you need a human.",
      emphasis: "catalog",
      ctaLabel: "View Pricing",
      href: "/pricing" as Route,
      imageSrc: "/media/customer-stories/demo-01/portrait.jpg",
      imageAlt: DEMO_ENGINEER_ALT,
    },
    {
      id: "migrate",
      heading: "Want a quick plan suggestion first?",
      body: "RunRacks AI can shortlist family and region while the contact form waits on inbox transport.",
      ctaLabel: "Try RunRacks AI",
      href: "/ai" as Route,
      imageSrc: "/media/customer-stories/demo-02/portrait.jpg",
      imageAlt: DEMO_WORKSPACE_ALT,
    },
  ] satisfies readonly SupportCtaCard[],
} as const;

/** Blog / resources footers. */
export const SUPPORT_CTA_BLOG = {
  cards: [
    {
      id: "support",
      heading: "Ready to size a real plan?",
      body: "Leave the article and compare documented VPS, Windows, and Admin RDP tiers—demo pricing stays labeled until checkout is live.",
      emphasis: "plans",
      ctaLabel: "View Pricing",
      href: "/pricing" as Route,
      imageSrc: "/media/customer-stories/demo-01/portrait.jpg",
      imageAlt: DEMO_ENGINEER_ALT,
    },
    {
      id: "migrate",
      heading: "Still deciding on a family?",
      body: "Ask RunRacks AI whether Linux VPS, Windows VPS, or Admin RDP fits the workload you just read about.",
      ctaLabel: "Try RunRacks AI",
      href: "/ai" as Route,
      imageSrc: "/media/customer-stories/demo-02/portrait.jpg",
      imageAlt: DEMO_WORKSPACE_ALT,
    },
  ] satisfies readonly SupportCtaCard[],
} as const;
