/**
 * Active benefit panel — editorial copy + illustration.
 */
import type { BenefitTab } from "@/features/admin-rdp-benefits/model/adminRdpBenefits.data";

export type AdminRdpBenefitsPanelProps = {
  tab: BenefitTab;
};

export function AdminRdpBenefitsPanel({ tab }: AdminRdpBenefitsPanelProps) {
  return (
    <div
      id={`ardp-benefit-panel-${tab.id}`}
      role="tabpanel"
      aria-labelledby={`ardp-benefit-tab-${tab.id}`}
      className="ardpBenefits__panel"
      data-ardp-panel
    >
      <div className="ardpBenefits__grid">
        <article className="ardpBenefits__content" data-ardp-copy>
          <h3 className="ardpBenefits__panelTitle">{tab.panelTitle}</h3>
          {tab.features.map((feature) => (
            <div key={feature.title} className="ardpBenefits__textBlock">
              <h4 className="ardpBenefits__textBlockTitle">{feature.title}</h4>
              <p className="ardpBenefits__description">{feature.description}</p>
            </div>
          ))}
        </article>
        <div className="ardpBenefits__illustrationFrame" data-ardp-art>
          {/* eslint-disable-next-line @next/next/no-img-element -- local SVG; avoid Image optimizer */}
          <img
            key={tab.illustrationSrc}
            src={tab.illustrationSrc}
            alt={tab.illustrationAlt}
            width={650}
            height={480}
            className="ardpBenefits__illustration"
            decoding="async"
            fetchPriority={tab.id === "scalability" ? "high" : "auto"}
          />
        </div>
      </div>
    </div>
  );
}
