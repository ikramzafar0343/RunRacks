/**
 * VPS product editorial composition.
 * Hero + pricing stay eager; below-fold GSAP/rails use dynamic() for JS budget.
 */
import { Suspense } from "react";
import { CustomizeHostingSection } from "@/features/customize/components/CustomizeHostingSection";
import { BrandsSection } from "@/features/home/components/BrandsSection";
import { PhInfra } from "@/features/product-hosting/components/PhInfra";
import { FaqSection } from "@/features/vps-faq/components/FaqSection";
import { VPS_FAQ } from "@/features/vps-faq/model/faqContent";
import { catalogRegionsIntro } from "@/shared/content/demoPricingCopy";
import { SupportCtaSection } from "@/features/support-cta/components/SupportCtaSection";
import { VpsCompanyRail } from "@/features/vps-product/components/VpsCompanyRail";
import { VpsCompetitorCompare } from "@/features/vps-product/components/VpsCompetitorCompare";
import { VpsPrinciples } from "@/features/vps-product/components/VpsPrinciples";
import { VpsProductFeatures } from "@/features/vps-product/components/VpsProductFeatures";
import { VpsProductHero } from "@/features/vps-product/components/VpsProductHero";
import { getStartingPrice } from "@/features/product-hosting/model/startingPrice";
import { getDemoVpsCatalog } from "@/features/vps-pricing/model/demoCatalog";
import { VpsPricingFallback } from "@/features/vps-pricing/components/VpsPricingFallback";
import { VpsPricingSection } from "@/features/vps-pricing/components/VpsPricingSection";
import type { VpsCatalogPayload } from "@/features/vps-pricing/model/types";
import { VPS_CUSTOMIZE_TRUST } from "@/features/vps-product/model/vpsCustomizeTrust";
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
      <VpsPrinciples />
      <BrandsSection />
      <VpsCompanyRail />
      <FaqSection content={VPS_FAQ} />
      <SupportCtaSection />
    </main>
  );
}
