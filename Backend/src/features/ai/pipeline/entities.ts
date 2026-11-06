/**
 * Entity extraction — locations kept distinct; negation respected.
 */
import type { ConversationStateV1, OsPreference } from "../types/state.js";
import { hasPhrase, hasWord, type NormalizedMessage } from "./normalize.js";

export function extractAndMergeEntities(
  norm: NormalizedMessage,
  prev: ConversationStateV1,
): ConversationStateV1 {
  const m = norm.matching;
  const next: ConversationStateV1 = {
    ...prev,
    language: norm.languageHint === "roman_urdu" ? "roman_urdu" : prev.language,
  };

  // OS exclusions / preferences
  if (
    hasPhrase(m, "not windows") ||
    hasPhrase(m, "windows nahi") ||
    hasPhrase(m, "windows nahin") ||
    hasPhrase(m, "no windows")
  ) {
    if (!next.osExcluded.includes("windows")) next.osExcluded.push("windows");
    if (next.osPreference === "windows") next.osPreference = "linux";
  }
  if (hasPhrase(m, "not linux") || hasPhrase(m, "linux nahi")) {
    if (!next.osExcluded.includes("linux")) next.osExcluded.push("linux");
  }
  if (
    !next.osExcluded.includes("windows") &&
    (hasWord(m, "windows") || hasPhrase(m, "remote desktop") || hasWord(m, "rdp"))
  ) {
    next.osPreference = "windows" as OsPreference;
  }
  if (
    !next.osExcluded.includes("linux") &&
    (hasWord(m, "linux") || hasWord(m, "ubuntu") || hasWord(m, "wordpress"))
  ) {
    next.osPreference = (next.osPreference === "windows" ? "either" : "linux") as OsPreference;
  }

  // Workload
  if (hasWord(m, "wordpress") || hasPhrase(m, "word press")) {
    next.workload = "wordpress";
  } else if (
    hasWord(m, "website") ||
    hasWord(m, "site") ||
    hasWord(m, "sites") ||
    hasWord(m, "blog")
  ) {
    next.workload = "website";
  } else if (
    hasWord(m, "application") ||
    hasWord(m, "app") ||
    hasWord(m, "api") ||
    hasWord(m, "apps")
  ) {
    next.workload = "application";
  } else if (
    hasPhrase(m, "remote desktop") ||
    hasWord(m, "rdp") ||
    hasPhrase(m, "remote windows")
  ) {
    next.workload = "remote_desktop";
  }

  const sites = m.match(/\b(\d+)\s*(?:wordpress\s+)?(?:web\s*)?sites?\b/);
  if (sites?.[1]) next.siteCount = Number.parseInt(sites[1], 10);

  // Budget: "my budget is 10 dollars", "under $20", "within 15 usd", "10 dollar ka"
  const budgetMatch =
    m.match(
      /(?:not more than|under|below|max(?:imum)?|within|up\s*to|upto)\s*(?:of\s+)?(?:usd|\$)?\s*(\d+(?:\.\d+)?)/,
    ) ??
    m.match(
      /(?:budget(?:\s+is|\s*[:=])?|can\s+afford|afford|around|about)\s*(?:usd|\$)?\s*(\d+(?:\.\d+)?)/,
    ) ??
    m.match(/\b(?:usd|\$)\s*(\d+(?:\.\d+)?)\b/) ??
    m.match(
      /\b(\d+(?:\.\d+)?)\s*(?:usd|dollars?)\b(?:\s*(?:\/\s*mo(?:nth)?|per\s+month|monthly|budget|ka|ki|ke))?/,
    );
  if (budgetMatch?.[1]) {
    next.budgetAmount = Number.parseFloat(budgetMatch[1]);
    next.budgetCurrency = "USD";
    if (
      !next.billingPeriod &&
      (hasWord(m, "monthly") ||
        hasPhrase(m, "per month") ||
        hasWord(m, "month") ||
        /\/\s*mo\b/.test(m) ||
        hasWord(m, "budget"))
    ) {
      next.billingPeriod = "monthly";
    }
  }
  if (hasWord(m, "monthly") || hasPhrase(m, "per month") || hasWord(m, "month")) {
    next.billingPeriod = "monthly";
  }
  if (hasWord(m, "annual") || hasWord(m, "yearly") || hasPhrase(m, "per year")) {
    next.billingPeriod = "annual";
  }

  // Location mentions — unresolved unless server region phrasing is explicit
  const KNOWN_LOCATIONS = [
    "pakistan",
    "pk",
    "india",
    "bangladesh",
    "usa",
    "united states",
    "canada",
    "uk",
    "united kingdom",
    "germany",
    "netherlands",
    "australia",
    "japan",
    "singapore",
    "uae",
  ];
  for (const loc of KNOWN_LOCATIONS) {
    if (hasWord(m, loc) || hasPhrase(m, loc)) {
      next.unresolvedLocationMention = loc;
      break;
    }
  }

  const fromMatch = m.match(
    /(?:i am from|i'm from|based in|living in|located in|i am in|i'm in|my country is|country is)\s+([a-z\s]+?)(?:\s+(?:suggest|recommend|need|what|and|tell|show|for|please|so)|\s*$)/,
  );
  if (fromMatch?.[1]) {
    const rawLoc = fromMatch[1].trim();
    next.userLocation = rawLoc;
    next.unresolvedLocationMention = rawLoc;
  }

  if (
    hasPhrase(m, "server in") ||
    hasPhrase(m, "data center in") ||
    hasPhrase(m, "datacenter in")
  ) {
    const loc = m.match(
      /(?:server|data ?center|datacenter) in ([a-z\s]+)/,
    )?.[1]?.trim();
    if (loc) {
      next.requestedServerLocation = loc;
      next.unresolvedLocationMention = null;
    }
  }

  const stack = stackLabelFrom(m);
  if (stack) next.stackLabel = stack;

  if (hasWord(m, "managed")) next.managementPreference = "managed";
  if (hasWord(m, "unmanaged") || hasPhrase(m, "i will manage")) {
    next.managementPreference = "unmanaged";
  }

  return next;
}

function stackLabelFrom(matching: string): string | null {
  const named: string[] = [];
  if (/\bnext\s*js\b|\bnextjs\b/.test(matching)) named.push("Next.js");
  if (/\bnode\s*js\b|\bnodejs\b/.test(matching)) named.push("Node.js");
  if (/\bpostgres(?:ql)?\b/.test(matching)) named.push("PostgreSQL");
  if (named.length > 0) return named.join(", ");
  if (/\b(windows|rdp)\b/.test(matching)) return null;
  if (/\bwebsite\b/.test(matching)) return "website";
  if (/\b(application|api)\b/.test(matching)) return "application";
  if (/\bdatabase\b/.test(matching)) return "database";
  return null;
}

export function needsWorkloadClarification(state: ConversationStateV1): boolean {
  return state.workload == null || state.workload === "unknown";
}
