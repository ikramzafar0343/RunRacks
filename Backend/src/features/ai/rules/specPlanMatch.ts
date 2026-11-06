/**
 * Parse + clamp hardware specs for Customize quotes (not catalog nearest-match).
 * Slider limits mirror Frontend CUSTOMIZE.sliders.
 */
import type { CustomizeFamily } from "../pack/customizeQuote.js";

export type HardwareSpecNeed = {
  vcpu: number | null;
  ramGb: number | null;
  nvmeGb: number | null;
  bandwidthTb: number | null;
};

export type ClampedCustomizeSpecs = {
  family: CustomizeFamily | null;
  vcpu: number;
  ramGb: number;
  nvmeGb: number;
  bandwidthTb: number;
  clamps: string[];
  missing: Array<"vcpu" | "ramGb" | "nvmeGb" | "bandwidthTb">;
};

/** Same ranges as Frontend customizeContent CUSTOMIZE.sliders. */
export const CUSTOMIZE_RANGES = {
  vcpu: { min: 1, max: 24, step: 1 },
  ramGb: { min: 1, max: 64, step: 1 },
  nvmeGb: { min: 20, max: 1280, step: 20 },
  bandwidthTb: { min: 1, max: 20, step: 1 },
} as const;

function firstNum(matching: string, patterns: RegExp[]): number | null {
  for (const re of patterns) {
    const hit = matching.match(re);
    if (hit?.[1]) {
      const n = Number.parseFloat(hit[1]);
      if (Number.isFinite(n) && n > 0) return Math.round(n);
    }
  }
  return null;
}

/** Parse hardware needs — prefer “cpu is 1” / labeled lists over bare digit-before-word. */
export function parseHardwareSpecs(matching: string): HardwareSpecNeed | null {
  const m = matching.toLowerCase().replace(/\s+/g, " ").trim();

  const vcpu = firstNum(m, [
    /(?:^|\b)(?:v\s*)?cpus?(?:\s*cores?)?\s*(?:is|:|=)?\s*(\d+(?:\.\d+)?)/,
    /(?:^|\b)cores?\s*(?:is|:|=)?\s*(\d+(?:\.\d+)?)/,
    /(\d+(?:\.\d+)?)\s*(?:v\s*)?cpus?(?:\s*cores?)?\b/,
    /(\d+(?:\.\d+)?)\s*cores?\b/,
  ]);

  const ramGb = firstNum(m, [
    /(?:^|\b)(?:ram|memory)\s*(?:is|:|=)?\s*(\d+(?:\.\d+)?)/,
    /(\d+(?:\.\d+)?)\s*(?:gb|g)\s*(?:of\s+)?(?:ram|memory)\b/,
  ]);

  const nvmeGb = firstNum(m, [
    /(?:^|\b)(?:nvme(?:\s*ssd)?|ssd|storage|disk)\s*(?:is|:|=)?\s*(\d+(?:\.\d+)?)/,
    /(\d+(?:\.\d+)?)\s*(?:gb|g)\s*(?:nvme|ssd|storage|disk)\b/,
    /(\d+(?:\.\d+)?)\s*(?:nvme|ssd)\b/,
  ]);

  const bandwidthTb = firstNum(m, [
    /(?:^|\b)(?:bandwidth|traffic|transfer)\s*(?:is|:|=)?\s*(\d+(?:\.\d+)?)/,
    /(\d+(?:\.\d+)?)\s*(?:tb|t)\s*(?:bandwidth|traffic|transfer|data)?\b/,
    /(\d+(?:\.\d+)?)\s*(?:bandwidth|traffic)\b/,
  ]);

  const need: HardwareSpecNeed = { vcpu, ramGb, nvmeGb, bandwidthTb };
  if (
    need.vcpu == null &&
    need.ramGb == null &&
    need.nvmeGb == null &&
    need.bandwidthTb == null
  ) {
    return null;
  }
  return need;
}

/** Null unless the user named Linux, Windows, or Admin RDP. */
export function detectCustomizeFamily(
  matching: string,
): CustomizeFamily | null {
  const m = matching.toLowerCase();
  if (/admin rdp|\brdp\b/.test(m)) return "windows-admin-rdp";
  if (/\bwindows\b/.test(m)) return "windows";
  if (/\blinux\b/.test(m)) return "linux";
  return null;
}

export function isSpecBuildQuery(matching: string): boolean {
  const m = matching.toLowerCase();
  const hasSpecWord =
    /\b(cpu|v\s*cpu|cores?|ram|memory|nvme|ssd|storage|disk|bandwidth|traffic)\b/.test(
      m,
    );
  const wantsBuild =
    /\b(create|build|make|need|want|suggest|recommend|find|show|size|configure|custom)\b/.test(
      m,
    ) ||
    /\bplan for me\b/.test(m) ||
    /\bthese (?:specs|numbers|requirements)\b/.test(m);
  const need = parseHardwareSpecs(m);
  const filled = need
    ? [need.vcpu, need.ramGb, need.nvmeGb, need.bandwidthTb].filter(
        (n) => n != null,
      ).length
    : 0;
  if (!hasSpecWord) return false;
  if (wantsBuild) return true;
  return filled >= 2;
}

