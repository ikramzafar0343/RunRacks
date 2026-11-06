/**
 * Storage mode is bound per conversation — never silent flip mid-chat.
 */
import type { AppContext } from "../../app/context.js";
import { pingDb, type Db } from "../../platform/db.js";
import * as repo from "./aiRepository.js";
import * as mem from "./aiMemoryStore.js";
import type { AiConversationRow, AiMessageRow } from "./aiRepository.js";

export type AiStore = {
  kind: "postgres" | "memory";
  db: Db | null;
  createConversation: (input: {
    id?: string;
    locale?: string;
    topic?: string | null;
    ownerSessionId?: string | null;
  }) => Promise<AiConversationRow>;
  ensureConversation: (
    id: string,
    input?: {
      locale?: string;
      topic?: string | null;
      ownerSessionId?: string | null;
    },
  ) => Promise<AiConversationRow>;
  getConversation: (id: string) => Promise<AiConversationRow | null>;
  saveState: (id: string, state: unknown) => Promise<void>;
  deleteConversation: (id: string) => Promise<boolean>;
  listMessages: (conversationId: string) => Promise<AiMessageRow[]>;
  findMessageByClientRequest: (
    conversationId: string,
    clientRequestId: string,
  ) => Promise<AiMessageRow | null>;
  hashPayload: (message: string, locale?: string, topic?: string | null) => string;
  getPayloadHash: (
    conversationId: string,
    clientRequestId: string,
  ) => Promise<string | null>;
  setPayloadHash: (
    conversationId: string,
    clientRequestId: string,
    hash: string,
  ) => Promise<void>;
  insertMessage: (input: {
    conversationId: string;
    role: "user" | "assistant" | "system";
    body: string;
    clientRequestId?: string | null;
    blocks?: unknown;
  }) => Promise<AiMessageRow>;
  getMessage: (
    conversationId: string,
    messageId: string,
  ) => Promise<AiMessageRow | null>;
  upsertFeedback: (
    messageId: string,
    rating: "up" | "down",
    note: string,
  ) => Promise<void>;
};

function memoryStore(): AiStore {
  return {
    kind: "memory",
    db: null,
    async createConversation(input) {
      return mem.memoryCreateConversation({ ...input, storageMode: "memory" });
    },
    async ensureConversation(id, input) {
      return mem.memoryEnsureConversation(id, input);
    },
    async getConversation(id) {
      return mem.memoryGetConversation(id);
    },
    async saveState(id, state) {
      mem.memorySaveState(id, state);
    },
    async deleteConversation(id) {
      return mem.memoryDeleteConversation(id);
    },
    async listMessages(conversationId) {
      return mem.memoryListMessages(conversationId);
    },
    async findMessageByClientRequest(conversationId, clientRequestId) {
      return mem.memoryFindMessageByClientRequest(conversationId, clientRequestId);
    },
    hashPayload: mem.memoryHashPayload,
    async getPayloadHash(cid, rid) {
      return mem.memoryGetPayloadHash(cid, rid);
    },
    async setPayloadHash(cid, rid, hash) {
      mem.memorySetPayloadHash(cid, rid, hash);
    },
    async insertMessage(input) {
      return mem.memoryInsertMessage(input);
    },
    async getMessage(conversationId, messageId) {
      return mem.memoryGetMessage(conversationId, messageId);
    },
    async upsertFeedback(messageId, rating, note) {
      mem.memoryUpsertFeedback(messageId, rating, note);
    },
  };
}

function postgresStore(db: Db): AiStore {
  return {
    kind: "postgres",
    db,
    createConversation: (input) =>
      repo.createConversation(db, { ...input, storageMode: "postgres" }),
    ensureConversation: (id, input) =>
      repo.ensureConversation(db, id, { ...input, storageMode: "postgres" }),
    getConversation: (id) => repo.getConversation(db, id),
    saveState: (id, state) => repo.saveConversationState(db, id, state),
    deleteConversation: (id) => repo.deleteConversation(db, id),
    listMessages: (id) => repo.listMessages(db, id),
    findMessageByClientRequest: (cid, rid) =>
      repo.findMessageByClientRequest(db, cid, rid),
    hashPayload: repo.hashPayload,
    getPayloadHash: (cid, rid) => repo.getPayloadHash(db, cid, rid),
    setPayloadHash: (cid, rid, hash) => repo.setPayloadHash(db, cid, rid, hash),
    insertMessage: (input) => repo.insertMessage(db, input),
    getMessage: (cid, mid) => repo.getMessage(db, cid, mid),
    upsertFeedback: (mid, rating, note) =>
      repo.upsertFeedback(db, mid, rating, note),
  };
}

/** Prefer Postgres when healthy; otherwise memory. Mode sticks on the conversation row. */
export async function resolvePreferredStore(ctx: AppContext): Promise<AiStore> {
  if (!ctx.db) return memoryStore();
  try {
    if (await pingDb(ctx.db)) return postgresStore(ctx.db);
  } catch {
    /* fall through */
  }
  return memoryStore();
}

/** Bind to an existing conversation's storage_mode — no silent flip. */
export async function storeForConversation(
  ctx: AppContext,
  conversationId: string,
): Promise<{ store: AiStore; convo: AiConversationRow | null; modeError?: string }> {
  const preferred = await resolvePreferredStore(ctx);
  const fromPref = await preferred.getConversation(conversationId);
  if (fromPref) {
    if (fromPref.storage_mode === "postgres" && preferred.kind !== "postgres") {
      return {
        store: preferred,
        convo: null,
        modeError:
          "This conversation was saved to the database, which is temporarily unavailable. Start a new temporary chat or retry later.",
      };
    }
    if (fromPref.storage_mode === "memory") {
      const mem = memoryStore();
      const c = await mem.getConversation(conversationId);
      return { store: mem, convo: c };
    }
    return { store: preferred, convo: fromPref };
  }
  // New conversation — try other store in case of prior memory
  if (preferred.kind === "postgres") {
    const mem = memoryStore();
    const c = await mem.getConversation(conversationId);
    if (c) return { store: mem, convo: c };
  }
  return { store: preferred, convo: null };
}
