/**
 * Admin RDP in USA — hero → benefits → pricing → FAQ → support CTA.
 */
import { Suspense } from "react";
import { AdminRdpBenefitsSection } from "@/features/admin-rdp-benefits/components/AdminRdpBenefitsSection";
import { FaqSection } from "@/features/vps-faq/components/FaqSection";
import { SupportCtaSection } from "@/features/support-cta/components/SupportCtaSection";
import { VpsPricingFallback } from "@/features/vps-pricing/components/VpsPricingFallback";
import { VpsPricingSection } from "@/features/vps-pricing/components/VpsPricingSection";
import type { VpsCatalogPayload } from "@/features/vps-pricing/model/types";
import { AdminRdpUsaClarity } from "@/features/admin-rdp-usa/components/AdminRdpUsaClarity";
import { AdminRdpUsaCompare } from "@/features/admin-rdp-usa/components/AdminRdpUsaCompare";
import { AdminRdpUsaHero } from "@/features/admin-rdp-usa/components/AdminRdpUsaHero";
import { ADMIN_RDP_USA } from "@/features/admin-rdp-usa/model/adminRdpUsaContent";
import { WhyChooseUs } from "@/features/why-choose/components/WhyChooseUs";
import "@/features/windows-usa/components/windows-usa.css";
import "@/features/admin-rdp-usa/components/admin-rdp-usa.css";

export type AdminRdpUsaPageProps = {
  initialCatalog: VpsCatalogPayload;
};

export function AdminRdpUsaPage({ initialCatalog }: AdminRdpUsaPageProps) {
  return (
    <main className="ardpUsaPage rrDenseSpacing flex flex-1 flex-col">
      <AdminRdpUsaHero />
      <AdminRdpBenefitsSection />
      <section
        id="admin-rdp-usa-plans"
        className="ardpUsaPricing"
        aria-label="United States Admin RDP plans"
      >
        <Suspense fallback={<VpsPricingFallback variant="page" />}>
          <VpsPricingSection
            variant="page"
            initialCatalog={initialCatalog}
            initialLocation="us"
          />
        </Suspense>
      </section>
      <WhyChooseUs variant="admin-rdp-usa" sectionId="admin-rdp-usa-why" />
      <AdminRdpUsaClarity />
      <AdminRdpUsaCompare />
      <FaqSection
        content={{
          heading: ADMIN_RDP_USA.faq.heading,
          items: ADMIN_RDP_USA.faq.items,
        }}
      />
      <SupportCtaSection content={ADMIN_RDP_USA.supportCta} />
    </main>
  );
}
