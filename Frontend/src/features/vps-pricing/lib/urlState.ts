/**
 * Parse / serialize VPS filter URL query params.
 */
import type {
  BillingTermMonths,
  VpsFamily,
} from "@/features/vps-pricing/model/types";

const FAMILIES: readonly VpsFamily[] = [
  "linux",
  "windows",
  "windows-admin-rdp",
];

const TERMS: readonly BillingTermMonths[] = [1, 3, 6, 12];

/** Default location when none is in the URL. */
export const DEFAULT_LOCATION_ID = "us";

export function parseFamily(raw: string | null): VpsFamily {
  if (raw && (FAMILIES as readonly string[]).includes(raw)) {
    return raw as VpsFamily;
  }
  return "linux";
}

/**
 * Product routes lock hosting family (tabs hidden). Ready for Admin RDP page.
 * Home / pricing keep family tabs.
 */
export function lockedFamilyFromPath(pathname: string): VpsFamily | null {
  if (
    pathname === "/products/windows-admin-rdp" ||
    pathname === "/products/admin-rdp" ||
    pathname === "/products/admin-rdp-usa"
  ) {
    return "windows-admin-rdp";
  }
  if (
    pathname === "/products/windows" ||
    pathname === "/products/windows-usa"
  ) {
    return "windows";
  }
  if (pathname === "/products/vps" || pathname === "/products/vps-usa") {
    return "linux";
  }
  return null;
}

export function parseTerm(raw: string | null): BillingTermMonths {
  const n = Number(raw);
  if ((TERMS as readonly number[]).includes(n)) {
    return n as BillingTermMonths;
  }
  return 1;
}

export function parseLocation(raw: string | null): string {
  if (!raw || raw.length === 0) return DEFAULT_LOCATION_ID;
  return raw;
}

export function buildVpsSearchParams(input: {
  family: VpsFamily;
  locationId: string;
  term: BillingTermMonths;
  /** When family is locked by product route, omit `family` from the query. */
  omitFamily?: boolean;
}): URLSearchParams {
  const params = new URLSearchParams();
  if (!input.omitFamily && input.family !== "linux") {
    params.set("family", input.family);
  }
  if (input.locationId !== DEFAULT_LOCATION_ID) {
    params.set("location", input.locationId);
  }
  if (input.term !== 1) params.set("term", String(input.term));
  return params;
}
