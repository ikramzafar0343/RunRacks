/**
 * POST .../messages/:messageId/feedback — proxy when Backend AI is live.
 */
import { aiNotConfiguredResponse } from "@/features/ai-advisor/server/aiNotConfigured";
import {
  forwardUpstream,
  gateAiBackendProxy,
  withForwardedCookies,
} from "@/server/aiBackendProxy";

type RouteContext = {
  params: Promise<{ id: string; messageId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { id, messageId } = await context.params;
  const gate = await gateAiBackendProxy();
  if (!gate.ok) {
    return aiNotConfiguredResponse(
      "Feedback isn’t stored yet — AI backend isn’t connected.",
    );
  }
  const body = await request.text();
  const upstream = await fetch(
    `${gate.baseUrl}/v1/ai/conversations/${encodeURIComponent(id)}/messages/${encodeURIComponent(messageId)}/feedback`,
    {
      method: "POST",
      headers: withForwardedCookies(request, {
        "Content-Type": "application/json",
      }),
      body,
      cache: "no-store",
    },
  );
  return forwardUpstream(upstream);
}
