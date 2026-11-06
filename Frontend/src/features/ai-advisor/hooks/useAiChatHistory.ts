"use client";

/**
 * Saved chats for this browser session, plus the chat still being written.
 */
import { useEffect, useMemo, useState } from "react";
import { AI_COPY } from "@/features/ai-advisor/model/aiContent";
import {
  deleteAiChat,
  fetchAiConversation,
  listAiChats,
  type AiChatSummary,
  type AiLoadedChat,
} from "@/features/ai-advisor/services/aiHistoryClient";

export type HistoryPhase = "loading" | "ready" | "unavailable";

type HistoryInput = {
  savedTick: number;
  activeId: string | null;
  activeTitle: string | null;
  activeStore: "postgres" | "memory" | null;
};

function clipTitle(raw: string): string {
  const flat = raw.replace(/\s+/g, " ").trim();
  if (!flat) return "";
  return flat.length <= 80 ? flat : `${flat.slice(0, 79)}…`;
}

export function useAiChatHistory({
  savedTick,
  activeId,
  activeTitle,
  activeStore,
}: HistoryInput) {
  const [chats, setChats] = useState<AiChatSummary[]>([]);
  const [phase, setPhase] = useState<HistoryPhase>("loading");
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [removedIds, setRemovedIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    let cancelled = false;
    void listAiChats().then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        setPhase((current) => (current === "ready" ? current : "unavailable"));
        setError(result.message);
        return;
      }
      setPhase("ready");
      setError(null);
      setChats(result.chats.filter((chat) => !removedIds.has(chat.id)));
      setNotice(result.databaseUnavailable ? AI_COPY.historyDbDown : null);
    });
    return () => {
      cancelled = true;
    };
  }, [savedTick, removedIds]);

  const visible = useMemo(() => {
    const title = activeTitle ? clipTitle(activeTitle) : "";
    if (!activeId || !title || removedIds.has(activeId)) return chats;
    if (chats.some((chat) => chat.id === activeId)) return chats;
    const preview: AiChatSummary = {
      id: activeId,
      title,
      topic: null,
      updatedAt: new Date().toISOString(),
      store: activeStore ?? "memory",
    };
    return [preview, ...chats];
  }, [activeId, activeStore, activeTitle, chats, removedIds]);

  async function removeChat(id: string): Promise<boolean> {
    const result = await deleteAiChat(id);
    if (!result.ok) {
      setError(result.message);
      return false;
    }
    setRemovedIds((prev) => new Set(prev).add(id));
    setError(null);
    setChats((prev) => prev.filter((chat) => chat.id !== id));
    return true;
  }

  async function openChat(id: string): Promise<AiLoadedChat | null> {
    const result = await fetchAiConversation(id);
    if (!result.ok) {
      setError(result.message);
      return null;
    }
    setError(null);
    return result.chat;
  }

  return { chats: visible, phase, notice, error, removeChat, openChat };
}
