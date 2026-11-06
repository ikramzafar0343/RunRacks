/**
 * Exact phrase-bank answers — reviewed text, not a generated guess.
 */
import type { ConversationStateV1 } from "../types/state.js";
import type { ComposedTurn } from "../types/turn.js";
import { links } from "./blocks.js";
import { tryCartAnswer } from "./cartAnswer.js";
import { tryPlanCompareAnswer } from "./planCompare.js";
import { tryCatalogFactsAnswer } from "./catalogFactsAnswer.js";
import { tryPlanCardAnswer } from "./planCardAnswer.js";
import { tryHostSuggestAnswer } from "./hostSuggestAnswer.js";
import { trySpecPlanAnswer } from "./specPlanAnswer.js";
import { trySmallTalkAnswer } from "./smallTalkAnswer.js";
import { tryMemoryFollowUp } from "./memoryFollowUp.js";
import { isReservedPhraseKey, lookupPhrase } from "../pack/phraseBank.js";
import { tryTrainingAnswer } from "../pack/trainingSheet.js";
import { findPlanCard, formatPlanCard } from "../pack/demoPlanCatalog.js";

function tryCompoundQuestionAnswer(input: {
  matching: string;
  state: ConversationStateV1;
  evidenceIds: string[];
}): ComposedTurn | null {
  const m = input.matching;
  const asksAboutSelfOrBrand =
    /tell me about yourself|who are you|what is runrack|about runrack|what does runracks do/i.test(
      m,
    );
  const asksAboutServices =
    /what type of services|services of runrack|services.*providing|what services/i.test(
      m,
    );
  const plan = findPlanCard(m);

  const topicCount =
    (asksAboutSelfOrBrand ? 1 : 0) +
    (asksAboutServices ? 1 : 0) +
    (plan ? 1 : 0);

  if (topicCount < 2) return null;

  const sections: string[] = [];

  if (asksAboutSelfOrBrand) {
    sections.push(
      "I’m RunRacks’ owned hosting advisor, not a human and not a general-purpose model. RunRacks is a hosting brand with three public families: Linux VPS, Windows VPS, and Admin RDP. Plan cards list vCPU, RAM, NVMe, access, OS images, and regions. Prices on the site are labeled demo until billing and checkout are connected.",
    );
  }

  if (asksAboutServices) {
    sections.push(
      "**RunRacks Hosting Services:**\n• **Linux VPS (VPS 1 to VPS 6 · from $4.49/mo):** High-performance KVM virtual servers with 100% full root access for websites, APIs, databases, and Docker.\n• **Windows VPS (Windows VPS 1 to 11 · from $8.99/mo):** Dedicated Windows Server with Administrator RDP access for Windows applications and .NET stacks.\n• **Admin RDP (Admin RDP 1 to 11 · from $10.99/mo):** Pre-configured remote desktop machines with dedicated admin privileges for remote work, browsing, and background tools.",
    );
  }

  if (plan) {
    sections.push(
      `**Complete Card Specifications for ${plan.name}:**\n${formatPlanCard(plan)}`,
    );
  }

  const state = {
    ...input.state,
    lastAnswerTemplateId: "compound_overview_v1",
    activeIntent: plan ? ("pricing" as const) : ("capabilities" as const),
  };

  return {
    text: sections.join("\n\n"),
    blocks: [links()],
    templateId: "compound_overview_v1",
    state,
    evidenceIds: plan
      ? [...input.evidenceIds, "brand", "services", plan.id]
      : [...input.evidenceIds, "brand", "services"],
  };
}

export function tryPhraseAnswer(input: {
  matching: string;
  state: ConversationStateV1;
  evidenceIds: string[];
}): ComposedTurn | null {
  const hit = lookupPhrase(input.matching);
  if (!hit) return null;
  const state = {
    ...input.state,
    lastAnswerTemplateId: `phrase_${hit.id}`,
    lastAdvisorAsk:
      hit.id === "brand" || hit.id === "self"
        ? ("identity" as const)
        : input.state.lastAdvisorAsk,
  };
  return {
    text: hit.answer,
    blocks: [links()],
    templateId: `phrase_${hit.id}`,
    state,
    evidenceIds: [...input.evidenceIds, hit.id],
  };
}

export function tryGuidedAnswer(input: {
  matching: string;
  state: ConversationStateV1;
  evidenceIds: string[];
}): ComposedTurn | null {
  const turn =
    tryMemoryFollowUp(input) ??
    trySpecPlanAnswer(input) ??
    tryHostSuggestAnswer(input) ??
    tryCartAnswer(input) ??
    tryPlanCompareAnswer(input) ??
    tryCompoundQuestionAnswer(input) ??
    tryCatalogFactsAnswer(input) ??
    tryPhraseAnswer(input) ??
    tryPlanCardAnswer(input) ??
    (isReservedPhraseKey(input.matching) ? null : tryTrainingAnswer(input)) ??
    trySmallTalkAnswer(input);
  if (!turn) return null;
  const named = findPlanCard(input.matching);
  if (
    !named ||
    turn.templateId === "cart_add_v1" ||
    turn.templateId.startsWith("compare_") ||
    turn.templateId.startsWith("spec_") ||
    turn.templateId.startsWith("host_")
  ) {
    return turn;
  }
  return {
    ...turn,
    state: {
      ...turn.state,
      lastDisplayedPlans: [{ id: named.id, label: named.name }],
    },
  };
}
