/**
 * Explainable recommendation helpers — no silent constraint changes.
 */
import type { ConversationStateV1 } from "../types/state.js";
import type { CatalogFreshness } from "../types/turn.js";
import { getDatacenterAdvice } from "../catalog/locationAdvisor.js";

export type PlanCandidate = {
  id: string;
  name: string;
  family: string;
  priceLabel?: string;
  amountMinor?: number | null;
};

export type RecommendResult = {
  primary: PlanCandidate | null;
  alternatives: PlanCandidate[];
  reason: string;
  blockedReason?: string;
};

export function filterAndRankPlans(
  state: ConversationStateV1,
  candidates: PlanCandidate[],
  freshness: CatalogFreshness,
): RecommendResult {
  if (freshness === "empty" || freshness === "unavailable" || candidates.length === 0) {
    return {
      primary: null,
      alternatives: [],
      reason: "No verified plan list is available right now.",
      blockedReason: "catalog_unavailable",
    };
  }

  let pool = [...candidates];
  if (state.osExcluded.includes("windows")) {
    pool = pool.filter((p) => !/windows|rdp/i.test(p.family + p.name));
  }
  if (state.osExcluded.includes("linux")) {
    pool = pool.filter((p) => !/linux|vps/i.test(p.family) || /windows|rdp/i.test(p.family));
  }
  if (state.osPreference === "linux") {
    pool = pool.filter((p) => /vps|linux/i.test(p.family) && !/windows|rdp/i.test(p.family));
  }
  if (state.osPreference === "windows" || state.workload === "remote_desktop") {
    pool = pool.filter((p) => /windows|rdp/i.test(p.family + p.name));
  }

  const hasBudget =
    state.budgetAmount != null && state.budgetCurrency === "USD";
  if (hasBudget) {
    const maxMinor = Math.round(state.budgetAmount! * 100);
    pool = pool.filter(
      (p) => typeof p.amountMinor === "number" && p.amountMinor <= maxMinor,
    );
  }

  if (pool.length === 0) {
    return {
      primary: null,
      alternatives: [],
      reason: hasBudget
        ? freshness === "demo"
          ? `No demo plan is at or under $${state.budgetAmount}/mo. Raise the budget or open Pricing.`
          : `No verified plan is at or under $${state.budgetAmount}/mo. Raise the budget or open Pricing.`
        : freshness === "demo"
          ? "No demo plan matches your hard requirements."
          : "No verified plan matches your hard requirements.",
      blockedReason: "no_match",
    };
  }

  pool.sort((a, b) => {
    const pa = a.amountMinor ?? Number.MAX_SAFE_INTEGER;
    const pb = b.amountMinor ?? Number.MAX_SAFE_INTEGER;
    if (pa !== pb) return pa - pb;
    return a.name.localeCompare(b.name);
  });

  // Budget browse lists every matching plan; other flows keep a short shortlist.
  const alternatives = hasBudget ? pool.slice(1) : pool.slice(1, 3);

  return {
    primary: pool[0]!,
    alternatives,
    reason: hasBudget
      ? freshness === "demo"
        ? `All labeled demo plans at or under $${state.budgetAmount}/mo, cheapest first.`
        : `All verified plans at or under $${state.budgetAmount}/mo, cheapest first.`
      : freshness === "demo"
        ? "Ranked from the labeled demo catalog, then name."
        : "Ranked by verified price fit, then name.",
  };
}

/** True when the user is asking to list plans for a stated budget. */
export function isBudgetBrowseQuery(matching: string): boolean {
  const m = matching.toLowerCase();
  return (
    /\bbudget\b/.test(m) ||
    /\b(under|below|within|up\s*to|upto|max(?:imum)?)\b/.test(m) ||
    /\b(show|list|all)\b.{0,24}\bplans?\b/.test(m) ||
    /\bplans?\b.{0,24}\b(under|within|for|in)\b/.test(m) ||
    /\b\d+(?:\.\d+)?\s*(?:usd|dollars?)\b/.test(m) ||
    /\$\s*\d+/.test(m)
  );
}

export function discoverPrompt(state: ConversationStateV1): {
  text: string;
  chips: { id: string; label: string }[];
  templateId: string;
} {
  const advice = getDatacenterAdvice(
    state.unresolvedLocationMention ?? state.userLocation,
  );

  const loc = advice
    ? ` ${advice.adviceText} RunRacks offers three hosting types: Linux VPS (full root access from $4.49/mo), Windows VPS (dedicated Windows Server from $8.99/mo), and Admin RDP (remote desktop from $10.99/mo) — each with 30 TB high-speed traffic, NVMe SSD, and DDoS protection.`
    : state.unresolvedLocationMention
      ? ` You mentioned ${state.unresolvedLocationMention} — we’ll treat that as a location note until you say whether it’s where you are, where visitors are, or where the server should live.`
      : "";

  if (state.language === "roman_urdu") {
    const urduLoc = advice
      ? ` ${advice.countryName} ke liye hum ${advice.recommendedDatacenters} recommend karte hain taake latency aur ping kam se kam rahe. Hum Linux VPS ($4.49/mo), Windows VPS ($8.99/mo), aur Admin RDP ($10.99/mo) provide karte hain.`
      : loc;
    return {
      text: `Main hosting choose karne mein madad kar sakta hoon.${urduLoc} Aap website host karna chahte hain, application chalani hai, ya remote Windows desktop?`,
      chips: [
        { id: "workload_website", label: "Website" },
        { id: "workload_app", label: "Application" },
        { id: "workload_rdp", label: "Remote Windows desktop" },
      ],
      templateId: "discover_urdu_v1",
    };
  }

  return {
    text: `I can help you choose hosting.${loc} What will you use it for — a website, an application, or a remote Windows desktop?`,
    chips: [
      { id: "workload_website", label: "Website" },
      { id: "workload_app", label: "Application" },
      { id: "workload_rdp", label: "Remote Windows desktop" },
    ],
    templateId: "discover_en_v1",
  };
}
