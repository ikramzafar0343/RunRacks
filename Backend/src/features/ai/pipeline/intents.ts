/**
 * Scored intent families — topic chip is a hint, not an override.
 */
import type { IntentFamily, ScoredIntent } from "../types/turn.js";
import {
  hasPhrase,
  hasWord,
  looksLikeGreetingTypo,
  type NormalizedMessage,
} from "./normalize.js";
import { isBareFollowUp } from "./dialogue.js";
import type { ConversationStateV1 } from "../types/state.js";

const AMBIGUITY_GAP = 2;

export function scoreIntents(
  norm: NormalizedMessage,
  topicHint?: string | null,
): ScoredIntent[] {
  const m = norm.matching;
  const scores = new Map<IntentFamily, number>();
  const add = (f: IntentFamily, n: number) =>
    scores.set(f, (scores.get(f) ?? 0) + n);

  if (
    looksLikeGreetingTypo(m) ||
    (hasWord(m, "hi") && m.split(" ").length <= 3) ||
    hasWord(m, "hello") ||
    hasWord(m, "hey") ||
    hasPhrase(m, "how are you") ||
    hasPhrase(m, "how r u") ||
    hasPhrase(m, "kaise ho") ||
    hasPhrase(m, "kese ho") ||
    hasWord(m, "salam")
  ) {
    add("greeting", 6);
  }

  if (
    hasPhrase(m, "what can you") ||
    hasPhrase(m, "who are you") ||
    hasPhrase(m, "what are you") ||
    hasPhrase(m, "about yourself") ||
    hasPhrase(m, "what is runracks") ||
    hasPhrase(m, "what is run racks") ||
    hasPhrase(m, "about runracks") ||
    hasPhrase(m, "what services") ||
    hasPhrase(m, "what do you offer") ||
    hasPhrase(m, "what do you provide") ||
    hasPhrase(m, "what are you doing") ||
    hasPhrase(m, "what r u doing") ||
    hasPhrase(m, "what do you do") ||
    hasPhrase(m, "kya kar rahe ho") ||
    hasPhrase(m, "where are you from") ||
    hasPhrase(m, "where r u from") ||
    hasPhrase(m, "where is runracks") ||
    hasPhrase(m, "where are your servers") ||
    hasPhrase(m, "where are your datacenters") ||
    hasPhrase(m, "server locations") ||
    hasPhrase(m, "datacenter locations") ||
    hasPhrase(m, "help me") && m.split(" ").length <= 4
  ) {
    add("capabilities", 5);
  }

  if (
    hasWord(m, "ticket") ||
    hasWord(m, "support") ||
    hasWord(m, "contact") ||
    hasPhrase(m, "open a ticket") ||
    hasPhrase(m, "fix my server")
  ) {
    add("contact", 7);
  }

  if (
    hasWord(m, "price") ||
    hasWord(m, "pricing") ||
    hasWord(m, "cost") ||
    hasWord(m, "budget") ||
    hasPhrase(m, "how much") ||
    hasPhrase(m, "kitni price") ||
    /\b\d+(?:\.\d+)?\s*(?:usd|dollars?)\b/.test(m) ||
    /\$\s*\d+/.test(m) ||
    /\b(under|within|up\s*to)\b.{0,12}\$?\s*\d+/.test(m)
  ) {
    add("pricing", 8);
  } else if (hasWord(m, "sasta") || hasWord(m, "sasti")) {
    add("pricing", 5);
  }

  if (
    hasWord(m, "compare") ||
    hasWord(m, "difference") ||
    hasPhrase(m, " vs ") ||
    hasWord(m, "versus")
  ) {
    add("compare", 6);
  }

  if (hasWord(m, "rdp") || hasPhrase(m, "admin rdp") || hasPhrase(m, "remote desktop")) {
    add("admin_rdp", 7);
  }
  if (hasPhrase(m, "windows vps") || (hasWord(m, "windows") && hasWord(m, "vps"))) {
    add("windows_vps", 7);
  }
  if (
    hasPhrase(m, "linux vps") ||
    hasWord(m, "ubuntu") ||
    (hasWord(m, "linux") && (hasWord(m, "vps") || hasWord(m, "server")))
  ) {
    add("linux_vps", 7);
  }

  // Compare / troubleshoot must outrank bare product mentions when explicit
  if (
    hasWord(m, "compare") ||
    hasWord(m, "difference") ||
    hasPhrase(m, " vs ") ||
    hasWord(m, "versus") ||
    /\bvs\b/.test(m)
  ) {
    add("compare", 10);
  }
  if (
    hasWord(m, "ssh") ||
    hasPhrase(m, "cannot login") ||
    hasPhrase(m, "can't login") ||
    hasPhrase(m, "not working") ||
    (hasWord(m, "login") && (hasWord(m, "cannot") || hasWord(m, "cant") || hasWord(m, "via")))
  ) {
    add("troubleshoot", 10);
  }

  if (
    hasPhrase(m, "need hosting") ||
    hasPhrase(m, "hosting for") ||
    hasPhrase(m, "hosting chahiye") ||
    hasPhrase(m, "best plan") ||
    hasPhrase(m, "best hosting") ||
    hasWord(m, "recommend") ||
    (hasWord(m, "hosting") && !hasWord(m, "shared"))
  ) {
    add("discover", 8);
  }

  if (
    hasWord(m, "ssh") ||
    hasWord(m, "dns") ||
    hasWord(m, "ssl") ||
    hasPhrase(m, "connect") ||
    hasPhrase(m, "cannot login") ||
    hasPhrase(m, "can't login") ||
    hasWord(m, "error")
  ) {
    add("troubleshoot", 6);
    add("setup", 4);
  }

  if (
    hasWord(m, "refund") ||
    hasWord(m, "sla") ||
    hasWord(m, "backup") ||
    hasWord(m, "backups") ||
    hasWord(m, "ddos") ||
    hasPhrase(m, "are backups")
  ) {
    add("policy", 8);
  }

  // Topic hint only if no strong subject yet
  const max = Math.max(0, ...scores.values());
  if (max < 5 && topicHint) {
    if (topicHint === "vps") add("linux_vps", 3);
    if (topicHint === "windows") add("windows_vps", 3);
    if (topicHint === "pricing") add("pricing", 3);
    if (topicHint === "contact") add("contact", 3);
  }

  if (scores.size === 0) add("unknown", 1);

  return [...scores.entries()]
    .map(([family, score]) => ({ family, score }))
    .sort((a, b) => b.score - a.score);
}

