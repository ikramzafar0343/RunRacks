/**
 * Product hosting page copy — keyed by product. No fabricated metrics.
 */
export type {
  BenefitCard,
  Capability,
  CapabilityIcon,
  ProductHostingContent,
  ProductHostingKey,
  WorkloadItem,
} from "./productHostingTypes";

import {
  SHARED_CAPS,
  SHARED_INCLUSIONS,
  SHARED_WORKLOADS,
} from "./productHostingShared";
import type {
  ProductHostingContent,
  ProductHostingKey,
} from "./productHostingTypes";

export const PRODUCT_HOSTING: Record<ProductHostingKey, ProductHostingContent> =
  {
    vps: {
      key: "vps",
      metaTitle: "VPS Hosting",
      metaDescription:
        "NVMe VPS with full root access, clear plans, and predictable performance from RunRacks.",
      defaultFamily: "linux",
      hero: {
        h1: "VPS hosting built for your next move",
        support:
          "Configurable compute, storage, and full root access—compare clear plans before you deploy.",
        ctaLabel: "Explore VPS plans",
        reassurance: "Demo pricing labeled · checkout connects when configured",
      },
      benefits: [
        {
          id: "compute",
          title: "Compute you can size",
          body: "Pick vCPU and RAM that match the workload—illustrative panels show the idea, not live metrics.",
          art: "compute",
        },
        {
          id: "backup",
          title: "Recovery you control",
          body: "You operate backups and restores inside the guest. We keep plan storage and access clear.",
          art: "backup",
        },
        {
          id: "manage",
          title: "Straightforward management",
          body: "SSH or RDP into a familiar environment and install the stack your team already knows.",
          art: "terminal",
        },
      ],
      inclusionsHeading: "Every plan has",
      inclusionsAccent: "everything you need",
      inclusions: SHARED_INCLUSIONS,
      billingDisclosure:
        "All plans are paid for the selected term. The monthly rate reflects the total plan price divided by the number of months. Demo amounts are labeled until live checkout is configured.",
      workloadsHeading: "Built for real workloads",
      workloadsIntro:
        "Choose a use case to see how RunRacks VPS fits—then jump to plans that match.",
      workloads: SHARED_WORKLOADS,
      infraHeading: "Regions in the catalog",
      capsHeading: "Server capabilities",
      capsSubheading: "What you get to work with on RunRacks VPS",
      capabilities: SHARED_CAPS,
      convertHeading: "Build on a VPS that fits your workload",
      convertSupport:
        "Compare Linux, Windows, and Admin RDP plans with the same clear specs.",
      convertCta: "Compare plans",
    },
    windows: {
      key: "windows",
      metaTitle: "Windows VPS Hosting",
      metaDescription:
        "Windows-ready VPS with administrator access, NVMe storage, and clear plan choices from RunRacks.",
      defaultFamily: "windows",
      hero: {
        h1: "Windows VPS with full administrator access.",
        lines: ["Windows VPS with", "full administrator access."],
        support: "",
        priceLeadIn: "From",
        ctaLabel: "View plans",
        reassurance: "Demo pricing · checkout when configured",
      },
      benefits: [
        {
          id: "compute",
          title: "Windows-sized compute",
          body: "Plans list vCPU and RAM for Windows Server workloads—decorative charts are not live telemetry.",
          art: "compute",
        },
        {
          id: "backup",
          title: "Your recovery process",
          body: "Operate Windows backups and restores yourself. Storage sizes are documented per plan.",
          art: "backup",
        },
        {
          id: "manage",
          title: "Administrator RDP when you need it",
          body: "Windows and Admin RDP families give desktop-style access for the tools your team already uses.",
          art: "terminal",
        },
      ],
      inclusionsHeading: "Every plan has",
      inclusionsAccent: "everything you need",
      inclusions: SHARED_INCLUSIONS,
      billingDisclosure:
        "All plans are paid for the selected term. The monthly rate reflects the total plan price divided by the number of months. Demo amounts are labeled until live checkout is configured.",
      workloadsHeading: "Windows-friendly workloads",
      workloadsIntro:
        "From app servers to admin desktops—filter plans to Windows or Admin RDP when you compare.",
      workloads: SHARED_WORKLOADS,
      infraHeading: "Regions in the catalog",
      capsHeading: "Windows VPS capabilities",
      capsSubheading: "Control and clarity for Microsoft-oriented stacks",
      capabilities: SHARED_CAPS,
      convertHeading: "Find a Windows plan that fits",
      convertSupport:
        "Compare Windows VPS and Admin RDP tiers with the same honest demo labels.",
      convertCta: "Compare Windows plans",
    },
  };
