/**
 * Reviewed bundled knowledge — commercial promises stay absent unless sourced.
 * Pack Q&A merges at retrieve time via allKnowledgeEntries().
 */
import { loadPackQaEntries } from "../pack/qaKnowledge.js";

export type KnowledgeEntry = {
  id: string;
  category: string;
  title: string;
  aliases: string[];
  locale: "en" | "roman_urdu";
  body: string;
  sourceRef: string;
  status: "published" | "draft";
  reviewedAt: string;
};

export const BUNDLED_KNOWLEDGE_ENTRIES: KnowledgeEntry[] = [
  {
    id: "kb-vps-vs-shared",
    category: "concepts",
    title: "VPS vs shared hosting",
    aliases: ["what is vps", "vps meaning", "shared hosting", "dedicated"],
    locale: "en",
    body: "A VPS gives you an isolated virtual server with root or admin access. Shared hosting puts many sites on one pool of resources. Dedicated means one physical machine for one customer. Pick VPS when you need control or predictable resources.",
    sourceRef: "bundled:concepts",
    status: "published",
    reviewedAt: "2026-11-05",
  },
  {
    id: "kb-linux-vps",
    category: "product",
    title: "Linux VPS fit",
    aliases: ["linux vps", "ubuntu server", "linux hosting"],
    locale: "en",
    body: "Linux VPS suits websites, APIs, and Linux-native stacks. You manage the OS unless you buy managed care. Confirm current plans and prices on Pricing.",
    sourceRef: "bundled:product",
    status: "published",
    reviewedAt: "2026-11-05",
  },
  {
    id: "kb-windows-vps",
    category: "product",
    title: "Windows VPS fit",
    aliases: ["windows vps", "windows server", "windows hosting"],
    locale: "en",
    body: "Windows VPS is for Windows applications and GUI workloads. Licensing and admin rights depend on the specific plan — verify on Pricing or Contact. It is not automatically the same as Admin RDP.",
    sourceRef: "bundled:product",
    status: "published",
    reviewedAt: "2026-11-05",
  },
  {
    id: "kb-admin-rdp",
    category: "product",
    title: "Admin RDP fit",
    aliases: ["admin rdp", "rdp plan", "remote desktop hosting"],
    locale: "en",
    body: "Admin RDP is aimed at remote desktop use. Concurrent users, resources, and licensing are plan-specific — do not assume they match Windows VPS. Confirm details on the Admin RDP and Pricing pages.",
    sourceRef: "bundled:product",
    status: "published",
    reviewedAt: "2026-11-05",
  },
  {
    id: "kb-wordpress",
    category: "workload",
    title: "WordPress on VPS",
    aliases: ["wordpress", "wp hosting", "wordpress sites"],
    locale: "en",
    body: "WordPress usually runs well on Linux VPS. Site count alone does not size RAM/CPU — traffic, plugins, and caching matter. Confirm a plan on Pricing after you know rough traffic.",
    sourceRef: "bundled:workload",
    status: "published",
    reviewedAt: "2026-11-05",
  },
  {
    id: "kb-location",
    category: "location",
    title: "Server location guidance",
    aliases: ["pakistan", "latency", "server location", "region", "data center"],
    locale: "en",
    body: "Choosing a nearby region can help latency for visitors, but proximity is not a measured speed guarantee. Confirm available locations on Pricing. I cannot invent latency numbers or declare a region fastest.",
    sourceRef: "bundled:location",
    status: "published",
    reviewedAt: "2026-11-05",
  },
  {
    id: "kb-ssh",
    category: "setup",
    title: "SSH first checks",
    aliases: ["ssh", "cannot ssh", "ssh connection"],
    locale: "en",
    body: "For SSH issues: confirm the server IP, that port 22 (or your custom port) is allowed, and that you use the correct user key/password. Share the exact error text (redact secrets) if it still fails.",
    sourceRef: "bundled:setup",
    status: "published",
    reviewedAt: "2026-11-05",
  },
  {
    id: "kb-rdp-connect",
    category: "setup",
    title: "RDP connection checks",
    aliases: [
      "how to connect rdp",
      "connect to windows vps",
      "remote desktop connection",
      "rdp connect",
      "remote desktop error",
      "cannot rdp",
      "how to login to windows vps",
      "connect via rdp",
      "how to use remote desktop",
    ],
    locale: "en",
    body: "For RDP: verify the public IP, that TCP 3389 (or your plan’s port) is reachable, and Windows credentials. Open Microsoft Remote Desktop, enter your server IP, and log in with username Administrator and your password. Do not expose RDP to the whole internet without a firewall allowlist. I cannot change your server from chat.",
    sourceRef: "bundled:setup",
    status: "published",
    reviewedAt: "2026-11-05",
  },
  {
    id: "kb-dns-ssl",
    category: "setup",
    title: "DNS and SSL basics",
    aliases: ["dns", "ssl", "https not working", "domain point"],
    locale: "en",
    body: "Point your domain A record to the server IP, wait for DNS TTL, then install a certificate (e.g. Let’s Encrypt via your panel). Exact panel steps vary by product — Contact if you need account-specific help.",
    sourceRef: "bundled:setup",
    status: "published",
    reviewedAt: "2026-11-05",
  },
  {
    id: "kb-urdu-hosting",
    category: "discover",
    title: "Hosting discovery (Roman Urdu)",
    aliases: ["mujhe hosting chahiye", "pakistan ke liye hosting", "sasta plan"],
    locale: "roman_urdu",
    body: "Main aapko plan choose karne mein madad kar sakta hoon. Pehle yeh batayein: website, application, ya remote Windows desktop?",
    sourceRef: "bundled:discover",
    status: "published",
    reviewedAt: "2026-11-05",
  },
  {
    id: "kb-linux-vs-windows",
    category: "compare",
    title: "Linux VPS vs Windows VPS comparison",
    aliases: [
      "difference between linux and windows",
      "linux vs windows",
      "linux or windows vps",
      "compare linux and windows",
      "linux vps vs windows vps",
    ],
    locale: "en",
    body: "Linux VPS is best for open-source stacks (Node.js, Python, PHP, Docker) with SSH root access. Windows VPS provides a full Windows Server desktop environment with Administrator access, ideal for .NET, IIS, ASP.NET, and Windows software. Choose Linux for lightweight performance or Windows for Windows-specific applications.",
    sourceRef: "bundled:compare",
    status: "published",
    reviewedAt: "2026-11-05",
  },
  {
    id: "kb-vps-vs-rdp",
    category: "compare",
    title: "Windows VPS vs Admin RDP comparison",
    aliases: [
      "difference between vps and rdp",
      "vps vs rdp",
      "admin rdp vs windows vps",
      "difference between windows vps and admin rdp",
      "rdp vs vps",
    ],
    locale: "en",
    body: "Windows VPS provides a dedicated server operating system with full administrative control to host server services, databases, and background tasks. Admin RDP provides a dedicated remote desktop environment tailored for interactive desktop workflows, multi-tab browsing, and agency tools. Choose Windows VPS for hosting services, or Admin RDP for interactive remote desktop work.",
    sourceRef: "bundled:compare",
    status: "published",
    reviewedAt: "2026-11-05",
  },
  {
    id: "kb-root-access",
    category: "product",
    title: "Root and Administrator Access",
    aliases: [
      "root access",
      "do i get root access",
      "full root access",
      "administrator access",
      "admin rights",
      "sudo access",
    ],
    locale: "en",
    body: "All RunRacks Linux VPS plans include full root access via SSH. Windows VPS and Admin RDP plans include full Administrator credentials, allowing you to install custom software, configure firewalls, and manage system services.",
    sourceRef: "bundled:product",
    status: "published",
    reviewedAt: "2026-11-05",
  },
  {
    id: "kb-migration",
    category: "setup",
    title: "Website and Workload Migration",
    aliases: [
      "how to migrate",
      "migrate website",
      "move my website",
      "transfer hosting",
      "migration help",
      "move to runracks",
    ],
    locale: "en",
    body: "To migrate to RunRacks: back up your website files and databases from your existing host, deploy your stack on your RunRacks VPS, restore your data, test using your server IP, and then update your domain DNS A records. For guidance, reach out to engineers on Contact.",
    sourceRef: "bundled:setup",
    status: "published",
    reviewedAt: "2026-11-05",
  },
  {
    id: "kb-docker",
    category: "workload",
    title: "Docker and Containers on Linux VPS",
    aliases: [
      "docker",
      "can i run docker",
      "docker containers",
      "docker compose",
      "container hosting",
    ],
    locale: "en",
    body: "Yes. All RunRacks Linux VPS plans provide full KVM virtualization with root access, allowing you to install Docker, Docker Compose, Podman, and run containerized applications without virtualization restrictions.",
    sourceRef: "bundled:workload",
    status: "published",
    reviewedAt: "2026-11-05",
  },
  {
    id: "kb-ddos",
    category: "policy",
    title: "DDoS Mitigation & Network Protection",
    aliases: [
      "ddos protection",
      "do you have ddos protection",
      "ddos mitigation",
      "anti ddos",
      "dos protection",
    ],
    locale: "en",
    body: "RunRacks includes automated DDoS mitigation across its network uplinks to absorb volumetric attacks. With root access, you can also configure system-level firewalls (UFW, iptables, Windows Firewall) for granular port filtering.",
    sourceRef: "bundled:policy",
    status: "published",
    reviewedAt: "2026-11-05",
  },
  {
    id: "kb-upgrades",
    category: "product",
    title: "Plan and Resource Upgrades",
    aliases: [
      "can i upgrade",
      "upgrade vps",
      "scale resources",
      "add more ram",
      "upgrade cpu",
      "increase storage",
    ],
    locale: "en",
    body: "Yes. You can scale your VPS resources (CPU cores, RAM, NVMe storage, and bandwidth) as your requirements grow. Your data and IP configurations are preserved during tier upgrades.",
    sourceRef: "bundled:product",
    status: "published",
    reviewedAt: "2026-11-05",
  },
];

/** @deprecated Prefer allKnowledgeEntries(); kept for callers expecting the name. */
export const KNOWLEDGE_ENTRIES = BUNDLED_KNOWLEDGE_ENTRIES;

let merged: KnowledgeEntry[] | null = null;

export function allKnowledgeEntries(): KnowledgeEntry[] {
  if (merged) return merged;
  merged = [...BUNDLED_KNOWLEDGE_ENTRIES, ...loadPackQaEntries()];
  return merged;
}
