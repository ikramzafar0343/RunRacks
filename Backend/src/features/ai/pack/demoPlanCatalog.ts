/**
 * Demo plan cards — same specs as Frontend demo catalog seeds.
 * Amounts are labeled demo and are not an orderable quote.
 */
export type DemoPlanCard = {
  id: string;
  name: string;
  family: "Linux VPS" | "Windows VPS" | "Admin RDP";
  vcpu: number;
  ramGb: number;
  nvmeGb: number;
  trafficTb?: number;
  deliveryMinutes?: number;
  monthlyUsd: number;
  compareAtUsd: number;
  os: string;
  tagline: string;
  badge: string;
  access: string;
  why?: string;
};

const LINUX_OS = "Linux distributions (Ubuntu, Debian, AlmaLinux)";
const WIN_OS = "Windows Server (image selected at order)";
const RDP_OS = "Windows Server with administrator RDP access";

export const DEMO_PLAN_CARDS: DemoPlanCard[] = [
  card("demo-linux-1", "VPS 1", "Linux VPS", 4, 6, 100, 4.49, 8.99, LINUX_OS, "Affordable VPS with full root access", "50% off", 30, 15),
  card("demo-linux-2", "VPS 2", "Linux VPS", 6, 16, 200, 10.49, 18.99, LINUX_OS, "Powerful VPS for growing projects", "45% off", 30, 15),
  card("demo-linux-3", "VPS 3", "Linux VPS", 8, 24, 300, 18.89, 34.99, LINUX_OS, "High-performance VPS for demanding workloads", "Popular · 46% off", 30, 15, "A complete solution for production apps. Clear specs and full root access."),
  card("demo-linux-4", "VPS 4", "Linux VPS", 12, 48, 400, 41.69, 69.99, LINUX_OS, "Enterprise-grade VPS for critical apps", "40% off", 30, 15),
  card("demo-linux-5", "VPS 5", "Linux VPS", 16, 64, 500, 77.4, 119.99, LINUX_OS, "Extra headroom for larger stacks", "35% off", 30, 15),
  card("demo-linux-6", "VPS 6", "Linux VPS", 24, 120, 600, 109.9, 159.99, LINUX_OS, "Serious capacity for production fleets", "31% off", 30, 15),
  card("demo-win-1", "Windows VPS 1", "Windows VPS", 2, 4, 40, 8.99, 14.99, WIN_OS, "Affordable Windows VPS with admin access", "40% off"),
  card("demo-win-3", "Windows VPS 3", "Windows VPS", 4, 8, 80, 16.99, 28.99, WIN_OS, "Solid Windows VPS for small teams", "41% off"),
  card("demo-win-5", "Windows VPS 5", "Windows VPS", 6, 12, 160, 25.99, 44.99, WIN_OS, "Balanced Windows VPS for growing apps", "Popular · 42% off", undefined, undefined, "A complete Windows VPS for long-term projects. Full administrator access."),
  card("demo-win-7", "Windows VPS 7", "Windows VPS", 8, 16, 320, 38.99, 64.99, WIN_OS, "More headroom for agencies and stores", "40% off"),
  card("demo-win-9", "Windows VPS 9", "Windows VPS", 12, 24, 480, 55, 90, WIN_OS, "High-traffic Windows workloads", "39% off"),
  card("demo-win-11", "Windows VPS 11", "Windows VPS", 16, 32, 640, 80, 130, WIN_OS, "Top-tier Windows capacity", "38% off"),
  card("demo-rdp-1", "Admin RDP 1", "Admin RDP", 2, 4, 60, 10.99, 17.99, RDP_OS, "Administrator RDP for light desktops", "39% off"),
  card("demo-rdp-3", "Admin RDP 3", "Admin RDP", 4, 8, 120, 19.99, 32.99, RDP_OS, "RDP desktops for small teams", "39% off"),
  card("demo-rdp-5", "Admin RDP 5", "Admin RDP", 6, 16, 240, 31.99, 54.99, RDP_OS, "Balanced admin RDP for daily work", "Popular · 42% off", undefined, undefined, "A complete admin RDP plan for long-term remote work. Everything you need day to day."),
  card("demo-rdp-7", "Admin RDP 7", "Admin RDP", 8, 24, 400, 45, 75, RDP_OS, "More power for multi-session RDP", "40% off"),
  card("demo-rdp-9", "Admin RDP 9", "Admin RDP", 12, 32, 640, 63, 100, RDP_OS, "High-capacity admin desktops", "37% off"),
  card("demo-rdp-11", "Admin RDP 11", "Admin RDP", 16, 48, 960, 90, 140, RDP_OS, "Maximum RDP resources", "36% off"),
];

