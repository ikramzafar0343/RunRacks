/**
 * VPS product route — static shell; URL filters read client-side in pricing.
 */
import type { Metadata } from "next";
import { Suspense } from "react";
import { VpsProductPage } from "@/features/vps-product/components/VpsProductPage";
import { VPS_PRODUCT } from "@/features/vps-product/model/vpsProductContent";
import { getCatalogForPage } from "@/server/catalogGateway";

export const metadata: Metadata = {
  title: VPS_PRODUCT.metaTitle,
  description: VPS_PRODUCT.metaDescription,
  alternates: { canonical: "/products/vps" },
};

async function VpsCatalogPage() {
  return <VpsProductPage initialCatalog={await getCatalogForPage()} />;
}

export default function VpsProductRoute() {
  return (
    <Suspense fallback={null}>
      <VpsCatalogPage />
    </Suspense>
  );
}
