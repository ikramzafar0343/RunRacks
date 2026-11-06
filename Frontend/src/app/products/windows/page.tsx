/**
 * Windows product route — static shell; URL filters read client-side in pricing.
 */
import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductHostingPage } from "@/features/product-hosting";
import { PRODUCT_HOSTING } from "@/features/product-hosting";
import { getCatalogForPage } from "@/server/catalogGateway";

const content = PRODUCT_HOSTING.windows;

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/products/windows" },
};

async function WindowsCatalogPage() {
  return (
    <ProductHostingPage
      product="windows"
      initialCatalog={await getCatalogForPage()}
      initialFamily="windows"
    />
  );
}

export default function WindowsProductRoute() {
  return (
    <Suspense fallback={null}>
      <WindowsCatalogPage />
    </Suspense>
  );
}