const REGIONS =
  "United States, United Kingdom, Canada, Netherlands, Germany, Singapore, Australia, Japan";

function card(
  id: string,
  name: string,
  family: DemoPlanCard["family"],
  vcpu: number,
  ramGb: number,
  nvmeGb: number,
  monthlyUsd: number,
  compareAtUsd: number,
  os: string,
  tagline: string,
  badge: string,
  trafficTb?: number,
  deliveryMinutes?: number,
  why?: string,
): DemoPlanCard {
  const row: DemoPlanCard = {
    id,
    name,
    family,
    vcpu,
    ramGb,
    nvmeGb,
    monthlyUsd,
    compareAtUsd,
    os,
    tagline,
    badge,
    access:
      family === "Linux VPS" ? "Full root access" : "Full root / administrator access",
  };
  if (trafficTb != null) row.trafficTb = trafficTb;
  if (deliveryMinutes != null) row.deliveryMinutes = deliveryMinutes;
  if (why) row.why = why;
  return row;
}

export function money(n: number): string {
  return `$${n.toFixed(2)}`;
}

export function formatPlanCard(plan: DemoPlanCard): string {
  const lines = [
    `${plan.name} (${plan.family}) — ${plan.tagline}.`,
    "",
    `• CPU: ${plan.vcpu} vCPU cores`,
    `• RAM: ${plan.ramGb} GB RAM (Dedicated ECC)`,
    `• Storage: ${plan.nvmeGb} GB NVMe SSD`,
  ];
  if (plan.trafficTb != null) {
    lines.push(`• Traffic / Bandwidth: ${plan.trafficTb} TB monthly traffic on 1 Gbps port`);
  }
  lines.push(
    `• Price: ${money(plan.monthlyUsd)}/mo (compare-at ${money(plan.compareAtUsd)}/mo, badge “${plan.badge}”)`,
    `• Access: ${plan.access}`,
    `• Operating System: ${plan.os}`,
  );
  if (plan.deliveryMinutes != null) {
    lines.push(`• Provisioning: Automated instant deployment in ~${plan.deliveryMinutes} min`);
  }
  lines.push(
    `• Datacenter Regions: ${REGIONS}`,
    `• Network: dedicated IPv4 address included`,
    `• Protection: Automated Enterprise Anti-DDoS mitigation included`,
  );
  if (plan.why) lines.push(`• Why this plan: ${plan.why}`);
  lines.push(
    "",
    "These amounts are from the published demo catalog and are not orderable as a live checkout yet. Confirm live details and custom options on Pricing before ordering.",
  );
  return lines.join("\n");
}

export function findPlanCard(matching: string): DemoPlanCard | null {
  const compact = matching.replace(/[^a-z0-9]/g, "");

  // Check alias "rdp 1" -> "admin rdp 1"
  const rdpMatch = matching.match(/\b(?:admin\s*)?rdp\s*(\d+)\b/);
  if (rdpMatch?.[1]) {
    const target = DEMO_PLAN_CARDS.find(
      (p) =>
        p.family === "Admin RDP" &&
        p.name.toLowerCase().endsWith(rdpMatch[1]!),
    );
    if (target) return target;
  }

  // Check alias "windows vps 1" or "win vps 1"
  const winMatch = matching.match(/\b(?:windows|win)\s*(?:vps\s*)?(\d+)\b/);
  if (winMatch?.[1]) {
    const target = DEMO_PLAN_CARDS.find(
      (p) =>
        p.family === "Windows VPS" &&
        p.name.toLowerCase().endsWith(winMatch[1]!),
    );
    if (target) return target;
  }

  const ranked = [...DEMO_PLAN_CARDS].sort(
    (a, b) => b.name.length - a.name.length,
  );
  for (const plan of ranked) {
    const name = plan.name.toLowerCase();
    if (matching.includes(name)) return plan;
    if (compact.includes(name.replace(/[^a-z0-9]/g, ""))) return plan;
  }
  return null;
}

export function listFamily(family: DemoPlanCard["family"]): string {
  const rows = DEMO_PLAN_CARDS.filter((p) => p.family === family);
  const bits = rows.map(
    (p) =>
      `${p.name}: ${p.vcpu} vCPU, ${p.ramGb} GB RAM, ${p.nvmeGb} GB NVMe, demo ${money(p.monthlyUsd)}/mo (${p.badge})`,
  );
  return `${family} plan cards (demo catalog):\n${bits.map((b) => `• ${b}`).join("\n")}\n\nAsk for one plan (for example “${rows[0]?.name ?? family} specs”) for the full card. Confirm live details on Pricing before ordering.`;
}
