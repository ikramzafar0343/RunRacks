/**
 * Why Choose Us — USA region landings (Linux / Windows / Admin RDP).
 */
import type { WhyChooseContent } from "@/features/why-choose/model/whyChooseTypes";

export const WHY_CHOOSE_LINUX_USA: WhyChooseContent = {
  titleBefore: "USA Linux VPS with",
  titleAccent: "region-first clarity",
  lead: "This landing is for United States capacity in the catalog. Compare USA Linux plans with the same honest specs you see globally—filtered to the region you opened.",
  kpisNotice: "Illustrative targets — not production SLAs",
  kpis: [
    { value: "US", caption: "catalog region" },
    { value: "Root", caption: "SSH access" },
    { value: "NVMe", caption: "local disk" },
  ],
  cta: { label: "View USA Linux plans", href: "#usa-plans" },
  features: [
    {
      id: "us-filter",
      icon: "zap",
      title: "United States already selected",
      body: "Pricing opens on the USA location so you are not hunting flags. Change region only when you intentionally need another market.",
    },
    {
      id: "latency",
      icon: "tag",
      title: "Closer to North American users",
      body: "Keep API and site latency friendly for US audiences while still reading vCPU, RAM, and NVMe the same way as the global Linux page.",
    },
    {
      id: "root",
      icon: "cpu",
      title: "Same root story, USA capacity",
      body: "Full root on USA Linux VPS tiers. Deploy agents, reverse proxies, and databases without a managed middle layer in the way.",
    },
    {
      id: "compare",
      icon: "panel",
      title: "Side-by-side USA tiers",
      body: "Filter billing terms on USA plans and compare sizes before you continue on Pricing or Contact—demo labels stay visible.",
    },
    {
      id: "support",
      icon: "headphones",
      title: "Help for US deployments",
      body: "Questions about USA capacity, networking, and Linux guests go to engineers who can walk the catalog with you.",
    },
    {
      id: "expand",
      icon: "shield",
      title: "Other regions when you need them",
      body: "Outgrowing a single region? The global Linux VPS page and pricing filters still list the rest of the catalog without rewriting your stack story.",
    },
  ],
};

export const WHY_CHOOSE_WINDOWS_USA: WhyChooseContent = {
  titleBefore: "USA Windows VPS for",
  titleAccent: "region-bound Windows work",
  lead: "Stay on United States Windows capacity when compliance, customers, or vendors expect a US footprint—without losing administrator access or clear plan labels.",
  kpisNotice: "Illustrative targets — not production SLAs",
  kpis: [
    { value: "US", caption: "Windows region" },
    { value: "Admin", caption: "guest access" },
    { value: "Demo", caption: "labeled tiers" },
  ],
  cta: { label: "View USA Windows plans", href: "#windows-usa-plans" },
  features: [
    {
      id: "us-windows",
      icon: "zap",
      title: "Windows Server in the USA catalog",
      body: "Open USA Windows VPS tiers directly. Keep IIS, .NET, and Windows services on US-labeled capacity when that is the requirement.",
    },
    {
      id: "pricing",
      icon: "tag",
      title: "USA tiers without blur",
      body: "Compare US Windows plan sizes with the same demo-aware pricing language as the global Windows page—region fixed, specs readable.",
    },
    {
      id: "admin",
      icon: "cpu",
      title: "Administrator on US guests",
      body: "Install Windows roles and vendor software with admin rights on the USA guest you picked from the catalog.",
    },
    {
      id: "ops",
      icon: "panel",
      title: "Operate the US instance",
      body: "Reboot, reimage, and check resources when Windows needs attention—without leaving the USA plan context you started in.",
    },
    {
      id: "support",
      icon: "headphones",
      title: "US Windows questions welcome",
      body: "Connectivity, images, and Windows guest setup for USA capacity get engineer help instead of a generic ticket maze.",
    },
    {
      id: "vs-rdp",
      icon: "shield",
      title: "Not the Admin RDP USA page",
      body: "Need a full remote desktop for operators? Use Admin RDP in USA. This page stays on Windows VPS server workloads in the US region.",
    },
  ],
};

export const WHY_CHOOSE_ADMIN_RDP_USA: WhyChooseContent = {
  titleBefore: "USA Admin RDP for",
  titleAccent: "desktops on US capacity",
  lead: "Operators who need a United States Admin RDP desktop get full administrator sessions on USA catalog tiers—separate from Windows VPS server plans.",
  kpisNotice: "Illustrative targets — not production SLAs",
  kpis: [
    { value: "US", caption: "Admin RDP region" },
    { value: "Full", caption: "admin desktop" },
    { value: "RDP", caption: "ready to connect" },
  ],
  cta: { label: "View USA Admin RDP plans", href: "#admin-rdp-usa-plans" },
  features: [
    {
      id: "us-desktop",
      icon: "zap",
      title: "US-hosted admin desktops",
      body: "Dial into a Windows admin desktop on United States capacity for support desks, agencies, and tools that expect a real session.",
    },
    {
      id: "tiers",
      icon: "tag",
      title: "USA Admin RDP sizing",
      body: "Pick light or heavier Admin RDP tiers in the USA filter. Capacity stays explicit so multi-session work is planned, not guessed.",
    },
    {
      id: "admin",
      icon: "cpu",
      title: "Administrator desktops in-region",
      body: "Full admin on the remote desktop—install the Windows apps your US team needs without a locked guest profile.",
    },
    {
      id: "session",
      icon: "panel",
      title: "Keep the session workable",
      body: "Reboot or rebuild the Admin RDP guest when the desktop needs a reset, then reconnect from your client.",
    },
    {
      id: "support",
      icon: "headphones",
      title: "RDP help for USA plans",
      body: "Client setup, session issues, and USA Admin RDP plan fit go to engineers who understand remote Windows desktops.",
    },
    {
      id: "vs-windows",
      icon: "shield",
      title: "Different from USA Windows VPS",
      body: "Windows VPS in USA is server-shaped. Admin RDP in USA is desktop-shaped. Choose the USA family that matches how people actually work.",
    },
  ],
};
