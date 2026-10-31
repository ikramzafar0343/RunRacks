/**
 * Product hosting page — Linux inclusions and workloads.
 * Windows uses windowsHostingContent.ts (do not reuse this pack there).
 */
import type { WorkloadItem } from "./productHostingTypes";

/** Short checklist lines for the inclusions panel (honest catalog features only). */
export const LINUX_INCLUSIONS = [
  "Full root access on Linux guests",
  "NVMe SSD storage",
  "Regions across the catalog",
  "Dedicated IPv4 address",
  "Documented Linux plan specs before you continue",
  "Linux images selected when ordering is connected",
  "Listed vCPU and RAM per Linux tier",
  "Linux family and billing-term filters",
  "Demo pricing labeled until checkout is live",
] as const;

export const LINUX_WORKLOADS: readonly WorkloadItem[] = [
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
