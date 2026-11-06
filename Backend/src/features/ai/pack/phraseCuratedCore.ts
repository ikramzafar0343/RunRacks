/**
 * Core brand, identity, services, and commercial rules.
 */
export type CuratedBlock = {
  id: string;
  phrases: string[];
  answer: string;
};

export const CURATED_CORE: CuratedBlock[] = [
  {
    id: "brand",
    phrases: [
      "what is runracks",
      "what is run racks",
      "what is runrack",
      "who is runracks",
      "tell me about runracks",
      "tell me about runrack",
      "explain runracks",
      "what does runracks do",
      "what kind of company is runracks",
      "runracks overview",
      "about runracks",
      "about runrack",
      "runrack company",
    ],
    answer:
      "RunRacks is a hosting brand for teams that want documented server plans and administrator access. The public catalog is three families: Linux VPS (root access for sites and apps), Windows VPS (Windows Server workloads), and Admin RDP (administrator Windows desktops over remote desktop). Plan cards list vCPU, RAM, NVMe, access, OS images, and regions. Prices on the site are labeled demo until billing and checkout are connected.",
  },
  {
    id: "self",
    phrases: [
      "tell me about yourself",
      "who are you",
      "what can you do",
      "what do you do",
      "introduce yourself",
      "describe yourself",
      "what is this assistant",
      "are you an ai",
      "what can you help with",
      "tell me what you can do",
      "tell me about you",
    ],
    answer:
      "I’m RunRacks’ owned hosting advisor. I am not a human and not a general-purpose model. I explain RunRacks services, read the published plan cards (vCPU, RAM, NVMe, access, OS, regions, and labeled demo prices), and help you compare Linux VPS, Windows VPS, and Admin RDP. I can’t place orders, open tickets, or change a server from chat.",
  },
  {
    id: "spec-build",
    phrases: [
      "create a plan for me",
      "build me a plan",
      "make a plan with these specs",
      "i need this cpu ram nvme bandwidth",
      "plan with 4 cpu 8 gb ram",
      "suggest a plan for my specs",
      "configure a server with these resources",
      "size a vps for me",
    ],
    answer:
      "Send CPU (vCPU), RAM (GB), NVMe SSD (GB), and bandwidth (TB). I quote a Customize demo build with those exact numbers and a labeled monthly price — for example: “cpu is 1 ram is 4 storage is 40 and bandwidth is 5”. Open /customize to tweak the same build.",
  },
  {
    id: "budget-browse",
    phrases: [
      "my budget is 10 dollars",
      "my budget is $10",
      "budget is 10 dollars",
      "budget 10 dollars",
      "show plans under 10 dollars",
      "show plans under $10",
      "plans under $10",
      "plans within 10 dollars",
      "what can i get for 10 dollars",
      "what can i get for $10",
      "i have 10 dollars",
      "10 dollar budget",
      "10 dollars budget",
      "under 10 usd",
      "within $10 a month",
      "budget 10 dollar ka",
    ],
    answer:
      "Tell me your monthly USD budget and I will list every labeled demo plan at or under that amount across Linux VPS, Windows VPS, and Admin RDP — cheapest first. Amounts stay demo until billing is connected; confirm on Pricing.",
  },
  {
    id: "services",
    phrases: [
      "what type of services of runrack providing",
      "what type of services does runracks provide",
      "what type of services",
      "what services do you provide",
      "what hosting do you offer",
      "which products do you sell",
      "what can i buy here",
      "what plans do you have",
      "list your services",
      "what do you offer",
      "runracks services",
      "types of hosting",
      "available services",
    ],
    answer:
      "RunRacks provides three hosting services:\n• Linux VPS (VPS 1 to VPS 6): High-performance KVM virtual servers with full root SSH access for websites, APIs, databases, and Docker (from $4.49/mo).\n• Windows VPS (Windows VPS 1, 3, 5, 7, 9, 11): Dedicated Windows Server with Administrator RDP access for Windows applications and .NET stacks (from $8.99/mo).\n• Admin RDP (Admin RDP 1, 3, 5, 7, 9, 11): Optimized remote desktop machines with dedicated admin privileges for remote work, browsing, and background tools (from $10.99/mo).\nAll services feature enterprise NVMe SSDs, 30 TB high-speed traffic, automated DDoS protection, and 8 global datacenter locations.",
  },
  {
    id: "regions",
    phrases: [
      "which regions do you have",
      "where are the servers located",
      "datacenter locations",
      "what locations can i choose",
      "do you have singapore servers",
      "do you have usa servers",
      "server locations list",
      "which countries do you host in",
      "where are runracks datacenters",
      "locations list",
    ],
    answer:
      "RunRacks operates across 8 enterprise Tier-3/Tier-4 datacenter facilities globally: United States, United Kingdom, Canada, Netherlands, Germany, Singapore, Australia, and Japan. Each location features direct fiber backbone connections and enterprise DDoS mitigation.",
  },
  {
    id: "demo-price",
    phrases: [
      "are prices live",
      "is pricing real",
      "can i order now",
      "is checkout working",
      "are these discounts real",
      "why does it say demo",
      "can i purchase a plan today",
      "is the price orderable",
    ],
    answer:
      "Card prices reflect the active RunRacks catalog snapshot. Live checkout is activated once billing integration is connected. Confirm final details and billing cycles on Pricing before purchase.",
  },
  {
    id: "vps-def",
    phrases: [
      "what is a vps",
      "what is vps hosting",
      "explain virtual private server",
      "what does vps mean",
      "virtual private server meaning",
      "how is vps different from shared hosting",
      "vps vs shared hosting",
      "why choose a vps",
    ],
    answer:
      "A Virtual Private Server (VPS) isolates dedicated vCPU, memory, and NVMe SSD storage for your workloads using KVM virtualization. Unlike shared hosting where hundreds of websites share resources and risk slowdowns, a VPS gives you guaranteed performance and 100% full root access to install any software or stack.",
  },
  {
    id: "win-vs-rdp",
    phrases: [
      "windows vps vs admin rdp",
      "difference between windows vps and admin rdp",
      "what is admin rdp hosting",
      "what is windows vps hosting",
      "should i pick rdp or windows vps",
      "which plan is for remote desktop",
      "admin rdp meaning",
      "windows server versus rdp desktop",
    ],
    answer:
      "Windows VPS is a dedicated virtual server running Windows Server, ideal for hosting Windows applications, ASP.NET Core websites, IIS, and databases with full Administrator access. Admin RDP is a pre-tuned remote desktop system specifically optimized for high-speed browsing, remote daily work, multi-session management, and automation tools.",
  },
  {
    id: "backups",
    phrases: [
      "do you backup my server",
      "what is the backup policy",
      "is backup free",
      "how does disaster recovery work",
      "do plans include backups",
      "what is the snapshot policy",
      "how long are backups kept",
      "backup retention",
    ],
    answer:
      "Backup inclusion, retention, and cost are not verified — public pages conflict. I won’t claim daily backups are included. Confirm on Pricing or Contact.",
  },
  {
    id: "legal",
    phrases: [
      "do you guarantee uptime",
      "where are your terms of service",
      "what is the privacy policy status",
      "is there an sla guarantee",
      "is there a money back guarantee",
      "are legal pages finished",
      "what are the refund rules",
      "can you promise 100 percent uptime",
    ],
    answer:
      "Terms, privacy, and refund pages are still pending legal review. I will not claim a refund guarantee, a finished contract, or an uptime SLA. Use Contact for anything that must be binding.",
  },
  {
    id: "start",
    phrases: [
      "how do i get started",
      "how do i place an order",
      "how to sign up",
      "how do i deploy a server",
      "what is the next step after choosing",
      "how do i reach a human",
      "i want to talk to support",
      "how does signup work",
    ],
    answer:
      "To get started, choose your plan on the Pricing page, select your preferred datacenter region and operating system, and proceed through checkout. If you need custom sizing or assistance, our support engineers are available via Contact.",
  },
];
