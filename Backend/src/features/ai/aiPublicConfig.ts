/**
 * Public AI Advisor config (mirrors Frontend starters / topics).
 */
export const AI_TOPICS = ["vps", "windows", "pricing", "contact"] as const;

export type AiTopic = (typeof AI_TOPICS)[number];

export const AI_STARTERS = [
  {
    id: "vps",
    label: "Linux VPS",
    prompt: "Help me choose a Linux VPS.",
    topic: "vps" as const,
  },
  {
    id: "windows",
    label: "Windows VPS",
    prompt: "Help me choose a Windows VPS.",
    topic: "windows" as const,
  },
  {
    id: "admin-rdp",
    label: "Admin RDP",
    prompt: "Help me choose an Admin RDP plan.",
    topic: "windows" as const,
  },
] as const;

export const AI_OWNED_DISCLAIMER =
  "Automated hosting advisor. Demo prices are labeled and checkout is not orderable. Confirm on Pricing; Contact for tickets. Not a human or general-purpose AI model.";

/** Built-in blurbs when content_sections / DB unavailable — no prices. */
export const PRODUCT_BLURBS = {
  linux_vps: {
    title: "Linux VPS",
    summary:
      "Linux VPS suits general workloads, APIs, and Linux-native stacks. Confirm current plans and labeled prices on Pricing.",
    href: "/pricing",
  },
  windows_vps: {
    title: "Windows VPS",
    summary:
      "Windows VPS fits GUI apps and Windows-native tooling. Confirm plans on Pricing; Contact for migrations.",
    href: "/pricing",
  },
  admin_rdp: {
    title: "Admin RDP",
    summary:
      "Admin RDP is for remote desktop workloads. Review Admin RDP and Pricing pages; Contact for setup help.",
    href: "/admin-rdp",
  },
} as const;
