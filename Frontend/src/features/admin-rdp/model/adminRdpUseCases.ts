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
      body: "Run web apps, APIs and websites on your own Windows or Linux environment. Install any stack you need with full admin rights, and keep it online around the clock on fast NVMe storage.",
      tools: ["IIS", "XAMPP", "Node.js", "Nginx", "MySQL", "WordPress"],
    },
    {
      id: "dev",
      icon: "code",
      title: "Software development and testing",
      body: "Get a clean, isolated machine for coding, debugging and beta testing. Break things freely — nothing you test touches your personal computer or your live users.",
      tools: ["VS Code", "Git", "Docker", "Visual Studio", "Python", "JDK"],
    },
    {
      id: "automation",
      icon: "bot",
      title: "Automation, scripts and bots",
      body: "Schedule scripts, scrapers and bots that run 24/7 without keeping your own PC switched on. Your RDP stays up even when you log off, so jobs keep running overnight.",
      tools: [
        "Selenium",
        "Python",
        "Task Scheduler",
        "Puppeteer",
        "AutoIt",
        "Node.js",
      ],
    },
    {
      id: "transfers",
      icon: "download",
      title: "High-speed downloads and uploads",
      body: "Move large files, software packages and media using our high-bandwidth data-centre ports. Ideal for content creators, uploaders and anyone shifting big files between servers.",
      tools: [
        "qBittorrent",
        "IDM",
        "FileZilla",
        "rclone",
        "JDownloader",
        "WinSCP",
      ],
    },
    {
      id: "design",
      icon: "palette",
      title: "Graphic design and multimedia",
      body: "Use dedicated CPU and RAM for design, editing and rendering work. Access your projects from any device and let long renders finish on the server instead of your laptop.",
      tools: [
        "Photoshop",
        "Illustrator",
        "Premiere Pro",
        "After Effects",
        "Blender",
        "Figma",
      ],
    },
    {
      id: "trading",
      icon: "chart",
      title: "Forex and crypto trading",
      body: "Keep your trading terminals and expert advisors running non-stop with low-latency connections. Choose a location close to your broker and never miss a trade because your PC went to sleep.",
      tools: [
        "MetaTrader 4",
        "MetaTrader 5",
        "cTrader",
        "TradingView",
        "NinjaTrader",
        "Binance",
      ],
    },
  ] as const satisfies readonly ArdpUseCase[],
} as const;
