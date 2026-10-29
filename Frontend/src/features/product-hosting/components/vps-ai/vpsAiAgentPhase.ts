import type { AgentMessage } from "./vpsAiTypes";

export type Phase =
  | { kind: "user"; index: number; chars: number }
  | { kind: "thinking"; index: number }
  | { kind: "agent"; index: number; chars: number }
  | { kind: "confirm"; chars: number }
  | { kind: "done" };

export function startForIndex(
  messages: readonly AgentMessage[],
  index: number,
  confirmPrompt?: string,
): Phase {
  if (index >= messages.length) {
    return confirmPrompt ? { kind: "confirm", chars: 0 } : { kind: "done" };
  }
  const msg = messages[index]!;
  return msg.from === "agent"
    ? { kind: "thinking", index }
    : { kind: "user", index, chars: 0 };
}

export function firstChangedIndex(
  prev: readonly AgentMessage[],
  next: readonly AgentMessage[],
): number {
  const len = Math.max(prev.length, next.length);
  for (let i = 0; i < len; i++) {
    const a = prev[i];
    const b = next[i];
    if (!a || !b || a.from !== b.from || a.text !== b.text) return i;
  }
  return -1;
}
