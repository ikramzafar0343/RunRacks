import type { BlogContentBlock } from "../model/types";

const WORDS_PER_MINUTE = 225;

function blockWordCount(block: BlogContentBlock): number {
  if (block.type === "ul") {
    return block.items.join(" ").split(/\s+/).filter(Boolean).length;
  }
  return block.text.split(/\s+/).filter(Boolean).length;
}

/** Whole-minute estimate from article body (≥1). */
export function estimateReadingMinutes(
  content: readonly BlogContentBlock[],
): number {
  const words = content.reduce((sum, b) => sum + blockWordCount(b), 0);
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
