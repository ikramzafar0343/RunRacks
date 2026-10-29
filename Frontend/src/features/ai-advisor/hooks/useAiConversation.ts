"use client";

/**
 * Conversation UI state — one active send; honest NOT_CONFIGURED handling.
 */
import { useCallback, useId, useState } from "react";
import { AI_COPY, AI_MAX_INPUT_CHARS } from "@/features/ai-advisor/model/aiContent";
import {
  createClientRequestId,
  sendAiMessage,
} from "@/features/ai-advisor/services/aiClient";
import type { AiStarterPrompt, AiTopic } from "@/shared/lib/apiContracts";

export type ChatRole = "user" | "assistant" | "system";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
};

export type ChatPhase =
  | { kind: "idle" }
  | { kind: "composing" }
  | { kind: "submitting" }
  | { kind: "unavailable"; message: string }
  | { kind: "failed"; message: string };

export function useAiConversation(topic: AiTopic | null) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [phase, setPhase] = useState<ChatPhase>({ kind: "idle" });
  const conversationId = `guest_${useId().replace(/:/g, "")}`;

  const applyChip = useCallback((starter: AiStarterPrompt) => {
    setDraft(starter.prompt);
    setPhase({ kind: "composing" });
  }, []);

  const send = useCallback(async () => {
    const text = draft.trim();
    if (!text) {
      setPhase({ kind: "failed", message: AI_COPY.emptyError });
      return;
    }
    if (text.length > AI_MAX_INPUT_CHARS) {
      setPhase({ kind: "failed", message: AI_COPY.tooLongError });
      return;
    }
    if (phase.kind === "submitting") return;

    const userMsg: ChatMessage = {
      id: createClientRequestId(),
      role: "user",
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setDraft("");
    setPhase({ kind: "submitting" });

    const result = await sendAiMessage(conversationId, {
      clientRequestId: createClientRequestId(),
      message: text,
      locale: "en",
      ...(topic ? { context: { topic } } : {}),
    });

    if (result.kind === "not_configured") {
      setPhase({ kind: "unavailable", message: result.message });
      return;
    }
    if (result.kind === "validation") {
      setPhase({ kind: "failed", message: result.message });
      return;
    }
    setPhase({ kind: "failed", message: result.message });
  }, [conversationId, draft, phase.kind, topic]);

  const resetChat = useCallback(() => {
    setDraft("");
    setMessages([]);
    setPhase({ kind: "idle" });
  }, []);

  return {
    draft,
    setDraft,
    messages,
    phase,
    applyChip,
    send,
    resetChat,
    hasMessages: messages.length > 0,
    isDirty: draft.trim().length > 0 || messages.length > 0,
  };
}
