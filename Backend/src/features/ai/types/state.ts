/**
 * Authoritative conversation state (schema v1).
 */
export const AI_STATE_VERSION = 1 as const;

export type Workflow =
  | "idle"
  | "discovery"
  | "comparison"
  | "setup"
  | "troubleshooting"
  | "contact";

export type OsPreference = "linux" | "windows" | "either" | null;

export type WorkloadKind =
  | "website"
  | "application"
  | "remote_desktop"
  | "wordpress"
  | "unknown"
  | null;

export type AdvisorAsk = "host" | "identity" | "trust" | "support" | "plan";

export type CustomQuoteFamily = "linux" | "windows" | "windows-admin-rdp";

export type CustomQuoteTerm = 1 | 3 | 6 | 12;

export type CustomQuoteNumbers = {
  vcpu: number | null;
  ramGb: number | null;
  nvmeGb: number | null;
  bandwidthTb: number | null;
};

export type CustomQuoteDraft = {
  requested: CustomQuoteNumbers;
  clamped: {
    vcpu: number;
    ramGb: number;
    nvmeGb: number;
    bandwidthTb: number;
  };
  clamps: string[];
  family: CustomQuoteFamily | null;
  regionId: string | null;
  billingTermMonths: CustomQuoteTerm | null;
};

export type ConversationStateV1 = {
  schemaVersion: typeof AI_STATE_VERSION;
  workflow: Workflow;
  activeIntent: string | null;
  productInterest: string | null;
  workload: WorkloadKind;
  osPreference: OsPreference;
  osExcluded: Array<"linux" | "windows">;
  budgetAmount: number | null;
  budgetCurrency: string | null;
  billingPeriod: "monthly" | "annual" | "unknown" | null;
  siteCount: number | null;
  managementPreference: "managed" | "unmanaged" | "unknown" | null;
  /** Distinct location fields — never silently conflated. */
  userLocation: string | null;
  visitorLocation: string | null;
  requestedServerLocation: string | null;
  unresolvedLocationMention: string | null;
  /** Named stack already established in this chat, such as Next.js and PostgreSQL. */
  stackLabel: string | null;
  /** What the previous advisor reply was doing. Structured, not a transcript. */
  lastAdvisorAsk: AdvisorAsk | null;
  pendingClarification: string | null;
  clarificationAttemptCount: number;
  lastAnswerTemplateId: string | null;
  lastDisplayedPlans: Array<{ id: string; label: string }>;
  completedDiagnosticSteps: string[];
  unansweredParts: string[];
  language: "en" | "roman_urdu";
  /** In-progress Customize build. Null until the user names hardware. */
  customQuote: CustomQuoteDraft | null;
};

export function emptyState(
  language: "en" | "roman_urdu" = "en",
): ConversationStateV1 {
  return {
    schemaVersion: AI_STATE_VERSION,
    workflow: "idle",
    activeIntent: null,
    productInterest: null,
    workload: null,
    osPreference: null,
    osExcluded: [],
    budgetAmount: null,
    budgetCurrency: null,
    billingPeriod: null,
    siteCount: null,
    managementPreference: null,
    userLocation: null,
    visitorLocation: null,
    requestedServerLocation: null,
    unresolvedLocationMention: null,
    stackLabel: null,
    lastAdvisorAsk: null,
    pendingClarification: null,
    clarificationAttemptCount: 0,
    lastAnswerTemplateId: null,
    lastDisplayedPlans: [],
    completedDiagnosticSteps: [],
    unansweredParts: [],
    language,
    customQuote: null,
  };
}

const QUOTE_FAMILIES = new Set<CustomQuoteFamily>([
  "linux",
  "windows",
  "windows-admin-rdp",
]);
const QUOTE_TERMS = new Set<CustomQuoteTerm>([1, 3, 6, 12]);
const QUOTE_REGIONS = new Set([
  "us",
  "gb",
  "ca",
  "nl",
  "de",
  "sg",
  "au",
  "jp",
]);

function finiteOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function parseCustomQuote(raw: unknown): CustomQuoteDraft | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Partial<CustomQuoteDraft>;
  const requested = row.requested;
  const clamped = row.clamped;
  if (!requested || !clamped) return null;
  const vcpu = finiteOrNull(clamped.vcpu);
  const ramGb = finiteOrNull(clamped.ramGb);
  const nvmeGb = finiteOrNull(clamped.nvmeGb);
  const bandwidthTb = finiteOrNull(clamped.bandwidthTb);
  if (vcpu == null || ramGb == null || nvmeGb == null || bandwidthTb == null) {
    return null;
  }
  const family = QUOTE_FAMILIES.has(row.family as CustomQuoteFamily)
    ? (row.family as CustomQuoteFamily)
    : null;
  const regionId = QUOTE_REGIONS.has(String(row.regionId))
    ? String(row.regionId)
    : null;
  const billingTermMonths = QUOTE_TERMS.has(
    row.billingTermMonths as CustomQuoteTerm,
  )
    ? (row.billingTermMonths as CustomQuoteTerm)
    : null;
  return {
    requested: {
      vcpu: finiteOrNull(requested.vcpu),
      ramGb: finiteOrNull(requested.ramGb),
      nvmeGb: finiteOrNull(requested.nvmeGb),
      bandwidthTb: finiteOrNull(requested.bandwidthTb),
    },
    clamped: { vcpu, ramGb, nvmeGb, bandwidthTb },
    clamps: Array.isArray(row.clamps)
      ? row.clamps.filter((item): item is string => typeof item === "string")
      : [],
    family,
    regionId,
    billingTermMonths,
  };
}

export function parseState(raw: unknown): ConversationStateV1 {
  if (!raw || typeof raw !== "object") return emptyState();
  const s = raw as Partial<ConversationStateV1>;
  return {
    ...emptyState(s.language === "roman_urdu" ? "roman_urdu" : "en"),
    ...s,
    schemaVersion: AI_STATE_VERSION,
    osExcluded: Array.isArray(s.osExcluded) ? s.osExcluded : [],
    lastDisplayedPlans: Array.isArray(s.lastDisplayedPlans)
      ? s.lastDisplayedPlans
      : [],
    completedDiagnosticSteps: Array.isArray(s.completedDiagnosticSteps)
      ? s.completedDiagnosticSteps
      : [],
    unansweredParts: Array.isArray(s.unansweredParts) ? s.unansweredParts : [],
    customQuote: parseCustomQuote(s.customQuote),
    stackLabel: cleanStackLabel(s.stackLabel),
    lastAdvisorAsk: cleanAdvisorAsk(s.lastAdvisorAsk),
  };
}

const ADVISOR_ASKS = new Set<AdvisorAsk>([
  "host",
  "identity",
  "trust",
  "support",
  "plan",
]);

function cleanStackLabel(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const label = value.trim();
  if (!label || label.length > 80) return null;
  return label;
}

function cleanAdvisorAsk(value: unknown): AdvisorAsk | null {
  return typeof value === "string" && ADVISOR_ASKS.has(value as AdvisorAsk)
    ? (value as AdvisorAsk)
    : null;
}