function clampStepped(
  value: number,
  min: number,
  max: number,
  step: number,
): number {
  const capped = Math.min(max, Math.max(min, value));
  const steps = Math.round((capped - min) / step);
  return Math.min(max, min + steps * step);
}

export function clampToCustomizeRanges(
  need: HardwareSpecNeed,
  family: CustomizeFamily | null,
): ClampedCustomizeSpecs {
  const missing: ClampedCustomizeSpecs["missing"] = [];
  const clamps: string[] = [];

  let vcpu = need.vcpu;
  let ramGb = need.ramGb;
  let nvmeGb = need.nvmeGb;
  let bandwidthTb = need.bandwidthTb;

  if (vcpu == null) missing.push("vcpu");
  else {
    const next = clampStepped(
      vcpu,
      CUSTOMIZE_RANGES.vcpu.min,
      CUSTOMIZE_RANGES.vcpu.max,
      CUSTOMIZE_RANGES.vcpu.step,
    );
    if (next !== vcpu) clamps.push(`vCPU ${vcpu} → ${next} (Customize range)`);
    vcpu = next;
  }

  if (ramGb == null) missing.push("ramGb");
  else {
    const next = clampStepped(
      ramGb,
      CUSTOMIZE_RANGES.ramGb.min,
      CUSTOMIZE_RANGES.ramGb.max,
      CUSTOMIZE_RANGES.ramGb.step,
    );
    if (next !== ramGb) clamps.push(`RAM ${ramGb} GB → ${next} GB`);
    ramGb = next;
  }

  if (nvmeGb == null) missing.push("nvmeGb");
  else {
    const next = clampStepped(
      nvmeGb,
      CUSTOMIZE_RANGES.nvmeGb.min,
      CUSTOMIZE_RANGES.nvmeGb.max,
      CUSTOMIZE_RANGES.nvmeGb.step,
    );
    if (next !== nvmeGb) {
      clamps.push(`NVMe ${nvmeGb} GB → ${next} GB (Customize step/range)`);
    }
    nvmeGb = next;
  }

  if (bandwidthTb == null) missing.push("bandwidthTb");
  else {
    const next = clampStepped(
      bandwidthTb,
      CUSTOMIZE_RANGES.bandwidthTb.min,
      CUSTOMIZE_RANGES.bandwidthTb.max,
      CUSTOMIZE_RANGES.bandwidthTb.step,
    );
    if (next !== bandwidthTb) {
      clamps.push(
        `Bandwidth ${bandwidthTb} TB → ${next} TB (Customize max ${CUSTOMIZE_RANGES.bandwidthTb.max} TB)`,
      );
    }
    bandwidthTb = next;
  }

  return {
    family,
    vcpu: vcpu ?? CUSTOMIZE_RANGES.vcpu.min,
    ramGb: ramGb ?? CUSTOMIZE_RANGES.ramGb.min,
    nvmeGb: nvmeGb ?? CUSTOMIZE_RANGES.nvmeGb.min,
    bandwidthTb: bandwidthTb ?? CUSTOMIZE_RANGES.bandwidthTb.min,
    clamps,
    missing,
  };
}

export function describeNeed(need: HardwareSpecNeed): string {
  const parts: string[] = [];
  if (need.vcpu != null) parts.push(`${need.vcpu} vCPU`);
  if (need.ramGb != null) parts.push(`${need.ramGb} GB RAM`);
  if (need.nvmeGb != null) parts.push(`${need.nvmeGb} GB NVMe`);
  if (need.bandwidthTb != null) parts.push(`${need.bandwidthTb} TB bandwidth`);
  return parts.join(", ");
}

export function customizeDeepLink(specs: {
  family: CustomizeFamily;
  vcpu: number;
  ramGb: number;
  nvmeGb: number;
  bandwidthTb: number;
  regionId?: string | null;
  billingTermMonths?: 1 | 3 | 6 | 12 | null;
}): string {
  const q = new URLSearchParams({
    family: specs.family,
    vcpu: String(specs.vcpu),
    ram: String(specs.ramGb),
    nvme: String(specs.nvmeGb),
    bw: String(specs.bandwidthTb),
  });
  if (specs.regionId) q.set("region", specs.regionId);
  if (specs.billingTermMonths) q.set("term", String(specs.billingTermMonths));
  return `/customize?${q.toString()}`;
}
