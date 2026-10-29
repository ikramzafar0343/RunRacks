/**
 * Admin RDP USA interactive benefits — typed tab content.
 * Honest product framing; no invented SLAs or PoP counts.
 */

export type BenefitFeature = {
  title: string;
  description: string;
};

export type BenefitTabId =
  "scalability" | "worldwide" | "dedicated" | "managed";

export type BenefitTab = {
  id: BenefitTabId;
  tabLabel: string;
  panelTitle: string;
  illustrationSrc: string;
  illustrationAlt: string;
  features: [BenefitFeature, BenefitFeature, BenefitFeature];
};

export const ADMIN_RDP_BENEFITS_HEADING =
  "More reasons to choose Admin RDP\nin the United States";

export const ADMIN_RDP_BENEFITS_TABS: readonly BenefitTab[] = [
  {
    id: "scalability",
    tabLabel: "Seamless Scalability",
    panelTitle: "Seamless Scalability",
    illustrationSrc: "/assets/vps-benefits/seamless-scalability.svg",
    illustrationAlt:
      "Illustration of Admin RDP resources with cloud, SSD, CPU, and RAM controls",
    features: [
      {
        title: "Scale As You Go",
        description:
          "As your remote desktop workloads grow, move to a higher Admin RDP plan with more RAM, CPU, and NVMe disk from the catalog.",
      },
      {
        title: "Upgrade When You Need",
        description:
          "Compare USA Admin RDP tiers on this page, then continue through Pricing when you are ready to change plan resources.",
      },
      {
        title: "Clear Provisioning Path",
        description:
          "Resource changes follow the real plan and provisioning flow—not a marketing guarantee of zero interruption. Use filters and Pricing for the current options.",
      },
    ],
  },
  {
    id: "worldwide",
    tabLabel: "Worldwide Server Locations",
    panelTitle: "Worldwide Server Locations",
    illustrationSrc: "/assets/vps-benefits/worldwide-server-locations.svg",
    illustrationAlt:
      "Illustration of a globe with region nodes for catalog hosting locations",
    features: [
      {
        title: "Start in the United States",
        description:
          "This page defaults the catalog to the United States region so USA Admin RDP plans stay in focus from the first view.",
      },
      {
        title: "Other Catalog Regions",
        description:
          "Need another region later? Location filters on the plans section include every catalog region without leaving the product flow.",
      },
      {
        title: "Resilient Connectivity Framing",
        description:
          "Choose a region that matches where you and your team work. We do not invent PoP counts or latency numbers in marketing copy.",
      },
    ],
  },
  {
    id: "dedicated",
    tabLabel: "Dedicated Resources",
    panelTitle: "Dedicated Environment",
    illustrationSrc: "/assets/vps-benefits/dedicated-resources.svg",
    illustrationAlt:
      "Illustration of a dedicated server chassis with CPU and RAM tiles",
    features: [
      {
        title: "Built for Admin Workloads",
        description:
          "Admin RDP plans are framed for desktop-style administrator access with predictable plan resources—not basic shared hosting contention.",
      },
      {
        title: "Fast NVMe Storage",
        description:
          "Plan cards highlight NVMe storage so file access stays responsive for apps and tools you run inside the guest OS.",
      },
      {
        title: "Your Plan’s RAM and CPU",
        description:
          "Each tier lists allocated RAM and processing capacity so you can compare what you get before you continue to Pricing.",
      },
    ],
  },
  {
    id: "managed",
    tabLabel: "Fully Managed",
    panelTitle: "Fully Managed",
    illustrationSrc: "/assets/vps-benefits/fully-managed.svg",
    illustrationAlt:
      "Illustration of a security shield with monitoring and updates tiles",
    features: [
      {
        title: "Less Routine Overhead",
        description:
          "Focus on your desktop and apps while RunRacks helps with plan fit and the hosting environment around your Admin RDP instance.",
      },
      {
        title: "Support When You Need It",
        description:
          "Talk with engineers about Admin RDP access, USA region choice, and next steps through Pricing or chat—without invented response-time SLAs.",
      },
      {
        title: "Steady Operational Help",
        description:
          "Get clear guidance on keeping your remote desktop workspace stable as you move from demo pricing into the real onboarding flow.",
      },
    ],
  },
] as const;

export const ADMIN_RDP_BENEFITS_DEFAULT_TAB: BenefitTabId = "scalability";
