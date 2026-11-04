/**
 * localStorage persistence for multi-line client cart (v2 + v1 migrate).
 */
import {
  CART_STORAGE_KEY,
  CART_STORAGE_KEY_V1,
  clampCartTerm,
  createCartLineId,
  type CartCustomSpec,
  type CartLine,
  type CartState,
} from "@/features/cart/model/cartTypes";
import type { VpsFamily } from "@/features/vps-pricing/model/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseCustom(raw: unknown): CartCustomSpec | null {
  if (!isRecord(raw)) return null;
  const family = raw.family;
  if (
    family !== "linux" &&
    family !== "windows" &&
    family !== "windows-admin-rdp"
  ) {
    return null;
  }
  if (typeof raw.label !== "string" || !raw.label) return null;
  const vcpu = Number(raw.vcpu);
  const ramGb = Number(raw.ramGb);
  const nvmeGb = Number(raw.nvmeGb);
  const bandwidthTb = Number(raw.bandwidthTb);
  const monthlyMinor = Number(raw.monthlyMinor);
  const termTotalMinor = Number(raw.termTotalMinor);
  if (
    ![vcpu, ramGb, nvmeGb, bandwidthTb, monthlyMinor, termTotalMinor].every(
      (n) => Number.isFinite(n),
    )
  ) {
    return null;
  }
  return {
    family: family as VpsFamily,
    label: raw.label,
    vcpu,
    ramGb,
    nvmeGb,
    bandwidthTb,
    dedicatedIpv4: Boolean(raw.dedicatedIpv4),
    automatedBackups: Boolean(raw.automatedBackups),
    monthlyMinor,
    termTotalMinor,
    currency: typeof raw.currency === "string" ? raw.currency : "USD",
  };
}

function parseLine(raw: unknown): CartLine | null {
  if (!isRecord(raw)) return null;
  if (typeof raw.planId !== "string" || !raw.planId) return null;
  if (typeof raw.locationId !== "string" || !raw.locationId) return null;
  const term = clampCartTerm(Number(raw.term) || 1);
  return {
    id: typeof raw.id === "string" && raw.id ? raw.id : createCartLineId(),
    planId: raw.planId,
    locationId: raw.locationId,
    term,
    osId: typeof raw.osId === "string" ? raw.osId : "",
    osVersion: typeof raw.osVersion === "string" ? raw.osVersion : null,
    appId: typeof raw.appId === "string" ? raw.appId : null,
    hostname: typeof raw.hostname === "string" ? raw.hostname : "",
    sshKey: typeof raw.sshKey === "string" ? raw.sshKey : "",
    coupon: typeof raw.coupon === "string" ? raw.coupon : "",
    custom: parseCustom(raw.custom),
  };
}

function emptyState(): CartState {
  return { lines: [] };
}

function migrateV1(): CartState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY_V1);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return null;
    const line = parseLine(parsed.line);
    window.localStorage.removeItem(CART_STORAGE_KEY_V1);
    return { lines: line ? [line] : [] };
  } catch {
    return null;
  }
}

export function readCartState(): CartState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      const migrated = migrateV1();
      if (migrated) {
        writeCartState(migrated);
        return migrated;
      }
      return emptyState();
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return emptyState();
    if (Array.isArray(parsed.lines)) {
      return {
        lines: parsed.lines
          .map((entry) => parseLine(entry))
          .filter((entry): entry is CartLine => entry != null),
      };
    }
    /* accidental v1 shape under v2 key */
    const line = parseLine(parsed.line);
    return { lines: line ? [line] : [] };
  } catch {
    return emptyState();
  }
}

export function writeCartState(state: CartState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota / private mode — ignore */
  }
}
