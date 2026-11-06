/**
 * Country-to-datacenter routing recommendations for optimal latency.
 * RunRacks has 8 tier-3/4 datacenter regions: US, CA, UK, NL, DE, SG, AU, JP.
 */

export type LocationRouting = {
  countryName: string;
  recommendedDatacenters: string;
  reason: string;
  adviceText: string;
};

const LOCATION_MAP: Record<
  string,
  { name: string; datacenters: string; reason: string }
> = {
  pakistan: {
    name: "Pakistan",
    datacenters: "Singapore (SG) or Germany (Frankfurt, DE)",
    reason:
      "optimal submarine cable routing and lowest round-trip latency to South Asia",
  },
  pk: {
    name: "Pakistan",
    datacenters: "Singapore (SG) or Germany (Frankfurt, DE)",
    reason:
      "optimal submarine cable routing and lowest round-trip latency to South Asia",
  },
  india: {
    name: "India",
    datacenters: "Singapore (SG) or Germany (Frankfurt, DE)",
    reason: "direct fiber routing and minimal network latency to India",
  },
  bangladesh: {
    name: "Bangladesh",
    datacenters: "Singapore (SG)",
    reason: "direct connectivity across the Bay of Bengal for low ping",
  },
  usa: {
    name: "United States",
    datacenters: "United States (US) or Canada (CA)",
    reason: "domestic tier-1 backbone connectivity across North America",
  },
  "united states": {
    name: "United States",
    datacenters: "United States (US) or Canada (CA)",
    reason: "domestic tier-1 backbone connectivity across North America",
  },
  canada: {
    name: "Canada",
    datacenters: "Canada (CA) or United States (US)",
    reason: "direct low-latency North American peering",
  },
  uk: {
    name: "United Kingdom",
    datacenters: "United Kingdom (London, UK) or Netherlands (NL)",
    reason: "ultra-low latency LINX peering across the UK and Europe",
  },
  "united kingdom": {
    name: "United Kingdom",
    datacenters: "United Kingdom (London, UK) or Netherlands (NL)",
    reason: "ultra-low latency LINX peering across the UK and Europe",
  },
  germany: {
    name: "Germany",
    datacenters: "Germany (Frankfurt, DE) or Netherlands (Amsterdam, NL)",
    reason: "direct DE-CIX fiber connections with sub-10ms response times",
  },
  netherlands: {
    name: "Netherlands",
    datacenters: "Netherlands (Amsterdam, NL) or Germany (DE)",
    reason: "AMS-IX interconnection for European speed and throughput",
  },
  australia: {
    name: "Australia",
    datacenters: "Australia (Sydney, AU)",
    reason: "direct domestic Australian routing without overseas hops",
  },
  japan: {
    name: "Japan",
    datacenters: "Japan (Tokyo, JP) or Singapore (SG)",
    reason: "high-speed Asian backbone connectivity",
  },
  singapore: {
    name: "Singapore",
    datacenters: "Singapore (SG)",
    reason: "local presence at Singapore's primary Internet exchange",
  },
  uae: {
    name: "United Arab Emirates",
    datacenters: "Singapore (SG) or Germany (DE)",
    reason: "best Middle Eastern transit routes and peering",
  },
};

/** Longest known country/region mention in a sentence. */
export function matchLocationQuery(text: string): string | null {
  const matching = text.toLowerCase();
  const keys = Object.keys(LOCATION_MAP).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`(?:^|\\s)${escaped}(?:\\s|$)`).test(matching)) return key;
  }
  return null;
}

export function getDatacenterAdvice(
  locationQuery: string | null | undefined,
): LocationRouting | null {
  if (!locationQuery) return null;
  const key = locationQuery.trim().toLowerCase();

  const matchedKey = Object.keys(LOCATION_MAP).find(
    (k) => key === k || key.includes(k),
  );

  if (!matchedKey) return null;
  const target = LOCATION_MAP[matchedKey]!;

  return {
    countryName: target.name,
    recommendedDatacenters: target.datacenters,
    reason: target.reason,
    adviceText: `For users in or connecting to ${target.name}, we recommend choosing ${target.datacenters} for ${target.reason}.`,
  };
}

