/**
 * Windows Hosting in USA — static shell; pricing filters resolve client-side.
 */
import type { Metadata } from "next";
import { Suspense } from "react";
import { WindowsUsaPage } from "@/features/windows-usa/components/WindowsUsaPage";
import { WINDOWS_USA } from "@/features/windows-usa/model/windowsUsaContent";
import { getCatalogForPage } from "@/server/catalogGateway";

export const metadata: Metadata = {
  title: WINDOWS_USA.metaTitle,
  description: WINDOWS_USA.metaDescription,
  alternates: { canonical: "/products/windows-usa" },
};

async function WindowsUsaCatalogPage() {
  return <WindowsUsaPage initialCatalog={await getCatalogForPage()} />;
}

export default function WindowsUsaRoute() {
  return (
    <Suspense fallback={null}>
      <WindowsUsaCatalogPage />
    </Suspense>
  );
}
