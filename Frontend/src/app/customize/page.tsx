import type { Metadata } from "next";
import { Suspense } from "react";
import { CustomizePage } from "@/features/customize";
import { CUSTOMIZE } from "@/features/customize";
import { getCatalogForPage } from "@/server/catalogGateway";

export const metadata: Metadata = {
  title: CUSTOMIZE.metaTitle,
  description: CUSTOMIZE.metaDescription,
  alternates: { canonical: "/customize" },
};

async function CustomizeCatalog() {
  const catalog = await getCatalogForPage();
  return <CustomizePage regions={catalog.regions} />;
}

export default function CustomizeRoutePage() {
  return (
    <Suspense fallback={null}>
      <CustomizeCatalog />
    </Suspense>
  );
}
