/**
 * GET /api/v1/ai/sources/:sourceId — proxy when Backend AI is live.
 */
import { aiNotConfiguredResponse } from "@/features/ai-advisor/server/aiNotConfigured";
import {
  forwardUpstream,
  gateAiBackendProxy,
  withForwardedCookies,
} from "@/server/aiBackendProxy";

type RouteContext = { params: Promise<{ sourceId: string }> };

export async function GET(request: Request, context: RouteContext) {
  const { sourceId } = await context.params;
  const gate = await gateAiBackendProxy();
  if (!gate.ok) {
    return aiNotConfiguredResponse(
      "Knowledge sources aren’t indexed for AI yet.",
    );
  }
  const upstream = await fetch(
    `${gate.baseUrl}/v1/ai/sources/${encodeURIComponent(sourceId)}`,
    {
      method: "GET",
      headers: withForwardedCookies(request),
      cache: "no-store",
    },
  );
  return forwardUpstream(upstream);
}
