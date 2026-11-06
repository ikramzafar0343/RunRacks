/**
 * AI conversation / message persistence (Postgres).
 */
import { createHash, randomUUID } from "node:crypto";
import type { Db } from "../../platform/db.js";
import { emptyState, parseState } from "./types/state.js";

export type AiConversationRow = {
  id: string;
  locale: string;
  topic: string | null;
  created_at: Date;
  updated_at: Date;
  owner_session_id: string | null;
  storage_mode: "postgres" | "memory";
  state: unknown;
};

export type AiMessageRow = {
  id: string;
  conversation_id: string;
  role: string;
  body: string;
  client_request_id: string | null;
  blocks: unknown;
  created_at: Date;
};

export async function createConversation(
  db: Db,
  input: {
    id?: string;
    locale?: string;
    topic?: string | null;
    ownerSessionId?: string | null;
    storageMode?: "postgres" | "memory";
  },
): Promise<AiConversationRow> {
  const id = input.id?.trim() || randomUUID();
  const res = await db.query<AiConversationRow>(
    `INSERT INTO ai_conversations
       (id, locale, topic, owner_session_id, storage_mode, state, schema_version)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb, 1)
     ON CONFLICT (id) DO UPDATE SET updated_at = now()
     RETURNING id, locale, topic, created_at, updated_at,
               owner_session_id, storage_mode, state`,
    [
      id,
      input.locale ?? "en",
      input.topic ?? null,
      input.ownerSessionId ?? null,
      input.storageMode ?? "postgres",
      JSON.stringify(emptyState()),
    ],
  );
  return res.rows[0]!;
}

export async function ensureConversation(
  db: Db,
  id: string,
  input: {
    locale?: string;
    topic?: string | null;
    ownerSessionId?: string | null;
    storageMode?: "postgres" | "memory";
  } = {},
): Promise<AiConversationRow> {
  const existing = await getConversation(db, id);
  if (existing) return existing;
  return createConversation(db, { id, ...input });
}

export async function getConversation(
  db: Db,
  id: string,
): Promise<AiConversationRow | null> {
  const res = await db.query<AiConversationRow>(
    `SELECT id, locale, topic, created_at, updated_at,
            owner_session_id, storage_mode, state
     FROM ai_conversations WHERE id = $1`,
    [id],
  );
  return res.rows[0] ?? null;
}

export async function saveConversationState(
  db: Db,
  id: string,
  state: unknown,
): Promise<void> {
  await db.query(
    `UPDATE ai_conversations
     SET state = $2::jsonb, updated_at = now()
     WHERE id = $1`,
    [id, JSON.stringify(state)],
  );
}

export async function deleteConversation(db: Db, id: string): Promise<boolean> {
  const res = await db.query(`DELETE FROM ai_conversations WHERE id = $1`, [id]);
  return (res.rowCount ?? 0) > 0;
}

export async function listMessages(
  db: Db,
  conversationId: string,
): Promise<AiMessageRow[]> {
  const res = await db.query<AiMessageRow>(
    `SELECT id, conversation_id, role, body, client_request_id, blocks, created_at
     FROM ai_messages
     WHERE conversation_id = $1
     ORDER BY created_at ASC
     LIMIT 200`,
    [conversationId],
  );
  return res.rows;
}

export async function findMessageByClientRequest(
  db: Db,
  conversationId: string,
  clientRequestId: string,
): Promise<AiMessageRow | null> {
  const res = await db.query<AiMessageRow>(
    `SELECT id, conversation_id, role, body, client_request_id, blocks, created_at
     FROM ai_messages
     WHERE conversation_id = $1 AND client_request_id = $2`,
    [conversationId, clientRequestId],
  );
  return res.rows[0] ?? null;
}

export function hashPayload(message: string, locale?: string, topic?: string | null): string {
  return createHash("sha256")
    .update(JSON.stringify({ message, locale: locale ?? "", topic: topic ?? "" }))
    .digest("hex");
}

export async function getPayloadHash(
  db: Db,
  conversationId: string,
  clientRequestId: string,
): Promise<string | null> {
  const res = await db.query<{ payload_hashes: Record<string, string> }>(
    `SELECT payload_hashes FROM ai_conversations WHERE id = $1`,
    [conversationId],
  );
  const map = res.rows[0]?.payload_hashes ?? {};
  return map[clientRequestId] ?? null;
}

export async function setPayloadHash(
  db: Db,
  conversationId: string,
  clientRequestId: string,
  hash: string,
): Promise<void> {
  await db.query(
    `UPDATE ai_conversations
     SET payload_hashes = COALESCE(payload_hashes, '{}'::jsonb) || jsonb_build_object($2::text, $3::text),
         updated_at = now()
     WHERE id = $1`,
    [conversationId, clientRequestId, hash],
  );
}

export async function insertMessage(
  db: Db,
  input: {
    conversationId: string;
    role: "user" | "assistant" | "system";
    body: string;
    clientRequestId?: string | null;
    blocks?: unknown;
  },
): Promise<AiMessageRow> {
  const id = randomUUID();
  const res = await db.query<AiMessageRow>(
    `INSERT INTO ai_messages
       (id, conversation_id, role, body, client_request_id, blocks)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb)
     RETURNING id, conversation_id, role, body, client_request_id, blocks, created_at`,
    [
      id,
      input.conversationId,
      input.role,
      input.body,
      input.clientRequestId ?? null,
      JSON.stringify(input.blocks ?? []),
    ],
  );
  await db.query(
    `UPDATE ai_conversations SET updated_at = now() WHERE id = $1`,
    [input.conversationId],
  );
  return res.rows[0]!;
}

export async function upsertFeedback(
  db: Db,
  messageId: string,
  rating: "up" | "down",
  note: string,
): Promise<void> {
  await db.query(
    `INSERT INTO ai_message_feedback (message_id, rating, note)
     VALUES ($1, $2, $3)
     ON CONFLICT (message_id) DO UPDATE SET
       rating = EXCLUDED.rating,
       note = EXCLUDED.note,
       created_at = now()`,
    [messageId, rating, note],
  );
}

export async function getMessage(
  db: Db,
  conversationId: string,
  messageId: string,
): Promise<AiMessageRow | null> {
  const res = await db.query<AiMessageRow>(
    `SELECT id, conversation_id, role, body, client_request_id, blocks, created_at
     FROM ai_messages
     WHERE id = $1 AND conversation_id = $2`,
    [messageId, conversationId],
  );
  return res.rows[0] ?? null;
}

export async function listOwnedConversations(
  db: Db,
  ownerSessionId: string,
): Promise<
  {
    id: string;
    title: string | null;
    topic: string | null;
    updatedAt: Date;
    store: "postgres" | "memory";
  }[]
> {
  const res = await db.query<{
    id: string;
    title: string | null;
    topic: string | null;
    updated_at: Date;
    storage_mode: "postgres" | "memory";
  }>(
    `SELECT c.id,
            c.topic,
            c.updated_at,
            c.storage_mode,
            (
              SELECT left(m.body, 200)
              FROM ai_messages m
              WHERE m.conversation_id = c.id AND m.role = 'user'
              ORDER BY m.created_at ASC
              LIMIT 1
            ) AS title
     FROM ai_conversations c
     WHERE c.owner_session_id = $1
     ORDER BY c.updated_at DESC
     LIMIT 80`,
    [ownerSessionId],
  );
  return res.rows.map((row) => ({
    id: row.id,
    title: row.title,
    topic: row.topic,
    updatedAt: row.updated_at,
    store: row.storage_mode,
  }));
}

export { parseState };
