/**
 * /v1/ai/* — owned agent; session ownership; SSE messages.
 */
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { AppContext } from "../../app/context.js";
import { isAiConfigured } from "../../platform/config.js";
import {
  AI_OWNED_DISCLAIMER,
  AI_STARTERS,
  AI_TOPICS,
  PRODUCT_BLURBS,
} from "./aiPublicConfig.js";
import { listOwnedChats } from "./aiChatList.js";
import { resolvePreferredStore, storeForConversation } from "./aiStore.js";
import { handleUserMessage } from "./aiService.js";
import { KNOWLEDGE_ENTRIES } from "./knowledge/entries.js";
import {
  apiError,
  ensureGuest,
  openSse,
  requireAi,
} from "./aiRouteHelpers.js";

const createSchema = z.object({
  locale: z.string().trim().min(2).max(16).optional(),
  topic: z.enum(["vps", "windows", "pricing", "contact", "setup"]).optional(),
});

const messageSchema = z.object({
  clientRequestId: z.string().trim().min(8).max(128),
  message: z.string().trim().min(1),
  locale: z.string().trim().min(2).max(16).optional(),
  context: z
    .object({
      topic: z
        .enum(["vps", "windows", "pricing", "contact", "setup"])
        .optional(),
    })
    .optional(),
});

