/**
 * VPS Hosting in USA — static shell; pricing filters resolve client-side.
 */
import type { Metadata } from "next";
import { Suspense } from "react";
import { VpsUsaPage } from "@/features/vps-usa/components/VpsUsaPage";
import { VPS_USA } from "@/features/vps-usa/model/vpsUsaContent";
import { getCatalogForPage } from "@/server/catalogGateway";

export const metadata: Metadata = {
  title: VPS_USA.metaTitle,
  description: VPS_USA.metaDescription,
  alternates: { canonical: "/products/vps-usa" },
};

async function VpsUsaCatalogPage() {
  return <VpsUsaPage initialCatalog={await getCatalogForPage()} />;
}

export default function VpsUsaRoute() {
  return (
    <Suspense fallback={null}>
      <VpsUsaCatalogPage />
    </Suspense>
  );
}
