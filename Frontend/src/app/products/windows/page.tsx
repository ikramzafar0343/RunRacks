/**
 * Windows product route — static shell; URL filters read client-side in pricing.
 */
import type { Metadata } from "next";
import { ProductHostingPage } from "@/features/product-hosting/components/ProductHostingPage";
import { PRODUCT_HOSTING } from "@/features/product-hosting/model/productHostingContent";
import { getDemoVpsCatalog } from "@/features/vps-pricing/model/demoCatalog";

const content = PRODUCT_HOSTING.windows;

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/products/windows" },
};

export default function WindowsProductRoute() {
  return (
    <ProductHostingPage
      product="windows"
      initialCatalog={getDemoVpsCatalog()}
      initialFamily="windows"
    />
  );
}
