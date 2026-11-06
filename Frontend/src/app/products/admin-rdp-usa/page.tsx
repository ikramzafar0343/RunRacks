/**
 * Admin RDP in USA — static shell; pricing filters resolve client-side.
 */
import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminRdpUsaPage } from "@/features/admin-rdp-usa/components/AdminRdpUsaPage";
import { ADMIN_RDP_USA } from "@/features/admin-rdp-usa/model/adminRdpUsaContent";
import { getCatalogForPage } from "@/server/catalogGateway";

export const metadata: Metadata = {
  title: ADMIN_RDP_USA.metaTitle,
  description: ADMIN_RDP_USA.metaDescription,
  alternates: { canonical: "/products/admin-rdp-usa" },
};

async function AdminRdpUsaCatalogPage() {
  return <AdminRdpUsaPage initialCatalog={await getCatalogForPage()} />;
}

export default function AdminRdpUsaRoute() {
  return (
    <Suspense fallback={null}>
      <AdminRdpUsaCatalogPage />
    </Suspense>
  );
}
