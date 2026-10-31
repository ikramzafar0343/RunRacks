/**
 * Hosting showcase cards — real routes, project-owned demo imagery.
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
  eyebrow: "Hosting products",
  headingLine1: "Infrastructure",
  headingLine2: "built to operate.",
  supporting:
    "Compare Linux VPS, Windows VPS, and Admin RDP—clear specs, administrator access, and regions that match your audience.",
  ctaLabel: "Customize a build",
  ctaHref: "/customize" as Route,
};

export const FEATURE_CARDS: FeatureCard[] = [
  {
    id: "offers",
    label: "Plans & prices",
    title: "Compare every hosting family in one catalog.",
    teaser: "Plans & offers",
    description:
      "Filter by family, region, and billing term. Demo prices are labeled until checkout is connected.",
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
    title: "Linux VPS with full root access.",
    teaser: "VPS hosting",
    description:
      "NVMe-backed virtual servers with documented vCPU, RAM, and storage for production and staging.",
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
    title: "Windows VPS for admin workloads.",
    teaser: "Windows hosting",
    description:
      "Administrator access on Windows Server–ready plans sized for apps, tools, and remote management.",
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
    title: "Remote desktops with full admin rights.",
    teaser: "Windows Admin RDP",
    description:
      "Persistent Windows workspaces for operators who need hands-on control—not a locked shared desktop.",
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
