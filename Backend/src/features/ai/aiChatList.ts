/**
 * Chats owned by one guest session. Postgres when the database answers.
 */
import type { AppContext } from "../../app/context.js";
import { pingDb } from "../../platform/db.js";
import * as repo from "./aiRepository.js";
import { memoryListOwned } from "./aiMemoryStore.js";

export type OwnedChat = {
  id: string;
  title: string;
  topic: string | null;
  updatedAt: string;
  store: "postgres" | "memory";
};

type RawChat = {
  id: string;
  title: string | null;
  topic: string | null;
  updatedAt: Date;
  store: "postgres" | "memory";
};

const LIMIT = 40;

function clipTitle(raw: string): string {
  const flat = raw.replace(/\s+/g, " ").trim();
  if (!flat) return "";
  return flat.length <= 80 ? flat : `${flat.slice(0, 79)}…`;
}

function toOwned(row: RawChat): OwnedChat | null {
  if (!row.title) return null;
  const title = clipTitle(row.title);
  if (!title) return null;
  return {
    id: row.id,
    title,
    topic: row.topic,
    updatedAt: row.updatedAt.toISOString(),
    store: row.store,
  };
}

export async function listOwnedChats(
  ctx: AppContext,
  ownerSessionId: string,
): Promise<{ chats: OwnedChat[]; databaseUnavailable: boolean }> {
  const temporary = memoryListOwned(ownerSessionId);
  let saved: RawChat[] = [];
  let databaseUnavailable = false;
  if (ctx.db) {
    try {
      if (await pingDb(ctx.db)) {
        saved = await repo.listOwnedConversations(ctx.db, ownerSessionId);
      } else {
        databaseUnavailable = true;
      }
    } catch {
      databaseUnavailable = true;
    }
  }

  const byId = new Map<string, OwnedChat>();
  for (const row of saved) {
    const chat = toOwned(row);
    if (chat) byId.set(chat.id, chat);
  }
  for (const row of temporary) {
    if (byId.has(row.id)) continue;
    const chat = toOwned(row);
    if (chat) byId.set(chat.id, chat);
  }

  const chats = [...byId.values()]
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, LIMIT);
  return { chats, databaseUnavailable };
}
