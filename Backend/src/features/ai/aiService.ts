/**
 * Persist turn + SSE — complete only after successful persistence.
 */
import type { AiStore } from "./aiStore.js";
import { runTurn } from "./pipeline/runTurn.js";

export type SseWriter = {
  write: (event: string, data: Record<string, unknown>) => void;
  end: () => void;
};

const turnLocks = new Map<string, Promise<void>>();

async function withTurnLock(
  conversationId: string,
  fn: () => Promise<void>,
): Promise<void> {
  const prev = turnLocks.get(conversationId) ?? Promise.resolve();
  let release!: () => void;
  const gate = new Promise<void>((r) => {
    release = r;
  });
  turnLocks.set(
    conversationId,
    prev.then(() => gate),
  );
  await prev;
  try {
    await fn();
  } finally {
    release();
    if (turnLocks.get(conversationId) === gate) turnLocks.delete(conversationId);
  }
}

export async function handleUserMessage(input: {
  store: AiStore;
  conversationId: string;
  clientRequestId: string;
  message: string;
  locale?: string;
  topic?: string | null;
  sse: SseWriter;
}): Promise<void> {
  const { store, conversationId, clientRequestId, message, sse } = input;

  await withTurnLock(conversationId, async () => {
    const payloadHash = store.hashPayload(message, input.locale, input.topic);
    const priorHash = await store.getPayloadHash(conversationId, clientRequestId);
    if (priorHash && priorHash !== payloadHash) {
      sse.write("error", {
        code: "IDEMPOTENCY_CONFLICT",
        message: "This request id was already used with a different message.",
      });
      sse.end();
      return;
    }

    const existing = await store.findMessageByClientRequest(
      conversationId,
      clientRequestId,
    );
    if (existing) {
      const assistant = (await store.listMessages(conversationId)).find(
        (m) => m.role === "assistant" && m.created_at >= existing.created_at,
      );
      sse.write("message.accepted", {
        conversationId,
        messageId: existing.id,
        idempotent: true,
      });
      const text = assistant?.body ?? "";
      if (text) sse.write("response.delta", { text });
      if (assistant?.blocks && Array.isArray(assistant.blocks)) {
        for (const block of assistant.blocks as object[]) {
          sse.write("response.block", { block });
        }
      }
      sse.write("response.complete", {
        conversationId,
        messageId: assistant?.id ?? existing.id,
        text,
        store: store.kind,
      });
      sse.end();
      return;
    }

    await store.setPayloadHash(conversationId, clientRequestId, payloadHash);

    const userRow = await store.insertMessage({
      conversationId,
      role: "user",
      body: message,
      clientRequestId,
    });
    sse.write("message.accepted", {
      conversationId,
      messageId: userRow.id,
      idempotent: false,
    });

    try {
      const convo = await store.getConversation(conversationId);
      const history = (await store.listMessages(conversationId))
        .filter((m) => m.id !== userRow.id)
        .map((m) => ({ role: m.role, body: m.body }));

      const answer = await runTurn({
        db: store.db,
        message,
        history,
        priorState: convo?.state,
        ...(input.topic !== undefined ? { topic: input.topic } : {}),
      });

      const finalText = answer.text.trim();
      const assistantRow = await store.insertMessage({
        conversationId,
        role: "assistant",
        body: finalText,
        blocks: answer.blocks,
      });
      await store.saveState(conversationId, answer.state);

      const chunkSize = 48;
      for (let i = 0; i < finalText.length; i += chunkSize) {
        sse.write("response.delta", {
          text: finalText.slice(i, i + chunkSize),
        });
      }
      for (const block of answer.blocks) {
        sse.write("response.block", { block });
      }
      sse.write("response.complete", {
        conversationId,
        messageId: assistantRow.id,
        text: finalText,
        store: store.kind,
        templateId: answer.templateId,
      });
      sse.end();
    } catch (err) {
      sse.write("error", {
        code: "INTERNAL_ERROR",
        message: err instanceof Error ? err.message : "Owned agent failed",
      });
      sse.end();
    }
  });
}
