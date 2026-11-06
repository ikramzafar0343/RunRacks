/**
 * GET /api/v1/ready — live Backend probe (env alone never yields ready: true).
 */
import { NextResponse } from "next/server";
import { getIntegrationStatus } from "@/shared/config/env";
import { probeBackendReady } from "@/server/backendProbe";
import type {
  ApiErrorBody,
  ApiSuccessBody,
  ReadyBlockedData,
  ReadyData,
} from "@/shared/lib/apiContracts";

export async function GET(): Promise<
  NextResponse<ApiSuccessBody<ReadyData> | ApiErrorBody>
> {
  const status = getIntegrationStatus();
  const timestamp = new Date().toISOString();
  const probe = await probeBackendReady();

  if (!probe.ready) {
    const blocked: ReadyBlockedData = {
      service: "frontend",
      status: "not_ready",
      backendConfigured: status.backendConfigured,
      // Frontend DATABASE_URL is unused; report Backend probe when known.
      databaseConfigured: probe.databaseConfigured ?? status.databaseConfigured,
      timestamp,
    };

    const message = !status.backendConfigured
      ? "BACKEND_API_BASE_URL is not configured."
      : probe.detail;

    const body: ApiErrorBody = {
      ok: false,
      error: {
        code: "NOT_CONFIGURED",
        message,
        details: {
          ...blocked,
          probe,
          frontendDatabaseUrlSet: status.databaseConfigured,
        },
      },
    };

    return NextResponse.json(body, { status: 503 });
  }

  const body: ApiSuccessBody<ReadyData> = {
    ok: true,
    data: {
      service: "frontend",
      status: "ready",
      backendConfigured: true,
      // Reflect Backend Postgres verification — not Frontend DATABASE_URL.
      databaseConfigured: probe.databaseConfigured === true,
      timestamp,
    },
  };

  return NextResponse.json(body);
}
