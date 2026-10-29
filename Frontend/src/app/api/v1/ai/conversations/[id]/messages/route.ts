/**
 * POST /api/v1/ai/conversations/:id/messages
 * Validates body; returns 503 NOT_CONFIGURED — never streams fake answers.
 */
import { NextResponse } from "next/server";
import { AI_MAX_INPUT_CHARS } from "@/features/ai-advisor/model/aiContent";
import { aiNotConfiguredResponse } from "@/features/ai-advisor/server/aiNotConfigured";
import type { AiMessageRequest, ApiErrorBody } from "@/shared/lib/apiContracts";

type RouteContext = { params: Promise<{ id: string }> };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validate(
  body: unknown,
):
  | { ok: true; data: AiMessageRequest }
  | { ok: false; message: string } {
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

  const data: AiMessageRequest = {
    clientRequestId,
    message,
  };
  if (locale) data.locale = locale;

  if (body.context !== undefined) {
    if (!isRecord(body.context)) {
      return { ok: false, message: "context must be an object." };
    }
    const topicRaw = body.context.topic;
    if (typeof topicRaw === "string" && topicRaw.length > 0) {
      data.context = {
        topic: topicRaw as NonNullable<AiMessageRequest["context"]>["topic"],
      };
    }
  }

  return { ok: true, data };
}

export async function POST(request: Request, context: RouteContext) {
  await context.params;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    const body: ApiErrorBody = {
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid JSON body.",
      },
    };
    return NextResponse.json(body, { status: 400 });
  }

  const parsed = validate(json);
  if (!parsed.ok) {
    const body: ApiErrorBody = {
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        message: parsed.message,
      },
    };
    return NextResponse.json(body, { status: 400 });
  }

  // Validated — still no model/backend. Never invent stream deltas.
  void parsed.data;
  return aiNotConfiguredResponse(
    "RunRacks AI isn’t connected yet. Use Contact or Pricing for now.",
  );
}
