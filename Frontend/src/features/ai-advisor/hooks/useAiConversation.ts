"use client";

import { useCallback, useRef, useState } from "react";
import { useCart } from "@/features/cart";
import {
  AI_COPY,
  AI_MAX_INPUT_CHARS,
} from "@/features/ai-advisor/model/aiContent";
import {
  readCartBlock,
  type AdvisorCartAdd,
} from "@/features/ai-advisor/lib/applyAdvisorCart";
import { absorbAdvisorBlock } from "@/features/ai-advisor/lib/readCustomizeQuote";
import {
  createClientRequestId,
  sendAiMessage,
} from "@/features/ai-advisor/services/aiClient";
import { NOTIFY_COPY } from "@/shared/ui/notify/notifyCopy";
import { useNotify } from "@/shared/ui/notify/NotifyProvider";
import type { AiStarterPrompt, AiTopic } from "@/shared/lib/apiContracts";
import type {
  AdvisorCustomizeQuote,
  ChatMessage,
  ChatPhase,
} from "./chatTypes";
import { startTypewriter } from "./typewriteAssistant";

export type { AssistantStatus, ChatMessage, ChatPhase, ChatRole } from "./chatTypes";

const withoutPending = (messages: ChatMessage[], assistantId: string) =>
  messages.filter(
    (m) =>
      !(m.id === assistantId && (m.status === "thinking" || !m.text.length)),
  );

const guestConversationId = () => `guest_${createClientRequestId()}`;

