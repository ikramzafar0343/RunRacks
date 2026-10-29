/**
 * VPS AI assistance demos — shared types.
 */

export type DemoId = "troubleshoot" | "setup" | "deploy" | "secure";

export type AgentMessage = {
  from: "user" | "agent";
  text: string;
};

export type SequenceStep = {
  atMs: number;
  terminalLines?: readonly string[];
  agentMessages?: readonly AgentMessage[];
  confirmPrompt?: string;
};

export type DemoState = {
  id: DemoId;
  tabLabel: string;
  heading: string;
  description: string;
  /** Total loop length before restart. */
  durationMs: number;
  sequence: readonly SequenceStep[];
};
