/**
 * VPS FAQ copy — educational marketing content, not live plan guarantees.
 */

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const VPS_FAQ = {
  heading: "RunRacks FAQs",
  items: [
    {
      id: "what-is-vps",
      question: "What is a VPS, and what is it used for?",
      answer:
        "A virtual private server (VPS) gives you dedicated CPU, RAM, and storage slices on shared hardware. Teams use it to run sites, apps, APIs, databases, and staging environments with more control than shared hosting.",
    },
    {
      id: "what-is-kvm",
      question: "What is KVM? What are the benefits of KVM?",
      answer:
        "KVM is a Linux hypervisor that runs each VPS as its own virtual machine with isolated resources. That isolation helps keep neighboring workloads from stealing your CPU or memory, and it supports familiar Linux and Windows guest images.",
    },
    {
      id: "why-vps",
      question: "Why choose VPS hosting? When should I upgrade to a VPS?",
      answer:
        "Upgrade when shared hosting feels cramped—slow peaks, limited SSH access, or you need a custom stack. A VPS is a fit when you want predictable resources, root-level control, and room to scale without rewriting your whole setup.",
    },
    {
      id: "kvm-safe",
      question: "Are KVM-based virtual private servers safe?",
      answer:
        "KVM isolates guests at the hypervisor level, which is a strong foundation. Security still depends on keeping your OS, apps, and access keys up to date—RunRacks provides the infrastructure; you manage what you install inside the server.",
    },
    {
      id: "custom-software",
      question: "Can I install custom software on my virtual server hosting?",
      answer:
        "Yes. With administrator access you can install the packages, runtimes, and services your stack needs, subject to acceptable-use and legal limits. Choose a plan with enough CPU, RAM, and NVMe for the software you intend to run.",
    },
    {
      id: "cost-choose",
      question:
        "How much does virtual server hosting cost? How do I choose the right VPS plan for my needs?",
      answer:
        "Price follows CPU, RAM, storage, and billing term. Start from your workload—traffic, databases, and concurrent jobs—then pick the smallest plan that leaves headroom. Compare families and regions on the RunRacks plans section; demo prices there are labeled when not live checkout.",
    },
    {
      id: "plan-limits",
      question:
        "What CPU, RAM, and disk options do RunRacks VPS plans include?",
      answer:
        "Plans list vCPU, RAM, and local NVMe storage for each tier. Exact sizes and locations are shown on the pricing table for the family you select (Linux, Windows, or Admin RDP). There is no separate inode marketing claim beyond what each plan card documents.",
    },
    {
      id: "get-started",
      question: "How can I get started with VPS hosting on RunRacks?",
      answer:
        "Pick a hosting family and region in Our Plans, choose a billing term, then continue on Pricing. Image selection and deploy stay unavailable until checkout and provisioning are connected for your account.",
    },
  ] satisfies readonly FaqItem[],
} as const;