export function pickPrimaryIntent(
  scored: ScoredIntent[],
  acts: string[],
  state: ConversationStateV1,
  matching: string,
): { primary: IntentFamily; ambiguous: boolean; parts: IntentFamily[] } {
  if (isBareFollowUp(matching) && state.activeIntent) {
    return {
      primary: state.activeIntent as IntentFamily,
      ambiguous: false,
      parts: [state.activeIntent as IntentFamily],
    };
  }

  // Greeting + hosting in same message → don't stop at greeting
  const hasGreeting = acts.includes("greeting");
  const nonGreeting = scored.filter((s) => s.family !== "greeting");
  if (hasGreeting && nonGreeting.length > 0 && (nonGreeting[0]?.score ?? 0) >= 5) {
    const parts = nonGreeting.filter((s) => s.score >= 5).map((s) => s.family);
    return {
      primary: nonGreeting[0]!.family,
      ambiguous: false,
      parts: parts.length ? parts : [nonGreeting[0]!.family],
    };
  }

  if (hasGreeting && (scored[0]?.family === "greeting" || looksLikeGreetingTypo(matching))) {
    return { primary: "greeting", ambiguous: false, parts: ["greeting"] };
  }

  const top = scored[0];
  const second = scored[1];
  const ambiguous =
    !!top &&
    !!second &&
    top.score - second.score < AMBIGUITY_GAP &&
    top.family !== second.family;

  const parts = scored.filter((s) => s.score >= 5).map((s) => s.family);
  return {
    primary: top?.family ?? "unknown",
    ambiguous,
    parts: parts.length ? parts : [top?.family ?? "unknown"],
  };
}
