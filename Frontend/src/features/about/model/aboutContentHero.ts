import type { CapabilityItem, FeatureItem } from "./types";

export const ABOUT_META = {
  title: "About RunRacks | Hosting Built Around You",
  description:
    "Meet RunRacks, our approach to reliable hosting, the people behind the platform, and the values that guide how we build and support online experiences.",
} as const;

export const ABOUT_HERO = {
  eyebrow: "About RunRacks",
  lines: ["From your first idea", "to everything", "you build next."],
  lead: "Hosting should give you the confidence to launch, the performance to grow, and people to turn to when it matters.",
  scrollCue: "Scroll to explore",
} as const;

export const ABOUT_CAPABILITIES: readonly CapabilityItem[] = [
  {
    id: "nvme",
    label: "Storage foundation",
    value: "NVMe-backed plans",
    verified: true,
  },
  {
    id: "access",
    label: "Control",
    value: "Full root & admin access",
    verified: true,
  },
  {
    id: "products",
    label: "Product range",
    value: "VPS, Windows & Admin RDP",
    verified: true,
  },
  {
    id: "plans",
    label: "Pricing clarity",
    value: "Clear, predictable plans",
    verified: true,
  },
  {
    id: "support",
    label: "Support stance",
    value: "Engineers when you need them",
    verified: true,
  },
  {
    id: "customize",
    label: "Flexibility",
    value: "Configurable hosting setups",
    verified: true,
  },
];

export const ABOUT_INTRO = {
  eyebrow: "Built around you",
  title: "Made for the way you grow.",
  lead: "A small project and a growing business may need different things. They should both get clarity, confidence, and room to move forward.",
  secondary:
    "We believe reliable infrastructure matters most when it stays out of your way—so you can focus on your customers, your products, and what comes next.",
  signature: "Technology with people in mind",
} as const;

export const ABOUT_FEATURES: readonly FeatureItem[] = [
  {
    id: "vision",
    indexLabel: "01 / 04",
    eyebrow: "Our vision",
    title: "A more dependable way to be online.",
    lead: "Technology should give you freedom, not more things to worry about.",
    body: "We want people and businesses to feel confident about the systems behind their work—through clear communication, thoughtful performance, and a commitment to keep improving.",
    mediaSide: "left",
    image: {
      src: "/images/showcase/rail-photo-operator.jpg",
      alt: "Operator reviewing systems at a workstation",
      objectPosition: "50% 30%",
    },
  },
  {
    id: "mission",
    indexLabel: "02 / 04",
    eyebrow: "Our mission",
    title: "Make complex hosting feel simple.",
    lead: "Useful tools. Clear choices. Support that makes sense.",
    body: "Our job is to turn infrastructure into a strong foundation for your next move—whether you're launching a first site, managing clients, or growing a more demanding project.",
    mediaSide: "right",
    image: {
      src: "/images/admin-rdp/team.jpg",
      alt: "Team collaborating around screens in a shared workspace",
      objectPosition: "50% 40%",
    },
  },
  {
    id: "future",
    indexLabel: "03 / 04",
    eyebrow: "Built for what's next",
    title: "Ready when your ambitions grow.",
    lead: "Your infrastructure should support what you create today and leave room for tomorrow.",
    body: "We design our approach around adaptability, useful tooling, and practical performance priorities. The aim is straightforward: fewer obstacles between your ideas and your work.",
    mediaSide: "left",
    image: {
      src: "/images/showcase/vps-cover-1200.jpg",
      alt: "Server infrastructure aisle with cool lighting",
      objectPosition: "center",
    },
  },
  {
    id: "leadership",
    indexLabel: "04 / 04",
    eyebrow: "How we lead",
    title: "Progress happens when people take ownership.",
    lead: "We value listening carefully, solving the real issue, and making each experience better.",
    body: "Good hosting takes more than technology. It takes people who pay attention to the details, work together when something is difficult, and care about the result.",
    mediaSide: "right",
    image: {
      src: "/images/admin-rdp/story-desk.jpg",
      alt: "Collaborative planning workspace with laptops and notes",
      objectPosition: "50% 45%",
    },
  },
];
