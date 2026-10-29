/**
 * VPS product route — static shell; URL filters read client-side in pricing.
 */
import type { Metadata } from "next";
import { VpsProductPage } from "@/features/vps-product/components/VpsProductPage";
import { VPS_PRODUCT } from "@/features/vps-product/model/vpsProductContent";
import { getDemoVpsCatalog } from "@/features/vps-pricing/model/demoCatalog";

export const metadata: Metadata = {
  title: VPS_PRODUCT.metaTitle,
  description: VPS_PRODUCT.metaDescription,
  alternates: { canonical: "/products/vps" },
};

export default function VpsProductRoute() {
  return <VpsProductPage initialCatalog={getDemoVpsCatalog()} />;
}
