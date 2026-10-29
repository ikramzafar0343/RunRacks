/**
 * GET /api/health — App Router Route Handler
 *
 * File path = URL: src/app/api/health/route.ts → /api/health
 * Exporting GET means this function runs on HTTP GET.
 *
 * Purpose: "Is the Next.js process up?" — does NOT check DB/backend.
 * For integration readiness, see /api/v1/ready.
 */
import { NextResponse } from "next/server";
import type { ApiSuccessBody, HealthData } from "@/shared/lib/apiContracts";

export function GET(): NextResponse<ApiSuccessBody<HealthData>> {
  const body: ApiSuccessBody<HealthData> = {
    ok: true,
    data: {
      service: "frontend",
      status: "ok",
      timestamp: new Date().toISOString(),
    },
  };

  // NextResponse.json sets Content-Type and serializes the typed body.
  return NextResponse.json(body);
}
