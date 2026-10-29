import type { Metadata } from "next";
import { StaticMarketingPage } from "@/shared/ui/StaticMarketingPage";

export const metadata: Metadata = {
  title: "Privacy Policy | RunRacks",
  description: "RunRacks privacy policy.",
};

export default function PrivacyPage() {
  return (
    <StaticMarketingPage
      title="Privacy Policy"
      description="Full privacy terms will be published here once legal review is complete. Until then, use Pricing for plan questions."
    />
  );
}
