/**
 * VPS Hosting in USA — static shell; pricing filters resolve client-side.
 */
import type { Metadata } from "next";
import { VpsUsaPage } from "@/features/vps-usa/components/VpsUsaPage";
import { VPS_USA } from "@/features/vps-usa/model/vpsUsaContent";
import { getDemoVpsCatalog } from "@/features/vps-pricing/model/demoCatalog";

export const metadata: Metadata = {
  title: VPS_USA.metaTitle,
  description: VPS_USA.metaDescription,
  alternates: { canonical: "/products/vps-usa" },
};

export default function VpsUsaRoute() {
  return <VpsUsaPage initialCatalog={getDemoVpsCatalog()} />;
}
