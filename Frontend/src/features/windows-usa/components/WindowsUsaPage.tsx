/**
 * Windows Hosting in USA — hero-first landing (more sections TBD).
 */
import { Suspense } from "react";
import { FaqSection } from "@/features/vps-faq";
import { SupportCtaSection } from "@/features/support-cta";
import { VpsPricingFallback } from "@/features/vps-pricing";
import { VpsPricingSection } from "@/features/vps-pricing";
import type { VpsCatalogPayload } from "@/features/vps-pricing";
import { WindowsUsaHero } from "@/features/windows-usa/components/WindowsUsaHero";
import { WindowsUsaHighlight } from "@/features/windows-usa/components/WindowsUsaHighlight";
import { WindowsUsaShowcase } from "@/features/windows-usa/components/WindowsUsaShowcase";
import { WINDOWS_USA } from "@/features/windows-usa/model/windowsUsaContent";
import { WhyChooseUs } from "@/features/why-choose";
import "@/features/windows-usa/components/windows-usa.css";

export type WindowsUsaPageProps = {
  initialCatalog: VpsCatalogPayload;
};

export function WindowsUsaPage({ initialCatalog }: WindowsUsaPageProps) {
  return (
    <main className="winUsaPage rrDenseSpacing flex flex-1 flex-col">
      <WindowsUsaHero />
      <WindowsUsaShowcase />
      <section
        id="windows-usa-plans"
        className="winUsaPricing"
        aria-label="United States Windows VPS plans"
      >
        <Suspense fallback={<VpsPricingFallback variant="page" />}>
          <VpsPricingSection
            variant="page"
            initialCatalog={initialCatalog}
            initialLocation="us"
          />
        </Suspense>
      </section>
      <WhyChooseUs variant="windows-usa" sectionId="windows-usa-why" />
      <WindowsUsaHighlight />
      <FaqSection
        content={{
          heading: WINDOWS_USA.faq.heading,
          items: WINDOWS_USA.faq.items,
        }}
      />
      <SupportCtaSection content={WINDOWS_USA.supportCta} />
    </main>
  );
}
