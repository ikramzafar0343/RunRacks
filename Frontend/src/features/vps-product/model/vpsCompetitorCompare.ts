/**
 * VPS competitor comparison — RunRacks VPS 1 vs published entry VPS rows.
 * RunRacks column mirrors catalog VPS 1; competitor figures match the compare table source.
 */

export type CompareProviderId =
  | "runracks"
  | "namecheap"
  | "godaddy"
  | "hostingcom";

export type CompareLogo = {
  src: string;
  alt: string;
  /** Optional mark chrome: orange Namecheap tile, dark GoDaddy / Hosting.com. */
  tone?: "lime" | "orange" | "ink" | "plain";
};

export type CompareProvider = {
  id: CompareProviderId;
  name: string;
  /** Fallback letter when logo is absent (RunRacks). */
  mark: string;
  logo?: CompareLogo;
  plan: string;
  monthlyPrice: string;
  monthlyMajor: number;
  vcpu: string;
  ram: string;
  storage: string;
  bandwidth: string;
  featured?: boolean;
  badge?: string;
};

export type CompareMetricKey =
  | "plan"
  | "price"
  | "vcpu"
  | "ram"
  | "storage"
  | "bandwidth"
  | "cheaper";

export type CompareMetric = {
  key: CompareMetricKey;
  label: string;
};

export type CompareSavings = {
  providerId: Exclude<CompareProviderId, "runracks">;
  name: string;
  logo: CompareLogo;
  amountLabel: string;
  note: string;
};

export const VPS_COMPETITOR_COMPARE = {
  headingId: "vps-competitor-compare-heading",
  headingBefore: "Stop ",
  headingAccent: "Overpaying",
  headingAfter: " for VPS Hosting",
  lead:
    "More vCPU, more RAM and 30 TB traffic on NVMe, for less than the big names charge for their entry VPS.",
  providers: [
    {
      id: "runracks",
      name: "RunRacks",
      mark: "R",
      plan: "VPS 1",
      monthlyPrice: "$4.49/mo",
      monthlyMajor: 4.49,
      vcpu: "4 vCPU",
      ram: "6 GB",
      storage: "100 GB NVMe",
      bandwidth: "30 TB",
      featured: true,
      badge: "BEST VALUE",
    },
    {
      id: "namecheap",
      name: "Namecheap",
      mark: "N",
      logo: {
        src: "/images/competitors/namecheap.svg",
        alt: "Namecheap",
        tone: "orange",
      },
      plan: "Quasar",
      monthlyPrice: "$15.88/mo",
      monthlyMajor: 15.88,
      vcpu: "4 vCPU",
      ram: "6 GB",
      storage: "120 GB",
      bandwidth: "3 TB",
    },
    {
      id: "godaddy",
      name: "GoDaddy",
      mark: "G",
      logo: {
        src: "/images/competitors/godaddy.svg",
        alt: "GoDaddy",
        tone: "ink",
      },
      plan: "2 vCPU / 4 GB RAM",
      monthlyPrice: "$32.99/mo",
      monthlyMajor: 32.99,
      vcpu: "2 vCPU",
      ram: "4 GB",
      storage: "100 GB",
      bandwidth: "Unmetered",
    },
    {
      id: "hostingcom",
      name: "Hosting.com",
      mark: "H",
      logo: {
        src: "/images/competitors/hosting-com-logo.png",
        alt: "Hosting.com",
        tone: "plain",
      },
      plan: "VPS XS",
      monthlyPrice: "$15.99/mo",
      monthlyMajor: 15.99,
      vcpu: "2 vCPU",
      ram: "4 GB",
      storage: "80 GB",
      bandwidth: "Unmetered",
    },
  ] satisfies readonly CompareProvider[],
  metrics: [
    { key: "plan", label: "Plan" },
    { key: "price", label: "Monthly price" },
    { key: "vcpu", label: "vCPU cores" },
    { key: "ram", label: "RAM" },
    { key: "storage", label: "Storage" },
    { key: "bandwidth", label: "Bandwidth" },
    { key: "cheaper", label: "Cheaper than RunRacks" },
  ] satisfies readonly CompareMetric[],
  cheapestLabel: "Lowest price",
  notCheaperLabel: "No",
  savings: [
    {
      providerId: "namecheap",
      name: "Namecheap",
      logo: {
        src: "/images/competitors/namecheap.svg",
        alt: "Namecheap",
        tone: "orange",
      },
      amountLabel: "$137",
      note: "saved every year with RunRacks VPS 1",
    },
    {
      providerId: "godaddy",
      name: "GoDaddy",
      logo: {
        src: "/images/competitors/godaddy.svg",
        alt: "GoDaddy",
        tone: "ink",
      },
      amountLabel: "$342",
      note: "saved every year with RunRacks VPS 1",
    },
    {
      providerId: "hostingcom",
      name: "Hosting.com",
      logo: {
        src: "/images/competitors/hosting-com-logo.png",
        alt: "Hosting.com",
        tone: "plain",
      },
      amountLabel: "$138",
      note: "saved every year with RunRacks VPS 1",
    },
  ] satisfies readonly CompareSavings[],
} as const;

export function metricValue(
  provider: CompareProvider,
  key: CompareMetricKey,
): string {
  switch (key) {
    case "plan":
      return provider.plan;
    case "price":
      return provider.monthlyPrice;
    case "vcpu":
      return provider.vcpu;
    case "ram":
      return provider.ram;
    case "storage":
      return provider.storage;
    case "bandwidth":
      return provider.bandwidth;
    case "cheaper":
      return provider.featured
        ? VPS_COMPETITOR_COMPARE.cheapestLabel
        : VPS_COMPETITOR_COMPARE.notCheaperLabel;
  }
}
