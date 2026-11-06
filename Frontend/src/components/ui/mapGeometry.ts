/**
 * WorldMap geometry — equirectangular fallback + explicit mapX/mapY pins.
 */
import { MAP_PROJECTION } from "./mapProjection";
import type { WorldMapPoint } from "./mapTypes";

/**
 * Project WGS84 → SVG viewBox using the same eqc bounds as dotted-map.
 * Prefer resolveMapPoint() when catalog hubs supply mapX/mapY.
 */
export function projectPoint(lat: number, lng: number) {
  const {
    mapWidth,
    mapHeight,
    xMin,
    yMax,
    xRange,
    yRange,
    viewBoxWidth,
    viewBoxHeight,
  } = MAP_PROJECTION;

  // proj4 equirectangular (eqc): x = R·λ, y = R·φ (R = 6378137).
  const R = 6378137;
  const mercX = R * ((lng * Math.PI) / 180);
  const mercY = R * ((lat * Math.PI) / 180);

  const rawX = (mapWidth * (mercX - xMin)) / xRange;
  const rawY = (mapHeight * (yMax - mercY)) / yRange;

  return {
    x: (rawX / mapWidth) * viewBoxWidth,
    y: (rawY / mapHeight) * viewBoxHeight,
  };
}

/** Prefer baked viewBox coords for catalog hubs; fall back to lat/lng projection. */
export function resolveMapPoint(point: WorldMapPoint): {
  x: number;
  y: number;
} {
  if (point.mapX !== undefined && point.mapY !== undefined) {
    return { x: point.mapX, y: point.mapY };
  }
  return projectPoint(point.lat, point.lng);
}

export function createCurvedPath(
  start: { x: number; y: number },
  end: { x: number; y: number },
) {
  const midX = (start.x + end.x) / 2;
  const midY = Math.min(start.y, end.y) - 50;
  return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
}
