import type { Metadata } from "next";
import { CustomizePage } from "@/features/customize/components/CustomizePage";
import { CUSTOMIZE } from "@/features/customize/model/customizeContent";
import { getDemoVpsCatalog } from "@/features/vps-pricing/model/demoCatalog";

export const metadata: Metadata = {
  title: CUSTOMIZE.metaTitle,
  description: CUSTOMIZE.metaDescription,
  alternates: { canonical: "/customize" },
};

export default function CustomizeRoutePage() {
  const catalog = getDemoVpsCatalog();
  return <CustomizePage regions={catalog.regions} />;
}
