/**
 * AI Advisor public copy + starter prompts (VPS, Windows, Admin RDP).
 */
import type { Route } from "next";
import type { AiStarterPrompt, AiTopic } from "@/shared/lib/apiContracts";

export type AiStarterIconId = "server" | "monitor" | "rdp";

export type AiStarterWithIcon = AiStarterPrompt & {
  icon: AiStarterIconId;
};

export const AI_META = {
  title: "RunRacks AI | Plan guidance",
  description:
    "Ask about Linux VPS, Windows VPS, and Admin RDP on RunRacks. Live answers connect when the AI backend is configured.",
} as const;

export const AI_COPY = {
  heading: "Ask RunRacks AI",
  headingAccent: "AI",
  lead: "Guidance for Linux VPS, Windows VPS, and Admin RDP plan fit.",
  placeholder: "Ask about VPS, Windows, or Admin RDP",
  disclaimer: "Demo catalog prices. Live model answers aren’t connected yet.",
  unavailable: "AI backend not connected yet.",
  sendLabel: "Send",
  stopLabel: "Stop",
  pendingLabel: "Sending…",
  emptyError: "Enter a question to send.",
  tooLongError: "Message is too long.",
  historyEmpty: "No chats in this session.",
  galleryLabel: "Add photos",
  filesLabel: "Add files",
  micLabel: "Voice input",
  micStopLabel: "Stop voice input",
  micUnsupported: "Voice input isn’t available in this browser.",
  micDenied: "Microphone permission was blocked.",
  micMissing: "No microphone was found.",
  attachLocal: "Photos and files stay on this device. Upload isn’t connected yet.",
  fileTooBig: "Each file must be 8 MB or smaller.",
  tooManyFiles: "You can attach up to 4 files.",
  removeFileLabel: "Remove",
} as const;

export const AI_TOPICS = [
  "vps",
  "windows",
  "pricing",
  "contact",
] as const satisfies readonly AiTopic[];

export const AI_MAX_INPUT_CHARS = 4000;

export const AI_STARTERS: readonly AiStarterWithIcon[] = [
  {
    id: "vps",
    label: "Linux VPS",
    prompt: "Help me choose a Linux VPS.",
    topic: "vps",
    icon: "server",
  },
  {
    id: "windows",
    label: "Windows VPS",
    prompt: "Help me choose a Windows VPS.",
    topic: "windows",
    icon: "monitor",
  },
  {
    id: "admin-rdp",
    label: "Admin RDP",
    prompt: "Help me choose an Admin RDP plan.",
    topic: "windows",
    icon: "rdp",
  },
] as const;

export const AI_STARTERS_PUBLIC: readonly AiStarterPrompt[] = AI_STARTERS.map(
  ({ id, label, prompt, topic }) => ({ id, label, prompt, topic }),
);

export const AI_HANDOFF_LINKS = [
  { label: "Pricing", href: "/pricing" as Route },
  { label: "Contact", href: "/contact" as Route },
] as const;

export function isAiTopic(value: string | null | undefined): value is AiTopic {
  return (
    value === "vps" ||
    value === "windows" ||
    value === "pricing" ||
    value === "contact"
  );
}

/** Message context topic, including the setup starter. */
export function isAiMessageTopic(value: unknown): value is AiTopic | "setup" {
  if (value === "setup") return true;
  return isAiTopic(typeof value === "string" ? value : undefined);
}

export function startersForTopic(
  topic: AiTopic | null,
): readonly AiStarterWithIcon[] {
  if (!topic || topic === "pricing" || topic === "contact") return AI_STARTERS;
  if (topic === "windows") {
    return AI_STARTERS.filter((s) => s.id !== "vps");
  }
  return AI_STARTERS.filter((s) => s.topic === topic);
}
