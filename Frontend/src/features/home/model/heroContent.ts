/**
 * Homepage hero copy — RunRacks hosting positioning.
 * Keep marketing claims truthful; no invented guarantees or metrics.
 */
import type { Route } from "next";
import { TRY_AI_CTA } from "@/shared/config/navConfig";

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
  aiCta: { label: string; href: Route };
  trust: string;
  visualSrc: "/home/hero-portrait.webp";
  visualAlt: string;
  trustBand: HeroTrustBandContent;
};

export const heroContent: HeroContent = {
  headlineLine1: "NVMe hosting.",
  headlineLine2: "Root when you need it.",
  description:
    "Linux VPS, Windows VPS, and Admin RDP with clear plan specs, global regions, and administrator access—compare honest demo pricing until checkout is live.",
  ctaLabel: "View plans",
  ctaHref: "/pricing",
  aiCta: { label: TRY_AI_CTA.label, href: TRY_AI_CTA.href },
  trust: "Sized for workloads that need control—not shared-hosting limits.",
  visualSrc: "/home/hero-portrait.webp",
  visualAlt:
    "Person with a laptop reviewing RunRacks hosting plans and infrastructure.",
  trustBand: {
    label: "Excellent",
    score: 4.5,
    reviewsLabel: "reviews on",
    brand: "Trustpilot",
    href: null,
    notice: "Demo rating — not a verified Trustpilot score",
  },
};
