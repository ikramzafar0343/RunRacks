import type { BillingTermMonths, VpsFamily } from "@/features/vps-pricing";

export type ChatRole = "user" | "assistant" | "system";
export type AssistantStatus = "thinking" | "typing" | "done";

/** Customize pricing card carried on an assistant turn. */
export type AdvisorCustomizeQuote = {
  family: VpsFamily;
  familyLabel: string;
  regionId: string;
  regionName: string;
  countryCode: string;
  term: BillingTermMonths;
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

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  chips?: { id: string; label: string }[];
  quote?: AdvisorCustomizeQuote;
  /** Catalog plan ids for a deploy suggestion, attached after typing. */
  planIds?: string[];
  status?: AssistantStatus;
};

export type ChatPhase =
  | { kind: "idle" }
  | { kind: "composing" }
  | { kind: "submitting" }
  | { kind: "streaming" }
  | { kind: "unavailable"; message: string }
  | { kind: "failed"; message: string };
