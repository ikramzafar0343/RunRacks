import type { UiBlock } from "../types/turn.js";

export function links(): UiBlock {
  return {
    type: "actionLinks",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Contact", href: "/contact" },
    ],
  };
}

export function chipsBlock(
  chips: { id: string; label: string }[],
): UiBlock {
  return { type: "replyChips", chips };
}
