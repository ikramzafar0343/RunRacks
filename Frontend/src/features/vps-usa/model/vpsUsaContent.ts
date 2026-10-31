/**
 * VPS Hosting in USA — marketing copy only.
 * Region name matches catalog: United States (id: us). No invented cities/SLAs.
 */
import type { Route } from "next";
import type { WorldMapDot } from "@/components/ui/map";
import type { SupportCtaCard } from "@/features/support-cta/model/supportCtaContent";
import type { FaqItem } from "@/features/vps-faq/model/faqContent";
import {
  DEMO_PRICING_ANSWER,
  OTHER_REGIONS_ANSWER,
  USA_REGION_ANSWER,
} from "@/shared/content/demoPricingCopy";

/** Catalog pin geometry for United States (same hub as network map). */
const US_PIN = { lat: 40.7128, lng: -74.006 } as const;
const ARC_ENDS = [
  { lat: 52.3676, lng: 4.9041 },
  { lat: 1.3521, lng: 103.8198 },
  { lat: -33.8688, lng: 151.2093 },
] as const;

export const VPS_USA_MAP_DOTS: readonly WorldMapDot[] = ARC_ENDS.map(
  (end, i) => ({
    start: {
      lat: US_PIN.lat,
      lng: US_PIN.lng,
      ...(i === 0
        ? {
            label: "United States",
            flagCode: "us",
            labelDx: 8,
            labelDy: -28,
          }
        : {}),
    },
    end: { lat: end.lat, lng: end.lng },
  }),
);

export const VPS_USA = {
  metaTitle: "Linux VPS in the United States | RunRacks",
  metaDescription:
    "Linux VPS plans filtered to the United States catalog region—NVMe storage, root access, and labeled demo pricing.",
  hero: {
    brand: "RunRacks",
    title: "Linux VPS for the United States region",
    lead: "Start on the US catalog location, compare NVMe tiers with full root access, and switch regions anytime in the filters.",
    primaryCta: { label: "View USA plans", href: "#usa-plans" as Route },
    secondaryCta: { label: "All plans", href: "/pricing" as Route },
    disclaimer: "Demo pricing — not live checkout",
    programs: [
      {
        image: "/images/showcase/vps-lead.jpg",
        category: "Sites & stores",
        title: "Ship marketing and storefronts on US plans",
        href: "#usa-plans" as Route,
      },
      {
        image: "/images/showcase/rail-photo-cloud.jpg",
        category: "Apps & APIs",
        title: "Run app servers with clear vCPU and RAM",
        href: "#usa-plans" as Route,
      },
      {
        image: "/images/showcase/rail-photo-operator.jpg",
        category: "Teams",
        title: "Compare plans your operators can act on",
        href: "/pricing" as Route,
      },
      {
        image: "/images/showcase/plans-cover-1200.jpg",
        category: "NVMe",
        title: "Local NVMe listed on every tier",
        href: "#usa-plans" as Route,
      },
      {
        image: "/images/showcase/vps-cover-1200.jpg",
        category: "Root access",
        title: "Administrator control when you launch",
        href: "#usa-plans" as Route,
      },
    ],
  },
  coverage: {
    eyebrow: "Coverage",
    heading: "United States catalog region",
    lead: "Plans open filtered to United States. Change location in the filters whenever you need another region.",
    region: {
      id: "us",
      name: "United States",
      countryCode: "us",
      href: "#usa-plans" as Route,
    },
  },
  story: {
    eyebrow: "How we frame US VPS",
    heading: "Operate from documented specs",
    body: [
      "Start with what must stay fast, who holds root, and which tier leaves headroom for growth.",
      "You get documented resource slices and NVMe tiers—without inventing latency claims or city lists that are not in the catalog.",
    ],
    image: {
      src: "/images/showcase/vps-lead.jpg",
      alt: "RunRacks team reviewing a VPS deployment together at a laptop",
      width: 1024,
      height: 682,
    },
    imageSecondary: {
      src: "/images/showcase/rail-photo-cloud.jpg",
      alt: "Infrastructure photography suggesting cloud operations atmosphere",
      width: 1200,
      height: 800,
    },
  },
  audience: {
    eyebrow: "Who it’s for",
    heading: "Built for operators who ship from the US",
    columns: [
      {
        id: "sites",
        title: "Sites & stores",
        body: "Marketing sites, storefronts, and content platforms that need a stable US region and room to grow beyond shared hosting.",
      },
      {
        id: "apps",
        title: "Apps & APIs",
        body: "Application servers, workers, and APIs that benefit from predictable vCPU and RAM with full control of the guest OS.",
      },
      {
        id: "teams",
        title: "Teams & agencies",
        body: "Studios and product teams that want clear plan cards, demo-labeled pricing, and a direct path to Pricing.",
      },
    ],
  },
  pricing: {
    eyebrow: "USA plans",
    heading: "Linux VPS for the United States",
    lead: "Family is locked to Linux on this page. Location defaults to United States—adjust term or region in the filters below.",
  },
  inclusions: {
    eyebrow: "What’s included",
    heading: "Clarity on every plan card",
    items: [
      {
        id: "root",
        title: "Root / administrator access",
        body: "Install and manage the packages your workload needs, within acceptable-use limits.",
      },
      {
        id: "nvme",
        title: "Local NVMe storage",
        body: "Disk size is listed per tier so you can match databases and media to real capacity.",
      },
      {
        id: "plans",
        title: "Predictable plan choices",
        body: "vCPU, RAM, region, and billing term stay visible—demo prices are labeled until checkout is live.",
      },
      {
        id: "support",
        title: "Engineers when you need them",
        body: "Talk to RunRacks engineers for technical help—not a maze of chatbots.",
      },
    ],
  },
  faq: {
    heading: "USA VPS questions",
    items: [
      {
        id: "us-region",
        question: "What does “United States” mean on this page?",
        answer: USA_REGION_ANSWER,
      },
      {
        id: "family-lock",
        question: "Can I order Windows from this page?",
        answer:
          "This landing locks the Linux VPS family so USA Linux plans stay in focus. Open Windows or Admin RDP product pages, or use Pricing, to compare other families.",
      },
      {
        id: "latency",
        question: "Do you publish US latency or uptime SLAs here?",
        answer:
          "No. This page does not invent latency numbers, compliance badges, or uptime percentages. Compare specs on the plan cards and confirm operational details through Contact or Pricing.",
      },
      {
        id: "root-access",
        question: "Do USA Linux plans include root access?",
        answer:
          "Yes—Linux VPS plans include root access so you can run your own stack. You remain responsible for the guest OS, apps, and access keys.",
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
        heading: "Questions about US-region VPS?",
        body: "Talk to RunRacks engineers about plan fit, root access, and moving workloads onto a United States location.",
        emphasis: "engineers",
        ctaLabel: "Let's talk",
        href: "/pricing" as Route,
        imageSrc: "/media/customer-stories/demo-01/portrait.jpg",
        imageAlt:
          "Demo portrait of an engineer at a laptop — not a verified staff photo",
      },
      {
        id: "migrate",
        heading: "Migrating Linux VPS into the US region?",
        body: "Size root-access Linux tiers for United States locations, confirm NVMe and vCPU fit, then continue on Pricing with USA already in focus.",
        ctaLabel: "Chat with us",
        href: "/ai" as Route,
        imageSrc: "/media/customer-stories/demo-02/portrait.jpg",
        imageAlt: "Demo portrait in a workspace — not a verified staff photo",
      },
    ] satisfies readonly SupportCtaCard[],
  },
} as const;
