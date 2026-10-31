/**
 * Admin RDP USA — post-pricing clarity strip (headline + 4 cards).
 * Honest product framing; no invented SLAs.
 */

export type ClarityFeatureIcon = "access" | "dashboard" | "insights";

export type ClarityFeatureCard = {
  id: ClarityFeatureIcon;
  title: string;
  body: string;
  tone: "brand" | "mid" | "soft";
};

export const ADMIN_RDP_USA_CLARITY = {
  headingId: "admin-rdp-usa-clarity-heading",
  /** Segments for accent highlights — keep order for the sentence. */
  heading: {
    before: "Operate ",
    accentA: "Admin RDP",
    mid: " in the United States with documented plans, NVMe storage, and a ",
    accentB: "full administrator desktop",
    after: " in one catalog.",
  },
  visual: {
    src: "/images/admin-rdp/float-01.webp",
    alt: "Windows Admin RDP server stack illustration",
  },
  features: [
    {
      id: "access",
      title: "Full administrator access",
      body: "Desktop-style Admin RDP with the keys you need to install tools, manage services, and keep credentials under your control.",
      tone: "brand",
    },
    {
      id: "dashboard",
      title: "United States catalog focus",
      body: "This page defaults to the US region so USA Admin RDP plans stay easy to compare—switch regions anytime in the filters.",
      tone: "mid",
    },
    {
      id: "insights",
      title: "Clear plan insights",
      body: "vCPU, RAM, and NVMe are listed on every tier. Demo prices stay labeled until real checkout is configured.",
      tone: "soft",
    },
  ] satisfies readonly ClarityFeatureCard[],
} as const;
