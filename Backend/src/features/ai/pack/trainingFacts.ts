/**
 * Shared facts for the uploaded question sheet.
 * Demo catalog only — no live orders, SLAs, or wallet numbers.
 */
import { DEMO_PLAN_CARDS, money, type DemoPlanCard } from "./demoPlanCatalog.js";

function low(family: DemoPlanCard["family"]): DemoPlanCard {
  return DEMO_PLAN_CARDS.find((card) => card.family === family)!;
}

const linux = low("Linux VPS");
const windows = low("Windows VPS");
const rdp = low("Admin RDP");

export const REGIONS =
  "United States, United Kingdom, Canada, Netherlands, Germany, Singapore, Australia, and Japan";

export const DEMO =
  "Listed amounts are published demo catalog prices, not a live order. Checkout payment is not connected, so nothing is charged.";

export const CONTACT =
  "Use the Contact page for anything this chat cannot confirm. I cannot open a ticket, see an account, or change a server from here.";

export const NO_LEGAL =
  "Terms, privacy, and refund pages are still pending legal review. I will not claim a money-back guarantee, a finished contract, or an uptime SLA.";

export const NOT_SOLD =
  "Shared hosting, dedicated servers, domain registration, cPanel hosting, game-server hosting, GPU servers, and managed VPS are not separate products in this catalog.";

export const PAY =
  "I cannot confirm card, PayPal, bank transfer, JazzCash, Easypaisa, or crypto as accepted methods. The checkout screen shows card (Visa, Mastercard, American Express), PayPal, and bank transfer as layout only. Live payment is not connected, no card data is stored, and I will not give a wallet account number or a PKR rate.";

export const ACCOUNT =
  "Account sign-in, registration, password reset, and Google sign-in are not configured. Do not paste a password here. I cannot see invoices, services, or login history.";

export const BACKUP =
  "Backup inclusion, retention, snapshots, and cost are not verified. I will not claim backups are included. Keep your own off-server copies until a backup product is published.";

export const DDOS =
  "I will not state a DDoS capacity, a null-route timer, or that protection is guaranteed. Confirm on Pricing or Contact.";

export const CHEAP = `${linux.name} is the lowest Linux demo price at ${money(linux.monthlyUsd)}/mo (${linux.vcpu} vCPU, ${linux.ramGb} GB RAM, ${linux.nvmeGb} GB NVMe). ${windows.name} is ${money(windows.monthlyUsd)}/mo. ${rdp.name} is ${money(rdp.monthlyUsd)}/mo. ${DEMO}`;

export const BILL =
  "Demo billing terms are 1, 3, 6, and 12 months. The demo bill is the monthly amount times the number of months, with no extra term discount. VPS 1 example: $4.49, $13.47, $26.94, and $53.88.";

export const CATALOG = `Catalog: Linux VPS ${linux.name}–VPS 6 from ${money(linux.monthlyUsd)}/mo demo; Windows VPS ${windows.name}–Windows VPS 11 from ${money(windows.monthlyUsd)}/mo demo; Admin RDP ${rdp.name}–Admin RDP 11 from ${money(rdp.monthlyUsd)}/mo demo.`;

export const LINUX_NOTE =
  "Linux cards name Ubuntu, Debian, and AlmaLinux, full root access, a dedicated IPv4, 30 TB traffic, and a 1 Gbps port label. Delivery is labeled about 15 minutes. That label is not proof your server is provisioning. Rocky, CentOS, Fedora, Arch, a custom ISO, KVM versus OpenVZ, nested virtualization, swap, IPv6, and a default SSH port are not confirmed.";

export const WINDOWS_NOTE =
  "Windows VPS uses a Windows Server image selected at order, with administrator access over Remote Desktop. I will not confirm Server 2019, 2022, 2025, Windows 10, or Windows 11, or that a license or RDS CAL is included.";

export const RDP_NOTE =
  "Admin RDP is its own plan with administrator Remote Desktop access. It is not a shared-hosting product. I will not promise a residential IP, a session count, or instant delivery.";

export function firstMatch(
  matching: string,
  pairs: ReadonlyArray<readonly [RegExp, string]>,
  fallback: string,
): string {
  for (const [re, text] of pairs) {
    if (re.test(matching)) return text;
  }
  return fallback;
}

export function say(...parts: Array<string | false>): string {
  return parts.filter((part): part is string => Boolean(part)).join(" ");
}
