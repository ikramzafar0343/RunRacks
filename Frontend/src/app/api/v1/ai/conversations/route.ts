/**
 * GET/POST /api/v1/ai/conversations — proxy to Backend when AI is live.
 */
import { aiNotConfiguredResponse } from "@/features/ai-advisor/server/aiNotConfigured";
import {
  forwardUpstream,
  gateAiBackendProxy,
  withForwardedCookies,
} from "@/server/aiBackendProxy";

export async function GET(request: Request) {
  const gate = await gateAiBackendProxy();
  if (!gate.ok) {
    return aiNotConfiguredResponse(
      "Chat history isn’t available until the AI backend is connected.",
    );
  }
  const upstream = await fetch(`${gate.baseUrl}/v1/ai/conversations`, {
    method: "GET",
    headers: withForwardedCookies(request),
    cache: "no-store",
  });
  return forwardUpstream(upstream);
}

export async function POST(request: Request) {
  const gate = await gateAiBackendProxy();
  if (!gate.ok) {
    return aiNotConfiguredResponse(
      "Conversation storage isn’t connected yet. AI chat will open when the backend is ready.",
    );
  }

  const body = await request.text();
  const upstream = await fetch(`${gate.baseUrl}/v1/ai/conversations`, {
    method: "POST",
    headers: withForwardedCookies(request, {
      "Content-Type": "application/json",
    }),
    body,
    cache: "no-store",
  });
  return forwardUpstream(upstream);
}
