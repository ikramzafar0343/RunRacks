/**
 * GET /api/v1/vps/catalog — VPS plan catalog seam.
 * Serves labeled demo catalog until a live backend exists.
 * Response is explicitly source:demo — not a live integration success claim.
 */
import { NextResponse } from "next/server";
import { getDemoVpsCatalog } from "@/features/vps-pricing/model/demoCatalog";
import type { ApiSuccessBody } from "@/shared/lib/apiContracts";
import type { VpsCatalogPayload } from "@/features/vps-pricing/model/types";

export function GET(): NextResponse<ApiSuccessBody<VpsCatalogPayload>> {
  const catalog = getDemoVpsCatalog();

  const body: ApiSuccessBody<VpsCatalogPayload> = {
    ok: true,
    data: catalog,
  };

  return NextResponse.json(body, {
    headers: {
      "X-RunRacks-Data-Source": catalog.source,
      // Demo catalog is static; short cache avoids client flash without claiming live backend.
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  });
}
