/**
 * Hosting feature showcase — card and section contracts.
 */
import type { Route } from "next";

export type FeatureCardId = "offers" | "vps" | "windows" | "rdp";

export type FeatureCardTheme = "red" | "violet" | "slate" | "night";

export type FeatureCard = {
  id: FeatureCardId;
  label: string;
  title: string;
  teaser: string;
  description: string;
  ctaLabel: string;
  href: Route;
  imageSrc: string;
  imageAlt: string;
  imagePosition: string;
  /** Optional muted loop cover (plays on all cards; no still poster). */
  videoSrc?: string;
  /** Loop only the first N seconds of `videoSrc` (inclusive cap). */
  videoMaxSeconds?: number;
  theme: FeatureCardTheme;
  verifiedOfferText?: string;
};

export type ShowcaseIntro = {
  eyebrow: string;
  headingLine1: string;
  headingLine2: string;
  supporting: string;
  ctaLabel: string;
  ctaHref: Route;
};
