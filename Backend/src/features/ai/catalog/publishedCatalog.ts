/**
 * Canonical published catalog plans matching Frontend demoCatalogSeeds.ts.
 * Source of truth for AI advisor when live WHMCS DB is unseeded or syncing.
 * All plans include 30 TB traffic on 1 Gbps, NVMe SSD, and Anti-DDoS.
 */

export type PublishedCatalogPlan = {
  id: string;
  name: string;
  family: "linux" | "windows" | "windows-admin-rdp";
  vcpu: number;
  ramGb: number;
  nvmeGb: number;
  trafficTb: number;
  monthlyMajor: number;
  compareAtMajor: number;
  featured?: boolean;
  tagline: string;
  badge: string;
  whyPlan?: string;
};

export const PUBLISHED_PLANS: PublishedCatalogPlan[] = [
  // Linux VPS Plans (1-6)
  {
    id: "demo-linux-1",
    name: "VPS 1",
    family: "linux",
    vcpu: 4,
    ramGb: 6,
    nvmeGb: 100,
    trafficTb: 30,
    monthlyMajor: 4.49,
    compareAtMajor: 8.99,
    tagline: "Affordable VPS with full root access",
    badge: "50% off",
  },
  {
    id: "demo-linux-2",
    name: "VPS 2",
    family: "linux",
    vcpu: 6,
    ramGb: 16,
    nvmeGb: 200,
    trafficTb: 30,
    monthlyMajor: 10.49,
    compareAtMajor: 18.99,
    tagline: "Powerful VPS for growing projects",
    badge: "45% off",
  },
  {
    id: "demo-linux-3",
    name: "VPS 3",
    family: "linux",
    vcpu: 8,
    ramGb: 24,
    nvmeGb: 300,
    trafficTb: 30,
    monthlyMajor: 18.89,
    compareAtMajor: 34.99,
    featured: true,
    tagline: "High-performance VPS for demanding workloads",
    badge: "Popular · 46% off",
    whyPlan: "Complete solution for production apps with root access.",
  },
  {
    id: "demo-linux-4",
    name: "VPS 4",
    family: "linux",
    vcpu: 12,
    ramGb: 48,
    nvmeGb: 400,
    trafficTb: 30,
    monthlyMajor: 41.69,
    compareAtMajor: 69.99,
    tagline: "Enterprise-grade VPS for critical apps",
    badge: "40% off",
  },
  {
    id: "demo-linux-5",
    name: "VPS 5",
    family: "linux",
    vcpu: 16,
    ramGb: 64,
    nvmeGb: 500,
    trafficTb: 30,
    monthlyMajor: 77.4,
    compareAtMajor: 119.99,
    tagline: "Extra headroom for larger stacks",
    badge: "35% off",
  },
  {
    id: "demo-linux-6",
    name: "VPS 6",
    family: "linux",
    vcpu: 24,
    ramGb: 120,
    nvmeGb: 600,
    trafficTb: 30,
    monthlyMajor: 109.9,
    compareAtMajor: 159.99,
    tagline: "Serious capacity for production fleets",
    badge: "31% off",
  },

  // Windows VPS Plans (1, 3, 5, 7, 9, 11)
  {
    id: "demo-win-1",
    name: "Windows VPS 1",
    family: "windows",
    vcpu: 2,
    ramGb: 4,
    nvmeGb: 40,
    trafficTb: 30,
    monthlyMajor: 8.99,
    compareAtMajor: 14.99,
    tagline: "Affordable Windows VPS with admin access",
    badge: "40% off",
  },
  {
    id: "demo-win-3",
    name: "Windows VPS 3",
    family: "windows",
    vcpu: 4,
    ramGb: 8,
    nvmeGb: 80,
    trafficTb: 30,
    monthlyMajor: 16.99,
    compareAtMajor: 28.99,
    tagline: "Solid Windows VPS for small teams",
    badge: "41% off",
  },
  {
    id: "demo-win-5",
    name: "Windows VPS 5",
    family: "windows",
    vcpu: 6,
    ramGb: 12,
    nvmeGb: 160,
    trafficTb: 30,
    monthlyMajor: 25.99,
    compareAtMajor: 44.99,
    featured: true,
    tagline: "Balanced Windows VPS for growing apps",
    badge: "Popular · 42% off",
    whyPlan: "Complete Windows VPS with full administrator access.",
  },
  {
    id: "demo-win-7",
    name: "Windows VPS 7",
    family: "windows",
    vcpu: 8,
    ramGb: 16,
    nvmeGb: 320,
    trafficTb: 30,
    monthlyMajor: 38.99,
    compareAtMajor: 64.99,
    tagline: "More headroom for agencies and stores",
    badge: "40% off",
  },
  {
    id: "demo-win-9",
    name: "Windows VPS 9",
    family: "windows",
    vcpu: 12,
    ramGb: 24,
    nvmeGb: 480,
    trafficTb: 30,
    monthlyMajor: 55.0,
    compareAtMajor: 90.0,
    tagline: "High-traffic Windows workloads",
    badge: "39% off",
  },
  {
    id: "demo-win-11",
    name: "Windows VPS 11",
    family: "windows",
    vcpu: 16,
    ramGb: 32,
    nvmeGb: 640,
    trafficTb: 30,
    monthlyMajor: 80.0,
    compareAtMajor: 130.0,
    tagline: "Top-tier Windows capacity",
    badge: "38% off",
  },

  // Admin RDP Plans (1, 3, 5, 7, 9, 11)
  {
    id: "demo-rdp-1",
    name: "Admin RDP 1",
    family: "windows-admin-rdp",
    vcpu: 2,
    ramGb: 4,
    nvmeGb: 60,
    trafficTb: 30,
    monthlyMajor: 10.99,
    compareAtMajor: 17.99,
    tagline: "Administrator RDP for light desktops",
    badge: "39% off",
  },
  {
    id: "demo-rdp-3",
    name: "Admin RDP 3",
    family: "windows-admin-rdp",
    vcpu: 4,
    ramGb: 8,
    nvmeGb: 120,
    trafficTb: 30,
    monthlyMajor: 19.99,
    compareAtMajor: 32.99,
    tagline: "RDP desktops for small teams",
    badge: "39% off",
  },
  {
    id: "demo-rdp-5",
    name: "Admin RDP 5",
    family: "windows-admin-rdp",
    vcpu: 6,
    ramGb: 16,
    nvmeGb: 240,
    trafficTb: 30,
    monthlyMajor: 31.99,
    compareAtMajor: 54.99,
    featured: true,
    tagline: "Balanced admin RDP for daily work",
    badge: "Popular · 42% off",
    whyPlan: "Complete admin RDP plan for daily remote management.",
  },
  {
    id: "demo-rdp-7",
    name: "Admin RDP 7",
    family: "windows-admin-rdp",
    vcpu: 8,
    ramGb: 24,
    nvmeGb: 400,
    trafficTb: 30,
    monthlyMajor: 45.0,
    compareAtMajor: 75.0,
    tagline: "More power for multi-session RDP",
    badge: "40% off",
  },
  {
    id: "demo-rdp-9",
    name: "Admin RDP 9",
    family: "windows-admin-rdp",
    vcpu: 12,
    ramGb: 32,
    nvmeGb: 640,
    trafficTb: 30,
    monthlyMajor: 63.0,
    compareAtMajor: 100.0,
    tagline: "High-capacity admin desktops",
    badge: "37% off",
  },
  {
    id: "demo-rdp-11",
    name: "Admin RDP 11",
    family: "windows-admin-rdp",
    vcpu: 16,
    ramGb: 48,
    nvmeGb: 960,
    trafficTb: 30,
    monthlyMajor: 90.0,
    compareAtMajor: 140.0,
    tagline: "Maximum RDP resources",
    badge: "36% off",
  },
];

export function getPublishedCatalog(
  familyFilter?: string,
  limit = 20,
): Array<{
  name: string;
  family: string;
  description: string;
  prices: Array<{ currency: string; cycle: string; amountMinor: number }>;
}> {
  let list = PUBLISHED_PLANS;
  if (familyFilter) {
    const f = familyFilter.toLowerCase();
    list = list.filter((p) => p.family === f || p.family.includes(f));
  }
  return list.slice(0, limit).map((p) => ({
    name: p.name,
    family: p.family,
    description: `${p.vcpu} vCPU, ${p.ramGb} GB RAM, ${p.nvmeGb} GB NVMe, 30 TB traffic`,
    prices: [
      {
        currency: "USD",
        cycle: "mo",
        amountMinor: Math.round(p.monthlyMajor * 100),
      },
    ],
  }));
}

