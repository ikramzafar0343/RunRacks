/**
 * Demo OS / app catalogs by product family — not live provisioning.
 */
import type { VpsFamily } from "@/features/vps-pricing/model/types";

export type ProvisionOs = {
  id: string;
  name: string;
  versionCount: number;
  versions: readonly string[];
};

export type ProvisionApp = {
  id: string;
  name: string;
  blurb: string;
};

const LINUX_OS: readonly ProvisionOs[] = [
  {
    id: "almalinux",
    name: "AlmaLinux",
    versionCount: 3,
    versions: ["10", "9", "8"],
  },
  {
    id: "centos",
    name: "CentOS",
    versionCount: 2,
    versions: ["Stream 9", "Stream 8"],
  },
  {
    id: "debian",
    name: "Debian",
    versionCount: 3,
    versions: ["12", "11", "10"],
  },
  {
    id: "fedora",
    name: "Fedora",
    versionCount: 2,
    versions: ["41", "40"],
  },
  {
    id: "rocky",
    name: "Rocky Linux",
    versionCount: 2,
    versions: ["9", "8"],
  },
  {
    id: "ubuntu",
    name: "Ubuntu",
    versionCount: 3,
    versions: ["24.04", "22.04", "20.04"],
  },
  {
    id: "opensuse",
    name: "openSUSE",
    versionCount: 2,
    versions: ["Leap 15", "Tumbleweed"],
  },
];

const LINUX_APPS: readonly ProvisionApp[] = [
  { id: "coolify", name: "Coolify", blurb: "Ready-to-use app" },
  { id: "docker-ce", name: "Docker-ce", blurb: "Ready-to-use app" },
  { id: "gitlab", name: "GitLab", blurb: "Ready-to-use app" },
  { id: "jitsi", name: "Jitsi", blurb: "Ready-to-use app" },
  { id: "lamp", name: "Lamp", blurb: "Ready-to-use app" },
  { id: "nextcloud", name: "Nextcloud", blurb: "Ready-to-use app" },
  { id: "owncast", name: "Owncast", blurb: "Ready-to-use app" },
  { id: "photoprism", name: "Photoprism", blurb: "Ready-to-use app" },
  {
    id: "prometheus-grafana",
    name: "Prometheus-grafana",
    blurb: "Ready-to-use app",
  },
  { id: "rustdesk", name: "RustDesk", blurb: "Ready-to-use app" },
  { id: "wireguard", name: "WireGuard", blurb: "Ready-to-use app" },
  { id: "wordpress", name: "WordPress", blurb: "Ready-to-use app" },
];

const WINDOWS_OS: readonly ProvisionOs[] = [
  {
    id: "ws2025",
    name: "Windows Server 2025",
    versionCount: 1,
    versions: ["Standard"],
  },
  {
    id: "ws2022",
    name: "Windows Server 2022",
    versionCount: 2,
    versions: ["Standard", "Datacenter"],
  },
  {
    id: "ws2019",
    name: "Windows Server 2019",
    versionCount: 2,
    versions: ["Standard", "Datacenter"],
  },
  {
    id: "ws2016",
    name: "Windows Server 2016",
    versionCount: 1,
    versions: ["Standard"],
  },
];

const WINDOWS_APPS: readonly ProvisionApp[] = [
  { id: "iis", name: "IIS stack", blurb: "Ready-to-use app" },
  { id: "mssql-express", name: "SQL Express", blurb: "Ready-to-use app" },
  { id: "docker-win", name: "Docker Desktop", blurb: "Ready-to-use app" },
  { id: "nodejs-win", name: "Node.js", blurb: "Ready-to-use app" },
  { id: "python-win", name: "Python", blurb: "Ready-to-use app" },
  { id: "git-win", name: "Git", blurb: "Ready-to-use app" },
  { id: "chrome-remote", name: "Remote tools", blurb: "Ready-to-use app" },
  { id: "filezilla", name: "FileZilla", blurb: "Ready-to-use app" },
  { id: "7zip", name: "7-Zip", blurb: "Ready-to-use app" },
  { id: "notepadpp", name: "Notepad++", blurb: "Ready-to-use app" },
  { id: "powershell", name: "PowerShell 7", blurb: "Ready-to-use app" },
  { id: "winscp", name: "WinSCP", blurb: "Ready-to-use app" },
];

const RDP_OS: readonly ProvisionOs[] = [
  {
    id: "rdp-ws2022",
    name: "Admin desktop 2022",
    versionCount: 1,
    versions: ["Full admin"],
  },
  {
    id: "rdp-ws2019",
    name: "Admin desktop 2019",
    versionCount: 1,
    versions: ["Full admin"],
  },
  {
    id: "rdp-ws2025",
    name: "Admin desktop 2025",
    versionCount: 1,
    versions: ["Full admin"],
  },
  {
    id: "rdp-office",
    name: "Office-ready desktop",
    versionCount: 1,
    versions: ["Standard"],
  },
];

const RDP_APPS: readonly ProvisionApp[] = [
  { id: "rdp-chrome", name: "Chrome", blurb: "Ready-to-use app" },
  { id: "rdp-edge", name: "Edge", blurb: "Ready-to-use app" },
  { id: "rdp-office", name: "Office tools", blurb: "Ready-to-use app" },
  { id: "rdp-teams", name: "Teams", blurb: "Ready-to-use app" },
  { id: "rdp-zoom", name: "Zoom", blurb: "Ready-to-use app" },
  { id: "rdp-anydesk", name: "AnyDesk", blurb: "Ready-to-use app" },
  { id: "rdp-rustdesk", name: "RustDesk", blurb: "Ready-to-use app" },
  { id: "rdp-vpn", name: "VPN client", blurb: "Ready-to-use app" },
  { id: "rdp-notepad", name: "Notepad++", blurb: "Ready-to-use app" },
  { id: "rdp-7zip", name: "7-Zip", blurb: "Ready-to-use app" },
  { id: "rdp-ftp", name: "FTP client", blurb: "Ready-to-use app" },
  { id: "rdp-git", name: "Git", blurb: "Ready-to-use app" },
];

export function getOsOptions(family: VpsFamily): readonly ProvisionOs[] {
  if (family === "windows") return WINDOWS_OS;
  if (family === "windows-admin-rdp") return RDP_OS;
  return LINUX_OS;
}

export function getAppOptions(family: VpsFamily): readonly ProvisionApp[] {
  if (family === "windows") return WINDOWS_APPS;
  if (family === "windows-admin-rdp") return RDP_APPS;
  return LINUX_APPS;
}

export function defaultProvisionForFamily(family: VpsFamily): {
  osId: string;
  osVersion: string | null;
  appId: string | null;
} {
  const os = getOsOptions(family)[0];
  return {
    osId: os?.id ?? "ubuntu",
    osVersion: os?.versions[0] ?? null,
    appId: null,
  };
}

export const PROVISION_DEMO_NOTE =
  "Demo images and apps for configuration only — not live provisioning until checkout is connected.";
