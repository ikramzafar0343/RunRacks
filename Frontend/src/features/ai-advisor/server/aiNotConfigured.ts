/**
 * Shared 503 NOT_CONFIGURED body for AI Advisor seams.
 */
import { NextResponse } from "next/server";
import type { ApiErrorBody } from "@/shared/lib/apiContracts";

export function aiNotConfiguredResponse(
  message = "RunRacks AI isn’t connected yet. Use Contact or Pricing for now.",
): NextResponse<ApiErrorBody> {
  const body: ApiErrorBody = {
    ok: false,
    error: {
      code: "NOT_CONFIGURED",
      message,
      details: {
        supportHref: "/contact",
        pricingHref: "/pricing",
      },
    },
  };
  return NextResponse.json(body, { status: 503 });
}
