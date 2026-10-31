/**
 * Admin RDP in USA — marketing copy only.
 * Region matches catalog: United States (id: us). No invented SLAs.
 */
import type { Route } from "next";
import type { GlobeMarker } from "@/components/ui/cobe-globe-analytics";
import { approvedBrands } from "@/features/home/model/brandsContent";
import type { SupportCtaCard } from "@/features/support-cta/model/supportCtaContent";
import type { FaqItem } from "@/features/vps-faq/model/faqContent";
import {
  DEMO_PRICING_ANSWER,
  OTHER_REGIONS_ANSWER,
  USA_REGION_ANSWER,
} from "@/shared/content/demoPricingCopy";

/** Catalog hubs for the hero Cobe globe (US focus + peer regions). */
export const ADMIN_RDP_USA_GLOBE_MARKERS: readonly GlobeMarker[] = [
  { id: "us", location: [40.7128, -74.006], size: 0.065 },
  { id: "nl", location: [52.3676, 4.9041], size: 0.04 },
  { id: "sg", location: [1.3521, 103.8198], size: 0.04 },
  { id: "au", location: [-33.8688, 151.2093], size: 0.04 },
];

export const ADMIN_RDP_USA = {
  metaTitle: "Admin RDP in the United States | RunRacks",
  metaDescription:
    "Admin RDP plans filtered to the United States region—full administrator desktops, NVMe storage, and labeled demo pricing.",
  hero: {
    badge: "Admin RDP · United States",
    title: "Admin RDP for the United States region",
    subtitle:
      "Windows remote desktops with full administrator rights, prefiltered to the US catalog location. Demo prices stay labeled until checkout.",
    primaryCta: {
      label: "View USA Admin RDP plans",
      href: "#admin-rdp-usa-plans" as Route,
    },
    secondaryCta: {
      label: "All Admin RDP hosting",
      href: "/products/admin-rdp" as Route,
    },
    logosNotice:
      "Illustrative technology marks — not partnership or endorsement claims.",
    logos: approvedBrands.map((b) => ({
      name: b.name,
      src: b.src,
    })),
  },
  faq: {
    heading: "USA Admin RDP FAQs",
    items: [
      {
        id: "us-region",
        question: "What does “United States” mean on this page?",
        answer: USA_REGION_ANSWER,
      },
      {
        id: "family-lock",
        question: "How is Admin RDP different from Windows VPS on this site?",
        answer:
          "This landing locks the Admin RDP family so USA remote-desktop plans stay in focus. Open Windows VPS or Windows in USA for the Windows VPS family, or use Pricing to compare all families.",
      },
      {
        id: "admin-access",
        question: "Do USA Admin RDP plans include administrator access?",
        answer:
          "Admin RDP plans include full administrator access for desktop-style remote work. You remain responsible for the guest OS, apps, and credentials.",
      },
      {
        id: "pricing-demo",
        question: "Is the pricing live checkout?",
        answer: DEMO_PRICING_ANSWER,
      },
      {
        id: "other-regions",
        question: "Can I still choose another region?",
        answer: OTHER_REGIONS_ANSWER,
      },
    ] satisfies readonly FaqItem[],
  },
  supportCta: {
    cards: [
      {
        id: "support",
        heading: "Questions about US Admin RDP?",
        body: "Talk to RunRacks engineers about Admin RDP plan fit, administrator access, and running remote desktops in the United States region.",
        emphasis: "engineers",
        ctaLabel: "Let's talk",
        href: "/pricing" as Route,
        imageSrc: "/media/customer-stories/demo-01/portrait.jpg",
        imageAlt:
          "Demo portrait of an engineer at a laptop — not a verified staff photo",
      },
      {
        id: "migrate",
        heading: "Moving operator desktops to USA Admin RDP?",
        body: "Size Admin RDP tiers for support desks or agency sessions in the United States region, then continue on Pricing without mixing in Windows VPS server plans.",
        ctaLabel: "Chat with us",
        href: "/ai" as Route,
        imageSrc: "/media/customer-stories/demo-02/portrait.jpg",
        imageAlt: "Demo portrait in a workspace — not a verified staff photo",
      },
    ] satisfies readonly SupportCtaCard[],
  },
} as const;
