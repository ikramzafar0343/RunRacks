/**
 * Merge WorldMap arc endpoints + extra pins into a unique labeled set.
 */
import { resolveMapPoint } from "./mapGeometry";
import type { WorldMapDot, WorldMapPoint } from "./mapTypes";

export function mergeMapPoints(
  dots: readonly WorldMapDot[],
  extraPoints: readonly WorldMapPoint[],
): WorldMapPoint[] {
  const byKey = new Map<string, WorldMapPoint>();
  const merge = (point: WorldMapPoint) => {
    const pos = resolveMapPoint(point);
    const key =
      point.mapX !== undefined && point.mapY !== undefined
        ? `xy:${point.mapX.toFixed(1)},${point.mapY.toFixed(1)}`
        : `ll:${point.lat.toFixed(2)},${point.lng.toFixed(2)}`;
    const prev = byKey.get(key);
    if (!prev) {
      byKey.set(key, point);
      return;
    }
    const next: WorldMapPoint = { lat: point.lat, lng: point.lng };
    const label = point.label ?? prev.label;
    const flagCode = point.flagCode ?? prev.flagCode;
    const labelDx = point.labelDx ?? prev.labelDx;
    const labelDy = point.labelDy ?? prev.labelDy;
    next.mapX = point.mapX ?? prev.mapX ?? pos.x;
    next.mapY = point.mapY ?? prev.mapY ?? pos.y;
    if (label !== undefined) next.label = label;
    if (flagCode !== undefined) next.flagCode = flagCode;
    if (labelDx !== undefined) next.labelDx = labelDx;
    if (labelDy !== undefined) next.labelDy = labelDy;
    byKey.set(key, next);
  };
  for (const point of extraPoints) merge(point);
  for (const dot of dots) {
    merge(dot.start);
    merge(dot.end);
  }
  return [...byKey.values()];
}
