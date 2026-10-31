/**
 * Admin RDP — Brandium About composition, Sage & Ink / Nourd + shared sections.
 * Below-fold client-heavy sections are dynamically imported for slow networks.
 */
import { Suspense } from "react";
import { ArdpHero } from "@/features/admin-rdp/components/ArdpHero";
import { ArdpNetwork } from "@/features/admin-rdp/components/ArdpNetwork";
import { ArdpStatistics } from "@/features/admin-rdp/components/ArdpStatistics";
import { ArdpStoryDesign } from "@/features/admin-rdp/components/ArdpStoryDesign";
import { ArdpStoryIdeas } from "@/features/admin-rdp/components/ArdpStoryIdeas";
import { ArdpWordFill } from "@/features/admin-rdp/components/ArdpWordFill";
import { ADMIN_RDP } from "@/features/admin-rdp/model/adminRdpContent";
import { CustomerStoriesSection } from "@/features/customer-stories/components/CustomerStoriesSection";
import { SupportCtaSection } from "@/features/support-cta/components/SupportCtaSection";
import { FaqSection } from "@/features/vps-faq/components/FaqSection";
import { VpsPricingFallback } from "@/features/vps-pricing/components/VpsPricingFallback";
import { VpsPricingSection } from "@/features/vps-pricing/components/VpsPricingSection";
import type { VpsCatalogPayload } from "@/features/vps-pricing/model/types";
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
      <ArdpStoryIdeas />
      <ArdpNetwork regions={initialCatalog.regions} />
      <ArdpStoryDesign />
      <ArdpStatistics />
      <CustomerStoriesSection />
      <FaqSection
        content={{
          heading: ADMIN_RDP.faq.heading,
          items: ADMIN_RDP.faq.items,
        }}
      />
      <SupportCtaSection />
    </main>
  );
}
