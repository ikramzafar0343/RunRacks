import type { BlogContentBlock, BlogTocItem } from "../model/types";

/** Ensure heading ids are unique across the article body + TOC. */
export function withUniqueHeadingIds(
  content: readonly BlogContentBlock[],
): BlogContentBlock[] {
  const seen = new Map<string, number>();

  return content.map((block) => {
    if (block.type !== "h2" && block.type !== "h3") return block;
    const count = seen.get(block.id) ?? 0;
    seen.set(block.id, count + 1);
    if (count === 0) return block;
    return { ...block, id: `${block.id}-${count + 1}` };
  });
}

/** Build TOC from h2/h3 blocks (call after withUniqueHeadingIds). */
export function buildToc(content: readonly BlogContentBlock[]): BlogTocItem[] {
  const items: BlogTocItem[] = [];
  for (const block of content) {
    if (block.type === "h2") {
      items.push({ id: block.id, text: block.text, level: 2 });
    } else if (block.type === "h3") {
      items.push({ id: block.id, text: block.text, level: 3 });
    }
  }
  return items;
}

/** Spec: omit TOC when fewer than two headings. */
export function shouldShowToc(items: readonly BlogTocItem[]): boolean {
  return items.length >= 2;
}
