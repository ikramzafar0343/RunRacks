/**
 * POST .../messages/:messageId/feedback — 503 until Backend persists feedback.
 */
import { aiNotConfiguredResponse } from "@/features/ai-advisor/server/aiNotConfigured";

type RouteContext = {
  params: Promise<{ id: string; messageId: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  await context.params;
  return aiNotConfiguredResponse(
    "Feedback isn’t stored yet — AI backend isn’t connected.",
  );
}
