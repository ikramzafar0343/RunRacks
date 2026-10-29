/**
 * Admin RDP product route — editorial Brandium-layout page, Sage & Ink.
 */
import type { Metadata } from "next";
import { AdminRdpPage } from "@/features/admin-rdp/components/AdminRdpPage";
import { ADMIN_RDP } from "@/features/admin-rdp/model/adminRdpContent";
import { getDemoVpsCatalog } from "@/features/vps-pricing/model/demoCatalog";

export const metadata: Metadata = {
  title: ADMIN_RDP.metaTitle,
  description: ADMIN_RDP.metaDescription,
  alternates: { canonical: "/products/admin-rdp" },
};

export default function AdminRdpProductRoute() {
  return <AdminRdpPage initialCatalog={getDemoVpsCatalog()} />;
}
