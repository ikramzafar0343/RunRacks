/**
 * Why Choose Us — Linux VPS (global).
 */
import type { WhyChooseContent } from "@/features/why-choose/model/whyChooseTypes";

export const WHY_CHOOSE_LINUX: WhyChooseContent = {
  titleBefore: "Linux VPS built for",
  titleAccent: "operators who ship",
  lead: "RunRacks Linux VPS keeps root access, NVMe plans, and catalog regions readable so you can compare tiers honestly and deploy without marketing fog.",
  kpisNotice: "Illustrative targets — not production SLAs",
  kpis: [
    { value: "Root", caption: "full SSH access" },
    { value: "NVMe", caption: "local disk plans" },
    { value: "8+", caption: "catalog regions" },
  ],
  cta: { label: "Compare Linux plans", href: "#vps-plans" },
  features: [
    {
      id: "root",
      icon: "zap",
      title: "Root from first boot",
      body: "SSH in with full root on day one. Install your stack, tune sysctl, and run the services you actually need—not a locked guest shell.",
    },
    {
      id: "specs",
      icon: "tag",
      title: "Specs you can compare",
      body: "vCPU, RAM, and NVMe stay labeled on every plan card. Demo pricing is marked until checkout is live, so you are not sold a fake buy button.",
    },
    {
      id: "kvm",
      icon: "cpu",
      title: "Dedicated KVM slices",
      body: "Your plan’s compute and memory are allocated to your guest. Neighbor noise stays out of the way when traffic spikes.",
    },
    {
      id: "images",
      icon: "panel",
      title: "Familiar Linux images",
      body: "Pick common distros from the catalog, rebuild when you need a clean slate, and keep deploys close to how you work locally.",
    },
    {
      id: "support",
      icon: "headphones",
      title: "Engineers who speak Linux",
      body: "Networking, packages, and boot issues go to people who know servers—not a script that only resets passwords.",
    },
    {
      id: "regions",
      icon: "shield",
      title: "Regions next to your users",
      body: "Filter the same catalog regions you see in pricing, then open Linux plans for the location that fits latency and compliance.",
    },
  ],
};