export async function registerAiRoutes(
  app: FastifyInstance,
  ctx: AppContext,
): Promise<void> {
  app.get("/v1/ai/config", async () => {
    const ready = isAiConfigured(ctx.config);
    return {
      ok: true,
      data: {
        status: ready ? ("ready" as const) : ("not_configured" as const),
        enabled: ready,
        maxInputChars: ctx.config.aiMaxInputChars,
        topics: AI_TOPICS,
        starters: AI_STARTERS,
        disclaimer: ready
          ? AI_OWNED_DISCLAIMER
          : "AI is disabled. Use Pricing or Contact.",
        supportHref: "/contact",
        timestamp: new Date().toISOString(),
        provider: "owned",
        disclosure: "Automated hosting advisor",
      },
    };
  });

  app.get("/v1/ai/conversations", async (req, reply) => {
    if (!requireAi(ctx, reply)) return;
    const owner = ensureGuest(ctx, req, reply);
    const listed = await listOwnedChats(ctx, owner);
    return { ok: true, data: listed };
  });

  app.post(
    "/v1/ai/conversations",
    { config: { rateLimit: { max: 20, timeWindow: "1 minute" } } },
    async (req, reply) => {
      if (!requireAi(ctx, reply)) return;
      const owner = ensureGuest(ctx, req, reply);
      const parsed = createSchema.safeParse(req.body ?? {});
      if (!parsed.success) {
        return apiError(reply, 400, "VALIDATION_ERROR", "Invalid conversation payload");
      }
      const store = await resolvePreferredStore(ctx);
      const row = await store.createConversation({
        ...(parsed.data.locale ? { locale: parsed.data.locale } : {}),
        topic: parsed.data.topic ?? null,
        ownerSessionId: owner,
      });
      return reply.status(201).send({
        ok: true,
        data: {
          id: row.id,
          locale: row.locale,
          topic: row.topic,
          createdAt: row.created_at.toISOString(),
          store: store.kind,
        },
      });
    },
  );

  app.get("/v1/ai/conversations/:id", async (req, reply) => {
    if (!requireAi(ctx, reply)) return;
    const owner = ensureGuest(ctx, req, reply);
    const { id } = req.params as { id: string };
    const { store, convo, modeError } = await storeForConversation(ctx, id);
    if (modeError) return apiError(reply, 503, "UPSTREAM_UNAVAILABLE", modeError);
    if (!convo) return apiError(reply, 404, "NOT_FOUND", "Conversation not found");
    if (convo.owner_session_id && convo.owner_session_id !== owner) {
      return apiError(reply, 403, "FORBIDDEN", "Conversation access denied");
    }
    const messages = await store.listMessages(id);
    return {
      ok: true,
      data: {
        id: convo.id,
        locale: convo.locale,
        topic: convo.topic,
        createdAt: convo.created_at.toISOString(),
        store: store.kind,
        messages: messages.map((m) => ({
          id: m.id,
          role: m.role,
          body: m.body,
          blocks: m.blocks ?? [],
          createdAt: m.created_at.toISOString(),
        })),
      },
    };
  });

  app.delete("/v1/ai/conversations/:id", async (req, reply) => {
    if (!requireAi(ctx, reply)) return;
    const owner = ensureGuest(ctx, req, reply);
    const { id } = req.params as { id: string };
    const { store, convo, modeError } = await storeForConversation(ctx, id);
    if (modeError) return apiError(reply, 503, "UPSTREAM_UNAVAILABLE", modeError);
    if (!convo) return apiError(reply, 404, "NOT_FOUND", "Conversation not found");
    if (convo.owner_session_id && convo.owner_session_id !== owner) {
      return apiError(reply, 403, "FORBIDDEN", "Conversation access denied");
    }
    await store.deleteConversation(id);
    return { ok: true, data: { deleted: true } };
  });

  app.post(
    "/v1/ai/conversations/:id/messages",
    { config: { rateLimit: { max: 30, timeWindow: "1 minute" } } },
    async (req, reply) => {
      if (!requireAi(ctx, reply)) return;
      const owner = ensureGuest(ctx, req, reply);
      const { id } = req.params as { id: string };
      const parsed = messageSchema.safeParse(req.body);
      if (!parsed.success) {
        return apiError(reply, 400, "VALIDATION_ERROR", "Invalid message payload");
      }
      if (parsed.data.message.length > ctx.config.aiMaxInputChars) {
        return apiError(
          reply,
          400,
          "VALIDATION_ERROR",
          `Message must be at most ${ctx.config.aiMaxInputChars} characters.`,
        );
      }

      const bound = await storeForConversation(ctx, id);
      if (bound.modeError) {
        return apiError(reply, 503, "UPSTREAM_UNAVAILABLE", bound.modeError);
      }
      let store = bound.store;
      let convo = bound.convo;
      if (!convo) {
        store = await resolvePreferredStore(ctx);
        convo = await store.ensureConversation(id, {
          ...(parsed.data.locale ? { locale: parsed.data.locale } : {}),
          topic: parsed.data.context?.topic ?? null,
          ownerSessionId: owner,
        });
      } else if (convo.owner_session_id && convo.owner_session_id !== owner) {
        return apiError(reply, 403, "FORBIDDEN", "Conversation access denied");
      }

      const sse = openSse(reply);
      await handleUserMessage({
        store,
        conversationId: convo.id,
        clientRequestId: parsed.data.clientRequestId,
        message: parsed.data.message,
        ...(parsed.data.locale ? { locale: parsed.data.locale } : {}),
        topic: parsed.data.context?.topic ?? null,
        sse,
      });
    },
  );

  app.post(
    "/v1/ai/conversations/:id/messages/:messageId/feedback",
    async (req, reply) => {
      if (!requireAi(ctx, reply)) return;
      const owner = ensureGuest(ctx, req, reply);
      const { id, messageId } = req.params as { id: string; messageId: string };
      const body = z
        .object({
          rating: z.enum(["up", "down"]),
          note: z.string().trim().max(500).optional(),
        })
        .safeParse(req.body);
      if (!body.success) {
        return apiError(reply, 400, "VALIDATION_ERROR", "Invalid feedback");
      }
      const { store, convo, modeError } = await storeForConversation(ctx, id);
      if (modeError) return apiError(reply, 503, "UPSTREAM_UNAVAILABLE", modeError);
      if (!convo) return apiError(reply, 404, "NOT_FOUND", "Conversation not found");
      if (convo.owner_session_id && convo.owner_session_id !== owner) {
        return apiError(reply, 403, "FORBIDDEN", "Conversation access denied");
      }
      const msg = await store.getMessage(id, messageId);
      if (!msg) return apiError(reply, 404, "NOT_FOUND", "Message not found");
      await store.upsertFeedback(messageId, body.data.rating, body.data.note ?? "");
      return { ok: true, data: { saved: true, store: store.kind } };
    },
  );

  app.get("/v1/ai/sources/:sourceId", async (req, reply) => {
    if (!requireAi(ctx, reply)) return;
    const { sourceId } = req.params as { sourceId: string };
    const kb = KNOWLEDGE_ENTRIES.find(
      (e) => e.id === sourceId && e.status === "published",
    );
    if (kb) {
      return {
        ok: true,
        data: {
          id: kb.id,
          title: kb.title,
          body: { summary: kb.body, sourceRef: kb.sourceRef },
        },
      };
    }
    const blurbKey =
      sourceId === "ai-blurb-linux-vps"
        ? "linux_vps"
        : sourceId === "ai-blurb-windows-vps"
          ? "windows_vps"
          : sourceId === "ai-blurb-admin-rdp"
            ? "admin_rdp"
            : null;
    if (blurbKey) {
      const b = PRODUCT_BLURBS[blurbKey];
      return {
        ok: true,
        data: {
          id: sourceId,
          title: b.title,
          body: { summary: b.summary, href: b.href, source: "builtin" },
        },
      };
    }
    return apiError(reply, 404, "NOT_FOUND", "Source not found");
  });

  app.post("/v1/ai/handoff", async (_req, reply) => {
    return apiError(
      reply,
      503,
      "NOT_CONFIGURED",
      "Automated handoff isn’t connected. Use /contact to reach engineers.",
      { supportHref: "/contact" },
    );
  });
}
