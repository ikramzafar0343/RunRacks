import type { PrincipleItem, TeamItem, TimelineItem, ValueItem } from "./types";

export const ABOUT_TIMELINE_INTRO = {
  eyebrow: "Our journey",
  title: "Built in deliberate phases.",
  description:
    "From clearer plan language to operator-first support—each phase sharpens how RunRacks hosting is explained and delivered.",
} as const;

/** Editorial phases — not dated historical claims. */
export const ABOUT_TIMELINE: readonly TimelineItem[] = [
  {
    id: "idea",
    phase: "The idea",
    title: "A clearer way forward",
    description:
      "An ambition to make the technical side of getting online easier to navigate.",
    image: {
      src: "/images/showcase/plans-cover-1200.jpg",
      alt: "Planning materials on a workspace surface",
    },
  },
  {
    id: "foundation",
    phase: "The foundation",
    title: "Building on reliability",
    description:
      "A focus on the essential details that make digital experiences feel dependable.",
    image: {
      src: "/images/showcase/vps-photo-left.jpg",
      alt: "Close view of server hardware",
    },
  },
  {
    id: "people",
    phase: "The people",
    title: "Putting support first",
    description:
      "Prioritizing the human side of complex questions and everyday needs.",
    image: {
      src: "/images/admin-rdp/story-portrait.jpg",
      alt: "Person focused on work in a bright office",
    },
  },
  {
    id: "platform",
    phase: "The platform",
    title: "Creating room to grow",
    description:
      "Thinking about flexible tools and the different needs of growing projects.",
    image: {
      src: "/images/showcase/vps-photo-right.jpg",
      alt: "Perspective view of a server environment",
    },
  },
  {
    id: "experience",
    phase: "The experience",
    title: "Improving every interaction",
    description:
      "Learning what users need and removing unnecessary friction along the way.",
    image: {
      src: "/images/showcase/rail-preview-leads.jpg",
      alt: "Product collaboration scene at a desk",
    },
  },
  {
    id: "future",
    phase: "The future",
    title: "Moving forward together",
    description:
      "Continuing to invest attention in the work that makes hosting more useful.",
    image: {
      src: "/images/showcase/rail-preview-grow.jpg",
      alt: "Modern workspace suggesting forward progress",
    },
  },
];

export const ABOUT_VALUES_INTRO = {
  eyebrow: "How we work",
  title: "Values you can see in action.",
  description:
    "A better experience starts with the everyday choices our people make.",
} as const;

export const ABOUT_VALUES: readonly ValueItem[] = [
  {
    id: "trust",
    title: "Earn trust",
    description: "Communicate clearly, follow through, and do what we say.",
    image: {
      src: "/images/showcase/rail-preview-brand.jpg",
      alt: "Calm branded workspace atmosphere",
    },
  },
  {
    id: "practical",
    title: "Be practical",
    description:
      "Focus on the problem in front of us and find the useful answer.",
    image: {
      src: "/images/showcase/vps-lead.jpg",
      alt: "Hands-on work reviewing hosting setup",
    },
  },
  {
    id: "energy",
    title: "Bring energy",
    description: "Approach challenges with care, curiosity, and momentum.",
    image: {
      src: "/images/admin-rdp/float-01.webp",
      alt: "Dynamic workspace detail",
    },
  },
  {
    id: "respect",
    title: "Respect people",
    description: "Listen carefully and treat every person with dignity.",
    image: {
      src: "/images/product-hosting/windows-hero-portrait.webp",
      alt: "Portrait framing emphasizing human presence",
    },
  },
  {
    id: "ownership",
    title: "Take ownership",
    description: "Stay accountable, solve what matters, and keep learning.",
    image: {
      src: "/images/admin-rdp/story-detail.jpg",
      alt: "Detailed desk work and focus",
    },
  },
  {
    id: "innovate",
    title: "Keep innovating",
    description:
      "Improve the way things work instead of accepting needless friction.",
    image: {
      src: "/images/showcase/rail-photo-cloud.jpg",
      alt: "Abstract cloud infrastructure visual",
    },
  },
];

export const ABOUT_TECH = {
  eyebrow: "Technology + people",
  title: "Smarter tools matter. People matter more.",
  paragraphs: [
    "Useful technology removes friction and makes the everyday easier.",
    "We believe the strongest hosting experiences pair thoughtful systems with real accountability, clear explanations, and human understanding.",
  ],
  link: { label: "Explore customize", href: "/customize" as const },
  image: {
    src: "/images/admin-rdp/team.jpg",
    alt: "People working together with systems and screens",
  },
} as const;

export const ABOUT_TEAM_INTRO = {
  eyebrow: "The people behind the platform",
  title: "Different strengths. One shared focus.",
  lead: "Good infrastructure depends on the people who build, improve, and support it.",
} as const;

export const ABOUT_TEAM: readonly TeamItem[] = [
  {
    id: "support",
    category: "Team 01",
    title: "Customer Support",
    description: "Thoughtful help, clear communication, and useful answers.",
    image: {
      src: "/images/admin-rdp/story-portrait.jpg",
      alt: "Support-focused workspace portrait",
    },
  },
  {
    id: "infra",
    category: "Team 02",
    title: "Infrastructure & Reliability",
    description: "Attention to the systems that keep projects working.",
    image: {
      src: "/images/showcase/vps-cover-1200.jpg",
      alt: "Infrastructure environment photography",
    },
  },
  {
    id: "engineering",
    category: "Team 03",
    title: "Product & Engineering",
    description: "Making complex workflows more approachable.",
    image: {
      src: "/images/showcase/rail-photo-operator.jpg",
      alt: "Engineering work at a monitoring station",
    },
  },
  {
    id: "ops",
    category: "Team 04",
    title: "Growth & Operations",
    description: "Connecting people, processes, and practical progress.",
    image: {
      src: "/images/showcase/rail-preview-grow.jpg",
      alt: "Operations and growth planning atmosphere",
    },
  },
];

export const ABOUT_STORIES_INTRO = {
  eyebrow: "In their words",
  title: "The people make the difference.",
  line: "A look at the thinking, care, and craft behind the work.",
} as const;

export const ABOUT_PRINCIPLES: readonly PrincipleItem[] = [
  {
    id: "p1",
    label: "Clarity",
    statement:
      "We explain hosting choices in plain language so you can decide with confidence.",
  },
  {
    id: "p2",
    label: "Reliability",
    statement:
      "We treat dependable infrastructure as the quiet foundation behind every launch.",
  },
  {
    id: "p3",
    label: "Accountability",
    statement:
      "We stay present when something is hard—and keep improving how support feels.",
  },
];

export const ABOUT_CTA = {
  eyebrow: "We're here to help",
  title: "Let's make your next move easier.",
  description:
    "Have a question about getting started or finding the right setup? Tell us what you're building and we'll help you find the next step.",
  primary: { label: "View plans", href: "/pricing" as const },
  secondary: { label: "Explore hosting", href: "/products/vps" as const },
  image: {
    src: "/images/admin-rdp/story-desk.jpg",
    alt: "Supportive workspace ready for a conversation",
  },
} as const;
