/**
 * Matching-copy normalization — original message preserved separately.
 */
const PROTECTED =
  /\b(?:https?:\/\/\S+|[\w.-]+@[\w.-]+\.\w+|\d{1,3}(?:\.\d{1,3}){3}|[a-z0-9-]+\.[a-z]{2,}|\bRR-[A-Z0-9-]+)\b/gi;

export type NormalizedMessage = {
  original: string;
  matching: string;
  languageHint: "en" | "roman_urdu";
};

export function normalizeForMatch(original: string): NormalizedMessage {
  const placeholders: string[] = [];
  let working = original.replace(PROTECTED, (m) => {
    const i = placeholders.length;
    placeholders.push(m);
    return ` __P${i}__ `;
  });

  working = working
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Collapse extreme letter runs for greeting typos (elllllow → elloow)
  working = working.replace(/(\p{L})\1{2,}/gu, "$1$1");

  for (let i = 0; i < placeholders.length; i++) {
    working = working.replace(`__p${i}__`, placeholders[i]!.toLowerCase());
  }

  const romanHints =
    /\b(mujhe|chahiye|sasta|sasti|kitni|kitna|nahi|nahin|aap|karein|karna|dein|batao|bataiye|konsa|kaunsa|acha|achi|kya)\b/;
  const languageHint: "en" | "roman_urdu" = romanHints.test(working)
    ? "roman_urdu"
    : "en";

  return { original, matching: working, languageHint };
}

/** Word-boundary includes; avoids “hi” inside “hosting”. */
export function hasWord(matching: string, word: string): boolean {
  const re = new RegExp(`(?:^|\\s)${escapeRe(word)}(?:\\s|$)`, "i");
  return re.test(matching);
}

export function hasAnyWord(matching: string, words: string[]): boolean {
  return words.some((w) => hasWord(matching, w) || matching.includes(` ${w} `));
}

export function hasPhrase(matching: string, phrase: string): boolean {
  return matching.includes(phrase.toLowerCase());
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function looksLikeGreetingTypo(matching: string): boolean {
  const compact = matching.replace(/\s+/g, "");
  if (/^(hi|hey|hello|helo|helllo|howdy|yo|salam|assalamualaikum)$/.test(compact)) {
    return true;
  }
  // h?e+l+o+ style
  if (/^h?e{1,2}l{1,3}o{1,3}w?$/.test(compact) && compact.length <= 12) {
    return true;
  }
  return false;
}
