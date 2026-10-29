/**
 * GET /api/v1/ready — integration readiness seam
 *
 * Always 503 until real backend + DB probes exist.
 * Env vars alone never yield ready: true.
 */
import { NextResponse } from "next/server";
import { getIntegrationStatus } from "@/shared/config/env";
import type {
  ApiErrorBody,
  ApiSuccessBody,
  ReadyBlockedData,
  ReadyData,
} from "@/shared/lib/apiContracts";

export function GET(): NextResponse<ApiSuccessBody<ReadyData> | ApiErrorBody> {
  const status = getIntegrationStatus();
  const timestamp = new Date().toISOString();

  if (!status.isReady) {
    const blocked: ReadyBlockedData = {
      service: "frontend",
      status: "not_ready",
      backendConfigured: status.backendConfigured,
      databaseConfigured: status.databaseConfigured,
      timestamp,
    };

    const message = status.isConfigured
      ? "Backend and database env are set, but live readiness probes are not implemented yet."
      : "Backend and database are not configured for this frontend yet.";

    const body: ApiErrorBody = {
      ok: false,
      error: {
        code: "NOT_CONFIGURED",
        message,
        details: blocked,
      },
    };

    return NextResponse.json(body, { status: 503 });
  }

  // Unreachable until real probes set isReady — kept for future contract.
  const body: ApiSuccessBody<ReadyData> = {
    ok: true,
    data: {
      service: "frontend",
      status: "ready",
      backendConfigured: true,
      databaseConfigured: true,
      timestamp,
    },
  };

  return NextResponse.json(body);
}
