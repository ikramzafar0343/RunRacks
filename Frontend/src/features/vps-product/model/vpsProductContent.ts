/**
 * Static VPS product page content — swap image paths when final assets land.
 * Placeholder media from existing public showcase / stories / brands.
 */

export type EditorialImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  objectPosition?: string;
};

/** Lucide icon keys resolved in VpsProductFeatures. */
export type VpsHeroIconId =
  | "gauge"
  | "activity"
  | "star"
  | "focus"
  | "settings"
  | "wallet";

export type VpsHeroFeature = {
  id: string;
  icon: VpsHeroIconId;
  title: string;
  description: string;
};

export type Principle = {
  id: string;
  number: string;
  title: string;
  description: string;
};

export type RailCard =
  | {
      id: string;
      type: "photo";
      height: "tall" | "medium" | "short";
      image: EditorialImage;
      caption?: string;
    }
  | {
      id: string;
      type: "message";
      height: "tall" | "medium" | "short";
      title: string;
      body: string;
      preview: EditorialImage;
      accent?: boolean;
    };

export const VPS_PRODUCT = {
  metaTitle: "Linux VPS Hosting | RunRacks",
  metaDescription:
    "Linux VPS on local NVMe with full root access. Compare documented vCPU, RAM, and storage—demo prices labeled until checkout.",
  hero: {
    titleLine: "Linux VPS on NVMe",
    accentLine: "with full root access",
    highlights: [
      { id: "speed", icon: "speed", label: "Local NVMe storage" },
      { id: "uptime", icon: "shield", label: "Isolated KVM guests" },
      { id: "locations", icon: "globe", label: "Catalog regions" },
    ] as const,
    primaryCta: { label: "View Plans", href: "#vps-plans" },
    secondaryCta: { label: "Try RunRacks AI", href: "/ai" },
    visual: {
      src: "/images/vps/hero/server-stack-large.webp",
      alt: "Three dark VPS server units with illuminated green status lights",
    },
    visualMobile: {
      src: "/images/vps/hero/server-stack-mobile.webp",
      alt: "Three dark VPS server units with illuminated green status lights",
    },
    /** Demo catalog floor (VPS 1) — not a live provisioning claim. */
    specs: [
      { id: "cpu", icon: "cpu", label: "CPU", value: "From 1 vCPU" },
      { id: "ram", icon: "ram", label: "RAM", value: "From 1 GB" },
      { id: "storage", icon: "storage", label: "Storage", value: "From 20 GB NVMe" },
    ] as const,
    features: [
      {
        id: "speed",
        icon: "gauge",
        title: "Fast delivery",
        description:
          "Plan cards list a 15 min delivery window so you know what to expect once ordering is connected.",
      },
      {
        id: "uptime",
        icon: "activity",
        title: "Reliable isolation",
        description:
          "Each Linux VPS runs as an isolated KVM guest so neighboring tenants do not share your CPU and memory pool.",
      },
      {
        id: "performance",
        icon: "star",
        title: "Documented performance",
        description:
          "Compare listed vCPU, RAM, and local NVMe on every tier before you choose a plan.",
      },
      {
        id: "latency",
        icon: "focus",
        title: "Catalog regions",
        description:
          "Filter by locations such as the United States or Singapore and pick the region nearest your audience.",
      },
      {
        id: "control",
        icon: "settings",
        title: "Plan controls",
        description:
          "Compare specs, filter the catalog, and use Customize to shape a build before checkout is configured.",
      },
      {
        id: "flexibility",
        icon: "wallet",
        title: "Flexible billing terms",
        description:
          "Choose monthly or longer terms on labeled demo pricing until live checkout is connected.",
      },
    ] satisfies readonly VpsHeroFeature[],
  },
  story: {
    label: "About RunRacks Linux VPS",
    paragraphs: [
      "RunRacks Linux VPS pairs documented compute, NVMe storage, and catalog regions so teams can run production and staging with full root access.",
      "Every build starts with the same questions: what must stay fast, who operates the guest, and what success looks like after launch.",
      "We keep specs readable and defaults purposeful so the infrastructure stays useful as your stack grows.",
    ],
  },
  photoPair: {
    left: {
      src: "/images/showcase/vps-photo-left.jpg",
      alt: "Support reaching down to help — reliable help when you need it",
      width: 768,
      height: 1024,
      objectPosition: "50% 40%",
    } satisfies EditorialImage,
    right: {
      src: "/images/showcase/vps-photo-right.jpg",
      alt: "Hand placing the final puzzle piece — goals, growth, and launch fitting together",
      width: 1024,
      height: 1024,
      objectPosition: "50% 50%",
    } satisfies EditorialImage,
  },
  principlesLabel: "How we work",
  principles: [
    {
      id: "goal",
      number: "01",
      title: "Understand the goal",
      description:
        "We begin with the workload, the audience, and the outcome the server must support so every plan choice has a clear purpose.",
    },
    {
      id: "clear",
      number: "02",
      title: "Make the complex clear",
      description:
        "Specs, regions, and billing stay readable. We turn complicated requirements into plans people can compare and act on.",
    },
    {
      id: "care",
      number: "03",
      title: "Build with care",
      description:
        "Performance, access, and maintainability are part of the product—not afterthoughts bolted on after launch.",
    },
    {
      id: "open",
      number: "04",
      title: "Work openly",
      description:
        "Scope, limits, and next steps stay visible so operators and stakeholders share the same picture of progress.",
    },
    {
      id: "measure",
      number: "05",
      title: "Size from the workload",
      description:
        "Match vCPU, RAM, and NVMe to traffic and services—then leave headroom instead of guessing from marketing slogans.",
    },
    {
      id: "improve",
      number: "06",
      title: "Keep improving",
      description:
        "We refine defaults and documentation over time so everyday hosting stays useful as stacks and teams change.",
    },
  ] satisfies readonly Principle[],
  rail: {
    label: "A closer look at RunRacks VPS",
    cards: [
      {
        id: "craft",
        type: "photo",
        height: "tall",
        image: {
          src: "/images/showcase/rail-photo-cloud.jpg",
          alt: "Server connected to the cloud with green data beams",
          width: 1024,
          height: 1024,
          objectPosition: "50% 50%",
        },
        caption: "Clear plans, practical defaults",
      },
      {
        id: "bridge",
        type: "message",
        height: "tall",
        title: "Plans that stay readable",
        body: "Compare specs, regions, and access before you order—without the maze.",
        preview: {
          src: "/images/showcase/rail-preview-stop.jpg",
          alt: "",
          width: 1024,
          height: 1024,
          objectPosition: "50% 50%",
        },
      },
      {
        id: "people",
        type: "photo",
        height: "tall",
        image: {
          src: "/images/showcase/rail-photo-operator.jpg",
          alt: "Operator with a laptop beside green-lit server racks",
          width: 1024,
          height: 1024,
          objectPosition: "50% 40%",
        },
      },
      {
        id: "partnership",
        type: "message",
        height: "medium",
        title: "From first question to next release",
        body: "We bring clarity to the work ahead—specs, access, and the path to production.",
        preview: {
          src: "/images/showcase/rail-preview-brand.jpg",
          alt: "",
          width: 1024,
          height: 1024,
          objectPosition: "50% 50%",
        },
      },
      {
        id: "capabilities",
        type: "message",
        height: "tall",
        accent: true,
        title: "Compute, storage, and control",
        body: "Strategy, operations, and technology working together on your VPS.",
        preview: {
          src: "/images/showcase/rail-preview-grow.jpg",
          alt: "",
          width: 1024,
          height: 1024,
          objectPosition: "50% 50%",
        },
      },
      {
        id: "standard",
        type: "message",
        height: "short",
        title: "Working standard",
        body: "Clear scope. Useful feedback. A shared understanding of what comes next.",
        preview: {
          src: "/images/showcase/rail-preview-leads.jpg",
          alt: "",
          width: 1024,
          height: 1024,
          objectPosition: "50% 50%",
        },
      },
    ] satisfies readonly RailCard[],
  },
} as const;
