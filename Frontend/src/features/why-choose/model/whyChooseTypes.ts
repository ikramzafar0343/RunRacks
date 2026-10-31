/**
 * Shared Why Choose Us content contract.
 */

export type WhyChooseIconId =
  | "zap"
  | "tag"
  | "cpu"
  | "panel"
  | "headphones"
  | "shield";

export type WhyChooseKpi = {
  value: string;
  caption: string;
};

export type WhyChooseFeature = {
  id: string;
  icon: WhyChooseIconId;
  title: string;
  body: string;
};

export type WhyChooseContent = {
  titleBefore: string;
  titleAccent: string;
  lead: string;
  kpisNotice: string;
  kpis: readonly WhyChooseKpi[];
  cta: { label: string; href: string };
  features: readonly WhyChooseFeature[];
};
