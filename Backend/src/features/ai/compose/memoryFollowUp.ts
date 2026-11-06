/**
 * Follow-ups reuse this chat’s stack, country, and last question.
 * Visitor text is not written back into the knowledge pack.
 */
import type { ConversationStateV1 } from "../types/state.js";
import type { ComposedTurn } from "../types/turn.js";
import { getDatacenterAdvice } from "../catalog/locationAdvisor.js";
import { PUBLISHED_PLANS } from "../catalog/publishedCatalog.js";
import { links } from "./blocks.js";
import { tryHostSuggestAnswer } from "./hostSuggestAnswer.js";
import { trySmallTalkAnswer } from "./smallTalkAnswer.js";

export function tryMemoryFollowUp(input: {
  matching: string;
  state: ConversationStateV1;
  evidenceIds: string[];
}): ComposedTurn | null {
  if (isAboutAdvisor(input.matching) && wasGreeting(input.state)) {
    return trySmallTalkAnswer(input);
  }
  if (isPlanWhy(input.matching) && hasShownPlan(input.state)) {
    return explainShownPlan(input);
  }
  if (/^(suggest|recommend)$/.test(input.matching)) {
    return tryHostSuggestAnswer(input);
  }
  return null;
}

function wasGreeting(state: ConversationStateV1): boolean {
  return (
    state.lastAdvisorAsk === "host" ||
    (state.lastAnswerTemplateId?.startsWith("greet_") ?? false)
  );
}

function isAboutAdvisor(matching: string): boolean {
  return /\bhow about you\b/.test(matching) || /\bwhat about you\b/.test(matching);
}

function isPlanWhy(matching: string): boolean {
  if (/\b(trust|choose|support|runrack)\b/.test(matching)) return false;
  return /^(why|why that|why this|why that plan|why this plan|what about the region|why that region)$/.test(
    matching,
  );
}

function hasShownPlan(state: ConversationStateV1): boolean {
  return (
    state.lastDisplayedPlans.length > 0 &&
    (state.pendingClarification === "host_suggest" ||
      state.lastAdvisorAsk === "plan")
  );
}

function familyLabel(family: string | undefined): string {
  if (family === "windows") return "Windows VPS";
  if (family === "windows-admin-rdp") return "Admin RDP";
  return "Linux VPS";
}

function explainShownPlan(input: {
  matching: string;
  state: ConversationStateV1;
  evidenceIds: string[];
}): ComposedTurn {
  const shown = input.state.lastDisplayedPlans[0]!;
  const plan = PUBLISHED_PLANS.find((row) => row.id === shown.id);
  const country =
    input.state.userLocation ?? input.state.unresolvedLocationMention;
  const advice = getDatacenterAdvice(country);
  const label = familyLabel(plan?.family);
  const name = plan?.name ?? shown.label;
  const specs = plan
    ? `${plan.vcpu} vCPU, ${plan.ramGb} GB RAM, ${plan.nvmeGb} GB NVMe`
    : name;
  const price = plan
    ? `$${plan.monthlyMajor.toFixed(2)}/mo labeled demo`
    : "the labeled demo price already on the card";
  const stack = input.state.stackLabel;
  const because = stack
    ? `${stack} ${stack.includes(",") ? "are" : "is"} why the ${label} card ${name} was chosen.`
    : `${name} is the ${label} card already on screen.`;
  const region = advice
    ? `From ${advice.countryName}, the catalog route stays ${advice.recommendedDatacenters}.`
    : "";
  const state: ConversationStateV1 = {
    ...input.state,
    lastAnswerTemplateId: "plan_why_v1",
    lastAdvisorAsk: "plan",
  };
  return {
    text: [because, `The card is ${name}: ${specs}, ${price}.`, region, "Checkout is not orderable."]
      .filter((part) => part.length > 0)
      .join(" "),
    blocks: [links()],
    templateId: "plan_why_v1",
    state,
    evidenceIds: [...input.evidenceIds, shown.id, "location_routing"],
  };
}
