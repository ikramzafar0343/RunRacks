export type PlanSpec = {
  name: string;
  supported: boolean;
  version: string;
};

export type FeatureRow = {
  feature: string;
  linux: PlanSpec[];
  windows: PlanSpec[];
  adminRdp: PlanSpec[];
};

const L_NAMES = ["VPS 1", "VPS 3", "VPS 5", "VPS 7"];
const W_NAMES = ["Win VPS 1", "Win VPS 3", "Win VPS 5", "Win VPS 7"];
const R_NAMES = ["Admin RDP 1", "Admin RDP 3", "Admin RDP 5", "Admin RDP 7"];

type S = [boolean, string];

function toSpecs(names: string[], specs: S[]): PlanSpec[] {
  return names.map((name, i) => ({
    name,
    supported: specs[i]?.[0] ?? true,
    version: specs[i]?.[1] ?? "",
  }));
}

function r(feature: string, l: S[], w: S[], rdp: S[]): FeatureRow {
  return {
    feature,
    linux: toSpecs(L_NAMES, l),
    windows: toSpecs(W_NAMES, w),
    adminRdp: toSpecs(R_NAMES, rdp),
  };
}

export const COMPARISON_ROWS: FeatureRow[] = [
  r(
    "Monthly Price",
    [
      [true, "$4.49"],
      [true, "$10.49"],
      [true, "$18.89"],
      [true, "$41.69"],
    ],
    [
      [true, "$8.99"],
      [true, "$16.99"],
      [true, "$25.99"],
      [true, "$38.99"],
    ],
    [
      [true, "$10.99"],
      [true, "$19.99"],
      [true, "$31.99"],
      [true, "$44.99"],
    ],
  ),
  r(
    "vCPU Compute",
    [
      [true, "1 Core"],
      [true, "2 Cores"],
      [true, "4 Cores"],
      [true, "8 Cores"],
    ],
    [
      [true, "2 Cores"],
      [true, "4 Cores"],
      [true, "6 Cores"],
      [true, "8 Cores"],
    ],
    [
      [true, "2 Cores"],
      [true, "4 Cores"],
      [true, "6 Cores"],
      [true, "8 Cores"],
    ],
  ),
  r(
    "Dedicated RAM",
    [
      [true, "1 GB"],
      [true, "2 GB"],
      [true, "4 GB"],
      [true, "16 GB"],
    ],
    [
      [true, "4 GB"],
      [true, "8 GB"],
      [true, "12 GB"],
      [true, "16 GB"],
    ],
    [
      [true, "4 GB"],
      [true, "8 GB"],
      [true, "16 GB"],
      [true, "24 GB"],
    ],
  ),
  r(
    "NVMe Storage",
    [
      [true, "20 GB"],
      [true, "40 GB"],
      [true, "80 GB"],
      [true, "320 GB"],
    ],
    [
      [true, "40 GB"],
      [true, "80 GB"],
      [true, "160 GB"],
      [true, "320 GB"],
    ],
    [
      [true, "60 GB"],
      [true, "120 GB"],
      [true, "240 GB"],
      [true, "400 GB"],
    ],
  ),
  r(
    "Windows License",
    [
      [false, "No"],
      [false, "No"],
      [false, "No"],
      [false, "No"],
    ],
    [
      [true, "2022"],
      [true, "2022"],
      [true, "2022"],
      [true, "2025"],
    ],
    [
      [true, "2022"],
      [true, "2022"],
      [true, "2022"],
      [true, "2022"],
    ],
  ),
  r(
    "Pre-installed Suite",
    [
      [false, "No"],
      [false, "No"],
      [false, "No"],
      [false, "No"],
    ],
    [
      [false, "No"],
      [false, "No"],
      [false, "No"],
      [false, "No"],
    ],
    [
      [true, "Browsers"],
      [true, "Browsers"],
      [true, "Dev Tools"],
      [true, "Full Suite"],
    ],
  ),
  r(
    "Admin / Root Access",
    [
      [true, "SSH Root"],
      [true, "SSH Root"],
      [true, "SSH Root"],
      [true, "SSH Root"],
    ],
    [
      [true, "Admin RDP"],
      [true, "Admin RDP"],
      [true, "Admin RDP"],
      [true, "Admin RDP"],
    ],
    [
      [true, "Full Admin"],
      [true, "Full Admin"],
      [true, "Full Admin"],
      [true, "Full Admin"],
    ],
  ),
  r(
    "Port & Bandwidth",
    [
      [true, "1 Gbps"],
      [true, "1 Gbps"],
      [true, "1 Gbps"],
      [true, "Dedicated"],
    ],
    [
      [true, "1 Gbps"],
      [true, "1 Gbps"],
      [true, "1 Gbps"],
      [true, "Dedicated"],
    ],
    [
      [true, "1 Gbps"],
      [true, "1 Gbps"],
      [true, "1 Gbps"],
      [true, "Dedicated"],
    ],
  ),
  r(
    "Dedicated IPv4",
    [
      [true, "1 IP"],
      [true, "1 IP"],
      [true, "1 IP"],
      [true, "2 IPs"],
    ],
    [
      [true, "1 IP"],
      [true, "1 IP"],
      [true, "1 IP"],
      [true, "2 IPs"],
    ],
    [
      [true, "1 IP"],
      [true, "1 IP"],
      [true, "1 IP"],
      [true, "2 IPs"],
    ],
  ),
  r(
    "Automated Backups",
    [
      [false, "No"],
      [true, "Weekly"],
      [true, "Daily"],
      [true, "Hourly"],
    ],
    [
      [false, "No"],
      [true, "Weekly"],
      [true, "Daily"],
      [true, "Hourly"],
    ],
    [
      [false, "No"],
      [true, "Weekly"],
      [true, "Daily"],
      [true, "Hourly"],
    ],
  ),
  r(
    "DDoS Mitigation",
    [
      [true, "Fast"],
      [true, "Fast"],
      [true, "Fast"],
      [true, "Advanced"],
    ],
    [
      [true, "Fast"],
      [true, "Fast"],
      [true, "Fast"],
      [true, "Advanced"],
    ],
    [
      [true, "Fast"],
      [true, "Fast"],
      [true, "Fast"],
      [true, "Advanced"],
    ],
  ),
];
