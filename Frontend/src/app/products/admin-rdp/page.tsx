/**
 * Admin RDP product route — editorial Brandium-layout page, Sage & Ink.
 */
import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminRdpPage } from "@/features/admin-rdp/components/AdminRdpPage";
import { ADMIN_RDP } from "@/features/admin-rdp/model/adminRdpContent";
import { getCatalogForPage } from "@/server/catalogGateway";

export const metadata: Metadata = {
  title: ADMIN_RDP.metaTitle,
  description: ADMIN_RDP.metaDescription,
  alternates: { canonical: "/products/admin-rdp" },
};

async function AdminRdpCatalogPage() {
  return <AdminRdpPage initialCatalog={await getCatalogForPage()} />;
}

export default function AdminRdpProductRoute() {
  return (
    <Suspense fallback={null}>
      <AdminRdpCatalogPage />
    </Suspense>
  );
}
