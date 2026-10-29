/**
 * Hostinger-ordered product hosting shell — Sage & Ink, shared sections.
 */
import { Suspense } from "react";
import { CustomerStoriesSection } from "@/features/customer-stories/components/CustomerStoriesSection";
import { PhBenefits } from "@/features/product-hosting/components/PhBenefits";
import { PhCapabilities } from "@/features/product-hosting/components/PhCapabilities";
import { PhConversion } from "@/features/product-hosting/components/PhConversion";
import { PhHero } from "@/features/product-hosting/components/PhHero";
import { PhInclusions } from "@/features/product-hosting/components/PhInclusions";
import { PhInfra } from "@/features/product-hosting/components/PhInfra";
import { PhWorkloads } from "@/features/product-hosting/components/PhWorkloads";
import { VpsAiSection } from "@/features/product-hosting/components/vps-ai/VpsAiSection";
import { WindowsProductHero } from "@/features/product-hosting/components/WindowsProductHero";
import {
  PRODUCT_HOSTING,
  type ProductHostingKey,
} from "@/features/product-hosting/model/productHostingContent";
import { getStartingPrice } from "@/features/product-hosting/model/startingPrice";
import { FaqSection } from "@/features/vps-faq/components/FaqSection";
import { getDemoVpsCatalog } from "@/features/vps-pricing/model/demoCatalog";
import { VpsPricingFallback } from "@/features/vps-pricing/components/VpsPricingFallback";
import { VpsPricingSection } from "@/features/vps-pricing/components/VpsPricingSection";
import type { VpsCatalogPayload } from "@/features/vps-pricing/model/types";
import "@/features/product-hosting/components/product-hosting.css";

export type ProductHostingPageProps = {
  product: ProductHostingKey;
  initialCatalog?: VpsCatalogPayload;
  initialFamily?: string | null;
  initialLocation?: string | null;
  initialTerm?: string | null;
};

export function ProductHostingPage({
  product,
  initialCatalog,
  initialFamily = null,
  initialLocation = null,
  initialTerm = null,
}: ProductHostingPageProps) {
  const content = PRODUCT_HOSTING[product];
  const catalog = initialCatalog ?? getDemoVpsCatalog();
  const family =
    (initialFamily as typeof content.defaultFamily | null) ??
    content.defaultFamily;
  const startingPrice = getStartingPrice(catalog, family, initialLocation);
  return (
    <main className="phPage flex flex-1 flex-col">
      {product === "windows" ? (
        <WindowsProductHero content={content} startingPrice={startingPrice} />
      ) : (
        <>
          <PhHero content={content} startingPrice={startingPrice} />
          <PhBenefits benefits={content.benefits} />
        </>
      )}

      <div id="vps-pricing" className="phPricingWrap phSection">
        <Suspense fallback={<VpsPricingFallback variant="page" />}>
          <VpsPricingSection
            variant="embedded"
            planLayout={product === "windows" ? "cards" : "rows"}
            initialCatalog={catalog}
            initialFamily={initialFamily ?? content.defaultFamily}
            initialLocation={initialLocation}
            initialTerm={initialTerm}
          />
        </Suspense>
      </div>

      <PhInclusions
        heading={content.inclusionsHeading}
        accent={content.inclusionsAccent}
        items={content.inclusions}
        billingDisclosure={content.billingDisclosure}
      />

      <PhWorkloads
        heading={content.workloadsHeading}
        intro={content.workloadsIntro}
        items={content.workloads}
      />

      <PhInfra heading={content.infraHeading} regions={catalog.regions} />

      <VpsAiSection />

      <PhCapabilities
        heading={content.capsHeading}
        subheading={content.capsSubheading}
        items={content.capabilities}
      />

      <CustomerStoriesSection />

      <PhConversion
        heading={content.convertHeading}
        support={content.convertSupport}
        ctaLabel={content.convertCta}
      />

      <FaqSection />
    </main>
  );
}
