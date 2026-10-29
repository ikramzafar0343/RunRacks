import type { BlogCategory } from "./types";

/** Published topic taxonomy for The Journal. */
export const BLOG_CATEGORIES: readonly BlogCategory[] = [
  {
    id: "cat-vps",
    slug: "vps-servers",
    name: "VPS & Servers",
    description: "Provisioning, performance, and day-to-day server operations.",
    sortOrder: 1,
    seoTitle: "VPS & Servers — RunRacks Journal",
    seoDescription:
      "Guides on VPS setup, resource planning, and reliable server workflows.",
  },
  {
    id: "cat-windows",
    slug: "windows-hosting",
    name: "Windows Hosting",
    description: "Windows Server, RDP, and desktop-style remote workflows.",
    sortOrder: 2,
    seoTitle: "Windows Hosting — RunRacks Journal",
    seoDescription:
      "Practical notes on Windows hosting, RDP access, and remote desktops.",
  },
  {
    id: "cat-security",
    slug: "security",
    name: "Security",
    description: "Hardening, access control, and operational safety habits.",
    sortOrder: 3,
    seoTitle: "Security — RunRacks Journal",
    seoDescription:
      "Security practices for cloud servers, RDP, and hosted workloads.",
  },
  {
    id: "cat-ops",
    slug: "operations",
    name: "Operations",
    description: "Backups, monitoring, and keeping production quiet.",
    sortOrder: 4,
    seoTitle: "Operations — RunRacks Journal",
    seoDescription:
      "Operational playbooks for backups, uptime, and incident readiness.",
  },
] as const;

export function getCategoryBySlug(slug: string): BlogCategory | undefined {
  return BLOG_CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryById(id: string): BlogCategory | undefined {
  return BLOG_CATEGORIES.find((c) => c.id === id);
}
