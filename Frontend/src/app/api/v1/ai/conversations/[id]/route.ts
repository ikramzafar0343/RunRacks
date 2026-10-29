/**
 * GET/DELETE /api/v1/ai/conversations/:id
 * 503 until Backend owns persistence and authz.
 */
import { aiNotConfiguredResponse } from "@/features/ai-advisor/server/aiNotConfigured";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  await context.params;
  return aiNotConfiguredResponse(
    "Conversation history isn’t available until the AI backend is connected.",
  );
}

export async function DELETE(_request: Request, context: RouteContext) {
  await context.params;
  return aiNotConfiguredResponse(
    "Clearing chats isn’t available until conversation storage is connected.",
  );
}
