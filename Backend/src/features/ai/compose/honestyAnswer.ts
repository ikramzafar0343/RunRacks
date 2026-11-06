/**
 * Pricing + policy honesty compose using canonical facts.
 */
import type { ConversationStateV1 } from "../types/state.js";
import type { ComposedTurn, CatalogFreshness } from "../types/turn.js";
import {
  filterAndRankPlans,
  isBudgetBrowseQuery,
  type PlanCandidate,
} from "../rules/recommend.js";
import type { KnowledgeEntry } from "../knowledge/entries.js";
import { links } from "./blocks.js";
import {
  demoNotOrderableReply,
  isBackupConflicted,
  isDemoPricingOrderable,
  isLegalPending,
  policyBackupReply,
  policyLegalPendingReply,
} from "../pack/canonicalFacts.js";

/** Budget-first pricing turn when the user stated a USD max. */
export function tryComposeBudgetBrowse(input: {
  matching: string;
  state: ConversationStateV1;
  plans: PlanCandidate[];
  freshness: CatalogFreshness;
  kb: KnowledgeEntry | undefined;
  evidenceIds: string[];
}): ComposedTurn | null {
  const pending = input.state.pendingClarification;
  if (
    pending === "custom_type" ||
    pending === "custom_region" ||
    pending === "custom_term" ||
    pending === "hardware_specs"
  ) {
    return null;
  }
  if (
    input.state.budgetAmount == null ||
    input.state.budgetCurrency !== "USD" ||
    !isBudgetBrowseQuery(input.matching)
  ) {
    return null;
  }
  return composePricingAnswer(input);
}

export function composePricingAnswer(input: {
  matching: string;
  state: ConversationStateV1;
  plans: PlanCandidate[];
  freshness: CatalogFreshness;
  kb: KnowledgeEntry | undefined;
  evidenceIds: string[];
}): ComposedTurn {
  const state = { ...input.state, activeIntent: "pricing" as const };
  if (
    !isDemoPricingOrderable() &&
    /purchase|buy|order|checkout/i.test(input.matching)
  ) {
    state.lastAnswerTemplateId = "price_demo_v1";
    return {
      text: demoNotOrderableReply(),
      blocks: [links()],
      templateId: "price_demo_v1",
      state,
      evidenceIds: input.evidenceIds,
    };
  }
  if (input.freshness === "empty" || input.freshness === "unavailable") {
    state.lastAnswerTemplateId = "price_unavailable_v1";
    return {
      text: input.kb?.body
        ? `${input.kb.body} Catalog amounts are not verified in this session — confirm on Pricing.`
        : "I can’t verify current RunRacks pricing right now. Open Pricing for labeled amounts, or Contact for a quote.",
      blocks: [links()],
      templateId: "price_unavailable_v1",
      state,
      evidenceIds: input.evidenceIds,
    };
  }

  // Budget browse: every catalog plan at or under the stated USD monthly max.
  if (state.budgetAmount != null && state.budgetCurrency === "USD") {
    const rec = filterAndRankPlans(state, input.plans, input.freshness);
    const matched = rec.primary
      ? [rec.primary, ...rec.alternatives]
      : [];
    if (matched.length === 0) {
      state.lastAnswerTemplateId = "price_budget_empty_v1";
      return {
        text: `${rec.reason} Demo amounts stay labeled until billing is connected.`,
        blocks: [links()],
        templateId: "price_budget_empty_v1",
        state,
        evidenceIds: input.evidenceIds,
      };
    }
    state.lastDisplayedPlans = matched.map((p) => ({
      id: p.id,
      label: p.name,
    }));
    state.lastAnswerTemplateId = "price_budget_v1";
    const orderNote = isDemoPricingOrderable()
      ? "Confirm on Pricing before purchase."
      : "These amounts are labeled demo and are not orderable. Confirm on Pricing.";
    const lines = matched.map((p) =>
      p.priceLabel ? `${p.name}: ${p.priceLabel}` : `${p.name}: price on Pricing`,
    );
    return {
      text: `Within about $${state.budgetAmount}/mo, these catalog plans fit:\n${lines
        .map((l) => `• ${l}`)
        .join("\n")}\n${rec.reason} ${orderNote}`,
      blocks: [
        {
          type: "planCards",
          plans: matched.map((p) => ({
            id: p.id,
            name: p.name,
            reason: rec.reason,
            ...(p.priceLabel ? { priceLabel: p.priceLabel } : {}),
            href: "/pricing",
          })),
        },
        { type: "list", items: lines },
        links(),
      ],
      templateId: "price_budget_v1",
      state,
      evidenceIds: input.evidenceIds,
    };
  }

  let selected = [...input.plans];
  if (/linux/i.test(input.matching)) {
    selected = selected.filter(
      (p) =>
        /linux|vps/i.test(p.family) &&
        !/windows|rdp/i.test(p.family + p.name),
    );
  } else if (/rdp|remote desktop/i.test(input.matching)) {
    selected = selected.filter((p) => /rdp/i.test(p.family + p.name));
  } else if (/windows/i.test(input.matching)) {
    selected = selected.filter(
      (p) =>
        /windows/i.test(p.family + p.name) &&
        !/rdp/i.test(p.family + p.name),
    );
  } else {
    const linux = input.plans.filter(
      (p) =>
        /linux|vps/i.test(p.family) &&
        !/windows|rdp/i.test(p.family + p.name),
    );
    const win = input.plans.filter(
      (p) =>
        /windows/i.test(p.family + p.name) &&
        !/rdp/i.test(p.family + p.name),
    );
    const rdp = input.plans.filter((p) => /rdp/i.test(p.family + p.name));
    selected = [...linux.slice(0, 2), ...win.slice(0, 2), ...rdp.slice(0, 2)];
  }
  if (selected.length === 0) selected = input.plans;
  const lines = selected
    .slice(0, 6)
    .map((p) =>
      p.priceLabel ? `${p.name}: ${p.priceLabel}` : `${p.name}: price on Pricing`,
    );
  const orderNote = isDemoPricingOrderable()
    ? "Confirm on Pricing before purchase."
    : "Amounts may still be demo — confirm on Pricing; checkout is not orderable until billing is connected.";
  const heading =
    input.freshness === "demo"
      ? "Demo catalog (not live checkout):"
      : input.freshness === "fresh"
        ? "Verified catalog snapshot:"
        : "Catalog snapshot:";
  state.lastAnswerTemplateId = "price_list_v1";
  return {
    text: `${heading}\n${lines.map((l) => `• ${l}`).join("\n")}\n${orderNote}`,
    blocks: [{ type: "list", items: lines }, links()],
    templateId: "price_list_v1",
    state,
    evidenceIds: input.evidenceIds,
  };
}

