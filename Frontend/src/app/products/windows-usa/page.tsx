/**
 * Windows Hosting in USA — static shell; pricing filters resolve client-side.
 */
import type { Metadata } from "next";
import { getDemoVpsCatalog } from "@/features/vps-pricing/model/demoCatalog";
import { WindowsUsaPage } from "@/features/windows-usa/components/WindowsUsaPage";
import { WINDOWS_USA } from "@/features/windows-usa/model/windowsUsaContent";

export const metadata: Metadata = {
  title: WINDOWS_USA.metaTitle,
  description: WINDOWS_USA.metaDescription,
  alternates: { canonical: "/products/windows-usa" },
};

export default function WindowsUsaRoute() {
  return <WindowsUsaPage initialCatalog={getDemoVpsCatalog()} />;
}
