/**
 * POST /api/v1/ai/conversations — create conversation.
 * 503 until Backend/DB persistence exists.
 */
import { aiNotConfiguredResponse } from "@/features/ai-advisor/server/aiNotConfigured";

export function POST() {
  return aiNotConfiguredResponse(
    "Conversation storage isn’t connected yet. AI chat will open when the backend is ready.",
  );
}
