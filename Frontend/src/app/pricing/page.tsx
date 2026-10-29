/**
 * Pricing — demo VPS catalog until commercial packages and checkout are live.
 */
import type { Metadata } from "next";
import { Suspense } from "react";
import { getDemoVpsCatalog } from "@/features/vps-pricing/model/demoCatalog";
import { VpsPricingFallback } from "@/features/vps-pricing/components/VpsPricingFallback";
import { VpsPricingSection } from "@/features/vps-pricing/components/VpsPricingSection";
import { HeroSection } from "@/components/ui/hero-1";
import { BrandsSection } from "@/features/home/components/BrandsSection";
import { VpsPlanComparison } from "@/features/vps-pricing/components/VpsPlanComparison";
import { FaqSection } from "@/features/vps-faq/components/FaqSection";
import { SupportCtaSection } from "@/features/support-cta/components/SupportCtaSection";

export const metadata: Metadata = {
  title: "Pricing | RunRacks",
  description:
    "Predictable cloud pricing for high-performance NVMe VPS, Windows Hosting & Admin RDP across 8 global locations.",
};

export default function PricingPage() {
  const catalog = getDemoVpsCatalog();

  return (
    <main className="flex flex-1 flex-col pt-16 md:pt-[4.8rem]">
      <HeroSection />
      <BrandsSection className="!pt-44 sm:!pt-48 md:!pt-52" />
      <div id="pricing-plans" className="scroll-mt-24">
        <Suspense fallback={<VpsPricingFallback variant="page" />}>
          <VpsPricingSection variant="page" initialCatalog={catalog} />
        </Suspense>
      </div>
      <VpsPlanComparison />
      <FaqSection />
      <SupportCtaSection />
    </main>
  );
}
