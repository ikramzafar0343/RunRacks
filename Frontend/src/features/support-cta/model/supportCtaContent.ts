/**
 * Dual support / migration CTA — real routes, project-owned demo imagery.
 */
import type { Route } from "next";

export type SupportCtaCard = {
  id: string;
  heading: string;
  body: string;
  emphasis?: string;
  ctaLabel: string;
  href: Route;
  imageSrc: string;
  imageAlt: string;
};

export const SUPPORT_CTA = {
  cards: [
    {
      id: "support",
      heading: "Talk to RunRacks engineers",
      body: "Plan fit, migrations, and product questions go to people who know the fleet—not a chatbot loop.",
      emphasis: "engineers",
      ctaLabel: "Contact us",
      href: "/contact" as Route,
      imageSrc: "/media/customer-stories/demo-01/portrait.jpg",
      imageAlt:
        "Demo portrait of an engineer at a laptop — not a verified staff photo",
    },
    {
      id: "migrate",
      heading: "Moving an existing workload?",
      body: "We can walk through family choice, region, and administrator access so your move onto RunRacks stays clear.",
      ctaLabel: "Try RunRacks AI",
      href: "/ai" as Route,
      imageSrc: "/media/customer-stories/demo-02/portrait.jpg",
      imageAlt: "Demo portrait in a workspace — not a verified staff photo",
    },
  ] satisfies readonly SupportCtaCard[],
} as const;
