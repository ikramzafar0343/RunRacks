/**
 * Home page — hero is the primary above-the-fold experience.
 * Client-heavy below-fold sections sit in Suspense so Cache Components
 * can prerender the shell without Turbopack client-proxy `instant` failures.
 */
import type { Metadata } from "next";
import { Suspense } from "react";
import { BrandTrustSection } from "@/features/brand-trust/components/BrandTrustSection";
import { CustomerStoriesSection } from "@/features/customer-stories/components/CustomerStoriesSection";
import { FeatureShowcaseSection } from "@/features/feature-showcase/components/FeatureShowcaseSection";
import { BrandsSection } from "@/features/home/components/BrandsSection";
import { AiCtaSection } from "@/features/home/components/AiCtaSection";
import { HeroSection } from "@/features/home/components/HeroSection";
import { HowWeWorkSection } from "@/features/how-we-work/components/HowWeWorkSection";
import { StatisticsSection } from "@/features/statistics/components/StatisticsSection";
import { SupportCtaSection } from "@/features/support-cta/components/SupportCtaSection";
import { FaqSection } from "@/features/vps-faq/components/FaqSection";
import { VpsPricingFallback } from "@/features/vps-pricing/components/VpsPricingFallback";
import { VpsPricingSection } from "@/features/vps-pricing/components/VpsPricingSection";
import { getDemoVpsCatalog } from "@/features/vps-pricing/model/demoCatalog";
import "@/features/home/components/home-page.css";

export const metadata: Metadata = {
  title: "NVMe VPS, Windows & Admin RDP Hosting",
  description:
    "RunRacks hosting for Linux VPS, Windows VPS, and Admin RDP—documented specs, administrator access, and labeled demo pricing until checkout is connected.",
  alternates: { canonical: "/" },
};

export default function Home() {
  const catalog = getDemoVpsCatalog();

  return (
    <main className="homePage rrDenseSpacing flex flex-1 flex-col pt-16 md:pt-[4.8rem]">
      <HeroSection />
      <BrandsSection />
      <Suspense fallback={<VpsPricingFallback variant="embedded" />}>
        <VpsPricingSection variant="embedded" initialCatalog={catalog} />
      </Suspense>
      <Suspense fallback={null}>
        <StatisticsSection />
      </Suspense>
      <Suspense fallback={null}>
        <HowWeWorkSection />
      </Suspense>
      <Suspense fallback={null}>
        <FeatureShowcaseSection />
      </Suspense>
      <Suspense fallback={null}>
        <CustomerStoriesSection />
      </Suspense>
      <AiCtaSection />
      <Suspense fallback={null}>
        <BrandTrustSection />
      </Suspense>
      <FaqSection />
      <SupportCtaSection />
    </main>
  );
}
