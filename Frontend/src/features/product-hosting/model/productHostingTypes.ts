/**
 * Product hosting page — content types.
 */
import type { VpsFamily } from "@/features/vps-pricing/model/types";

export type ProductHostingKey = "vps" | "windows";

export type BenefitCard = {
  id: string;
  title: string;
  body: string;
  art: "compute" | "backup" | "terminal";
};

export type WorkloadItem = {
  id: string;
  label: string;
  /** Idle card title lines (exactly two). */
  idleLines: readonly [string, string];
  title: string;
  description: string;
  benefits: readonly string[];
  /** Approved brand ids for illustrative tool marks. */
  toolIds: readonly string[];
  /** Tilted preview shown when the card is active (company-rail style). */
  preview: {
    src: string;
    objectPosition?: string;
  };
};

export type ProductHostingContent = {
  key: ProductHostingKey;
  metaTitle: string;
  metaDescription: string;
  defaultFamily: VpsFamily;
  hero: {
    h1: string;
    support: string;
    ctaLabel: string;
    reassurance: string;
    /** Windows split-hero title lines (masked reveal). */
    lines?: readonly string[];
    badge?: string;
    features?: readonly string[];
    priceLeadIn?: string;
  };
  benefits: readonly BenefitCard[];
  inclusionsHeading: string;
  /** Accent phrase inside the inclusions heading (Hostinger-style). */
  inclusionsAccent: string;
  inclusions: readonly string[];
  billingDisclosure: string;
  workloadsHeading: string;
  workloadsIntro: string;
  workloads: readonly WorkloadItem[];
  infraHeading: string;
  convertHeading: string;
  convertSupport: string;
  convertCta: string;
};
