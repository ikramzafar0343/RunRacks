/**
 * Hosting-only showcase cards — real routes, project-owned demo imagery.
 * Cover art export size: 1200×1200 (1:1). Cards are locked to the same ratio.
 */
import type { Route } from "next";
import type {
  FeatureCard,
  ShowcaseIntro,
} from "@/features/feature-showcase/model/types";

/** Single export size for every showcase cover. */
export const SHOWCASE_COVER_SIZE = { width: 1200, height: 1200 } as const;

export const SHOWCASE_INTRO: ShowcaseIntro = {
  eyebrow: "What we offer",
  headingLine1: "Everything to build",
  headingLine2: "what’s next.",
  supporting:
    "Explore the tools, digital solutions, and infrastructure designed to help your next idea go further.",
  ctaLabel: "Explore solutions",
  ctaHref: "/customize" as Route,
};

export const FEATURE_CARDS: FeatureCard[] = [
  {
    id: "offers",
    label: "Plans & prices",
    title: "Find the right plan for your next move.",
    teaser: "Plans & offers",
    description: "Compare options, features, and pricing in one place.",
    ctaLabel: "View plans",
    href: "/pricing" as Route,
    imageSrc: "/images/showcase/plans-cover-1200.jpg",
    imageAlt:
      "Person considering hosting plans with plan option cards on a green studio backdrop",
    imagePosition: "center center",
    theme: "red",
  },
  {
    id: "vps",
    label: "VPS hosting",
    title: "More control. Room to scale.",
    teaser: "VPS hosting",
    description:
      "Flexible hosting for projects that need dependable infrastructure.",
    ctaLabel: "View VPS plans",
    href: "/products/vps" as Route,
    imageSrc: "/images/showcase/vps-cover-1200.jpg",
    imageAlt:
      "Person with a phone seated against a green VPS hosting studio backdrop",
    imagePosition: "center center",
    theme: "violet",
  },
  {
    id: "windows",
    label: "Windows",
    title: "Windows servers ready when you are.",
    teaser: "Windows hosting",
    description:
      "Deploy Windows workloads with a familiar desktop environment and clear plan choices.",
    ctaLabel: "Explore Windows",
    href: "/products/windows" as Route,
    imageSrc: "/images/showcase/windows-cover-1200.jpg",
    imageAlt:
      "Professional with a tablet beside Windows hosting feature cards on a green backdrop",
    imagePosition: "center center",
    theme: "slate",
  },
  {
    id: "rdp",
    label: "Admin RDP",
    title: "Admin access without the guesswork.",
    teaser: "Windows Admin RDP",
    description:
      "Remote desktop admin sessions for teams that need hands-on Windows control.",
    ctaLabel: "View Admin RDP",
    href: "/products/admin-rdp" as Route,
    imageSrc: "/images/showcase/admin-rdp-cover-1200.jpg",
    imageAlt:
      "Administrator at a desk with Windows Admin RDP feature cards on a green backdrop",
    imagePosition: "center center",
    theme: "night",
  },
];

export function getFeatureCard(id: FeatureCard["id"]): FeatureCard {
  const card = FEATURE_CARDS.find((item) => item.id === id);
  if (!card) {
    throw new Error(`Unknown feature card: ${id}`);
  }
  return card;
}
