/**
 * Editable homepage hero copy and visual asset.
 * Keep marketing claims truthful; no invented guarantees or metrics.
 */

export type HeroTrustBandContent = {
  label: string;
  /** 0–5, supports halves (e.g. 4.5) */
  score: number;
  /** e.g. "reviews on" — do not invent review counts */
  reviewsLabel: string;
  brand: string;
  /** Set when a real Trustpilot profile URL exists */
  href: string | null;
  /** Required when score is demo / unverified */
  notice: string;
};

export type HeroContent = {
  headlineLine1: string;
  headlineLine2: string;
  description: string;
  ctaLabel: string;
  ctaHref: "/pricing";
  trust: string;
  visualSrc: "/home/hero-portrait.webp";
  visualAlt: string;
  trustBand: HeroTrustBandContent;
};

export const heroContent: HeroContent = {
  headlineLine1: "Your idea, online.",
  headlineLine2: "Made easy.",
  description:
    "One platform to build, launch, manage, and grow your presence online — all in one place.",
  ctaLabel: "View plans",
  ctaHref: "/pricing",
  trust: "Designed to help you launch with confidence.",
  visualSrc: "/home/hero-portrait.webp",
  visualAlt:
    "Person holding a laptop, ready to bring an idea online with RunRacks.",
  trustBand: {
    label: "Excellent",
    score: 4.5,
    reviewsLabel: "reviews on",
    brand: "Trustpilot",
    href: null,
    notice: "Demo rating — not a verified Trustpilot score",
  },
};
