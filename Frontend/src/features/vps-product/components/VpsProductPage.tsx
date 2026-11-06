/**
 * VPS product editorial composition.
 * Hero + pricing stay eager; below-fold GSAP/rails use dynamic() for JS budget.
 */
import { Suspense } from "react";
import { CustomizeHostingSection } from "@/features/customize";
import { BrandsSection } from "@/features/home";
import { PhInfra } from "@/features/product-hosting";
import { FaqSection } from "@/features/vps-faq";
import { VPS_FAQ } from "@/features/vps-faq";
import { catalogRegionsIntro } from "@/shared/content/demoPricingCopy";
import { SupportCtaSection } from "@/features/support-cta";
import { SUPPORT_CTA_LINUX_VPS } from "@/features/support-cta";
import { VpsCompanyRail } from "@/features/vps-product/components/VpsCompanyRail";

import { VpsCompetitorCompare } from "@/features/vps-product/components/VpsCompetitorCompare";
import { VpsProductFeatures } from "@/features/vps-product/components/VpsProductFeatures";
import { VpsProductHero } from "@/features/vps-product/components/VpsProductHero";
import { getStartingPrice } from "@/features/product-hosting";
import { getDemoVpsCatalog } from "@/features/vps-pricing";
import { VpsPricingFallback } from "@/features/vps-pricing";
import { VpsPricingSection } from "@/features/vps-pricing";
import type { VpsCatalogPayload } from "@/features/vps-pricing";
import { VPS_CUSTOMIZE_TRUST } from "@/features/vps-product/model/vpsCustomizeTrust";
import { WhyChooseUs } from "@/features/why-choose";
import "@/features/vps-product/components/vps-product.css";

export type VpsProductPageProps = {
  initialCatalog?: VpsCatalogPayload;
  initialFamily?: string | null;
  initialLocation?: string | null;
  initialTerm?: string | null;
};

export function VpsProductPage({
  initialCatalog,
  initialFamily = null,
  initialLocation = null,
  initialTerm = null,
}: VpsProductPageProps = {}) {
  const catalog = initialCatalog ?? getDemoVpsCatalog();
  const startingPrice = getStartingPrice(catalog, "linux", initialLocation);

  return (
    <main className="vpsProductPage rrDenseSpacing flex flex-1 flex-col">
      <VpsProductHero startingPrice={startingPrice} />
      <section
        id="vps-plans"
        className="vpsProductPricing"
        aria-label="VPS hosting plans"
      >
        <Suspense fallback={<VpsPricingFallback variant="page" />}>
          <VpsPricingSection
            variant="page"
            initialCatalog={catalog}
            initialFamily={initialFamily}
            initialLocation={initialLocation}
            initialTerm={initialTerm}
          />
        </Suspense>
      </section>
      <VpsProductFeatures />
      <CustomizeHostingSection
        regions={catalog.regions}
        sectionId="vps-customize"
        plansHref="#vps-plans"
        trust={VPS_CUSTOMIZE_TRUST}
        lockedFamily="linux"
      />
      <PhInfra
        heading="Catalog regions"
        regions={catalog.regions}
        intro={catalogRegionsIntro("VPS plans")}
        pricingAnchor="#vps-plans"
      />
      <VpsCompetitorCompare />
      <WhyChooseUs variant="linux" />
      <BrandsSection />
      <VpsCompanyRail />
      <FaqSection content={VPS_FAQ} />
      <SupportCtaSection content={SUPPORT_CTA_LINUX_VPS} />
    </main>
  );
}
