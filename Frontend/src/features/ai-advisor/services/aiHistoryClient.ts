/**
 * Chat list and one saved transcript. Same-origin, guest cookie forwarded.
 */
import type { ApiErrorBody, ApiSuccessBody } from "@/shared/lib/apiContracts";
import type {
  ChatMessage,
  ChatRole,
} from "@/features/ai-advisor/hooks/chatTypes";
import {
  planIdsFromBlocks,
  quoteFromBlocks,
} from "@/features/ai-advisor/lib/readCustomizeQuote";

export type AiChatSummary = {
  id: string;
  title: string;
  topic: string | null;
  updatedAt: string;
  store: "postgres" | "memory";
};

export type AiHistoryList =
  | { ok: true; chats: AiChatSummary[]; databaseUnavailable: boolean }
  | { ok: false; message: string };

export type AiLoadedChat = {
  id: string;
  store: "postgres" | "memory";
  messages: ChatMessage[];
};

export type AiLoadResult =
  { ok: true; chat: AiLoadedChat } | { ok: false; message: string };

function isRole(role: string): role is ChatRole {
  return role === "user" || role === "assistant" || role === "system";
}

function chipsFrom(blocks: unknown): ChatMessage["chips"] {
  if (!Array.isArray(blocks)) return undefined;
  for (const block of blocks) {
    if (!block || typeof block !== "object") continue;
    const row = block as { type?: unknown; chips?: unknown };
    if (row.type !== "replyChips" || !Array.isArray(row.chips)) continue;
    const chips = row.chips.flatMap((chip) => {
      if (!chip || typeof chip !== "object") return [];
      const item = chip as { id?: unknown; label?: unknown };
      if (typeof item.id !== "string" || typeof item.label !== "string") {
        return [];
      }
      return [{ id: item.id, label: item.label }];
    });
    if (chips.length > 0) return chips;
  }
  return undefined;
}

async function errorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const body = (await res.json()) as ApiErrorBody;
    return body.error?.message || fallback;
  } catch {
    return fallback;
  }
}

function isSummary(value: unknown): value is AiChatSummary {
  if (!value || typeof value !== "object") return false;
  const row = value as AiChatSummary;
  return (
    typeof row.id === "string" &&
    typeof row.title === "string" &&
    (row.store === "postgres" || row.store === "memory")
  );
}

export async function listAiChats(): Promise<AiHistoryList> {
  const res = await fetch("/api/v1/ai/conversations", { cache: "no-store" });
  if (!res.ok) {
    return {
      ok: false,
      message: await errorMessage(res, "Chat history isn’t available."),
    };
  }
  const body = (await res.json()) as ApiSuccessBody<{
    chats?: unknown;
    databaseUnavailable?: boolean;
  }>;
  if (!body.ok || !Array.isArray(body.data?.chats)) {
    return { ok: false, message: "Chat history isn’t available." };
  }
  return {
    ok: true,
    chats: body.data.chats.filter(isSummary),
    databaseUnavailable: body.data.databaseUnavailable === true,
  };
}

export async function deleteAiChat(
  id: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const res = await fetch(
    `/api/v1/ai/conversations/${encodeURIComponent(id)}`,
    { method: "DELETE", cache: "no-store" },
  );
  if (!res.ok) {
    return {
      ok: false,
      message: await errorMessage(res, "Couldn’t delete that chat."),
    };
  }
  return { ok: true };
}

export async function fetchAiConversation(id: string): Promise<AiLoadResult> {
  const res = await fetch(
    `/api/v1/ai/conversations/${encodeURIComponent(id)}`,
    { cache: "no-store" },
  );
  if (!res.ok) {
    return {
      ok: false,
      message: await errorMessage(res, "Couldn’t open that chat."),
    };
  }
  const body = (await res.json()) as ApiSuccessBody<{
    id?: string;
    store?: string;
    messages?: unknown;
  }>;
  if (!body.ok || typeof body.data?.id !== "string") {
    return { ok: false, message: "Couldn’t open that chat." };
  }
  if (body.data.store !== "postgres" && body.data.store !== "memory") {
    return { ok: false, message: "Couldn’t open that chat." };
  }
  const store = body.data.store;
  const messages = Array.isArray(body.data.messages)
    ? body.data.messages.flatMap((row) => {
        if (!row || typeof row !== "object") return [];
        const item = row as {
          id?: unknown;
          role?: unknown;
          body?: unknown;
          blocks?: unknown;
        };
        if (
          typeof item.id !== "string" ||
          typeof item.role !== "string" ||
          typeof item.body !== "string" ||
          !isRole(item.role)
        ) {
          return [];
        }
        const chips = chipsFrom(item.blocks);
        const quote = quoteFromBlocks(item.blocks);
        const planIds = planIdsFromBlocks(item.blocks);
        const message: ChatMessage = {
          id: item.id,
          role: item.role,
          text: item.body,
          status: "done",
        };
        if (chips) message.chips = chips;
        if (quote) message.quote = quote;
        if (planIds) message.planIds = planIds;
        return [message];
      })
    : [];
  return { ok: true, chat: { id: body.data.id, store, messages } };
}
