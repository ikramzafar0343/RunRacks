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
      metaTitle: "Linux VPS Hosting | RunRacks",
      metaDescription:
        "Linux VPS on local NVMe with full root access. Compare documented plans—demo prices labeled until checkout.",
      defaultFamily: "linux",
      hero: {
        h1: "Linux VPS with full root access",
        support:
          "Documented vCPU, RAM, and NVMe—compare clear Linux plans before you continue to Pricing.",
        ctaLabel: "Explore VPS plans",
        reassurance: "Demo pricing labeled · checkout connects when configured",
      },
      benefits: [
        {
          id: "compute",
          title: "Compute you can size",
          body: "Pick vCPU and RAM that match the workload—illustrative panels are not live telemetry.",
          art: "compute",
        },
        {
          id: "backup",
          title: "Recovery you control",
          body: "You operate backups and restores inside the guest. Storage sizes stay documented per plan.",
          art: "backup",
        },
        {
          id: "manage",
          title: "Familiar remote access",
          body: "SSH into a Linux guest and install the stack your team already knows.",
          art: "terminal",
        },
      ],
      inclusionsHeading: "Every Linux plan includes",
      inclusionsAccent: "the essentials",
      inclusions: SHARED_INCLUSIONS,
      billingDisclosure:
        "Plans are billed for the selected term. Monthly figures divide the term total by months. Demo amounts are labeled until live checkout is configured.",
      workloadsHeading: "Built for real workloads",
      workloadsIntro:
        "Choose a use case to see how Linux VPS fits—then jump to matching plans.",
      workloads: SHARED_WORKLOADS,
      infraHeading: "Regions in the catalog",
      capsHeading: "Linux VPS capabilities",
      capsSubheading: "What you work with on RunRacks Linux VPS",
      capabilities: SHARED_CAPS,
      convertHeading: "Find a Linux VPS that fits",
      convertSupport:
        "Compare Linux tiers with Windows and Admin RDP using the same catalog filters.",
      convertCta: "Compare plans",
    },
    windows: {
      key: "windows",
      metaTitle: "Windows VPS Hosting | RunRacks",
      metaDescription:
        "Windows VPS with administrator access and NVMe storage. Compare clear plan choices—demo prices labeled until checkout.",
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
          title: "Sized for Windows workloads",
          body: "Plans list vCPU and RAM for Windows Server apps—decorative charts are not live telemetry.",
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
          title: "Administrator access",
          body: "Install roles, runtimes, and tools through administrator access on the Windows guest.",
          art: "terminal",
        },
      ],
      inclusionsHeading: "Every Windows plan includes",
      inclusionsAccent: "the essentials",
      inclusions: SHARED_INCLUSIONS,
      billingDisclosure:
        "Plans are billed for the selected term. Monthly figures divide the term total by months. Demo amounts are labeled until live checkout is configured.",
      workloadsHeading: "Windows-friendly workloads",
      workloadsIntro:
        "From app servers to admin tools—filter the catalog to Windows when you compare.",
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
