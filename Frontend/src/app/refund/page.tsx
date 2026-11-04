import type { Metadata } from "next";
import { StaticMarketingPage } from "@/shared/ui/StaticMarketingPage";

export const metadata: Metadata = {
  title: "Refund Policy | RunRacks",
  description: "RunRacks refund policy.",
};

export default function RefundPage() {
  return (
    <StaticMarketingPage
      title="Refund Policy"
      description="Full refund terms will be published here once legal review is complete. Until billing and checkout are connected, demo money-back labels on cart and checkout are not live commitments."
    />
  );
}
