/**
 * POST /api/v1/ai/handoff — still no fake tickets; proxy or point to /contact.
 */
import { aiNotConfiguredResponse } from "@/features/ai-advisor/server/aiNotConfigured";
import {
  forwardUpstream,
  gateAiBackendProxy,
  withForwardedCookies,
} from "@/server/aiBackendProxy";

export async function POST(request: Request) {
  const gate = await gateAiBackendProxy();
  if (!gate.ok) {
    return aiNotConfiguredResponse(
      "Automated handoff isn’t connected. Use /contact to reach engineers.",
    );
  }
  const body = await request.text();
  const upstream = await fetch(`${gate.baseUrl}/v1/ai/handoff`, {
    method: "POST",
    headers: withForwardedCookies(request, {
      "Content-Type": "application/json",
    }),
    body,
    cache: "no-store",
  });
  return forwardUpstream(upstream);
}
