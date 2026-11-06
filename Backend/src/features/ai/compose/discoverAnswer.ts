import type { ConversationStateV1 } from "../types/state.js";
import type { ComposedTurn } from "../types/turn.js";
import {
  discoverPrompt,
  filterAndRankPlans,
  isBudgetBrowseQuery,
  type PlanCandidate,
} from "../rules/recommend.js";
import type { CatalogFreshness } from "../types/turn.js";
import { needsWorkloadClarification } from "../pipeline/entities.js";
import { getDatacenterAdvice } from "../catalog/locationAdvisor.js";
import { chipsBlock, links } from "./blocks.js";
import { composePricingAnswer } from "./honestyAnswer.js";

export function composeDiscover(
  stateIn: ConversationStateV1,
  plans: PlanCandidate[],
  freshness: CatalogFreshness,
  evidenceIds: string[],
  matching = "",
): ComposedTurn {
  const state = { ...stateIn, workflow: "discovery" as const, activeIntent: "discover" };

  // Budget-first: list every plan in range before asking workload.
  if (
    state.budgetAmount != null &&
    state.budgetCurrency === "USD" &&
    isBudgetBrowseQuery(matching || `budget ${state.budgetAmount}`)
  ) {
    return composePricingAnswer({
      matching: matching || `budget $${state.budgetAmount}`,
      state,
      plans,
      freshness,
      kb: undefined,
      evidenceIds,
    });
  }

  if (needsWorkloadClarification(state)) {
    const prompt = discoverPrompt(state);
    if (state.lastAnswerTemplateId === prompt.templateId) {
      state.clarificationAttemptCount += 1;
      state.lastAnswerTemplateId = "discover_simplify_v1";
      return {
        text: "Still with you on hosting. Website, application, or remote Windows desktop?",
        blocks: [chipsBlock(prompt.chips), links()],
        templateId: "discover_simplify_v1",
        state,
        evidenceIds,
      };
    }
    state.pendingClarification = "workload";
    state.lastAnswerTemplateId = prompt.templateId;
    return {
      text: prompt.text,
      blocks: [chipsBlock(prompt.chips), links()],
      templateId: prompt.templateId,
      state,
      evidenceIds,
    };
  }

  state.pendingClarification = null;
  const locNote = state.unresolvedLocationMention
    ? ` Location note: ${state.unresolvedLocationMention} (say if that’s you, visitors, or the server region).`
    : "";
  const rec = filterAndRankPlans(state, plans, freshness);
  if (rec.blockedReason === "catalog_unavailable") {
    state.lastAnswerTemplateId = "discover_noprice_v1";
    const budget =
      state.budgetAmount != null
        ? ` Budget about ${state.budgetCurrency ?? ""} ${state.budgetAmount}/${state.billingPeriod ?? "month"}.`
        : "";
    return {
      text: `You’re looking at ${state.workload} hosting.${budget}${locNote} I can’t verify current RunRacks pricing right now. Traffic and management preference still affect fit — do you want updates handled for you?`,
      blocks: [
        chipsBlock([
          { id: "mgmt_yes", label: "Managed please" },
          { id: "mgmt_no", label: "I’ll manage it" },
        ]),
        links(),
      ],
      templateId: "discover_noprice_v1",
      state,
      evidenceIds,
    };
  }
  if (rec.primary) {
    state.lastDisplayedPlans = [rec.primary, ...rec.alternatives].map((p) => ({
      id: p.id,
      label: p.name,
    }));
    state.lastAnswerTemplateId = "discover_plans_v1";
    const advice = getDatacenterAdvice(
      state.unresolvedLocationMention ?? state.userLocation,
    );
    const locPrefix = advice ? `${advice.adviceText} ` : "";
    return {
      text: `${locPrefix}Based on your requirements, start with ${rec.primary.name}. ${rec.reason} ${
        freshness === "demo"
          ? "These amounts are labeled demo and are not orderable. Confirm on Pricing."
          : "Confirm live details on Pricing before ordering."
      }`,
      blocks: [
        {
          type: "planCards",
          plans: [rec.primary, ...rec.alternatives].map((p) => ({
            id: p.id,
            name: p.name,
            reason: rec.reason,
            ...(p.priceLabel ? { priceLabel: p.priceLabel } : {}),
            href: "/pricing",
          })),
        },
        links(),
      ],
      templateId: "discover_plans_v1",
      state,
      evidenceIds,
    };
  }
  state.lastAnswerTemplateId = "discover_nomatch_v1";
  return {
    text: `${rec.reason} Say which requirement can change (budget, OS, or workload) — I won’t change it silently.`,
    blocks: [links()],
    templateId: "discover_nomatch_v1",
    state,
    evidenceIds,
  };
}
