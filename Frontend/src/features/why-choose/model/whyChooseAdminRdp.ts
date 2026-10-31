/**
 * Why Choose Us — Admin RDP (global).
 */
import type { WhyChooseContent } from "@/features/why-choose/model/whyChooseTypes";

export const WHY_CHOOSE_ADMIN_RDP: WhyChooseContent = {
  titleBefore: "Admin RDP for",
  titleAccent: "real Windows desktops",
  lead: "Admin RDP is desktop-first: a persistent Windows remote session with full administrator rights, sized by vCPU, RAM, and NVMe you can compare before checkout.",
  kpisNotice: "Illustrative targets — not production SLAs",
  kpis: [
    { value: "Full", caption: "administrator RDP" },
    { value: "24/7", caption: "session ready" },
    { value: "Demo", caption: "labeled pricing" },
  ],
  cta: { label: "Compare Admin RDP plans", href: "#vps-plans" },
  features: [
    {
      id: "desktop",
      icon: "zap",
      title: "Desktop session, not a guest cage",
      body: "Connect with a remote desktop client and work like it is your machine—install tools, manage services, and keep operator workflows familiar.",
    },
    {
      id: "pricing",
      icon: "tag",
      title: "Tiers matched to desk work",
      body: "Light support desks and heavy multi-session use get different Admin RDP sizes. Plan cards show capacity without vague “unlimited” claims.",
    },
    {
      id: "admin",
      icon: "cpu",
      title: "Administrator by design",
      body: "Admin RDP exists for full admin rights. Permission walls that block legacy finance or agency tools are the problem this family solves.",
    },
    {
      id: "panel",
      icon: "panel",
      title: "Reset the desktop when needed",
      body: "Reboot or reinstall when a session goes sideways, then get back to work without waiting on a locked-down hosting panel.",
    },
    {
      id: "support",
      icon: "headphones",
      title: "Help that knows RDP",
      body: "Connectivity, client settings, and Windows desktop issues go to people who understand remote admin sessions—not generic VPS scripts.",
    },
    {
      id: "contrast",
      icon: "shield",
      title: "Clear vs Windows VPS",
      body: "Windows VPS is server-first. Admin RDP is desktop-first. Same catalog honesty, different job—so you pick the family that matches the work.",
    },
  ],
};
