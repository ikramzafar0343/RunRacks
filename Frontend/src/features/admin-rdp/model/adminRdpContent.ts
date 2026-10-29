/**
 * Admin RDP editorial page — English product copy (Brandium About section order).
 * Demo/illustrative labels where claims are not production-verified.
 */
import type { Route } from "next";

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
    "Windows Admin RDP with full administrator access. Compare demo plans, see how teams work remotely, and open Pricing when checkout is configured.",
  hero: {
    eyebrow: "+ ( What we offer )",
    lines: ["Windows Admin RDP", "with full administrator access"] as const,
    /** Short hero subtitle — manifesto below keeps the long scroll text */
    lead: "Remote Windows desktops with full admin access. Compare demo plans, then open Pricing when checkout is configured.",
    primaryCta: {
      label: "View plans",
      href: "/pricing" as Route,
    },
    secondaryCta: {
      label: "View pricing",
      href: "/products/admin-rdp#vps-plans" as Route,
    },
  },
  /** Curved tilted-grid band under hero CTAs — float-01..04 WebP ~640 */
  heroGallery: [
    {
      src: "/images/admin-rdp/float-01.webp",
      alt: "Windows Admin RDP server racks on a green field",
    },
    {
      src: "/images/admin-rdp/float-02.webp",
      alt: "Operator with laptop beside Admin RDP product screens",
    },
    {
      src: "/images/admin-rdp/float-03.webp",
      alt: "Operator with phone and laptop in a neon green studio",
    },
    {
      src: "/images/admin-rdp/float-04.webp",
      alt: "Stepping through a doorway into a Windows server workspace",
    },
  ] as const,
  /** Centered scroll word-fill block under the float stage */
  manifesto: {
    paragraphs: [
      "For teams that need a real Windows desktop remotely, Admin RDP delivers full administrator access with clear demo specs—vCPU, RAM, and storage you can compare before checkout is configured.",
    ] as const,
  },
  storyIdeas: {
    eyebrow: "+ ( Remote desktops that keep up )",
    body: "We take time to understand how your operators work—support, finance tools, legacy apps, or day-to-day admin. Those needs shape which Admin RDP tier fits, so remote sessions feel like a real Windows machine, not a locked-down guest account.",
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
    eyebrow: "+ ( Access built for operators )",
    primary:
      "Admin RDP is for teams that need hands-on Windows control: install software, manage services, and work through a familiar desktop. We keep the story simple—honest plan specs, remote desktop access, and clear next steps on Pricing when you are ready.",
    secondary:
      "A strong remote workspace only works when access and execution match. Specs without a usable desktop fail operators; a desktop without clear capacity fails capacity planning. Admin RDP holds both: transparent demo tiers and full administrator sessions.",
    image: {
      src: "/images/admin-rdp/team.jpg",
      alt: "Team working with remote Windows tools — placeholder for Admin RDP team slot",
    },
  },
  /** Locations / globe — same catalog regions as pricing filters */
  network: {
    eyebrow: "Global network",
    headingAfter: "locations. Pick a region, open Admin RDP plans.",
    intro:
      "Same catalog regions as pricing filters—select a row, then jump to Admin RDP plans for that location.",
  },
  stats: {
    eyebrow: "( No fluff )",
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
    heading: "Questions? We got you.",
    items: [
      {
        id: "what-is-admin-rdp",
        question: "What is Windows Admin RDP on RunRacks?",
        answer:
          "Admin RDP is a Windows remote desktop plan family with full administrator access. You connect with a remote desktop client, manage the machine like a local Windows box, and compare demo tiers by vCPU, RAM, and storage before checkout is configured.",
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
        answer:
          "Catalog prices are demo labels for comparison. Checkout completes when backend and billing are configured. Use Pricing to continue with the current real flow.",
      },
      {
        id: "regions",
        question: "Which regions can I pick?",
        answer:
          "Demo regions appear in the pricing filters for the family you select. Availability on a live order depends on capacity when the platform is fully configured—treat region lists as catalog demos until then.",
      },
      {
        id: "get-started",
        question: "How do I get started?",
        answer:
          "Open Pricing to compare Admin RDP tiers in the VPS catalog with the Admin RDP family selected. This page is editorial—no fake order buttons.",
      },
    ] as const satisfies readonly ArdpFaqItem[],
  },
  bottomCta: {
    heading: "Ready to run Admin RDP with us?",
    ctaLabel: "Plan a walkthrough",
    href: "/pricing" as Route,
  },
} as const;
