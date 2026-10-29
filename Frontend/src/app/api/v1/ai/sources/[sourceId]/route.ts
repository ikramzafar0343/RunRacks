/**
 * GET /api/v1/ai/sources/:sourceId — 503 until published knowledge index exists.
 */
import { aiNotConfiguredResponse } from "@/features/ai-advisor/server/aiNotConfigured";

type RouteContext = { params: Promise<{ sourceId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  await context.params;
  return aiNotConfiguredResponse(
    "Knowledge sources aren’t indexed for AI yet.",
  );
}
