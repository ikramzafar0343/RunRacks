/**
 * Windows USA editorial showcase — four hosting slides (static).
 */
import type { Route } from "next";

export type WindowsUsaShowcaseSlide = {
  id: string;
  title: string;
  description: string;
  detailsHref: Route | (string & {});
  capabilities: readonly string[];
  /** Local public asset only. */
  mediaSrc: string;
  mediaAlt: string;
};

export const WINDOWS_USA_SHOWCASE = {
  eyebrow: "Windows",
  heading: "Windows VPS",
  badgeName: "Windows",
  badgeBrand: "RUNRACKS",
  watermark: "Windows",
  ctaLabel: "View Details",
} as const;

export const WINDOWS_USA_SHOWCASE_SLIDES: readonly WindowsUsaShowcaseSlide[] = [
  {
    id: "plans",
    title: "Windows VPS plans",
    description:
      "Compare Windows tiers with clear vCPU, RAM, and local NVMe on every card—demo prices labeled so you can shortlist before you get started.",
    detailsHref: "#windows-usa-plans",
    capabilities: [
      "vCPU & RAM",
      "Local NVMe",
      "Billing terms",
      "Demo-labeled prices",
      "Plan filters",
      "Compare tiers",
    ],
    mediaSrc: "/images/showcase/windows-cover-1200.jpg",
    mediaAlt: "Windows hosting cover photography for plan comparison",
  },
  {
    id: "access",
    title: "Administrator access",
    description:
      "Full administrator access where the Windows family allows—install your stack, manage the guest, and keep credentials under your control.",
    detailsHref: "/products/windows",
    capabilities: [
      "Full admin where allowed",
      "Install your stack",
      "You manage the guest",
      "RDP-ready families",
      "Secure credentials",
    ],
    mediaSrc: "/images/product-hosting/windows-hero-portrait.webp",
    mediaAlt: "Windows VPS portrait scene suggesting administrator access",
  },
  {
    id: "region",
    title: "United States region",
    description:
      "This page opens on the United States catalog location—same plan language as every region, with filters ready if you need another hub.",
    detailsHref: "#windows-usa-plans",
    capabilities: [
      "Catalog location us",
      "Same plan language",
      "Switch regions in filters",
      "Peer hubs available",
      "Clear region cards",
    ],
    mediaSrc: "/images/showcase/rail-photo-cloud.jpg",
    mediaAlt:
      "Infrastructure photography suggesting cloud operations atmosphere",
  },
  {
    id: "support",
    title: "Engineer help",
    description:
      "Talk to humans who run the fleet—migration guidance and support when you need it, with a clear path into RunRacks.",
    detailsHref: "/pricing",
    capabilities: [
      "Humans who run the fleet",
      "Migration guidance",
      "Support when you need it",
      "View plans",
      "No chatbot maze",
    ],
    mediaSrc: "/images/showcase/rail-photo-operator.jpg",
    mediaAlt: "Operator at work — illustrative support atmosphere photo",
  },
] as const;

export const SHOWCASE_AUTOPLAY_MS = 7000;
