/**
 * Admin RDP — Brandium About composition, Sage & Ink / Nourd + shared sections.
 * Below-fold client-heavy sections are dynamically imported for slow networks.
 */
import { Suspense } from "react";
import { ArdpHero } from "@/features/admin-rdp/components/ArdpHero";
import { ArdpStatistics } from "@/features/admin-rdp/components/ArdpStatistics";
import { ArdpUseCases } from "@/features/admin-rdp/components/ArdpUseCases";
import { ArdpWordFill } from "@/features/admin-rdp/components/ArdpWordFill";
import { ADMIN_RDP } from "@/features/admin-rdp/model/adminRdpContent";
import { CustomerStoriesSection } from "@/features/customer-stories/components/CustomerStoriesSection";
import { PhInfra } from "@/features/product-hosting/components/PhInfra";
import { SupportCtaSection } from "@/features/support-cta/components/SupportCtaSection";
import { SUPPORT_CTA_ADMIN_RDP } from "@/features/support-cta/model/supportCtaContent";
import { FaqSection } from "@/features/vps-faq/components/FaqSection";
import { VpsPricingFallback } from "@/features/vps-pricing/components/VpsPricingFallback";
import { VpsPricingSection } from "@/features/vps-pricing/components/VpsPricingSection";
import type { VpsCatalogPayload } from "@/features/vps-pricing/model/types";
import { WhyChooseUs } from "@/features/why-choose/components/WhyChooseUs";
import { catalogRegionsIntro } from "@/shared/content/demoPricingCopy";
import "@/features/admin-rdp/components/admin-rdp-page.css";


export type AdminRdpPageProps = {
  initialCatalog: VpsCatalogPayload;
};

export function AdminRdpPage({ initialCatalog }: AdminRdpPageProps) {
  return (
    <main className="ardpPage rrDenseSpacing flex flex-1 flex-col">
      <ArdpHero />
      <section
        id="vps-plans"
        className="ardpPricing"
        aria-label="Admin RDP plans"
      >
        <Suspense fallback={<VpsPricingFallback variant="page" />}>
          <VpsPricingSection variant="page" initialCatalog={initialCatalog} />
        </Suspense>
      </section>
      <ArdpWordFill />
      <ArdpUseCases />
      <PhInfra
        heading="Catalog regions"
        regions={initialCatalog.regions}
        intro={catalogRegionsIntro("Admin RDP plans")}
        pricingAnchor="#vps-plans"
      />
      <WhyChooseUs variant="admin-rdp" />
      <ArdpStatistics />
      <CustomerStoriesSection
        heading="How teams use Admin RDP"
        intro="Illustrative operator stories about remote Windows desktops with administrator access—labeled demo until verified case studies ship."
      />
      <FaqSection
        content={{
          heading: ADMIN_RDP.faq.heading,
          items: ADMIN_RDP.faq.items,
        }}
      />
      <SupportCtaSection content={SUPPORT_CTA_ADMIN_RDP} />
    </main>
  );
}
