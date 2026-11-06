/**
 * Dialogue act detection (separate from subject intents).
 */
import type { DialogueAct } from "../types/turn.js";
import {
  hasPhrase,
  hasWord,
  looksLikeGreetingTypo,
  type NormalizedMessage,
} from "./normalize.js";

export function detectDialogueActs(norm: NormalizedMessage): DialogueAct[] {
  const m = norm.matching;
  const acts: DialogueAct[] = [];

  if (
    looksLikeGreetingTypo(m) ||
    hasWord(m, "hi") ||
    hasWord(m, "hello") ||
    hasWord(m, "hey") ||
    hasPhrase(m, "how are you") ||
    hasPhrase(m, "assalam") ||
    hasWord(m, "salam")
  ) {
    acts.push("greeting");
  }

  if (
    hasWord(m, "thanks") ||
    hasWord(m, "thank") ||
    hasWord(m, "shukriya") ||
    hasWord(m, "shukria")
  ) {
    acts.push("thanks");
  }

  if (hasWord(m, "bye") || hasPhrase(m, "good bye") || hasWord(m, "goodbye")) {
    acts.push("goodbye");
  }

  if (
    hasPhrase(m, "do for me") ||
    hasPhrase(m, "do it") ||
    hasPhrase(m, "go ahead") ||
    hasPhrase(m, "you choose") ||
    hasPhrase(m, "aap choose") ||
    hasPhrase(m, "aap choose kar") ||
    /^(yes|yeah|yep|no|nope|ok|okay|sure)$/.test(m.trim()) ||
    hasPhrase(m, "the second") ||
    hasPhrase(m, "cheaper") ||
    hasWord(m, "why")
  ) {
    acts.push("follow_up");
  }

  if (
    hasWord(m, "actually") ||
    hasWord(m, "instead") ||
    hasPhrase(m, "not windows") ||
    hasPhrase(m, "windows nahi") ||
    hasPhrase(m, "nahi chahiye")
  ) {
    acts.push("correction");
  }

  if (
    hasPhrase(m, "repeating") ||
    hasPhrase(m, "same answer") ||
    hasPhrase(m, "not helping") ||
    hasWord(m, "useless")
  ) {
    acts.push("frustration");
  }

  if (m.includes("?") || hasWord(m, "what") || hasWord(m, "how") || hasWord(m, "kitni")) {
    acts.push("question");
  }

  if (acts.length === 0) acts.push("statement");
  return acts;
}

export function isBareFollowUp(matching: string): boolean {
  const t = matching.trim();
  return (
    /^(yes|yeah|yep|no|nope|ok|okay|sure|please|do for me|do it|go ahead|continue|you choose|aap choose kar dein)$/.test(
      t,
    ) || t.length <= 16 && /^(do for me|do it)$/.test(t)
  );
}