export function useAiConversation(topic: AiTopic | null) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [phase, setPhase] = useState<ChatPhase>({ kind: "idle" });
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [savedTick, setSavedTick] = useState(0);
  const [sessionStore, setSessionStore] = useState<
    "postgres" | "memory" | null
  >(null);
  const conversationIdRef = useRef<string | null>(null);
  const lastRequestRef = useRef<{
    clientRequestId: string;
    message: string;
    assistantId: string;
  } | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const typeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cartOnceRef = useRef(new Set<string>());
  const { addFromPlan } = useCart();
  const { toast } = useNotify();

  const clearTypewriter = useCallback(() => {
    if (typeTimerRef.current) {
      clearTimeout(typeTimerRef.current);
      typeTimerRef.current = null;
    }
  }, []);

  const typewrite = useCallback(
    (
      assistantId: string,
      fullText: string,
      messageId: string | undefined,
      chips: { id: string; label: string }[] | undefined,
      quote: AdvisorCustomizeQuote | undefined,
      planIds: string[] | undefined,
    ) =>
      startTypewriter({
        assistantId,
        fullText,
        messageId,
        chips,
        quote,
        planIds,
        setPhase,
        setMessages,
        clearTimer: clearTypewriter,
        armTimer: (id) => {
          typeTimerRef.current = id;
        },
      }),
    [clearTypewriter],
  );

  const applyChip = useCallback((starter: AiStarterPrompt) => {
    setDraft(starter.prompt);
    setPhase({ kind: "composing" });
  }, []);

  const runSend = useCallback(
    async (text: string, clientRequestId: string, assistantId: string) => {
      abortRef.current?.abort();
      clearTypewriter();
      const controller = new AbortController();
      abortRef.current = controller;
      setPhase({ kind: "submitting" });
      if (!conversationIdRef.current) {
        const id = guestConversationId();
        conversationIdRef.current = id;
        setConversationId(id);
      }

      let buffered = "";
      const pending = {
        cart: null as AdvisorCartAdd | null,
        quote: null as AdvisorCustomizeQuote | null,
        planIds: null as string[] | null,
        chips: undefined as { id: string; label: string }[] | undefined,
      };

      const result = await sendAiMessage(
        conversationIdRef.current,
        {
          clientRequestId,
          message: text,
          locale: "en",
          ...(topic ? { context: { topic } } : {}),
        },
        {
          onDelta: (delta) => {
            buffered += delta;
          },
          onBlock: (block) => {
            absorbAdvisorBlock(block, pending);
            const cart = readCartBlock(block);
            if (cart) pending.cart = cart;
          },
          onComplete: ({ text: finalText, store }) => {
            if (store) setSessionStore(store);
            if (finalText) buffered = finalText;
          },
        },
        controller.signal,
      );

      if (result.kind === "aborted") {
        clearTypewriter();
        setMessages((prev) => withoutPending(prev, assistantId));
        setPhase({ kind: "idle" });
        return;
      }

      if (result.kind === "ok") {
        if (result.store) setSessionStore(result.store);
        setSavedTick((tick) => tick + 1);
        await typewrite(
          assistantId,
          result.text || buffered,
          result.messageId,
          pending.chips,
          pending.quote ?? undefined,
          pending.planIds ?? undefined,
        );
        const cartAdd = pending.cart;
        if (cartAdd && !cartOnceRef.current.has(clientRequestId)) {
          cartOnceRef.current.add(clientRequestId);
          const added = addFromPlan({
            planId: cartAdd.planId,
            locationId: cartAdd.locationId,
            term: cartAdd.term,
            family: cartAdd.family,
          });
          toast(
            added.ok
              ? {
                  tone: "success",
                  ...NOTIFY_COPY.addedPlan(cartAdd.planName),
                  action: { label: NOTIFY_COPY.viewCart, href: "/cart" },
                }
              : { tone: "warning", ...NOTIFY_COPY.cartFull },
          );
        }
        setPhase({ kind: "idle" });
        return;
      }

      setMessages((prev) => withoutPending(prev, assistantId));

      if (result.kind === "not_configured") {
        setPhase({ kind: "unavailable", message: result.message });
        return;
      }
      setPhase({
        kind: "failed",
        message:
          result.kind === "validation" || result.kind === "error"
            ? result.message
            : "Request failed.",
      });
    },
    [addFromPlan, clearTypewriter, toast, topic, typewrite],
  );

  const send = useCallback(
    async (override?: string) => {
      const text = (override ?? draft).trim();
      if (!text) {
        setPhase({ kind: "failed", message: AI_COPY.emptyError });
        return;
      }
      if (text.length > AI_MAX_INPUT_CHARS) {
        setPhase({ kind: "failed", message: AI_COPY.tooLongError });
        return;
      }
      if (phase.kind === "submitting" || phase.kind === "streaming") return;

      const assistantId = createClientRequestId();
      const clientRequestId = createClientRequestId();
      lastRequestRef.current = { clientRequestId, message: text, assistantId };
      setMessages((prev) => [
        ...prev,
        { id: createClientRequestId(), role: "user", text },
        { id: assistantId, role: "assistant", text: "", status: "thinking" },
      ]);
      setDraft("");
      await runSend(text, clientRequestId, assistantId);
    },
    [draft, phase.kind, runSend],
  );

  const retry = useCallback(async () => {
    const last = lastRequestRef.current;
    if (!last || phase.kind === "submitting" || phase.kind === "streaming")
      return;
    const assistantId = createClientRequestId();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", text: "", status: "thinking" },
    ]);
    lastRequestRef.current = { ...last, assistantId };
    await runSend(last.message, last.clientRequestId, assistantId);
  }, [phase.kind, runSend]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    clearTypewriter();
    setMessages((prev) =>
      prev.map((m) =>
        m.status === "thinking" || m.status === "typing"
          ? { ...m, status: "done" as const }
          : m,
      ),
    );
    setPhase({ kind: "idle" });
  }, [clearTypewriter]);

  const openConversation = useCallback(
    (id: string, next: ChatMessage[], store: "postgres" | "memory" | null) => {
      abortRef.current?.abort();
      clearTypewriter();
      conversationIdRef.current = id;
      setConversationId(id);
      setMessages(next);
      setDraft("");
      setPhase({ kind: "idle" });
      setSessionStore(store);
      lastRequestRef.current = null;
    },
    [clearTypewriter],
  );

  const resetChat = useCallback(() => {
    abortRef.current?.abort();
    clearTypewriter();
    conversationIdRef.current = null;
    setConversationId(null);
    setDraft("");
    setMessages([]);
    setPhase({ kind: "idle" });
    setSessionStore(null);
    lastRequestRef.current = null;
  }, [clearTypewriter]);

  return {
    draft,
    setDraft,
    messages,
    phase,
    sessionStore,
    applyChip,
    send,
    retry,
    stop,
    resetChat,
    openConversation,
    conversationId,
    savedTick,
    hasMessages: messages.length > 0,
    isDirty: draft.trim().length > 0 || messages.length > 0,
  };
}
