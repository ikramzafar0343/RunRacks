/**
 * Windows Hosting in USA — hero-first landing (more sections TBD).
 */
import { Suspense } from "react";
import { FaqSection } from "@/features/vps-faq/components/FaqSection";
import { SupportCtaSection } from "@/features/support-cta/components/SupportCtaSection";
import { VpsPricingFallback } from "@/features/vps-pricing/components/VpsPricingFallback";
import { VpsPricingSection } from "@/features/vps-pricing/components/VpsPricingSection";
import type { VpsCatalogPayload } from "@/features/vps-pricing/model/types";
import { WindowsUsaHero } from "@/features/windows-usa/components/WindowsUsaHero";
import { WindowsUsaHighlight } from "@/features/windows-usa/components/WindowsUsaHighlight";
import { WindowsUsaShowcase } from "@/features/windows-usa/components/WindowsUsaShowcase";
import { WindowsUsaWhy } from "@/features/windows-usa/components/WindowsUsaWhy";
import { WINDOWS_USA } from "@/features/windows-usa/model/windowsUsaContent";
import "@/features/windows-usa/components/windows-usa.css";

export type WindowsUsaPageProps = {
  initialCatalog: VpsCatalogPayload;
};

export function WindowsUsaPage({ initialCatalog }: WindowsUsaPageProps) {
  return (
    <main className="winUsaPage flex flex-1 flex-col">
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
      <WindowsUsaWhy />
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
