import type { VpsFamily } from "@/features/vps-pricing/model/types";

export type PlanSpec = {
  name: string;
  supported: boolean;
  version: string;
};

export type FeatureRow = {
  feature: string;
  /** When true, render Check/X beside the value. */
  showIcon?: boolean;
  linux: PlanSpec[];
  windows: PlanSpec[];
  adminRdp: PlanSpec[];
};

export type ComparisonFamilyKey = "linux" | "windows" | "adminRdp";

export const L_NAMES = ["VPS 1", "VPS 2", "VPS 3", "VPS 4", "VPS 5", "VPS 6"];
export const W_NAMES = [
  "Win VPS 1",
  "Win VPS 3",
  "Win VPS 5",
  "Win VPS 7",
  "Win VPS 9",
  "Win VPS 11",
];
export const R_NAMES = [
  "Admin RDP 1",
  "Admin RDP 3",
  "Admin RDP 5",
  "Admin RDP 7",
  "Admin RDP 9",
  "Admin RDP 11",
];

export type SpecTuple = [boolean, string];

export function toSpecs(names: string[], specs: SpecTuple[]): PlanSpec[] {
  return names.map((name, i) => ({
    name,
    supported: specs[i]?.[0] ?? true,
    version: specs[i]?.[1] ?? "",
  }));
}

export function comparisonRow(
  feature: string,
  l: SpecTuple[],
  w: SpecTuple[],
  rdp: SpecTuple[],
  showIcon = false,
): FeatureRow {
  return {
    feature,
    showIcon,
    linux: toSpecs(L_NAMES, l),
    windows: toSpecs(W_NAMES, w),
    adminRdp: toSpecs(R_NAMES, rdp),
  };
}

/** Map URL family id to comparison row key. */
export function comparisonKeyForFamily(family: VpsFamily): ComparisonFamilyKey {
  if (family === "windows") return "windows";
  if (family === "windows-admin-rdp") return "adminRdp";
  return "linux";
}

export function plansForFamily(row: FeatureRow, family: VpsFamily): PlanSpec[] {
  return row[comparisonKeyForFamily(family)];
}

export const FAMILY_META: Record<
  ComparisonFamilyKey,
  { label: string; accent: "linux" | "windows" | "rdp" }
> = {
  linux: { label: "Linux VPS", accent: "linux" },
  windows: { label: "Windows VPS", accent: "windows" },
  adminRdp: { label: "Admin RDP", accent: "rdp" },
};
