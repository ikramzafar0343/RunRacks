/**
 * GET /api/v1/ai/config — ready only after live Backend AI probe.
 */
import { NextResponse } from "next/server";
import {
  AI_COPY,
  AI_MAX_INPUT_CHARS,
  AI_STARTERS_PUBLIC,
  AI_TOPICS,
} from "@/features/ai-advisor/model/aiContent";
import { probeAiReady } from "@/server/aiProbe";
import { forwardUpstream, gateAiBackendProxy } from "@/server/aiBackendProxy";
import type { AiConfigData, ApiSuccessBody } from "@/shared/lib/apiContracts";

export async function GET(): Promise<
  NextResponse<ApiSuccessBody<AiConfigData>> | Response
> {
  const gate = await gateAiBackendProxy();
  if (gate.ok) {
    const upstream = await fetch(`${gate.baseUrl}/v1/ai/config`, {
      method: "GET",
      cache: "no-store",
    });
    if (upstream.ok) {
      return forwardUpstream(upstream);
    }
  }

  const probe = await probeAiReady();
  const timestamp = new Date().toISOString();
  const status = probe.ready ? "ready" : "not_configured";

  const data: AiConfigData = {
    status,
    enabled: probe.ready,
    maxInputChars: AI_MAX_INPUT_CHARS,
    topics: AI_TOPICS,
    starters: AI_STARTERS_PUBLIC,
    disclaimer: AI_COPY.disclaimer,
    supportHref: "/contact",
    timestamp,
  };

  return NextResponse.json({ ok: true, data });
}
