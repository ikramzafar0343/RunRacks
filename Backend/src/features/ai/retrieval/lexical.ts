/**
 * Deterministic lexical retrieval over reviewed knowledge.
 */
import {
  allKnowledgeEntries,
  type KnowledgeEntry,
} from "../knowledge/entries.js";

export type RetrievalHit = {
  entry: KnowledgeEntry;
  score: number;
};

const MIN_SCORE = 3;

function escapeRe(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Whole-token match so “racks” does not hit “runracks” or “you” hit “your”. */
function wordHit(haystack: string, token: string): boolean {
  if (token.length < 2) return false;
  return new RegExp(
    `(?:^|[^a-z0-9])${escapeRe(token)}(?:[^a-z0-9]|$)`,
    "i",
  ).test(haystack);
}

/**
 * Full-alias bonus. A long reviewed question that merely contains a short
 * visitor message does not get the bonus.
 */
function aliasBonus(matching: string, alias: string): number {
  if (matching === alias) return 6;
  const userWords = matching.split(/\s+/).filter(Boolean).length;
  if (alias.length >= 8 && wordHit(matching, alias)) return 6;
  if (
    userWords >= 4 &&
    matching.length >= 16 &&
    alias.length > matching.length &&
    wordHit(alias, matching)
  ) {
    return 6;
  }
  return 0;
}

const STOPWORDS = new Set([
  "what",
  "is",
  "the",
  "a",
  "an",
  "and",
  "or",
  "of",
  "to",
  "in",
  "on",
  "for",
  "with",
  "at",
  "by",
  "from",
  "can",
  "you",
  "tell",
  "me",
  "how",
  "do",
  "i",
  "are",
  "does",
  "it",
  "my",
  "your",
  "this",
  "that",
  "between",
]);

export function retrieveKnowledge(
  matching: string,
  localeHint: "en" | "roman_urdu" = "en",
  limit = 3,
): RetrievalHit[] {
  const tokens = new Set(
    matching
      .split(/\s+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 1),
  );

  const hits: RetrievalHit[] = [];
  for (const entry of allKnowledgeEntries()) {
    if (entry.status !== "published") continue;
    let score = 0;
    if (entry.locale === localeHint) score += 1;
    // Prefer pack Q&A slightly when locale matches
    if (entry.id.startsWith("RR-") && entry.locale === localeHint) score += 0.5;
    const title = entry.title.toLowerCase();
    const body = entry.body.toLowerCase();
    for (const alias of entry.aliases) {
      const a = alias.toLowerCase();
      const bonus = aliasBonus(matching, a);
      if (bonus > 0) score += bonus;
      else {
        for (const part of a.split(/\s+/)) {
          if (part.length > 2 && !STOPWORDS.has(part) && tokens.has(part)) {
            score += 1;
          }
        }
      }
    }
    for (const t of tokens) {
      if (!STOPWORDS.has(t)) {
        if (wordHit(title, t)) score += 1;
        if (wordHit(body, t)) score += 0.35;
      }
    }
    if (score >= MIN_SCORE) hits.push({ entry, score });
  }

  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}
