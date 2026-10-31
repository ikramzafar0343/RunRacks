/**
 * Shared Why Choose Us — left copy + KPIs + feature grid (Sage & Ink / Nourd).
 */
import {
  Cpu,
  Headphones,
  LayoutDashboard,
  ShieldCheck,
  Tag,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  getWhyChooseContent,
  type WhyChooseVariant,
} from "@/features/why-choose/model/whyChooseContent";
import type { WhyChooseIconId } from "@/features/why-choose/model/whyChooseTypes";
import "@/features/why-choose/components/why-choose-us.css";

const ICONS: Record<WhyChooseIconId, LucideIcon> = {
  zap: Zap,
  tag: Tag,
  cpu: Cpu,
  panel: LayoutDashboard,
  headphones: Headphones,
  shield: ShieldCheck,
};

type WhyChooseUsProps = {
  variant: WhyChooseVariant;
  sectionId?: string;
};

export function WhyChooseUs({
  variant,
  sectionId = "why-choose-us",
}: WhyChooseUsProps) {
  const content = getWhyChooseContent(variant);
  const headingId = `${sectionId}-heading`;

  return (
    <section
      id={sectionId}
      className="rrWhy"
      aria-labelledby={headingId}
    >
      <div className="rrWhyInner">
        <div className="rrWhyCopy">
          <h2 id={headingId} className="rrWhyTitle">
            {content.titleBefore}{" "}
            <span className="rrWhyTitleAccent">{content.titleAccent}</span>
          </h2>
          <p className="rrWhyLead">{content.lead}</p>

          <p className="rrWhyKpisNotice">{content.kpisNotice}</p>
          <div className="rrWhyKpis" aria-label="Illustrative service targets">
            {content.kpis.map((kpi) => (
              <div key={kpi.caption} className="rrWhyKpi">
                <strong>{kpi.value}</strong>
                <span>{kpi.caption}</span>
              </div>
            ))}
          </div>

          <a className="rrWhyCta" href={content.cta.href}>
            {content.cta.label}
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="rrWhyFeats">
          {content.features.map((feature) => {
            const Icon = ICONS[feature.icon];
            return (
              <article key={feature.id} className="rrWhyFeat">
                <div className="rrWhyFeatIcon" aria-hidden>
                  <Icon size={20} strokeWidth={2} />
                </div>
                <h3 className="rrWhyFeatTitle">{feature.title}</h3>
                <p className="rrWhyFeatBody">{feature.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
