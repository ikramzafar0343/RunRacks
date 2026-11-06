/**
 * Pricing — demo VPS catalog until commercial packages and checkout are live.
 */
import type { Metadata } from "next";
import { Suspense } from "react";
import { VpsPricingFallback } from "@/features/vps-pricing";
import { VpsPricingSection } from "@/features/vps-pricing";
import { HeroSection } from "@/components/ui/hero-1";
import { BrandsSection } from "@/features/home";
import { VpsPlanComparison } from "@/features/vps-pricing";
import { VpsPlanComparisonFallback } from "@/features/vps-pricing";
import { FaqSection } from "@/features/vps-faq";
import { PRICING_FAQ } from "@/features/vps-faq";
import { SupportCtaSection } from "@/features/support-cta";
import { SUPPORT_CTA_PRICING } from "@/features/support-cta";
import { getCatalogForPage } from "@/server/catalogGateway";

export const metadata: Metadata = {
  title: "Hosting Plans & Pricing | RunRacks",
  description:
    "Compare Linux VPS, Windows VPS, and Admin RDP plans by region and billing term. Catalog prices are labeled demo until checkout is live.",
};

async function PricingCatalog() {
  const catalog = await getCatalogForPage();
  return <VpsPricingSection variant="page" initialCatalog={catalog} />;
}

export default function PricingPage() {
  return (
    <main className="pricingPage rrDenseSpacing flex flex-1 flex-col pt-16 md:pt-[4.8rem]">
      <HeroSection />
      <BrandsSection />
      <div id="pricing-plans" className="scroll-mt-24">
        <Suspense fallback={<VpsPricingFallback variant="page" />}>
          <PricingCatalog />
        </Suspense>
      </div>
      <Suspense fallback={<VpsPlanComparisonFallback />}>
        <VpsPlanComparison />
      </Suspense>
      <FaqSection content={PRICING_FAQ} />
      <SupportCtaSection content={SUPPORT_CTA_PRICING} />
    </main>
  );
}
