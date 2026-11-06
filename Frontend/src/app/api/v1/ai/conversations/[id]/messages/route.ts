/**
 * POST /api/v1/ai/conversations/:id/messages
 * Validates locally; proxies SSE stream when Backend AI is live.
 */
import { NextResponse } from "next/server";
import {
  AI_MAX_INPUT_CHARS,
  isAiMessageTopic,
} from "@/features/ai-advisor/model/aiContent";
import { aiNotConfiguredResponse } from "@/features/ai-advisor/server/aiNotConfigured";
import {
  forwardUpstream,
  gateAiBackendProxy,
  withForwardedCookies,
} from "@/server/aiBackendProxy";
import type { AiMessageRequest, ApiErrorBody } from "@/shared/lib/apiContracts";

type RouteContext = { params: Promise<{ id: string }> };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validate(
  body: unknown,
): { ok: true; data: AiMessageRequest } | { ok: false; message: string } {
  if (!isRecord(body)) {
    return { ok: false, message: "Request body must be a JSON object." };
  }

  const clientRequestId =
    typeof body.clientRequestId === "string" ? body.clientRequestId.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const locale =
    typeof body.locale === "string" ? body.locale.trim() : undefined;

  if (clientRequestId.length < 8 || clientRequestId.length > 128) {
    return {
      ok: false,
      message: "clientRequestId must be 8–128 characters.",
    };
  }
  if (message.length < 1) {
    return { ok: false, message: "Message cannot be empty." };
  }
  if (message.length > AI_MAX_INPUT_CHARS) {
    return {
      ok: false,
      message: `Message must be at most ${AI_MAX_INPUT_CHARS} characters.`,
    };
  }

  const data: AiMessageRequest = { clientRequestId, message };
  if (locale) data.locale = locale;

  if (body.context !== undefined) {
    if (!isRecord(body.context)) {
      return { ok: false, message: "context must be an object." };
    }
    const topicRaw = body.context.topic;
    if (topicRaw !== undefined) {
      if (!isAiMessageTopic(topicRaw)) {
        return {
          ok: false,
          message:
            "context.topic must be vps, windows, pricing, contact, or setup.",
        };
      }
      data.context = { topic: topicRaw };
    }
  }

  return { ok: true, data };
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    const body: ApiErrorBody = {
      ok: false,
      error: { code: "VALIDATION_ERROR", message: "Invalid JSON body." },
    };
    return NextResponse.json(body, { status: 400 });
  }

  const parsed = validate(json);
  if (!parsed.ok) {
    const body: ApiErrorBody = {
      ok: false,
      error: { code: "VALIDATION_ERROR", message: parsed.message },
    };
    return NextResponse.json(body, { status: 400 });
  }

  const gate = await gateAiBackendProxy();
  if (!gate.ok) {
    return aiNotConfiguredResponse(
      "RunRacks AI isn’t connected yet. Use Contact or Pricing for now.",
    );
  }

  const upstream = await fetch(
    `${gate.baseUrl}/v1/ai/conversations/${encodeURIComponent(id)}/messages`,
    {
      method: "POST",
      headers: withForwardedCookies(request, {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      }),
      body: JSON.stringify(parsed.data),
      cache: "no-store",
    },
  );
  return forwardUpstream(upstream);
}
