/**
 * Windows product page — inclusions + workloads (not the Linux shared pack).
 */
import type { WorkloadItem } from "./productHostingTypes";

export const WINDOWS_INCLUSIONS = [
  "Full Windows administrator access",
  "NVMe SSD storage",
  "Regions across the catalog",
  "Dedicated IPv4 address",
  "Documented Windows plan specs",
  "Windows Server images when ordering is connected",
  "Listed vCPU and RAM per Windows tier",
  "Windows family and billing-term filters",
  "Demo pricing labeled until checkout is live",
] as const;

export const WINDOWS_WORKLOADS: readonly WorkloadItem[] = [
  {
    id: "iis",
    label: "Windows apps",
    idleLines: ["IIS and", ".NET services"],
    title: "IIS and .NET application hosts",
    description:
      "Run Windows Server roles and application pools with administrator control beyond shared hosting.",
    benefits: [
      "Install Windows Server roles you need",
      "Pair with the reverse proxy you choose",
      "Keep staging separate from production",
    ],
    toolIds: ["docker", "github", "gitlab"],
    preview: {
      src: "/images/showcase/rail-preview-brand.jpg",
      objectPosition: "50% 50%",
    },
  },
  {
    id: "line-of-business",
    label: "Line of business",
    idleLines: ["Vendor and", "legacy apps"],
    title: "Vendor and legacy Windows tools",
    description:
      "Host Windows-only business apps that refuse to run cleanly on Linux guests.",
    benefits: [
      "Administrator rights for installers",
      "Persistent Windows environment",
      "Specs sized for desktop-adjacent apps",
    ],
    toolIds: ["github", "gitlab", "docker"],
    preview: {
      src: "/images/showcase/rail-preview-stop.jpg",
      objectPosition: "50% 50%",
    },
  },
  {
    id: "build",
    label: "Build agents",
    idleLines: ["CI and", "build agents"],
    title: "Windows CI and build agents",
    description:
      "Keep Windows build agents on dedicated slices so compile jobs do not fight other tenants for CPU.",
    benefits: [
      "Isolated vCPU and RAM",
      "Predictable addressing for agents",
      "Room for caches and artifacts",
    ],
    toolIds: ["github", "gitlab", "docker"],
    preview: {
      src: "/images/showcase/rail-preview-leads.jpg",
      objectPosition: "50% 50%",
    },
  },
  {
    id: "data",
    label: "Data on Windows",
    idleLines: ["SQL-adjacent", "and files"],
    title: "SQL-adjacent and file-heavy Windows jobs",
    description:
      "Size NVMe and memory for Windows data services you operate yourself.",
    benefits: [
      "Local NVMe for fast disks",
      "Memory-heavy Windows tiers",
      "You control backups and restores",
    ],
    toolIds: ["docker", "github", "gitlab"],
    preview: {
      src: "/images/showcase/rail-preview-grow.jpg",
      objectPosition: "50% 50%",
    },
  },
  {
    id: "rdp-adjacent",
    label: "Remote ops",
    idleLines: ["Admin tools", "over RDP"],
    title: "Admin tooling over remote desktop",
    description:
      "When operators need Windows tools remotely, compare Windows VPS vs Admin RDP so the family matches the job.",
    benefits: [
      "Administrator sessions when required",
      "Clear family choice in the catalog",
      "Demo pricing labeled until checkout",
    ],
    toolIds: ["github", "docker", "ubuntu"],
    preview: {
      src: "/images/showcase/rail-photo-cloud.jpg",
      objectPosition: "50% 40%",
    },
  },
];
