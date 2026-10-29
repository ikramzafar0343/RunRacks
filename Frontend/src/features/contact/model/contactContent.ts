/**
 * Contact page copy — real routes only; no invented offices/emails/phones.
 * Imagery reuses project-owned demo assets (honest alts).
 */
import type { Route } from "next";
import type { FaqItem } from "@/features/vps-faq/model/faqContent";

export const CONTACT_META = {
  title: "Contact | RunRacks",
  description:
    "Reach RunRacks engineers, open RunRacks AI, or explore plans. Message intake connects when mail is configured.",
} as const;

export const CONTACT_HERO = {
  brand: "Contact RunRacks",
  lead: "Ask engineers, open RunRacks AI, or pick a plan — real routes, no invented phone lines or offices.",
  primary: { label: "Send a message", href: "#contact-form" as const },
  secondary: { label: "View plans", href: "/pricing" as Route },
  image: {
    src: "/images/admin-rdp/story-desk.jpg",
    alt: "Demo workspace desk — not a verified RunRacks office photo",
  },
} as const;

export type ContactChannel = {
  id: string;
  title: string;
  body: string;
  ctaLabel: string;
  href: Route | "#contact-form";
  imageSrc: string;
  imageAlt: string;
};

export const CONTACT_CHANNELS: readonly ContactChannel[] = [
  {
    id: "engineers",
    title: "Talk to engineers",
    body: "Describe your stack, migration, or blocking issue. We route it when message intake is live.",
    ctaLabel: "Open the form",
    href: "#contact-form",
    imageSrc: "/media/customer-stories/demo-01/portrait.jpg",
    imageAlt:
      "Demo portrait of an engineer at a laptop — not a verified staff photo",
  },
  {
    id: "ai",
    title: "RunRacks AI",
    body: "Get plan and product answers instantly in chat — available now.",
    ctaLabel: "Open AI chat",
    href: "/ai" as Route,
    imageSrc: "/images/showcase/rail-preview-brand.jpg",
    imageAlt: "Product preview imagery for RunRacks AI guidance",
  },
  {
    id: "plans",
    title: "Plans & pricing",
    body: "Compare Linux VPS, Windows, and Admin RDP before you write us.",
    ctaLabel: "View pricing",
    href: "/pricing" as Route,
    imageSrc: "/images/showcase/plans-cover-1200.jpg",
    imageAlt: "RunRacks plans cover imagery",
  },
  {
    id: "abuse",
    title: "Report an issue",
    body: "Security or abuse concerns use the form with the Report issue topic — no fake mailbox.",
    ctaLabel: "Report via form",
    href: "#contact-form",
    imageSrc: "/images/showcase/rail-photo-operator.jpg",
    imageAlt: "Demo operator workspace imagery — not a verified staff photo",
  },
] as const;

export const CONTACT_TOPICS = [
  { value: "engineers", label: "Talk to engineers" },
  { value: "plans", label: "Plans & pricing" },
  { value: "migration", label: "Migration help" },
  { value: "abuse", label: "Report issue / abuse" },
  { value: "other", label: "Something else" },
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number]["value"];

export const CONTACT_FORM = {
  heading: "Send a message",
  lead: "Fill this in when you need a human. Until inbox transport is connected, submit will say so plainly — use Pricing or RunRacks AI in the meantime.",
  notConfigured:
    "Message intake isn’t connected yet. Use Pricing or RunRacks AI for now.",
  submitLabel: "Send message",
  pendingLabel: "Sending…",
  image: {
    src: "/images/admin-rdp/story-portrait.jpg",
    alt: "Demo portrait in a workspace — not a verified staff photo",
  },
} as const;

export const CONTACT_FAQ = {
  heading: "Contact FAQs",
  items: [
    {
      id: "reach-engineers",
      question: "How do I reach RunRacks engineers?",
      answer:
        "Use the contact form with the Talk to engineers topic. When message intake is wired, that is the path to humans. Until then, Pricing and RunRacks AI remain live destinations.",
    },
    {
      id: "ai-vs-humans",
      question: "When should I use RunRacks AI vs a human?",
      answer:
        "Use AI for plan comparisons, product questions, and quick stack guidance. Use the form when you need an engineer on a migration, outage, or account-specific issue.",
    },
    {
      id: "migrations",
      question: "Can you help with migrations?",
      answer:
        "Yes — pick Migration help on the form, or open RunRacks AI for guided first steps. Closing CTAs also link to chat and VPS plans.",
    },
    {
      id: "inbox-status",
      question: "What happens when I submit before inbox is live?",
      answer:
        "You will see an honest notice that message intake is not connected yet — never a fake “message sent” confirmation. Your draft stays visible so you can copy it elsewhere.",
    },
  ] satisfies readonly FaqItem[],
} as const;
