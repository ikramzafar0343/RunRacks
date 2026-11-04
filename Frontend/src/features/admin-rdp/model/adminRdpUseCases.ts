/**
 * Admin RDP interactive use-case list + detail copy.
 */
export type ArdpUseCaseIcon =
  | "server"
  | "code"
  | "bot"
  | "download"
  | "palette"
  | "chart";

export type ArdpUseCase = {
  id: string;
  icon: ArdpUseCaseIcon;
  title: string;
  body: string;
  tools: readonly string[];
  /** Optional detail media under `/public/videos/admin-rdp/` */
  videoSrc?: string;
  /** Video fills the detail card; copy is omitted; only the shared CTA overlays. */
  mediaOnly?: boolean;
};

export const ADMIN_RDP_USE_CASES = {
  title: "What can you do with a RunRacks RDP?",
  subtitle:
    "Affordable Windows RDP and VPS with full administrator access — built for real workloads without stretching your budget.",
  toolsLabel: "Popular software & tools",
  cta: { label: "View RDP plans", href: "#vps-plans" as const },
  items: [
    {
      id: "deploy",
      icon: "server",
      title: "Deploy apps and host websites",
      body: "",
      tools: [],
      videoSrc: "/videos/admin-rdp/use-case.mp4",
      mediaOnly: true,
    },
    {
      id: "dev",
      icon: "code",
      title: "Software development and testing",
      body: "",
      tools: [],
      videoSrc: "/videos/admin-rdp/use-case-software-dev.mp4",
      mediaOnly: true,
    },
    {
      id: "automation",
      icon: "bot",
      title: "Automation, scripts and bots",
      body: "",
      tools: [],
      videoSrc: "/videos/admin-rdp/use-case-automation.mp4",
      mediaOnly: true,
    },
    {
      id: "transfers",
      icon: "download",
      title: "High-speed downloads and uploads",
      body: "",
      tools: [],
      videoSrc: "/videos/admin-rdp/use-case-transfers.mp4",
      mediaOnly: true,
    },
    {
      id: "design",
      icon: "palette",
      title: "Graphic design and multimedia",
      body: "",
      tools: [],
      videoSrc: "/videos/admin-rdp/use-case-design.mp4",
      mediaOnly: true,
    },
    {
      id: "trading",
      icon: "chart",
      title: "Forex and crypto trading",
      body: "",
      tools: [],
      videoSrc: "/videos/admin-rdp/use-case-trading.mp4",
      mediaOnly: true,
    },
  ] as const satisfies readonly ArdpUseCase[],
} as const;
