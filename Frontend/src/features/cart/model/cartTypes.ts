/**
 * Client cart lines — multi-server configure UI until live checkout exists.
 */
import type { BillingTermMonths, VpsFamily } from "@/features/vps-pricing";

/** Cart billing terms — matches customize + catalog (1 / 3 / 6 / 12). */
export type CartBillingTerm = BillingTermMonths;

/** Synthetic id for builds from /customize (not a catalog plan seed). */
export const CUSTOM_PLAN_PREFIX = "custom:";

export const MAX_CART_LINES = 10;

export type CartCustomSpec = {
  family: VpsFamily;
  label: string;
  vcpu: number;
  ramGb: number;
  nvmeGb: number;
  bandwidthTb: number;
  dedicatedIpv4: boolean;
  automatedBackups: boolean;
  monthlyMinor: number;
  termTotalMinor: number;
  currency: string;
};

export type CartLine = {
  id: string;
  planId: string;
  locationId: string;
  term: CartBillingTerm;
  osId: string;
  osVersion: string | null;
  appId: string | null;
  hostname: string;
  sshKey: string;
  coupon: string;
  /** Present when the line came from the customize configurator. */
  custom: CartCustomSpec | null;
};

export type CartState = {
  lines: CartLine[];
};

export const CART_STORAGE_KEY = "runracks.cart.v2";
export const CART_STORAGE_KEY_V1 = "runracks.cart.v1";

export const CART_FAMILIES: readonly {
  id: VpsFamily;
  label: string;
}[] = [
  { id: "linux", label: "Linux VPS" },
  { id: "windows", label: "Windows VPS" },
  { id: "windows-admin-rdp", label: "Admin RDP" },
] as const;

export function clampCartTerm(term: number): CartBillingTerm {
  if (term === 3) return 3;
  if (term === 6) return 6;
  if (term === 12) return 12;
  return 1;
}

export function isCustomPlanId(planId: string): boolean {
  return planId.startsWith(CUSTOM_PLAN_PREFIX);
}

export function customPlanId(family: VpsFamily): string {
  return `${CUSTOM_PLAN_PREFIX}${family}`;
}

export function createCartLineId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `line-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
