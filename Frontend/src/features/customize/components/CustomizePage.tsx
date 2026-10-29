/**
 * Customize hosting — Hero7, configurator, FAQ, support CTA.
 */
import { Hero7 } from "@/components/ui/modern-hero";
import { CustomizeConfigurator } from "@/features/customize/components/CustomizeConfigurator";
import { CUSTOMIZE } from "@/features/customize/model/customizeContent";
import { SupportCtaSection } from "@/features/support-cta/components/SupportCtaSection";
import { FaqSection } from "@/features/vps-faq/components/FaqSection";
import type { VpsRegion } from "@/features/vps-pricing/model/types";
import "@/features/customize/components/customize.css";
import "@/features/customize/components/customize-summary.css";

export type CustomizePageProps = {
  regions: readonly VpsRegion[];
};

export function CustomizePage({ regions }: CustomizePageProps) {
  const defaultRegionId = regions[0]?.id ?? "us";
  const { hero, faq } = CUSTOMIZE;

  return (
    <main className="czPage flex flex-1 flex-col">
      <Hero7
        heading={hero.title}
        description={hero.lead}
        button={{ text: hero.cta.label, url: hero.cta.href }}
        trust={hero.trust}
      />

      <section
        id="cz-config"
        className="czConfig scroll-mt-24"
        aria-label="Hosting configurator"
      >
        <CustomizeConfigurator
          regions={regions}
          defaultRegionId={defaultRegionId}
        />
      </section>

      <FaqSection content={faq} />
      <SupportCtaSection />
    </main>
  );
}
