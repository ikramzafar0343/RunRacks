/**
 * Shared inclusion lines from catalog plan details (no invented extras).
 */
import type {
  VpsCatalogPayload,
  VpsFamily,
} from "@/features/vps-pricing/model/types";

const PREFERRED_LABELS = [
  "Access",
  "Storage",
  "Network",
  "Operating systems",
  "Regions",
] as const;

export function getCatalogInclusions(
  catalog: VpsCatalogPayload,
  family: VpsFamily,
  fallback: readonly string[],
): string[] {
  const plans = catalog.plans.filter((p) => p.family === family);
  if (plans.length === 0) return [...fallback];

  const byLabel = new Map<string, string>();
  for (const plan of plans) {
    for (const d of plan.details) {
      if (!byLabel.has(d.label)) {
        byLabel.set(d.label, d.value);
      }
    }
  }

  const lines: string[] = [];
  for (const label of PREFERRED_LABELS) {
    const value = byLabel.get(label);
    if (value) {
      lines.push(`${label}: ${value}`);
    }
  }

  const sample = plans[0];
  if (sample) {
    lines.unshift(
      `Plan hardware starts at ${sample.vcpu} vCPU · ${sample.ramGb} GB RAM · ${sample.nvmeGb} GB NVMe (see each plan for full sizes)`,
    );
  }

  if (lines.length === 0) return [...fallback];
  return lines;
}
