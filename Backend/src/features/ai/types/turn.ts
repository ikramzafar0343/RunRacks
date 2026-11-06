/**
 * Turn pipeline typed I/O.
 */
import type { ConversationStateV1 } from "./state.js";

export type DialogueAct =
  | "greeting"
  | "thanks"
  | "goodbye"
  | "follow_up"
  | "correction"
  | "frustration"
  | "question"
  | "statement";

export type IntentFamily =
  | "greeting"
  | "discover"
  | "linux_vps"
  | "windows_vps"
  | "admin_rdp"
  | "pricing"
  | "compare"
  | "setup"
  | "troubleshoot"
  | "policy"
  | "contact"
  | "capabilities"
  | "out_of_scope"
  | "unknown";

export type QuestionPart = {
  id: string;
  family: IntentFamily;
  status: "answered" | "needs_clarification" | "unavailable";
};

export type ScoredIntent = {
  family: IntentFamily;
  score: number;
};

export type CatalogFreshness =
  | "fresh"
  | "stale"
  | "demo"
  | "empty"
  | "unavailable";

export type UiBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | {
      type: "actionLinks";
      links: { label: string; href: string }[];
    }
  | {
      type: "replyChips";
      chips: { id: string; label: string }[];
    }
  | { type: "handoffPrompt"; text: string }
  | {
      type: "addToCart";
      planId: string;
      planName: string;
      family: "linux" | "windows" | "windows-admin-rdp";
      locationId: string;
      term: 1 | 3 | 6 | 12;
    }
  | {
      type: "planCards";
      plans: Array<{
        id: string;
        name: string;
        reason: string;
        priceLabel?: string;
        href?: string;
      }>;
    }
  | {
      type: "customizeQuote";
      family: "linux" | "windows" | "windows-admin-rdp";
      familyLabel: string;
      regionId: string;
      regionName: string;
      countryCode: string;
      term: 1 | 3 | 6 | 12;
      vcpu: number;
      ramGb: number;
      nvmeGb: number;
      bandwidthTb: number;
      dedicatedIpv4: boolean;
      automatedBackups: boolean;
      monthlyMinor: number;
      termTotalMinor: number;
      notice: string;
      href: string;
    };

export type ComposedTurn = {
  text: string;
  blocks: UiBlock[];
  templateId: string;
  state: ConversationStateV1;
  evidenceIds: string[];
};

export type HistoryTurn = { role: string; body: string };
