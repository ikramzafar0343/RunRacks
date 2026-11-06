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
    "Ask about Linux VPS, Windows VPS, and Admin RDP on RunRacks. Owned advisor — no cloud model keys.",
} as const;

export const AI_COPY = {
  heading: "Ask RunRacks AI",
  headingAccent: "AI",
  lead: "Guidance for Linux VPS, Windows VPS, and Admin RDP plan fit.",
  placeholder: "Ask about VPS or Admin RDP",
  disclaimer:
    "Demo prices are labeled and checkout is not orderable. Confirm on Pricing; Contact for tickets.",
  unavailable: "AI backend not connected yet.",
  tempSession:
    "Temporary session — this chat can disappear if the server restarts.",
  sendLabel: "Send",
  stopLabel: "Stop",
  pendingLabel: "Sending…",
  emptyError: "Enter a question to send.",
  tooLongError: "Message is too long.",
  historyEmpty: "No chats yet.",
  historyLoading: "Loading chats…",
  historyUnavailable: "Chat history isn’t available until AI is connected.",
  historyDbDown: "Saved chats can’t be loaded right now.",
  deleteChatConfirm: {
    title: "Delete this chat?",
    description: "This cannot be undone.",
    confirmLabel: "Delete",
    cancelLabel: "Cancel",
  },
  newChatConfirm: {
    title: "Start a new chat?",
    description: "This conversation stays in your history.",
    confirmLabel: "New chat",
    cancelLabel: "Stay here",
  },
  chatDeleted: {
    title: "Chat deleted",
    description: "That conversation was removed.",
  },
  chatDeleteFailed: {
    title: "Could not delete chat",
    description: "Try again in a moment.",
  },

  galleryLabel: "Add photos",
  filesLabel: "Add files",
  micLabel: "Voice input",
  micStopLabel: "Stop voice input",
  micUnsupported: "Voice input isn’t available in this browser.",
  micDenied: "Microphone permission was blocked.",
  micMissing: "No microphone was found.",
  attachLocal:
    "Photos and files stay on this device. Upload isn’t connected yet.",
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
  {
    id: "budget-10",
    label: "$10 budget",
    prompt: "My budget is 10 dollars — show all plans inside that.",
    topic: "pricing",
    icon: "server",
  },
  {
    id: "spec-build",
    label: "Build by specs",
    prompt:
      "Create a Customize plan: cpu is 2 ram is 4 storage is 80 and bandwidth is 5 — show the demo price on a card.",
    topic: "pricing",
    icon: "server",
  },
] as const;

/** Suggestions for the scroll prompt. Sent as-is when the field is empty. */
export const AI_SCROLL_PROMPTS = [
  "Which plan fits my online store?",
  "Help me compare Linux VPS and Windows VPS.",
  "What NVMe plan fits a small site?",
  "Which Admin RDP plan should I look at?",
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
