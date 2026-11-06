/**
 * Ephemeral conversation store — bound mode, TTL, size limits.
 */
import { createHash, randomUUID } from "node:crypto";
import { emptyState, parseState } from "./types/state.js";
import type { AiConversationRow, AiMessageRow } from "./aiRepository.js";

type ConvoRecord = AiConversationRow & {
  messages: AiMessageRow[];
  payload_hashes: Record<string, string>;
  expiresAt: number;
};

const convos = new Map<string, ConvoRecord>();
const feedback = new Map<string, { rating: "up" | "down"; note: string }>();
const TTL_MS = 1000 * 60 * 60 * 12;
const MAX_CONVOS = 500;

function touchExpiry(row: ConvoRecord): void {
  row.expiresAt = Date.now() + TTL_MS;
}

function evict(): void {
  const now = Date.now();
  for (const [id, c] of convos) {
    if (c.expiresAt < now) convos.delete(id);
  }
  while (convos.size > MAX_CONVOS) {
    const first = convos.keys().next().value;
    if (!first) break;
    convos.delete(first);
  }
}

export function memoryCreateConversation(input: {
  id?: string;
  locale?: string;
  topic?: string | null;
  ownerSessionId?: string | null;
  storageMode?: "postgres" | "memory";
}): AiConversationRow {
  evict();
  const id = input.id?.trim() || randomUUID();
  const existing = convos.get(id);
  if (existing) {
    touchExpiry(existing);
    return existing;
  }
  const now = new Date();
  const row: ConvoRecord = {
    id,
    locale: input.locale ?? "en",
    topic: input.topic ?? null,
    created_at: now,
    updated_at: now,
    owner_session_id: input.ownerSessionId ?? null,
    storage_mode: "memory",
    state: emptyState(),
    messages: [],
    payload_hashes: {},
    expiresAt: Date.now() + TTL_MS,
  };
  convos.set(id, row);
  return row;
}

export function memoryEnsureConversation(
  id: string,
  input: {
    locale?: string;
    topic?: string | null;
    ownerSessionId?: string | null;
  } = {},
): AiConversationRow {
  const existing = convos.get(id);
  if (existing) {
    touchExpiry(existing);
    return existing;
  }
  return memoryCreateConversation({ id, ...input, storageMode: "memory" });
}

export function memoryGetConversation(id: string): AiConversationRow | null {
  evict();
  const c = convos.get(id);
  if (!c) return null;
  touchExpiry(c);
  return c;
}

export function memorySaveState(id: string, state: unknown): void {
  const c = convos.get(id);
  if (!c) return;
  c.state = parseState(state);
  c.updated_at = new Date();
  touchExpiry(c);
}

export function memoryDeleteConversation(id: string): boolean {
  return convos.delete(id);
}

export function memoryListMessages(conversationId: string): AiMessageRow[] {
  return [...(convos.get(conversationId)?.messages ?? [])];
}

export function memoryFindMessageByClientRequest(
  conversationId: string,
  clientRequestId: string,
): AiMessageRow | null {
  return (
    (convos.get(conversationId)?.messages ?? []).find(
      (m) => m.client_request_id === clientRequestId,
    ) ?? null
  );
}

export function memoryHashPayload(
  message: string,
  locale?: string,
  topic?: string | null,
): string {
  return createHash("sha256")
    .update(JSON.stringify({ message, locale: locale ?? "", topic: topic ?? "" }))
    .digest("hex");
}

export function memoryGetPayloadHash(
  conversationId: string,
  clientRequestId: string,
): string | null {
  return convos.get(conversationId)?.payload_hashes[clientRequestId] ?? null;
}

export function memorySetPayloadHash(
  conversationId: string,
  clientRequestId: string,
  hash: string,
): void {
  const c = convos.get(conversationId);
  if (!c) return;
  c.payload_hashes[clientRequestId] = hash;
}

export function memoryInsertMessage(input: {
  conversationId: string;
  role: "user" | "assistant" | "system";
  body: string;
  clientRequestId?: string | null;
  blocks?: unknown;
}): AiMessageRow {
  const convo = memoryEnsureConversation(input.conversationId);
  const row: AiMessageRow = {
    id: randomUUID(),
    conversation_id: input.conversationId,
    role: input.role,
    body: input.body.slice(0, 20_000),
    client_request_id: input.clientRequestId ?? null,
    blocks: input.blocks ?? [],
    created_at: new Date(),
  };
  const record = convos.get(convo.id)!;
  record.messages.push(row);
  if (record.messages.length > 200) {
    record.messages = record.messages.slice(-200);
  }
  record.updated_at = new Date();
  touchExpiry(record);
  return row;
}

export function memoryGetMessage(
  conversationId: string,
  messageId: string,
): AiMessageRow | null {
  return (
    (convos.get(conversationId)?.messages ?? []).find((m) => m.id === messageId) ??
    null
  );
}

export function memoryListOwned(ownerSessionId: string): {
  id: string;
  title: string | null;
  topic: string | null;
  updatedAt: Date;
  store: "memory";
}[] {
  evict();
  const rows: {
    id: string;
    title: string | null;
    topic: string | null;
    updatedAt: Date;
    store: "memory";
  }[] = [];
  for (const convo of convos.values()) {
    if (convo.owner_session_id !== ownerSessionId) continue;
    const first = convo.messages.find((message) => message.role === "user");
    if (!first) continue;
    rows.push({
      id: convo.id,
      title: first.body.slice(0, 200),
      topic: convo.topic,
      updatedAt: convo.updated_at,
      store: "memory",
    });
  }
  return rows;
}

export function memoryUpsertFeedback(
  messageId: string,
  rating: "up" | "down",
  note: string,
): void {
  feedback.set(messageId, { rating, note });
}
