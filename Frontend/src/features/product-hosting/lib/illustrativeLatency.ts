/**
 * Illustrative per-region latency (not measured RTT).
 * Baselines stay under 100; ticks drift / jump then clamp to 35–99.
 */

const BASE_MIN = 45;
const BASE_MAX = 92;
const CLAMP_MIN = 35;
const CLAMP_MAX = 99;

function hashRegionId(regionId: string): number {
  let h = 2166136261;
  for (let i = 0; i < regionId.length; i += 1) {
    h ^= regionId.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Stable seed reading for a catalog region id (45–92). */
export function baselineMs(regionId: string): number {
  const span = BASE_MAX - BASE_MIN + 1;
  return BASE_MIN + (hashRegionId(regionId) % span);
}

function clampMs(n: number): number {
  return Math.min(CLAMP_MAX, Math.max(CLAMP_MIN, Math.round(n)));
}

/**
 * Next illustrative reading: usually ±1–3, sometimes a larger ±8–18 jump.
 */
export function nextMs(current: number): number {
  const jump = Math.random() < 0.22;
  const delta = jump
    ? (Math.random() < 0.5 ? -1 : 1) * (8 + Math.floor(Math.random() * 11))
    : (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(Math.random() * 3));
  return clampMs(current + delta);
}
