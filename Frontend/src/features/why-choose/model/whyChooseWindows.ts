/**
 * Why Choose Us — Windows VPS (global).
 */
import type { WhyChooseContent } from "@/features/why-choose/model/whyChooseTypes";

export const WHY_CHOOSE_WINDOWS: WhyChooseContent = {
  titleBefore: "Windows VPS for",
  titleAccent: "apps that need Windows",
  lead: "When workloads require a Windows Server environment—not just a remote desktop—RunRacks Windows VPS gives you administrator access with plan cards that stay honest about capacity.",
  kpisNotice: "Illustrative targets — not production SLAs",
  kpis: [
    { value: "Admin", caption: "Windows access" },
    { value: "NVMe", caption: "local disk plans" },
    { value: "RDP", caption: "or console ready" },
  ],
  cta: { label: "Compare Windows plans", href: "#vps-pricing" },
  features: [
    {
      id: "windows-stack",
      icon: "zap",
      title: "Windows-first workloads",
      body: "Run IIS, .NET services, MSSQL-adjacent tools, and Windows-only apps on a machine sized for server roles—not a shared desktop session.",
    },
    {
      id: "pricing",
      icon: "tag",
      title: "Clear Windows tier pricing",
      body: "Compare Windows VPS tiers by vCPU, RAM, and storage without unlock-style upsells. Demo labels stay visible until billing is connected.",
    },
    {
      id: "isolation",
      icon: "cpu",
      title: "Isolated Windows guests",
      body: "KVM-backed resources stay on your plan so patch nights and build agents do not steal cycles from another tenant’s box.",
    },
    {
      id: "manage",
      icon: "panel",
      title: "Reimage and reboot cleanly",
      body: "Rebuild the guest, bounce the instance, and check usage from a simple panel when Windows needs a fresh start.",
    },
    {
      id: "support",
      icon: "headphones",
      title: "Windows-aware support",
      body: "Licensing questions, RDP connectivity, and guest boot issues land with engineers who work Windows Server day to day.",
    },
    {
      id: "family",
      icon: "shield",
      title: "Right family, right page",
      body: "Need a full admin desktop instead? Admin RDP is a separate family. Windows VPS stays focused on server-shaped Windows work.",
    },
  ],
};
