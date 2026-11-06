/**
 * GET/DELETE /api/v1/ai/conversations/:id — proxy when Backend AI is live.
 */
import { aiNotConfiguredResponse } from "@/features/ai-advisor/server/aiNotConfigured";
import {
  forwardUpstream,
  gateAiBackendProxy,
  withForwardedCookies,
} from "@/server/aiBackendProxy";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const gate = await gateAiBackendProxy();
  if (!gate.ok) {
    return aiNotConfiguredResponse(
      "Conversation history isn’t available until the AI backend is connected.",
    );
  }
  const upstream = await fetch(
    `${gate.baseUrl}/v1/ai/conversations/${encodeURIComponent(id)}`,
    {
      method: "GET",
      headers: withForwardedCookies(request),
      cache: "no-store",
    },
  );
  return forwardUpstream(upstream);
}

export async function DELETE(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const gate = await gateAiBackendProxy();
  if (!gate.ok) {
    return aiNotConfiguredResponse(
      "Clearing chats isn’t available until conversation storage is connected.",
    );
  }
  const upstream = await fetch(
    `${gate.baseUrl}/v1/ai/conversations/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: withForwardedCookies(request),
      cache: "no-store",
    },
  );
  return forwardUpstream(upstream);
}
