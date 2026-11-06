/**
 * Configure-cart add — same local cart as Pricing, not a live order.
 */
import type { ConversationStateV1 } from "../types/state.js";
import type { ComposedTurn, UiBlock } from "../types/turn.js";
import { links } from "./blocks.js";
import {
  DEMO_PLAN_CARDS,
  findPlanCard,
  money,
  type DemoPlanCard,
} from "../pack/demoPlanCatalog.js";

type CartFamily = "linux" | "windows" | "windows-admin-rdp";

function familyOf(plan: DemoPlanCard): CartFamily {
  if (plan.family === "Windows VPS") return "windows";
  if (plan.family === "Admin RDP") return "windows-admin-rdp";
  return "linux";
}

function wantsCart(matching: string): boolean {
  if (!/\b(cart|basket)\b/.test(matching)) return false;
  if (!/\b(add|put|place|throw|move|send)\b/.test(matching)) return false;
  if (
    /\b(backup|add-?on|addon|coupon|extra ip)\b/.test(matching) &&
    !findPlanCard(matching)
  ) {
    return false;
  }
  return true;
}

function cartBlock(plan: DemoPlanCard): UiBlock {
  return {
    type: "addToCart",
    planId: plan.id,
    planName: plan.name,
    family: familyOf(plan),
    locationId: "us",
    term: 1,
  };
}

export function tryCartAnswer(input: {
  matching: string;
  state: ConversationStateV1;
  evidenceIds: string[];
}): ComposedTurn | null {
  if (!wantsCart(input.matching)) return null;
  const named = findPlanCard(input.matching);
  const rememberedId = input.state.lastDisplayedPlans[0]?.id;
  const plan =
    named ??
    DEMO_PLAN_CARDS.find((card) => card.id === rememberedId) ??
    null;
  if (!plan) {
    const state = {
      ...input.state,
      lastAnswerTemplateId: "cart_need_plan_v1",
    };
    return {
      text: "Tell me which plan to add — for example VPS 1, Windows VPS 3, or Admin RDP 1. I can put that card in your configure cart. Checkout payment is not connected, so it will not be an order.",
      blocks: [links()],
      templateId: "cart_need_plan_v1",
      state,
      evidenceIds: input.evidenceIds,
    };
  }
  const state = {
    ...input.state,
    activeIntent: "pricing" as const,
    lastAnswerTemplateId: "cart_add_v1",
    lastDisplayedPlans: [{ id: plan.id, label: plan.name }],
  };
  return {
    text: `${plan.name} is being added to your configure cart at the demo price of ${money(plan.monthlyUsd)}/mo. Checkout payment is not connected, so this is not an order or invoice. Open Cart to review it.`,
    blocks: [cartBlock(plan), links()],
    templateId: "cart_add_v1",
    state,
    evidenceIds: [...input.evidenceIds, plan.id],
  };
}
