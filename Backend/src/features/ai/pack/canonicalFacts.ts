/**
 * Public-snapshot canonical facts — honesty gates, not live billing truth.
 */
import { readFileSync } from "node:fs";
import { resolvePackFile } from "./packPaths.js";

export type CanonicalFacts = {
  brand: string;
  snapshot_date: string;
  authority: string;
  product_families: string[];
  catalog_regions: string[];
  demo_pricing: {
    status: string;
    orderable: boolean;
    reason: string;
    sources: string[];
  };
  ai_backend: { status: string; source: string };
  contact_inbox: { status: string; source: string };
  legal_documents: {
    privacy: string;
    terms: string;
    refund: string;
    sources: string[];
  };
  backup_included: {
    status: string;
    evidence: string[];
    customer_safe_claim: string;
  };
  numeric_claims: Record<string, string>;
  competitor_comparison: {
    brand: string;
    terms_conflict: Record<string, string>;
    free_domain_conflict: Record<string, string>;
    source_urls: string[];
  };
};

let cached: CanonicalFacts | null = null;

export function getCanonicalFacts(): CanonicalFacts {
  if (cached) return cached;
  const raw = readFileSync(resolvePackFile("runracks_canonical_facts.json"), "utf8");
  cached = JSON.parse(raw) as CanonicalFacts;
  return cached;
}

export function isDemoPricingOrderable(): boolean {
  return getCanonicalFacts().demo_pricing.orderable;
}

export function demoPricingReason(): string {
  return getCanonicalFacts().demo_pricing.reason;
}

export function backupCustomerSafeClaim(): string {
  return getCanonicalFacts().backup_included.customer_safe_claim;
}

export function isBackupConflicted(): boolean {
  return getCanonicalFacts().backup_included.status === "conflicted";
}

export function isLegalPending(
  kind: "privacy" | "terms" | "refund" = "terms",
): boolean {
  return getCanonicalFacts().legal_documents[kind] === "pending";
}

export function competitorBrand(): string {
  return getCanonicalFacts().competitor_comparison.brand;
}

export function policyBackupReply(): string {
  return `Backup ${backupCustomerSafeClaim().toLowerCase()}. I will not invent inclusion, retention, or cost. Confirm on Pricing or Contact once billing terms are finalized.`;
}

export function policyLegalPendingReply(): string {
  return "RunRacks terms, privacy, and refund pages are still pending legal review. I will not claim a refund guarantee or finished legal terms. Use Contact for official confirmation.";
}

export function demoNotOrderableReply(): string {
  return `${demoPricingReason()}. Listed amounts are demo until billing and checkout are connected — I cannot confirm a purchase or invent an order. Open Pricing for labeled amounts, or Contact for a quote.`;
}

export function competitorPolicyBlockReply(): string {
  const brand = competitorBrand();
  return `${brand} policies are benchmark-only and are not RunRacks terms. I will not transfer competitor refund, domain, or renewal claims onto RunRacks. Confirm RunRacks terms when they are published, or use Contact.`;
}
