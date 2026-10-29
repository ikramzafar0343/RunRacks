/**
 * Home page — hero is the primary above-the-fold experience.
 * Below-fold sections are dynamically imported for slow-network JS budgets.
 */
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { BrandsSection } from "@/features/home/components/BrandsSection";
import { HeroSection } from "@/features/home/components/HeroSection";
import { VpsPricingFallback } from "@/features/vps-pricing/components/VpsPricingFallback";
import { VpsPricingSection } from "@/features/vps-pricing/components/VpsPricingSection";
import { getDemoVpsCatalog } from "@/features/vps-pricing/model/demoCatalog";

const StatisticsSection = dynamic(() =>
  import("@/features/statistics/components/StatisticsSection").then((m) => m.StatisticsSection),
);

const HowWeWorkSection = dynamic(() =>
  import("@/features/how-we-work/components/HowWeWorkSection").then((m) => m.HowWeWorkSection),
);

const FeatureShowcaseSection = dynamic(() =>
  import("@/features/feature-showcase/components/FeatureShowcaseSection").then(
    (m) => m.FeatureShowcaseSection,
  ),
);

const CustomerStoriesSection = dynamic(() =>
  import("@/features/customer-stories/components/CustomerStoriesSection").then(
    (m) => m.CustomerStoriesSection,
  ),
);

const AiCtaSection = dynamic(() =>
  import("@/features/home/components/AiCtaSection").then((m) => m.AiCtaSection),
);

const BrandTrustSection = dynamic(() =>
  import("@/features/brand-trust/components/BrandTrustSection").then(
    (m) => m.BrandTrustSection,
  ),
);

const FaqSection = dynamic(() =>
  import("@/features/vps-faq/components/FaqSection").then((m) => m.FaqSection),
);

const SupportCtaSection = dynamic(() =>
  import("@/features/support-cta/components/SupportCtaSection").then(
    (m) => m.SupportCtaSection,
  ),
);

export const metadata: Metadata = {
  title: "VPS Hosting & Windows Servers",
  description:
    "Compare clear VPS and Windows plans from RunRacks—NVMe storage, root access, and honest demo pricing until live checkout is configured.",
  alternates: { canonical: "/" },
};

export default function Home() {
  const catalog = getDemoVpsCatalog();

  return (
    <main className="flex flex-1 flex-col pt-16 md:pt-[4.8rem]">
      <HeroSection />
      <BrandsSection />
      <Suspense fallback={<VpsPricingFallback variant="embedded" />}>
        <VpsPricingSection variant="embedded" initialCatalog={catalog} />
      </Suspense>
      <StatisticsSection />
      <HowWeWorkSection />
      <FeatureShowcaseSection />
      <CustomerStoriesSection />
      <AiCtaSection />
      <BrandTrustSection />
      <FaqSection />
      <SupportCtaSection />
    </main>
  );
}
