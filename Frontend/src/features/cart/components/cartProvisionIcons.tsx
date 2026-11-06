/**
 * Brand logos for cart OS / apps / payments / families.
 */
import type { ComponentType, ReactNode } from "react";
import {
  FaCcAmex,
  FaCcMastercard,
  FaCcPaypal,
  FaCcVisa,
  FaUniversity,
  FaWindows,
} from "react-icons/fa";
import {
  HiOutlineComputerDesktop,
  HiOutlineServerStack,
  HiOutlineSquare3Stack3D,
} from "react-icons/hi2";
import {
  SiAlmalinux,
  SiAnydesk,
  SiCentos,
  SiCoolify,
  SiDebian,
  SiDocker,
  SiFedora,
  SiFilezilla,
  SiGit,
  SiGitlab,
  SiGooglechrome,
  SiJitsi,
  SiLinux,
  SiNextcloud,
  SiNodedotjs,
  SiNotepadplusplus,
  SiOpensuse,
  SiGrafana,
  SiPython,
  SiRockylinux,
  SiRustdesk,
  SiUbuntu,
  SiWireguard,
  SiWordpress,
  SiZoom,
} from "react-icons/si";
import type { VpsFamily } from "@/features/vps-pricing";

type IconProps = {
  size?: number;
  className?: string;
  color?: string;
  style?: { color?: string };
  "aria-hidden"?: boolean;
};

type BrandIcon = {
  Icon: ComponentType<IconProps>;
  color: string;
};

function renderBrand(
  Icon: ComponentType<IconProps>,
  color: string,
  size: number,
) {
  return <Icon size={size} color={color} style={{ color }} aria-hidden />;
}

const OS_ICONS: Record<string, BrandIcon> = {
  almalinux: { Icon: SiAlmalinux, color: "#0F56A6" },
  centos: { Icon: SiCentos, color: "#262577" },
  debian: { Icon: SiDebian, color: "#A80030" },
  fedora: { Icon: SiFedora, color: "#51A2DA" },
  rocky: { Icon: SiRockylinux, color: "#10B981" },
  ubuntu: { Icon: SiUbuntu, color: "#E95420" },
  opensuse: { Icon: SiOpensuse, color: "#73BA25" },
  ws2025: { Icon: FaWindows, color: "#00A4EF" },
  ws2022: { Icon: FaWindows, color: "#00A4EF" },
  ws2019: { Icon: FaWindows, color: "#00A4EF" },
  ws2016: { Icon: FaWindows, color: "#00A4EF" },
  "rdp-ws2022": { Icon: FaWindows, color: "#00A4EF" },
  "rdp-ws2019": { Icon: FaWindows, color: "#00A4EF" },
  "rdp-ws2025": { Icon: FaWindows, color: "#00A4EF" },
  "rdp-office": { Icon: HiOutlineComputerDesktop, color: "#2c6a52" },
};

const APP_ICONS: Record<string, BrandIcon> = {
  coolify: { Icon: SiCoolify, color: "#2B2D42" },
  "docker-ce": { Icon: SiDocker, color: "#2496ED" },
  gitlab: { Icon: SiGitlab, color: "#FC6D26" },
  jitsi: { Icon: SiJitsi, color: "#1D76BB" },
  lamp: { Icon: SiLinux, color: "#E95420" },
  nextcloud: { Icon: SiNextcloud, color: "#0082C9" },
  owncast: { Icon: HiOutlineSquare3Stack3D, color: "#2c6a52" },
  photoprism: { Icon: HiOutlineSquare3Stack3D, color: "#9B59B6" },
  "prometheus-grafana": { Icon: SiGrafana, color: "#F46800" },
  rustdesk: { Icon: SiRustdesk, color: "#F4C430" },
  wireguard: { Icon: SiWireguard, color: "#88171A" },
  wordpress: { Icon: SiWordpress, color: "#21759B" },
  iis: { Icon: FaWindows, color: "#00A4EF" },
  "mssql-express": { Icon: FaWindows, color: "#CC2927" },
  "docker-win": { Icon: SiDocker, color: "#2496ED" },
  "nodejs-win": { Icon: SiNodedotjs, color: "#339933" },
  "python-win": { Icon: SiPython, color: "#3776AB" },
  "git-win": { Icon: SiGit, color: "#F05032" },
  "chrome-remote": { Icon: SiGooglechrome, color: "#4285F4" },
  filezilla: { Icon: SiFilezilla, color: "#BF0000" },
  "7zip": { Icon: HiOutlineSquare3Stack3D, color: "#000000" },
  notepadpp: { Icon: SiNotepadplusplus, color: "#90E059" },
  powershell: { Icon: FaWindows, color: "#012456" },
  winscp: { Icon: SiFilezilla, color: "#1A7DB3" },
  "rdp-chrome": { Icon: SiGooglechrome, color: "#4285F4" },
  "rdp-edge": { Icon: FaWindows, color: "#0078D7" },
  "rdp-office": { Icon: FaWindows, color: "#D83B01" },
  "rdp-teams": { Icon: FaWindows, color: "#6264A7" },
  "rdp-zoom": { Icon: SiZoom, color: "#2D8CFF" },
  "rdp-anydesk": { Icon: SiAnydesk, color: "#EF443B" },
  "rdp-rustdesk": { Icon: SiRustdesk, color: "#F4C430" },
  "rdp-vpn": { Icon: SiWireguard, color: "#88171A" },
  "rdp-notepad": { Icon: SiNotepadplusplus, color: "#90E059" },
  "rdp-7zip": { Icon: HiOutlineSquare3Stack3D, color: "#111" },
  "rdp-ftp": { Icon: SiFilezilla, color: "#BF0000" },
  "rdp-git": { Icon: SiGit, color: "#F05032" },
};

const FAMILY_ICONS: Record<VpsFamily, BrandIcon> = {
  linux: { Icon: SiLinux, color: "#FCC624" },
  windows: { Icon: FaWindows, color: "#00A4EF" },
  "windows-admin-rdp": { Icon: HiOutlineServerStack, color: "#2c6a52" },
};

export function cartOsIcon(osId: string, size = 20): ReactNode {
  const entry = OS_ICONS[osId] ?? { Icon: SiLinux, color: "#2c6a52" };
  return renderBrand(entry.Icon, entry.color, size);
}

export function cartAppIcon(appId: string, size = 18): ReactNode {
  const entry = APP_ICONS[appId] ?? {
    Icon: HiOutlineSquare3Stack3D,
    color: "#2c6a52",
  };
  return renderBrand(entry.Icon, entry.color, size);
}

export function cartFamilyIcon(family: VpsFamily, size = 18): ReactNode {
  const { Icon, color } = FAMILY_ICONS[family];
  return renderBrand(Icon, color, size);
}

export const CART_PAYMENT_MARKS: readonly {
  id: string;
  label: string;
  Icon: ComponentType<IconProps>;
  color: string;
}[] = [
  { id: "visa", label: "Visa", Icon: FaCcVisa, color: "#1A1F71" },
  {
    id: "mastercard",
    label: "Mastercard",
    Icon: FaCcMastercard,
    color: "#EB001B",
  },
  { id: "amex", label: "American Express", Icon: FaCcAmex, color: "#2E77BC" },
  { id: "paypal", label: "PayPal", Icon: FaCcPaypal, color: "#003087" },
  { id: "bank", label: "Bank transfer", Icon: FaUniversity, color: "#2c6a52" },
];
