/**
 * GET /api/v1/vps/catalog — demo until WHMCS-mapped Backend cache exists.
 * Always labels source honestly via X-RunRacks-Data-Source.
 */
import { NextResponse } from "next/server";
import { getCatalogForPage } from "@/server/catalogGateway";
import type { ApiSuccessBody } from "@/shared/lib/apiContracts";
import type { VpsCatalogPayload } from "@/features/vps-pricing";

export async function GET(): Promise<
  NextResponse<ApiSuccessBody<VpsCatalogPayload>>
> {
  const catalog = await getCatalogForPage();

  const body: ApiSuccessBody<VpsCatalogPayload> = {
    ok: true,
    data: catalog,
  };

  return NextResponse.json(body, {
    headers: {
      "X-RunRacks-Data-Source": catalog.source,
      "Cache-Control": "public, max-age=30, stale-while-revalidate=120",
    },
  });
}
