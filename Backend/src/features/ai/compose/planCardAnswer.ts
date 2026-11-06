/**
 * Answers that mirror a pricing plan card, or list a family.
 */
import type { ConversationStateV1 } from "../types/state.js";
import type { ComposedTurn } from "../types/turn.js";
import { links } from "./blocks.js";
import {
  DEMO_PLAN_CARDS,
  findPlanCard,
  formatPlanCard,
  listFamily,
  type DemoPlanCard,
} from "../pack/demoPlanCatalog.js";

function familyFrom(matching: string): DemoPlanCard["family"] | null {
  if (/admin rdp|rdp plan/.test(matching) && !findPlanCard(matching)) {
    return "Admin RDP";
  }
  if (/windows vps|windows plan/.test(matching) && !/\bvps\s*1\b/.test(matching)) {
    if (!findPlanCard(matching)) return "Windows VPS";
  }
  if (
    /\blinux vps\b/.test(matching) ||
    (/\bvps plans?\b/.test(matching) && !/windows|admin rdp/.test(matching))
  ) {
    if (!findPlanCard(matching)) return "Linux VPS";
  }
  return null;
}

export function tryPlanCardAnswer(input: {
  matching: string;
  state: ConversationStateV1;
  evidenceIds: string[];
}): ComposedTurn | null {
  const m = input.matching;
  const plan = findPlanCard(m);
  const wantsSpecs =
    plan != null ||
    /spec|plan card|details|include|what is|tell me|about/.test(m);
  if (plan && wantsSpecs) {
    const state = {
      ...input.state,
      activeIntent: "pricing" as const,
      lastAnswerTemplateId: `plan_${plan.id}`,
      lastDisplayedPlans: [{ id: plan.id, label: plan.name }],
    };
    return {
      text: formatPlanCard(plan),
      blocks: [
        {
          type: "planCards",
          plans: [
            {
              id: plan.id,
              name: plan.name,
              reason: plan.tagline,
              priceLabel: `$${plan.monthlyUsd.toFixed(2)}/mo`,
              href: "/pricing",
            },
          ],
        },
        links(),
      ],
      templateId: `plan_${plan.id}`,
      state,
      evidenceIds: [...input.evidenceIds, plan.id],
    };
  }

  const family = familyFrom(m);
  const wantsList =
    family != null &&
    /plan|spec|price|tier|card|offer|which|list|all|services/.test(m);
  if (family && wantsList) {
    const state = {
      ...input.state,
      activeIntent: "pricing" as const,
      lastAnswerTemplateId: `plans_${family.replace(/\s+/g, "_").toLowerCase()}`,
    };
    return {
      text: listFamily(family),
      blocks: [links()],
      templateId: state.lastAnswerTemplateId,
      state,
      evidenceIds: input.evidenceIds,
    };
  }

  if (
    /all plans|every plan|plan cards|list (the )?plans|what plans/.test(m)
  ) {
    const state = {
      ...input.state,
      activeIntent: "pricing" as const,
      lastAnswerTemplateId: "plans_all_v1",
    };
    const names = DEMO_PLAN_CARDS.map((p) => p.name).join(", ");
    return {
      text: `RunRacks demo catalog cards: ${names}. Ask for one by name (for example “VPS 1 specs”) and I’ll read that card: vCPU, RAM, NVMe, access, OS, regions, and the labeled demo monthly price. Checkout is not orderable yet.`,
      blocks: [links()],
      templateId: "plans_all_v1",
      state,
      evidenceIds: input.evidenceIds,
    };
  }

  return null;
}
