/**
 * Static VPS product page content — swap image paths when final assets land.
 * Placeholder media from existing public showcase / stories / brands.
 */
import { approvedBrands } from "@/features/home/model/brandsContent";

export type EditorialImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  objectPosition?: string;
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
  metaTitle: "VPS Hosting",
  metaDescription:
    "NVMe VPS with full root access, clear plans, and predictable performance from RunRacks.",
  hero: {
    lines: [
      "Root access without the guesswork",
      "NVMe plans with clear control after launch",
    ],
    supportLines: [
      "Compare clear specs and regions before you order",
      "Ship with full root and predictable performance",
    ],
  },
  lead: {
    src: "/images/showcase/vps-lead.jpg",
    alt: "RunRacks team reviewing a VPS deployment together at a laptop",
    width: 1024,
    height: 682,
    objectPosition: "50% 48%",
  } satisfies EditorialImage,
  story: {
    label: "About RunRacks VPS",
    paragraphs: [
      "RunRacks VPS brings dedicated compute, storage, and networking together so teams can run production workloads with full root and straightforward plan choices.",
      "Every deployment starts with the same questions: what must stay fast, who operates it, and what a successful result looks like after launch.",
      "We focus on clear specs, purposeful defaults, and infrastructure that remains useful as your stack grows.",
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
      title: "Measure what matters",
      description:
        "We connect delivery to relevant signals—uptime, latency, and capacity—so improvements follow evidence.",
    },
    {
      id: "improve",
      number: "06",
      title: "Keep improving",
      description:
        "We refine defaults and documentation over time so everyday hosting stays useful as stacks and teams change.",
    },
  ] satisfies readonly Principle[],
  logos: {
    heading: "Platforms that fit modern stacks",
    intro:
      "Illustrative technology marks for environments teams commonly run on VPS—not partnership or endorsement claims.",
    brands: approvedBrands.slice(0, 8),
  },
  rail: {
    label: "A closer look at RunRacks",
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
