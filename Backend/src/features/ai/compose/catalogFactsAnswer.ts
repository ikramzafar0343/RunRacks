/**
 * Region list and demo billing-term answers from the plan cards.
 */
import type { ConversationStateV1 } from "../types/state.js";
import type { ComposedTurn } from "../types/turn.js";
import { links } from "./blocks.js";
import {
  DEMO_PLAN_CARDS,
  money,
  type DemoPlanCard,
} from "../pack/demoPlanCatalog.js";

const REGIONS = [
  "United States",
  "United Kingdom",
  "Canada",
  "Netherlands",
  "Germany",
  "Singapore",
  "Australia",
  "Japan",
];

const TERMS = [1, 3, 6, 12] as const;

function isRegionQuestion(matching: string): boolean {
  const place =
    /region|location|datacent|data center|countries|where are your server|hosting server/.test(
      matching,
    );
  const ask = /list|which|what|where|available|offer|have|all|show/.test(
    matching,
  );
  return place && ask && !/spec|vcpu|nvme/.test(matching);
}

function isBillingQuestion(matching: string): boolean {
  if (/how much does vps cost|what is the cost|kitni price/.test(matching)) {
    return false;
  }
  const duration =
    /duration|billing term|billed every|payment term|term length|yearly|annual/.test(
      matching,
    );
  const bill = /bill|price|cost|charge|pay|invoice/.test(matching);
  return duration || (/month/.test(matching) && /bill|duration|term/.test(matching)) || (duration && bill);
}

function mentionedPlans(matching: string): DemoPlanCard[] {
  const ranked = [...DEMO_PLAN_CARDS].sort((a, b) => b.name.length - a.name.length);
  const used: Array<[number, number]> = [];
  const hits: Array<{ plan: DemoPlanCard; at: number }> = [];
  for (const plan of ranked) {
    const name = plan.name.toLowerCase();
    const at = matching.indexOf(name);
    if (at < 0) continue;
    const end = at + name.length;
    if (used.some(([start, stop]) => at < stop && end > start)) continue;
    hits.push({ plan, at });
    used.push([at, end]);
  }
  hits.sort((a, b) => a.at - b.at);
  return hits.map((hit) => hit.plan);
}

function termTotal(monthlyUsd: number, months: number): string {
  const minor = Math.round(monthlyUsd * 100) * months;
  return money(minor / 100);
}

function billLines(plan: DemoPlanCard): string {
  const parts = TERMS.map(
    (months) =>
      `${months} month${months === 1 ? "" : "s"} ${termTotal(plan.monthlyUsd, months)}`,
  );
  return `${plan.name} demo ${money(plan.monthlyUsd)}/mo → ${parts.join(", ")}.`;
}

function regionsText(): string {
  return `Hosting regions on the plan cards: ${REGIONS.join(", ")}. Every Linux VPS, Windows VPS, and Admin RDP card can be filtered to those regions. I don’t invent latency numbers or call one city fastest. Confirm the location on Pricing.`;
}

function billingText(matching: string): string {
  const named = mentionedPlans(matching);
  const examples = (named.length ? named : DEMO_PLAN_CARDS.slice(0, 1)).map(
    billLines,
  );
  return [
    "Demo billing durations: 1 month (billed monthly), 3 months (billed every 3 months), 6 months (billed every 6 months), and 12 months (billed every 12 months).",
    "In this catalog the monthly card price stays the same for every term. The term bill is that monthly amount times 1, 3, 6, or 12.",
    ...examples,
    "These are labeled demo amounts, not a live invoice. Checkout stays off until billing is connected — confirm on Pricing.",
  ].join(" ");
}

export function tryCatalogFactsAnswer(input: {
  matching: string;
  state: ConversationStateV1;
  evidenceIds: string[];
}): ComposedTurn | null {
  const region = isRegionQuestion(input.matching);
  const billing = isBillingQuestion(input.matching);
  if (!region && !billing) return null;
  const templateId = region && !billing ? "regions_list_v1" : "billing_terms_v1";
  const text =
    region && !billing ? regionsText() : billingText(input.matching);
  const state = { ...input.state, lastAnswerTemplateId: templateId };
  return {
    text,
    blocks: [links()],
    templateId,
    state,
    evidenceIds: input.evidenceIds,
  };
}
