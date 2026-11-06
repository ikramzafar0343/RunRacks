/**
 * Home page — hero is the primary above-the-fold experience.
 * Client-heavy below-fold sections sit in Suspense so Cache Components
 * can prerender the shell without Turbopack client-proxy `instant` failures.
 */
import type { Metadata } from "next";
import { Suspense } from "react";
import { BrandTrustSection } from "@/features/brand-trust";
import { CustomerStoriesSection } from "@/features/customer-stories";
import { FeatureShowcaseSection } from "@/features/feature-showcase/components/FeatureShowcaseSection";
import { BrandsSection } from "@/features/home";
import { AiCtaSection } from "@/features/home";
import { HeroSection } from "@/features/home";
import { HowWeWorkSection } from "@/features/how-we-work/components/HowWeWorkSection";
import { StatisticsSection } from "@/features/statistics/components/StatisticsSection";
import { SupportCtaSection } from "@/features/support-cta";
import { FaqSection } from "@/features/vps-faq";
import { HOME_FAQ } from "@/features/vps-faq";
import { VpsPricingFallback } from "@/features/vps-pricing";
import { VpsPricingSection } from "@/features/vps-pricing";
import "@/features/home/components/home-page.css";
import { getCatalogForPage } from "@/server/catalogGateway";

export const metadata: Metadata = {
  title: "NVMe VPS, Windows & Admin RDP Hosting",
  description:
    "RunRacks hosting for Linux VPS, Windows VPS, and Admin RDP—documented specs, administrator access, and labeled demo pricing until checkout is connected.",
  alternates: { canonical: "/" },
};

async function HomePricingCatalog() {
  const catalog = await getCatalogForPage();
  return <VpsPricingSection variant="embedded" initialCatalog={catalog} />;
}

export default function Home() {
  return (
    <main className="homePage rrDenseSpacing flex flex-1 flex-col pt-16 md:pt-[4.8rem]">
      <HeroSection />
      <BrandsSection />
      <Suspense fallback={<VpsPricingFallback variant="embedded" />}>
        <HomePricingCatalog />
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
        <CustomerStoriesSection
          heading="How teams use RunRacks"
          intro="Illustrative cross-product stories from operators comparing Linux VPS, Windows VPS, and Admin RDP—labeled demo until verified case studies ship."
        />
      </Suspense>
      <AiCtaSection />
      <Suspense fallback={null}>
        <BrandTrustSection />
      </Suspense>
      <FaqSection content={HOME_FAQ} />
      <SupportCtaSection />
    </main>
  );
}
