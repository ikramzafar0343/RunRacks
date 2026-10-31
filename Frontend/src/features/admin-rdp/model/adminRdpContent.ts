/**
 * Admin RDP editorial page — English product copy (Brandium About section order).
 * Demo/illustrative labels where claims are not production-verified.
 */
import type { Route } from "next";
import {
  DEMO_PRICING_ANSWER,
  catalogRegionsIntro,
} from "@/shared/content/demoPricingCopy";

export type ArdpStat = { value: string; caption: string };
export type ArdpTestimonial = {
  quote: string;
  name: string;
  role: string;
};
export type ArdpFaqItem = { id: string; question: string; answer: string };

export const ADMIN_RDP = {
  metaTitle: "Admin RDP — Windows remote desktop | RunRacks",
  metaDescription:
    "Windows Admin RDP with full administrator access. Compare labeled demo plans and continue on Pricing when checkout is configured.",
  hero: {
    lines: ["Windows Admin RDP", "for operators"] as const,
    lead: "A persistent Windows remote desktop with full administrator rights—sized by vCPU, RAM, and NVMe you can compare before checkout.",
    notes: ["Remote Windows desktop", "Full administrator access"] as const,
    primaryCta: {
      label: "Explore Plans",
      href: "/products/admin-rdp#vps-plans" as Route,
    },
    secondaryCta: {
      label: "Try RunRacks AI",
      href: "/ai" as Route,
    },
    visual: {
      src: "/images/admin-rdp/hero-workstation.webp",
      alt: "Windows Admin RDP workstation — monitor with Windows desktop, RunRacks tower, keyboard, and mouse",
    },
    visualMobile: {
      src: "/images/admin-rdp/hero-workstation-mobile.webp",
      alt: "Windows Admin RDP workstation — monitor with Windows desktop, RunRacks tower, keyboard, and mouse",
    },
  },
  /** Centered scroll word-fill block under the float stage */
  manifesto: {
    paragraphs: [
      "Admin RDP is for teams that need a real Windows desktop remotely—full administrator access with documented demo specs for vCPU, RAM, and storage before checkout is connected.",
    ] as const,
  },
  storyIdeas: {
    eyebrow: "+ ( Built for operator workflows )",
    body: "Support desks, finance tools, legacy apps, and day-to-day admin all need a proper Windows session. Match those needs to an Admin RDP tier so remote work feels like a machine you control—not a locked guest account.",
    portrait: {
      src: "/images/admin-rdp/story-portrait.jpg",
      alt: "Operator in a beanbag with a laptop under a WORK headline",
    },
    pair: [
      {
        src: "/images/admin-rdp/story-desk.jpg",
        alt: "Operator carrying an overloaded folder of messy data papers",
      },
      {
        src: "/images/admin-rdp/story-detail.jpg",
        alt: "Operator checking a phone surrounded by social media icons",
      },
    ] as const,
  },
  storyDesign: {
    eyebrow: "+ ( Specs and a usable desktop )",
    primary:
      "Install software, manage services, and work through a familiar Windows desktop. Plan cards stay honest about capacity; Pricing is the next step when you are ready to continue.",
    secondary:
      "Specs without a usable desktop fail operators; a desktop without clear capacity fails planning. Admin RDP pairs labeled demo tiers with full administrator sessions.",
    image: {
      src: "/images/admin-rdp/team.jpg",
      alt: "Team working with remote Windows tools — placeholder for Admin RDP team slot",
    },
  },
  /** Locations / globe — same catalog regions as pricing filters */
  network: {
    eyebrow: "Catalog regions",
    headingAfter: "locations. Pick a region, open Admin RDP plans.",
    intro: catalogRegionsIntro("Admin RDP plans"),
  },
  stats: {
    eyebrow: "( Demo figures )",
    items: [
      {
        value: "40",
        caption: "Demo plan combinations across Admin RDP tiers in the catalog",
      },
      {
        value: "95+",
        caption: "Illustrative regions and filters shown in pricing demos",
      },
      {
        value: "12",
        caption: "Months of billed demo terms you can compare on plan cards",
      },
      {
        value: "3",
        caption: "Hosting families: Linux, Windows, and Windows Admin RDP",
      },
      {
        value: "100%",
        caption:
          "Administrator access on Admin RDP plans — labeled demo checkout",
      },
    ] as const satisfies readonly ArdpStat[],
  },
  testimonials: {
    eyebrow: "( Experiences )",
    heading: "What operators say",
    demoNotice: "Illustrative quotes — not verified customer reviews.",
    items: [
      {
        quote:
          "Admin RDP finally gave our support team a real Windows desktop instead of hopping through temporary jump boxes. Specs on the plan cards matched what we needed to trial.",
        name: "Amina Okonkwo",
        role: "Support lead — demo persona",
      },
      {
        quote:
          "We needed admin rights for legacy finance tools. The remote session felt familiar, and comparing tiers without marketing fog helped us pick a starting size.",
        name: "Marcus Chen",
        role: "Ops manager — demo persona",
      },
      {
        quote:
          "Clear vCPU and RAM labels beat vague ‘unlimited’ claims. We still treat this as demo pricing until checkout is live, but the product story already makes sense.",
        name: "Elena Ruiz",
        role: "IT coordinator — demo persona",
      },
      {
        quote:
          "Our contractors dial in over RDP and keep working. Administrator access removed the usual permission blockers we hit on locked guests.",
        name: "Jordan Blake",
        role: "Agency founder — demo persona",
      },
      {
        quote:
          "Switching between Windows VPS and Admin RDP in the catalog made the difference obvious. One is server-first; the other is desktop-first for admins.",
        name: "Priya Nair",
        role: "Platform engineer — demo persona",
      },
      {
        quote:
          "Pricing is honest about what is configured today. That transparency matters more than a fake ‘buy now’ button.",
        name: "Tomás Silva",
        role: "CTO — demo persona",
      },
    ] as const satisfies readonly ArdpTestimonial[],
  },
  faq: {
    heading: "Admin RDP FAQs",
    items: [
      {
        id: "what-is-admin-rdp",
        question: "What is Windows Admin RDP on RunRacks?",
        answer:
          "Admin RDP is a Windows remote desktop family with full administrator access. Connect with a remote desktop client, manage the machine like a local Windows box, and compare demo tiers by vCPU, RAM, and storage before checkout is configured.",
      },
      {
        id: "who-is-admin-rdp-for",
        question: "Who is Admin RDP for?",
        answer:
          "Teams that need a full Windows desktop remotely—support desks, agencies, operators running Windows-only tools, or anyone who outgrew locked-down guest sessions. If you primarily need a headless server, compare Linux or Windows VPS instead.",
      },
      {
        id: "admin-rdp-vs-windows-vps",
        question: "How is Admin RDP different from Windows VPS?",
        answer:
          "Windows VPS emphasizes server workloads. Admin RDP emphasizes an administrator desktop session over RDP. Both appear in the same catalog so you can filter by family and compare honest demo specs side by side.",
      },
      {
        id: "full-admin-access",
        question: "Do I get full administrator access?",
        answer:
          "Yes on Admin RDP plans—the product story is full admin for remote desktop work. Plan cards and demos label what is illustrative versus ready for checkout so you are not sold a fake live purchase flow.",
      },
      {
        id: "install-software",
        question: "Can I install my own software?",
        answer:
          "Administrator access is intended for installing and managing the Windows tools your workflow needs. Always follow license terms for Microsoft and third-party software; RunRacks demos do not grant redistributable Windows licenses beyond what your account provides when live.",
      },
      {
        id: "pricing-live",
        question: "Is pricing live today?",
        answer: DEMO_PRICING_ANSWER,
      },
      {
        id: "regions",
        question: "Which regions can I pick?",
        answer:
          "Regions appear in the pricing filters for Admin RDP. Treat the list as the current catalog until capacity and checkout are fully connected.",
      },
      {
        id: "get-started",
        question: "How do I get started?",
        answer:
          "Compare Admin RDP tiers on this page or on Pricing, then Contact the team to continue. Deploy stays unavailable until checkout is configured.",
      },
    ] as const satisfies readonly ArdpFaqItem[],
  },
  bottomCta: {
    heading: "Compare Admin RDP tiers",
    ctaLabel: "View Pricing",
    href: "/pricing" as Route,
  },
} as const;
