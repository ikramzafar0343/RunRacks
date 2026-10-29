import type { Metadata } from "next";
import { StaticMarketingPage } from "@/shared/ui/StaticMarketingPage";

export const metadata: Metadata = {
  title: "Terms & Conditions | RunRacks",
  description: "RunRacks terms and conditions.",
};

export default function TermsPage() {
  return (
    <StaticMarketingPage
      title="Terms & Conditions"
      description="Service terms will be published here once legal review is complete. Until then, plan details and acceptable use follow the copy shown on product pages."
    />
  );
}
