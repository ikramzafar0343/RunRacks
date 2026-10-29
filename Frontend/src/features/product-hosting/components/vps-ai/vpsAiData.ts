/**
 * VPS AI assistance demos — public barrel (types, demos, frame helpers).
 */
export type {
  AgentMessage,
  DemoId,
  DemoState,
  SequenceStep,
} from "./vpsAiTypes";
export { VPS_AI_DEMOS } from "./vpsAiDemos";

import { VPS_AI_DEMOS } from "./vpsAiDemos";
import type { DemoId, DemoState } from "./vpsAiTypes";

export const DEFAULT_DEMO_ID: DemoId = "setup";

export function demoById(id: DemoId): DemoState {
  return VPS_AI_DEMOS.find((d) => d.id === id) ?? VPS_AI_DEMOS[1]!;
}

/** Resolve visible terminal/agent state for a clock position. */
export function frameAt(demo: DemoState, elapsedMs: number) {
  const t = ((elapsedMs % demo.durationMs) + demo.durationMs) % demo.durationMs;
  let current = demo.sequence[0]!;
  for (const step of demo.sequence) {
    if (step.atMs <= t) current = step;
    else break;
  }
  const last = demo.sequence[demo.sequence.length - 1]!;
  return {
    terminalLines: current.terminalLines ?? [],
    agentMessages: current.agentMessages ?? [],
    confirmPrompt: current.confirmPrompt,
    isComplete: t >= last.atMs,
  };
}

/** Static poster frame for reduced-motion (final step). */
export function posterFrame(demo: DemoState) {
  const last = demo.sequence[demo.sequence.length - 1]!;
  return {
    terminalLines: last.terminalLines ?? [],
    agentMessages: last.agentMessages ?? [],
    confirmPrompt: last.confirmPrompt,
    isComplete: true,
  };
}
