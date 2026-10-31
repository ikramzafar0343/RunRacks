/**
 * Catalog region geometry for the Windows network map.
 * IDs must match VpsRegion.id from the VPS catalog.
 */
import type { WorldMapDot, WorldMapPoint } from "@/components/ui/map";
import type { VpsRegion } from "@/features/vps-pricing/model/types";

export type NetworkGroupId = "na" | "eu" | "apac";

export type NetworkPinMeta = {
  id: string;
  group: NetworkGroupId;
  lat: number;
  lng: number;
  /** Legacy SVG pin center (1000×500) — kept for reference. */
  x: number;
  y: number;
  labelX: number;
  labelY: number;
  textAnchor: "start" | "middle" | "end";
};

export const NETWORK_GROUP_LABELS: Record<NetworkGroupId, string> = {
  na: "North America",
  eu: "Europe",
  apac: "Asia & Pacific",
};

export const NETWORK_GROUP_ORDER: readonly NetworkGroupId[] = [
  "na",
  "eu",
  "apac",
];

/**
 * Pin geometry keyed by catalog region id.
 * lat/lng = primary hosting hub cities (not country centroids) for accurate globe markers.
 */
export const NETWORK_PIN_META: Record<string, NetworkPinMeta> = {
  us: {
    id: "us",
    group: "na",
    lat: 40.7128,
    lng: -74.006,
    x: 227,
    y: 148,
    labelX: 227,
    labelY: 128,
    textAnchor: "middle",
  },
  ca: {
    id: "ca",
    group: "na",
    lat: 43.6532,
    lng: -79.3832,
    x: 210,
    y: 105,
    labelX: 210,
    labelY: 86,
    textAnchor: "middle",
  },
  gb: {
    id: "gb",
    group: "eu",
    lat: 51.5074,
    lng: -0.1278,
    x: 488,
    y: 108,
    labelX: 468,
    labelY: 118,
    textAnchor: "end",
  },
  nl: {
    id: "nl",
    group: "eu",
    lat: 52.3676,
    lng: 4.9041,
    x: 508,
    y: 112,
    labelX: 508,
    labelY: 92,
    textAnchor: "middle",
  },
  de: {
    id: "de",
    group: "eu",
    lat: 50.1109,
    lng: 8.6821,
    x: 528,
    y: 118,
    labelX: 548,
    labelY: 128,
    textAnchor: "start",
  },
  sg: {
    id: "sg",
    group: "apac",
    lat: 1.3521,
    lng: 103.8198,
    x: 778,
    y: 268,
    labelX: 778,
    labelY: 292,
    textAnchor: "middle",
  },
  au: {
    id: "au",
    group: "apac",
    lat: -33.8688,
    lng: 151.2093,
    x: 868,
    y: 348,
    labelX: 868,
    labelY: 372,
    textAnchor: "middle",
  },
  jp: {
    id: "jp",
    group: "apac",
    lat: 35.6762,
    lng: 139.6503,
    x: 870,
    y: 158,
    labelX: 870,
    labelY: 182,
    textAnchor: "middle",
  },
};

/** Hub arcs for WorldMap (decorative; only include endpoints present in catalog). */
const NETWORK_ARC_PAIRS: readonly [string, string][] = [
  ["us", "ca"],
  ["us", "nl"],
  ["gb", "nl"],
  ["nl", "de"],
  ["gb", "sg"],
  ["sg", "au"],
  ["us", "au"],
  ["nl", "jp"],
  ["de", "jp"],
];

/** Label pixel nudges so close hubs don’t stack (viewBox 800×400). */
const LABEL_OFFSETS: Record<string, { dx: number; dy: number }> = {
  us: { dx: 10, dy: 22 },
  ca: { dx: -42, dy: -30 },
  gb: { dx: -62, dy: -24 },
  nl: { dx: 18, dy: -34 },
  de: { dx: 58, dy: 18 },
  sg: { dx: -8, dy: 26 },
  jp: { dx: 12, dy: -28 },
  au: { dx: 0, dy: 24 },
};

function pointForRegion(region: VpsRegion): WorldMapPoint | null {
  const meta = NETWORK_PIN_META[region.id];
  if (!meta) return null;
  const offset = LABEL_OFFSETS[region.id];
  return {
    lat: meta.lat,
    lng: meta.lng,
    label: region.name,
    flagCode: region.countryCode,
    ...(offset ? { labelDx: offset.dx, labelDy: offset.dy } : {}),
  };
}

export function pinMetaFor(regionId: string): NetworkPinMeta | undefined {
  return NETWORK_PIN_META[regionId];
}

export function groupForCountryCode(countryCode: string): NetworkGroupId {
  const cc = countryCode.toLowerCase();
  if (cc === "us" || cc === "ca" || cc === "mx") return "na";
  if (
    cc === "gb" ||
    cc === "nl" ||
    cc === "de" ||
    cc === "fr" ||
    cc === "ch" ||
    cc === "ie"
  ) {
    return "eu";
  }
  return "apac";
}

/** Every catalog region with pin geometry — drives the 8 labeled map markers. */
export function buildNetworkPoints(
  regions: readonly VpsRegion[],
): WorldMapPoint[] {
  const points: WorldMapPoint[] = [];
  for (const region of regions) {
    const point = pointForRegion(region);
    if (point) points.push(point);
  }
  return points;
}

export function buildNetworkDots(regions: readonly VpsRegion[]): WorldMapDot[] {
  const byId = new Map(regions.map((r) => [r.id, r]));
  const dots: WorldMapDot[] = [];

  for (const [startId, endId] of NETWORK_ARC_PAIRS) {
    const startRegion = byId.get(startId);
    const endRegion = byId.get(endId);
    if (!startRegion || !endRegion) continue;
    const start = pointForRegion(startRegion);
    const end = pointForRegion(endRegion);
    if (!start || !end) continue;
    dots.push({ start, end });
  }

  return dots;
}
