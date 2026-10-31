/**
 * Product hosting page — shared inclusions, workloads, and capabilities.
 */
import type { Capability, WorkloadItem } from "./productHostingTypes";

/** Short checklist lines for the inclusions panel (honest catalog features only). */
export const SHARED_INCLUSIONS = [
  "Full root / administrator access",
  "NVMe SSD storage",
  "Regions across the catalog",
  "Dedicated IPv4 address",
  "Documented plan specs before you continue",
  "OS images selected when ordering is connected",
  "Listed vCPU and RAM per tier",
  "Family and billing-term filters",
  "Demo pricing labeled until checkout is live",
] as const;

export const SHARED_WORKLOADS: readonly WorkloadItem[] = [
  {
    id: "automation",
    label: "Automation",
    idleLines: ["Scripts and", "scheduled jobs"],
    title: "Scripts and scheduled jobs",
    description:
      "Run cron jobs, workers, and deployment hooks with predictable CPU and memory.",
    benefits: [
      "SSH access for your toolchain",
      "Room for background workers",
      "Scale resources when jobs grow",
    ],
    toolIds: ["github", "gitlab", "docker"],
    preview: {
      src: "/images/showcase/rail-preview-stop.jpg",
      objectPosition: "50% 50%",
    },
  },
  {
    id: "apps",
    label: "Application hosting",
    idleLines: ["Open-source app", "self-hosting"],
    title: "Open-source app self-hosting",
    description:
      "Host application stacks that need root-level control beyond shared hosting.",
    benefits: [
      "Install the runtimes you need",
      "Pair with reverse proxies you choose",
      "Separate staging from production",
    ],
    toolIds: ["wordpress", "docker", "ubuntu"],
    preview: {
      src: "/images/showcase/rail-preview-brand.jpg",
      objectPosition: "50% 50%",
    },
  },
  {
    id: "apis",
    label: "APIs",
    idleLines: ["App and API", "deployment"],
    title: "Service endpoints",
    description:
      "Keep API processes on dedicated slices so neighboring tenants do not steal your peak capacity.",
    benefits: [
      "Isolated vCPU and RAM",
      "Predictable network addressing",
      "Room to add caches and queues",
    ],
    toolIds: ["docker", "github", "gitlab"],
    preview: {
      src: "/images/showcase/rail-preview-leads.jpg",
      objectPosition: "50% 50%",
    },
  },
  {
    id: "data",
    label: "Data workloads",
    idleLines: ["Databases and", "storage"],
    title: "Databases and storage-heavy jobs",
    description:
      "Size NVMe and memory for databases or analytics workers you operate yourself.",
    benefits: [
      "Local NVMe for fast disks",
      "Choose memory-heavy plans",
      "You control backups and restores",
    ],
    toolIds: ["docker", "ubuntu", "github"],
    preview: {
      src: "/images/showcase/rail-preview-grow.jpg",
      objectPosition: "50% 50%",
    },
  },
  {
    id: "commerce",
    label: "Online stores",
    idleLines: ["High-traffic and", "online stores"],
    title: "Storefronts and commerce backends",
    description:
      "Run commerce stacks when you need custom plugins, workers, or Windows-compatible tooling.",
    benefits: [
      "Plans sized for busy catalogs",
      "Region choice near your audience",
      "Full control of the guest OS",
    ],
    toolIds: ["shopify", "wordpress", "stripe"],
    preview: {
      src: "/images/showcase/rail-photo-cloud.jpg",
      objectPosition: "50% 40%",
    },
  },
];

export const SHARED_CAPS: readonly Capability[] = [
  {
    id: "root",
    number: "01",
    icon: "root",
    title: "Full root access",
    body: "Administer the guest OS with the same privileges you expect on a dedicated machine.",
  },
  {
    id: "admin",
    number: "02",
    icon: "admin",
    title: "Administrative control",
    body: "Install packages, configure services, and shape firewall rules inside your VPS.",
  },
  {
    id: "network",
    number: "03",
    icon: "network",
    title: "Dedicated IPv4",
    body: "Each plan includes addressing you can point DNS and TLS certificates at.",
  },
  {
    id: "storage",
    number: "04",
    icon: "storage",
    title: "NVMe storage",
    body: "Local NVMe volumes sized per plan so disk-bound workloads stay on fast media.",
  },
  {
    id: "images",
    number: "05",
    icon: "images",
    title: "OS images at order",
    body: "Select a supported Linux or Windows image when you provision—subject to family.",
  },
  {
    id: "clarity",
    number: "06",
    icon: "clarity",
    title: "Readable plans",
    body: "Compare vCPU, RAM, storage, and regions before you commit—no hidden marketing tiers.",
  },
];
