/**
 * Admin RDP in USA — static shell; pricing filters resolve client-side.
 */
import type { Metadata } from "next";
import { getDemoVpsCatalog } from "@/features/vps-pricing/model/demoCatalog";
import { AdminRdpUsaPage } from "@/features/admin-rdp-usa/components/AdminRdpUsaPage";
import { ADMIN_RDP_USA } from "@/features/admin-rdp-usa/model/adminRdpUsaContent";

export const metadata: Metadata = {
  title: ADMIN_RDP_USA.metaTitle,
  description: ADMIN_RDP_USA.metaDescription,
  alternates: { canonical: "/products/admin-rdp-usa" },
};

export default function AdminRdpUsaRoute() {
  return <AdminRdpUsaPage initialCatalog={getDemoVpsCatalog()} />;
}
