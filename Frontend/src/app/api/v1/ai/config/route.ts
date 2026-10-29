/**
 * GET /api/v1/ai/config — public advisor config.
 * Always reports not_configured until real AI readiness probes exist.
 */
import { NextResponse } from "next/server";
import {
  AI_COPY,
  AI_MAX_INPUT_CHARS,
  AI_STARTERS_PUBLIC,
  AI_TOPICS,
} from "@/features/ai-advisor/model/aiContent";
import { getAiIntegrationStatus } from "@/shared/config/env";
import type { AiConfigData, ApiSuccessBody } from "@/shared/lib/apiContracts";

export function GET(): NextResponse<ApiSuccessBody<AiConfigData>> {
  const ai = getAiIntegrationStatus();
  const timestamp = new Date().toISOString();

  // Env alone never yields ready — probes required later.
  const status = ai.isReady ? "ready" : "not_configured";

  const data: AiConfigData = {
    status,
    enabled: ai.isReady,
    maxInputChars: AI_MAX_INPUT_CHARS,
    topics: AI_TOPICS,
    starters: AI_STARTERS_PUBLIC,
    disclaimer: AI_COPY.disclaimer,
    supportHref: "/contact",
    timestamp,
  };

  return NextResponse.json({ ok: true, data });
}
