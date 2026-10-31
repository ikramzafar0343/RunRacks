/**
 * Canonical FAQ sets — educational marketing content, not live plan guarantees.
 * Product pages should use family-specific exports, not the same block everywhere.
 */
import { DEMO_PRICING_ANSWER } from "@/shared/content/demoPricingCopy";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

/** Home, /pricing, and /faq — Linux/VPS education. */
export const VPS_FAQ = {
  heading: "VPS hosting FAQs",
  items: [
    {
      id: "what-is-vps",
      question: "What is a VPS?",
      answer:
        "A virtual private server isolates CPU, memory, and NVMe storage for your workload on shared hardware. Teams use it for sites, APIs, databases, and staging when shared hosting no longer provides enough control.",
    },
    {
      id: "what-is-kvm",
      question: "Why KVM virtualization?",
      answer:
        "KVM runs each VPS as its own virtual machine with isolated resources. That separation helps neighboring tenants from consuming your CPU or memory, and it supports familiar Linux guest images.",
    },
    {
      id: "why-vps",
      question: "When should I move to a VPS?",
      answer:
        "Move up when shared hosting limits SSH access, slows under traffic spikes, or blocks the stack you need. A VPS fits when you want predictable resources, root access, and room to grow without rewriting your application.",
    },
    {
      id: "kvm-safe",
      question: "How secure is a KVM VPS?",
      answer:
        "KVM isolates guests at the hypervisor layer—a solid baseline. Day-to-day security still depends on patching your OS, apps, and access keys. RunRacks provides the infrastructure; you manage what runs inside the server.",
    },
    {
      id: "custom-software",
      question: "Can I install my own software?",
      answer:
        "Yes. With root access you can install the packages, runtimes, and services your stack needs, within acceptable-use and legal limits. Size the plan for the CPU, RAM, and NVMe your software requires.",
    },
    {
      id: "cost-choose",
      question: "How do I choose a plan?",
      answer:
        "Match vCPU, RAM, and NVMe to traffic, databases, and concurrent jobs, then leave modest headroom. Compare families and regions in plans; labeled demo prices are not live checkout until billing is connected.",
    },
    {
      id: "plan-limits",
      question: "What specs do plans list?",
      answer:
        "Each tier documents vCPU, RAM, and local NVMe. Exact sizes and regions appear on the plan cards for Linux VPS, Windows VPS, or Admin RDP—there are no separate marketing claims beyond those cards.",
    },
    {
      id: "get-started",
      question: "How do I get started on RunRacks?",
      answer:
        "Choose a family and region, pick a billing term, and continue from Pricing or Contact. Image selection and deploy stay unavailable until checkout and provisioning are connected for your account.",
    },
  ] satisfies readonly FaqItem[],
} as const;

/** Windows product page — administrator Windows VPS focus. */
export const WINDOWS_FAQ = {
  heading: "Windows VPS FAQs",
  items: [
    {
      id: "win-what",
      question: "What is Windows VPS hosting on RunRacks?",
      answer:
        "Windows VPS plans provide administrator access on NVMe-backed virtual servers so you can run Windows Server workloads, remote tools, and custom services without shared-hosting limits.",
    },
    {
      id: "win-admin",
      question: "Do I get full administrator access?",
      answer:
        "Yes. Plans are sized for administrator-level control so you can install roles, runtimes, and applications your team needs, subject to acceptable-use policies.",
    },
    {
      id: "win-choose",
      question: "How do I pick a Windows plan?",
      answer:
        "Start from concurrent users, databases, and background services, then choose vCPU, RAM, and NVMe that leave headroom. Use location filters to align with your audience.",
    },
    {
      id: "win-pricing",
      question: "Are the prices on this page live?",
      answer: DEMO_PRICING_ANSWER,
    },
    {
      id: "win-start",
      question: "How do I continue after comparing plans?",
      answer:
        "Open Pricing for the full catalog, use Customize for a rough build, or Contact our team. Provisioning and image selection unlock when checkout is connected.",
    },
  ] satisfies readonly FaqItem[],
} as const;

/** Admin RDP product page — remote desktop focus (page may override with ADMIN_RDP.faq). */
export const ADMIN_RDP_FAQ = {
  heading: "Admin RDP FAQs",
  items: [
    {
      id: "rdp-what",
      question: "What is Admin RDP hosting?",
      answer:
        "Admin RDP plans deliver a Windows remote desktop with administrator rights so operators can run tools, browsers, and workflows from a controlled environment—not a locked-down shared desktop.",
    },
    {
      id: "rdp-access",
      question: "Who should use Admin RDP?",
      answer:
        "Teams that need a persistent Windows workspace with admin control—agencies, operators, and support staff who outgrow consumer remote-desktop limits.",
    },
    {
      id: "rdp-regions",
      question: "Can I choose a region?",
      answer:
        "Yes. Plan filters use the same catalog regions as Pricing. Pick a location that matches latency needs for the people who will connect.",
    },
    {
      id: "rdp-pricing",
      question: "Are plan prices final?",
      answer: DEMO_PRICING_ANSWER,
    },
    {
      id: "rdp-start",
      question: "How do I move forward?",
      answer:
        "Compare Admin RDP tiers on this page, then continue on Pricing or Contact. Deploy steps remain unavailable until billing is configured.",
    },
  ] satisfies readonly FaqItem[],
} as const;
