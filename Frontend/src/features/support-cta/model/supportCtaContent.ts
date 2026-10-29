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
      heading: "Talk to the engineers who run the fleet",
      body: "Your questions go to RunRacks engineers — deep technical help without the chatbot maze.",
      emphasis: "engineers",
      ctaLabel: "Let's talk",
      href: "/contact" as Route,
      imageSrc: "/media/customer-stories/demo-01/portrait.jpg",
      imageAlt:
        "Demo portrait of an engineer at a laptop — not a verified staff photo",
    },
    {
      id: "migrate",
      heading: "Want to migrate your site?",
      body: "Our team can walk you through moving workloads onto RunRacks VPS infrastructure—with clear plan choices and admin access when you need it.",
      ctaLabel: "Chat with us",
      href: "/ai" as Route,
      imageSrc: "/media/customer-stories/demo-02/portrait.jpg",
      imageAlt: "Demo portrait in a workspace — not a verified staff photo",
    },
  ] satisfies readonly SupportCtaCard[],
} as const;