export function composePolicyAnswer(input: {
  matching: string;
  state: ConversationStateV1;
  kb: KnowledgeEntry | undefined;
  evidenceIds: string[];
}): ComposedTurn {
  const state = { ...input.state };
  if (/backup|backups/i.test(input.matching) && isBackupConflicted()) {
    state.lastAnswerTemplateId = "policy_backup_v1";
    return {
      text: input.kb?.body ?? policyBackupReply(),
      blocks: [links()],
      templateId: "policy_backup_v1",
      state,
      evidenceIds: input.evidenceIds,
    };
  }
  if (
    /refund|terms|privacy|legal/i.test(input.matching) &&
    (isLegalPending("refund") ||
      isLegalPending("terms") ||
      isLegalPending("privacy"))
  ) {
    state.lastAnswerTemplateId = "policy_legal_v1";
    return {
      text: input.kb?.body ?? policyLegalPendingReply(),
      blocks: [links()],
      templateId: "policy_legal_v1",
      state,
      evidenceIds: input.evidenceIds,
    };
  }
  if (input.kb) {
    state.lastAnswerTemplateId = `kb_${input.kb.id}`;
    return {
      text: input.kb.body,
      blocks: [links()],
      templateId: `kb_${input.kb.id}`,
      state,
      evidenceIds: input.evidenceIds,
    };
  }
  state.lastAnswerTemplateId = "policy_missing_v1";
  return {
    text: "I don’t have an approved source for that policy detail here, so I won’t guess. Check Pricing/docs or Contact for entitlements like backups, DDoS, or refunds.",
    blocks: [links()],
    templateId: "policy_missing_v1",
    state,
    evidenceIds: input.evidenceIds,
  };
}
