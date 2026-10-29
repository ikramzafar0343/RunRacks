/**
 * VPS Hosting in USA — map-first product landing.
 * Order: hero → why → coverage → story → audience → pricing → inclusions → FAQ → CTA.
 */
import { Suspense } from "react";
import { FaqSection } from "@/features/vps-faq/components/FaqSection";
import { SupportCtaSection } from "@/features/support-cta/components/SupportCtaSection";
import { VpsPricingFallback } from "@/features/vps-pricing/components/VpsPricingFallback";
import { VpsPricingSection } from "@/features/vps-pricing/components/VpsPricingSection";
import type { VpsCatalogPayload } from "@/features/vps-pricing/model/types";
import { VpsUsaAudience } from "@/features/vps-usa/components/VpsUsaAudience";
import { VpsUsaCoverage } from "@/features/vps-usa/components/VpsUsaCoverage";
import { VpsUsaHero } from "@/features/vps-usa/components/VpsUsaHero";
import { VpsUsaInclusions } from "@/features/vps-usa/components/VpsUsaInclusions";
import { VpsUsaStory } from "@/features/vps-usa/components/VpsUsaStory";
import { VpsUsaWhy } from "@/features/vps-usa/components/VpsUsaWhy";
import { VPS_USA } from "@/features/vps-usa/model/vpsUsaContent";
import "@/features/vps-usa/components/vps-usa.css";
import "@/features/vps-usa/components/vps-usa-sections.css";

export type VpsUsaPageProps = {
  initialCatalog: VpsCatalogPayload;
};

export function VpsUsaPage({ initialCatalog }: VpsUsaPageProps) {
  return (
    <main className="usaPage flex flex-1 flex-col">
      <VpsUsaHero />
      <VpsUsaWhy />
      <VpsUsaCoverage />
      <VpsUsaStory />
      <VpsUsaAudience />
      <section
        id="usa-plans"
        className="usaPricing"
        aria-label="United States VPS plans"
      >
        <header className="usaPricingIntro">
          <p className="usaEyebrow">{VPS_USA.pricing.eyebrow}</p>
          <h2 className="usaHeading">{VPS_USA.pricing.heading}</h2>
          <p className="usaLead">{VPS_USA.pricing.lead}</p>
        </header>
        <Suspense fallback={<VpsPricingFallback variant="page" />}>
          <VpsPricingSection
            variant="page"
            initialCatalog={initialCatalog}
            initialLocation="us"
          />
        </Suspense>
      </section>
      <VpsUsaInclusions />
      <FaqSection
        content={{
          heading: VPS_USA.faq.heading,
          items: VPS_USA.faq.items,
        }}
      />
      <SupportCtaSection content={VPS_USA.supportCta} />
    </main>
  );
}
