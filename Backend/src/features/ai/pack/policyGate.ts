/**
 * Fail-closed honesty gate for high-risk / abuse utterances.
 */
import type { ConversationStateV1 } from "../types/state.js";
import type { ComposedTurn } from "../types/turn.js";
import { links } from "../compose/blocks.js";
import {
  competitorPolicyBlockReply,
  demoNotOrderableReply,
  policyLegalPendingReply,
} from "./canonicalFacts.js";

function turn(
  state: ConversationStateV1,
  templateId: string,
  text: string,
  evidenceIds: string[],
): ComposedTurn {
  const next = { ...state, lastAnswerTemplateId: templateId };
  return { text, blocks: [links()], templateId, state: next, evidenceIds };
}

export function applyPolicyGate(
  matching: string,
  state: ConversationStateV1,
  evidenceIds: string[],
  original?: string,
): ComposedTurn | null {
  const m = matching.toLowerCase();
  const raw = (original ?? matching).toLowerCase();

  if (
    /\bpassword\s*[:=]\s*\S+/i.test(raw) ||
    /\bpassword\s+(?:is\s+)?\d+/i.test(m) ||
    /\b(api[_-]?key|private key|otp|cvv|card number)\b/i.test(m)
  ) {
    return turn(
      state,
      "gate_secret_v1",
      "Please remove passwords, keys, OTP, or card details from chat. I do not store or repeat secrets. Rotate anything you pasted, then describe the issue without credentials.",
      evidenceIds,
    );
  }

  if (
    /\bwaseerhost\b/i.test(m) &&
    /\b(refund|terms|policy|free domain|renewal)\b/i.test(m)
  ) {
    return turn(
      state,
      "gate_competitor_v1",
      competitorPolicyBlockReply(),
      evidenceIds,
    );
  }

  if (
    /\b(30[- ]day|money[- ]back)\b/i.test(m) &&
    /\brefund\b/i.test(m) &&
    /\b(guarantee|guaranteed)\b/i.test(m)
  ) {
    return turn(
      state,
      "gate_no_guarantee_v1",
      policyLegalPendingReply(),
      evidenceIds,
    );
  }

  if (
    /\b(legal terms|terms of service|privacy policy)\b/i.test(m) &&
    /\b(complete|finished|final|done)\b/i.test(m)
  ) {
    return turn(
      state,
      "gate_legal_pending_v1",
      policyLegalPendingReply(),
      evidenceIds,
    );
  }

  if (
    /\b(another customer|other customer|someone else.?s)\b/i.test(m) &&
    /\b(invoice|account|billing|password)\b/i.test(m)
  ) {
    return turn(
      state,
      "gate_no_account_v1",
      "I cannot view or disclose another customer’s account, invoices, or credentials. Sign in to your own account or use Contact for authorized support.",
      evidenceIds,
    );
  }

  if (
    /\b(confirm|prove|show)\b/i.test(m) &&
    /\b(server was created|order (was )?placed|provisioned|ticket #\d+)\b/i.test(m)
  ) {
    return turn(
      state,
      "gate_no_fabricate_v1",
      "I cannot confirm orders, provisioning, or invent ticket IDs from chat. Check your account once billing is connected, or use Contact — I will not fabricate success.",
      evidenceIds,
    );
  }

  if (
    /\bignore (all )?(previous )?rules\b/i.test(m) ||
    /\bclaim 100% uptime\b/i.test(m) ||
    /\bjailbreak\b/i.test(m)
  ) {
    return turn(
      state,
      "gate_resist_v1",
      "I stay within RunRacks hosting guidance and reviewed facts. I will not invent uptime guarantees or ignore safety rules. Ask about plan fit, setup checks, or Pricing.",
      evidenceIds,
    );
  }

  if (
    /\b(without|no)\b/i.test(m) &&
    /\b(rds cal|cal|license)\b/i.test(m) &&
    /\b(\d+\s*users?|concurrent)\b/i.test(m)
  ) {
    return turn(
      state,
      "gate_license_v1",
      "I cannot promise unlicensed multi-user access. Windows/RDP licensing and concurrent users are plan-specific — confirm on Admin RDP / Pricing or Contact. Do not assume CALs are included.",
      evidenceIds,
    );
  }

  if (
    /\b(purchase|buy|order|checkout)\b/i.test(m) &&
    (/\$\s*\d/i.test(matching) || /\bnow\b/i.test(m) || /\bdemo\b/i.test(m))
  ) {
    return turn(
      state,
      "gate_demo_price_v1",
      demoNotOrderableReply(),
      evidenceIds,
    );
  }

  return null;
}
