/**
 * Windows Hosting in USA — marketing copy only.
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
export const WINDOWS_USA_GLOBE_MARKERS: readonly GlobeMarker[] = [
  { id: "us", location: [40.7128, -74.006], size: 0.065 },
  { id: "nl", location: [52.3676, 4.9041], size: 0.04 },
  { id: "sg", location: [1.3521, 103.8198], size: 0.04 },
  { id: "au", location: [-33.8688, 151.2093], size: 0.04 },
];

export const WINDOWS_USA = {
  metaTitle: "Windows VPS in the United States | RunRacks",
  metaDescription:
    "Windows VPS plans filtered to the United States region—administrator access, NVMe storage, and labeled demo pricing.",
  hero: {
    badge: "Windows VPS · United States",
    title: "Windows VPS for the United States region",
    subtitle:
      "Administrator Windows VPS on NVMe, with the catalog already filtered to United States. Demo prices stay labeled until checkout.",
    primaryCta: {
      label: "View USA Windows plans",
      href: "#windows-usa-plans" as Route,
    },
    secondaryCta: {
      label: "All Windows hosting",
      href: "/products/windows" as Route,
    },
    logosNotice:
      "Illustrative technology marks — not partnership or endorsement claims.",
    logos: approvedBrands.map((b) => ({
      name: b.name,
      src: b.src,
    })),
  },
  pricing: {
    eyebrow: "USA Windows plans",
    heading: "Windows VPS · United States filter",
    lead: "Family stays locked to Windows. Location defaults to United States—change term or region in the filters below.",
  },
  faq: {
    heading: "USA Windows VPS FAQs",
    items: [
      {
        id: "us-region",
        question: "What does “United States” mean on this page?",
        answer: USA_REGION_ANSWER,
      },
      {
        id: "family-lock",
        question: "Can I order Linux from this page?",
        answer:
          "This landing locks the Windows VPS family so USA Windows plans stay in focus. Open Linux VPS or VPS in USA, or use Pricing, to compare other families.",
      },
      {
        id: "admin-access",
        question: "Do USA Windows plans include administrator access?",
        answer:
          "Windows VPS plans include administrator access so you can install and manage the stack your workload needs. You remain responsible for the guest OS, apps, and credentials.",
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
        heading: "Questions about US Windows VPS?",
        body: "Talk to RunRacks engineers about Windows plan fit, administrator access, and running workloads in the United States region.",
        emphasis: "engineers",
        ctaLabel: "Let's talk",
        href: "/pricing" as Route,
        imageSrc: "/media/customer-stories/demo-01/portrait.jpg",
        imageAlt:
          "Demo portrait of an engineer at a laptop — not a verified staff photo",
      },
      {
        id: "migrate",
        heading: "Moving Windows Server workloads to the US?",
        body: "Map IIS roles, vendor installers, and USA region choice before you switch families—then continue on Pricing with Windows tiers in focus.",
        ctaLabel: "Chat with us",
        href: "/ai" as Route,
        imageSrc: "/media/customer-stories/demo-02/portrait.jpg",
        imageAlt: "Demo portrait in a workspace — not a verified staff photo",
      },
    ] satisfies readonly SupportCtaCard[],
  },
} as const;
