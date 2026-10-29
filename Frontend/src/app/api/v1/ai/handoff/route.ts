/**
 * POST /api/v1/ai/handoff — no fake tickets; point visitors to /contact.
 */
import { aiNotConfiguredResponse } from "@/features/ai-advisor/server/aiNotConfigured";

export function POST() {
  return aiNotConfiguredResponse(
    "Automated handoff isn’t connected. Use /contact to reach engineers.",
  );
}
