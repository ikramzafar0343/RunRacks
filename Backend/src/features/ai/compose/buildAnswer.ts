import type { ConversationStateV1 } from "../types/state.js";
import type { ComposedTurn, IntentFamily } from "../types/turn.js";
import type { PlanCandidate } from "../rules/recommend.js";
import { nextDiagnosticStep } from "../rules/diagnose.js";
import type { RetrievalHit } from "../retrieval/lexical.js";
import type { CatalogFreshness } from "../types/turn.js";
import { needsWorkloadClarification } from "../pipeline/entities.js";
import { discoverPrompt } from "../rules/recommend.js";
import { chipsBlock, links } from "./blocks.js";
import { composeDiscover } from "./discoverAnswer.js";
import {
  composePolicyAnswer,
  composePricingAnswer,
  tryComposeBudgetBrowse,
} from "./honestyAnswer.js";
import { tryGuidedAnswer } from "./phraseAnswer.js";
import { trySmallTalkAnswer } from "./smallTalkAnswer.js";
import { composeContactAnswer } from "./supportAnswer.js";
import { applyPolicyGate } from "../pack/policyGate.js";

export function buildAnswer(input: {
  primary: IntentFamily;
  parts: IntentFamily[];
  matching: string;
  original?: string;
  state: ConversationStateV1;
  knowledge: RetrievalHit[];
  plans: PlanCandidate[];
  freshness: CatalogFreshness;
  acts: string[];
  ambiguous: boolean;
}): ComposedTurn {
  let state = { ...input.state };
  const evidenceIds = input.knowledge.map((h) => h.entry.id);
  const topHit = input.knowledge[0];
  const kb = topHit?.entry;
  const gated = applyPolicyGate(
    input.matching,
    state,
    evidenceIds,
    input.original,
  );
  if (gated) return gated;
  const budgetBrowse = tryComposeBudgetBrowse({
    matching: input.matching,
    state,
    plans: input.plans,
    freshness: input.freshness,
    kb,
    evidenceIds,
  });
  if (budgetBrowse) return budgetBrowse;
  const guided = tryGuidedAnswer({
    matching: input.matching,
    state,
    evidenceIds,
  });
  if (guided) return guided;
  if (input.acts.includes("frustration")) {
    state.lastAnswerTemplateId = "frustration_v1";
    return {
      text: "You’re right to call that out. Tell me the one thing you still need — plan pick, price check, or a connection error — and I’ll answer that directly.",
      blocks: [links()],
      templateId: "frustration_v1",
      state,
      evidenceIds,
    };
  }
  if (
    input.acts.includes("follow_up") &&
    (state.workflow === "discovery" || state.activeIntent === "discover") &&
    needsWorkloadClarification(state)
  ) {
    state.clarificationAttemptCount += 1;
    if (state.clarificationAttemptCount >= 2) {
      state.pendingClarification = null;
      state.lastAnswerTemplateId = "discover_simplify_v1";
      return {
        text: "Let’s simplify: do you want to put a website online, or log in to a Windows desktop remotely?",
        blocks: [
          chipsBlock([
            { id: "workload_website", label: "Website" },
            { id: "workload_rdp", label: "Remote Windows desktop" },
          ]),
          links(),
        ],
        templateId: "discover_simplify_v1",
        state,
        evidenceIds,
      };
    }
    const prompt = discoverPrompt(state);
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
  if (/website|application|remote windows|wordpress/i.test(input.matching)) {
    if (/wordpress|website|site/i.test(input.matching)) state.workload = "website";
    if (/application|app|api/i.test(input.matching)) state.workload = "application";
    if (/remote|rdp|desktop/i.test(input.matching)) state.workload = "remote_desktop";
  }
  const strongKb = topHit && topHit.score >= 7;
  const forceDiscover =
    input.primary === "discover" &&
    (/best plan|recommend|hosting chahiye|need hosting|hosting for/i.test(
      input.matching,
    ) ||
      needsWorkloadClarification(state));
  if (
    strongKb &&
    kb &&
    !forceDiscover &&
    !["greeting", "capabilities", "troubleshoot", "setup", "pricing"].includes(
      input.primary,
    )
  ) {
    state.activeIntent = input.primary;
    state.lastAnswerTemplateId = `kb_${kb.id}`;
    const text = /contact/i.test(kb.body)
      ? kb.body
      : `${kb.body} Confirm details on Pricing or Contact.`;
    return {
      text,
      blocks: [links()],
      templateId: `kb_${kb.id}`,
      state,
      evidenceIds,
    };
  }
  switch (input.primary) {
    case "greeting":
    case "capabilities": {
      const small = trySmallTalkAnswer({
        matching: input.matching,
        state,
        evidenceIds,
      });
      if (small) return small;
      if (input.primary === "greeting") {
        state.activeIntent = "greeting";
        state.lastAnswerTemplateId = "greet_short_v1";
        state.lastAdvisorAsk = "host";
        return {
          text: "Hi! What are you planning to host?",
          blocks: [
            chipsBlock([
              { id: "workload_website", label: "Website" },
              { id: "workload_app", label: "Application" },
              { id: "workload_rdp", label: "Remote Windows desktop" },
            ]),
          ],
          templateId: "greet_short_v1",
          state,
          evidenceIds,
        };
      }
      state.lastAnswerTemplateId = "caps_v1";
      return {
        text: "I’m RunRacks’ automated hosting advisor (rules + reviewed knowledge — not a human or general AI model). I help with plan fit, budget lists, labeled demo prices, comparisons, and setup checks. I can’t create tickets, orders, or change servers.",
        blocks: [links()],
        templateId: "caps_v1",
        state,
        evidenceIds,
      };
    }
    case "discover":
      return composeDiscover(
        state,
        input.plans,
        input.freshness,
        evidenceIds,
        input.matching,
      );
    case "linux_vps":
    case "windows_vps":
    case "admin_rdp": {
      state.activeIntent = input.primary;
      const body =
        kb?.body ??
        (input.primary === "admin_rdp"
          ? "Admin RDP is for remote desktop workloads. Confirm plan specifics on Pricing — don’t assume it matches Windows VPS."
          : input.primary === "windows_vps"
            ? "Windows VPS fits Windows apps. Confirm licensing and access on Pricing."
            : "Linux VPS fits Linux sites and APIs. Confirm current plans on Pricing.");
      state.lastAnswerTemplateId = `product_${input.primary}`;
      return { text: body, blocks: [links()], templateId: `product_${input.primary}`, state, evidenceIds };
    }
    case "pricing":
      return composePricingAnswer({
        matching: input.matching,
        state,
        plans: input.plans,
        freshness: input.freshness,
        kb,
        evidenceIds,
      });
    case "compare":
      state.workflow = "comparison";
      state.activeIntent = "compare";
      state.lastAnswerTemplateId = "compare_v1";
      return {
        text: "Linux VPS: Linux stacks and sites. Windows VPS: Windows apps/GUI. Admin RDP: remote desktop — licensing and users are plan-specific, not identical to Windows VPS. Prices only when verified on Pricing.",
        blocks: [links()],
        templateId: "compare_v1",
        state,
        evidenceIds,
      };
    case "setup":
    case "troubleshoot": {
      const step = nextDiagnosticStep(input.matching, state);
      state = step.state;
      state.activeIntent = input.primary;
      state.lastAnswerTemplateId = `diag_${step.stepId}`;
      return {
        text: step.text,
        blocks: [links()],
        templateId: `diag_${step.stepId}`,
        state,
        evidenceIds,
      };
    }
    case "policy":
      return composePolicyAnswer({
        matching: input.matching,
        state,
        kb,
        evidenceIds,
      });
    case "contact":
      return composeContactAnswer({
        matching: input.matching,
        state,
        evidenceIds,
      });
    default: {
      const small = trySmallTalkAnswer({
        matching: input.matching,
        state,
        evidenceIds,
      });
      if (small) return small;
      if (input.ambiguous) {
        state.lastAnswerTemplateId = "ambiguous_v1";
        return {
          text: "Do you want help choosing a hosting plan, or help fixing a connection/setup issue?",
          blocks: [
            chipsBlock([
              { id: "intent_discover", label: "Choose a plan" },
              { id: "intent_setup", label: "Fix a connection" },
            ]),
            links(),
          ],
          templateId: "ambiguous_v1",
          state,
          evidenceIds,
        };
      }
      if (kb && topHit && topHit.score >= 7) {
        state.lastAnswerTemplateId = `kb_${kb.id}`;
        return {
          text: kb.body,
          blocks: [links()],
          templateId: `kb_${kb.id}`,
          state,
          evidenceIds,
        };
      }
      state.lastAnswerTemplateId = "unknown_v1";
      return {
        text: "I can help with RunRacks hosting choices, verified prices when available, and basic setup checks. What do you need help with?",
        blocks: [
          chipsBlock([
            { id: "workload_website", label: "Website hosting" },
            { id: "intent_pricing", label: "Pricing" },
            { id: "intent_setup", label: "Setup help" },
          ]),
          links(),
        ],
        templateId: "unknown_v1",
        state,
        evidenceIds,
      };
    }
  }
}

