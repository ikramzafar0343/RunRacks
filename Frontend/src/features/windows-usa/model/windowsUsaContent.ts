/**
 * Windows Hosting in USA — marketing copy only.
 * Region matches catalog: United States (id: us). No invented SLAs.
 */
import type { Route } from "next";
import type { GlobeMarker } from "@/components/ui/cobe-globe-analytics";
import { approvedBrands } from "@/features/home/model/brandsContent";
import type { SupportCtaCard } from "@/features/support-cta/model/supportCtaContent";
import type { FaqItem } from "@/features/vps-faq/model/faqContent";

/** Catalog hubs for the hero Cobe globe (US focus + peer regions). */
export const WINDOWS_USA_GLOBE_MARKERS: readonly GlobeMarker[] = [
  { id: "us", location: [40.7128, -74.006], size: 0.065 },
  { id: "nl", location: [52.3676, 4.9041], size: 0.04 },
  { id: "sg", location: [1.3521, 103.8198], size: 0.04 },
  { id: "au", location: [-33.8688, 151.2093], size: 0.04 },
];

export const WINDOWS_USA = {
  metaTitle: "Windows VPS Hosting in the United States",
  metaDescription:
    "Run Windows VPS plans in the United States — administrator access, NVMe storage, and clear demo pricing from RunRacks.",
  hero: {
    badge: "Windows VPS · United States",
    title: "Windows VPS hosting in the United States",
    subtitle:
      "Administrator access, NVMe plan cards, and a United States catalog region—compare honest demo pricing before you get started.",
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
    heading: "Windows VPS for the United States",
    lead: "Family is locked to Windows on this page. Location defaults to United States—adjust term or region in the filters below.",
  },
  faq: {
    heading: "USA Windows VPS questions",
    items: [
      {
        id: "us-region",
        question: "What does “United States” mean on this page?",
        answer:
          "United States is the catalog region id `us`. Plans shown here default to that location. Exact facility cities are not listed as marketing claims—use the plan filters and Pricing for the current real options.",
      },
      {
        id: "family-lock",
        question: "Can I order Linux from this page?",
        answer:
          "This landing locks the Windows VPS family so USA Windows plans stay in focus. Open the Linux VPS or VPS in USA pages, or use Pricing, to compare other families.",
      },
      {
        id: "admin-access",
        question: "Do USA Windows plans include administrator access?",
        answer:
          "Windows VPS plans are framed with administrator access so you can install and manage the stack your workload needs. You remain responsible for the guest OS, apps, and access credentials.",
      },
      {
        id: "pricing-demo",
        question: "Is the pricing live checkout?",
        answer:
          "Catalog prices are demo labels for comparison until backend billing is configured. Use Pricing or talk to engineers to continue with the current real flow.",
      },
      {
        id: "other-regions",
        question: "Can I still choose another region?",
        answer:
          "Yes. Location filters on the plans section include every catalog region. This page simply starts you on United States.",
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
        heading: "Moving Windows workloads to the US?",
        body: "We can walk you through plan choices and admin access so your move onto RunRacks stays clear—from demo tiers to Pricing.",
        ctaLabel: "Chat with us",
        href: "/ai" as Route,
        imageSrc: "/media/customer-stories/demo-02/portrait.jpg",
        imageAlt: "Demo portrait in a workspace — not a verified staff photo",
      },
    ] satisfies readonly SupportCtaCard[],
  },
} as const;
