/**
 * Contact intent: a support-offering question is not a fault report.
 */
import type { ConversationStateV1 } from "../types/state.js";
import type { ComposedTurn } from "../types/turn.js";
import { links } from "./blocks.js";

function asksSupportOffering(matching: string): boolean {
  if (!/\bsupport\b/.test(matching)) return false;
  if (
    /\b(error|ticket|fault|down|outage|broken|issue|problem)\b/.test(matching) ||
    /\bnot working\b/.test(matching)
  ) {
    return false;
  }
  return /\b(type|kind|provid|offer|what|does)\b/.test(matching);
}

export function composeContactAnswer(input: {
  matching: string;
  state: ConversationStateV1;
  evidenceIds: string[];
}): ComposedTurn {
  const offering = asksSupportOffering(input.matching);
  const state: ConversationStateV1 = {
    ...input.state,
    workflow: "contact",
    activeIntent: "contact",
    lastAnswerTemplateId: offering ? "support_offer_v1" : "contact_v1",
    lastAdvisorAsk: offering ? "support" : input.state.lastAdvisorAsk,
  };
  if (offering) {
    return {
      text: "RunRacks has not published support hours, a phone number, or a ticket action I can take from this chat. A person is on the Contact page. I will not promise a reply time.",
      blocks: [
        { type: "handoffPrompt", text: "Contact engineers via /contact" },
        links(),
      ],
      templateId: "support_offer_v1",
      state,
      evidenceIds: input.evidenceIds,
    };
  }
  return {
    text: "I can help narrow the issue, but I can’t open a ticket or change your server here. What error are you seeing? Or use Contact to reach engineers.",
    blocks: [
      { type: "handoffPrompt", text: "Contact engineers via /contact" },
      links(),
    ],
    templateId: "contact_v1",
    state,
    evidenceIds: input.evidenceIds,
  };
}
