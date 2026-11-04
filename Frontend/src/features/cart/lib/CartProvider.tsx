/**
 * Client cart context — multi-line configure cart until live checkout exists.
 */
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  MAX_CART_LINES,
  clampCartTerm,
  createCartLineId,
  customPlanId,
  type CartCustomSpec,
  type CartLine,
} from "@/features/cart/model/cartTypes";
import { defaultProvisionForFamily } from "@/features/cart/model/provisionCatalog";
import {
  commitCartLines,
  getCartServerSnapshot,
  getCartSnapshot,
  subscribeCart,
} from "@/features/cart/lib/cartStore";
import type { BillingTermMonths, VpsFamily } from "@/features/vps-pricing/model/types";

type SeedCartInput = {
  planId: string;
  locationId: string;
  term: BillingTermMonths;
  family?: VpsFamily;
};

type SeedCustomizeInput = {
  locationId: string;
  term: BillingTermMonths;
  custom: CartCustomSpec;
};

export type CartAddResult =
  | { ok: true; line: CartLine }
  | { ok: false; reason: "full" };

type CartContextValue = {
  lines: CartLine[];
  /** First line — convenience for single-line callers. */
  line: CartLine | null;
  itemCount: number;
  hydrated: boolean;
  addFromPlan: (input: SeedCartInput) => CartAddResult;
  addFromCustomize: (input: SeedCustomizeInput) => CartAddResult;
  /** @deprecated Prefer addFromPlan — appends, does not replace. */
  seedFromPlan: (input: SeedCartInput) => CartAddResult;
  /** @deprecated Prefer addFromCustomize — appends, does not replace. */
  seedFromCustomize: (input: SeedCustomizeInput) => CartAddResult;
  updateLine: (id: string, patch: Partial<Omit<CartLine, "id">>) => void;
  removeLine: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function emptyProvision(family?: VpsFamily) {
  return family
    ? defaultProvisionForFamily(family)
    : {
        osId: "",
        osVersion: null as string | null,
        appId: null as string | null,
      };
}

const hydrateSubscribe = () => () => {};
const hydrateClient = () => true;
const hydrateServer = () => false;

function useCartHydrated(): boolean {
  return useSyncExternalStore(hydrateSubscribe, hydrateClient, hydrateServer);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const lines = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getCartServerSnapshot,
  );
  const hydrated = useCartHydrated();

  const addFromPlan = useCallback((input: SeedCartInput): CartAddResult => {
    const prev = getCartSnapshot();
    if (prev.length >= MAX_CART_LINES) return { ok: false, reason: "full" };
    const provision = emptyProvision(input.family);
    const line: CartLine = {
      id: createCartLineId(),
      planId: input.planId,
      locationId: input.locationId || "us",
      term: clampCartTerm(input.term),
      osId: provision.osId,
      osVersion: provision.osVersion,
      appId: provision.appId,
      hostname: "",
      sshKey: "",
      coupon: "",
      custom: null,
    };
    commitCartLines([...prev, line]);
    return { ok: true, line };
  }, []);

  const addFromCustomize = useCallback(
    (input: SeedCustomizeInput): CartAddResult => {
      const prev = getCartSnapshot();
      if (prev.length >= MAX_CART_LINES) return { ok: false, reason: "full" };
      const provision = defaultProvisionForFamily(input.custom.family);
      const line: CartLine = {
        id: createCartLineId(),
        planId: customPlanId(input.custom.family),
        locationId: input.locationId || "us",
        term: clampCartTerm(input.term),
        osId: provision.osId,
        osVersion: provision.osVersion,
        appId: provision.appId,
        hostname: "",
        sshKey: "",
        coupon: "",
        custom: input.custom,
      };
      commitCartLines([...prev, line]);
      return { ok: true, line };
    },
    [],
  );

  const updateLine = useCallback(
    (id: string, patch: Partial<Omit<CartLine, "id">>) => {
      const prev = getCartSnapshot();
      const next = prev.map((entry) =>
        entry.id === id ? { ...entry, ...patch, id: entry.id } : entry,
      );
      commitCartLines(next);
    },
    [],
  );

  const removeLine = useCallback((id: string) => {
    commitCartLines(getCartSnapshot().filter((entry) => entry.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    commitCartLines([]);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      line: lines[0] ?? null,
      itemCount: lines.length,
      hydrated,
      addFromPlan,
      addFromCustomize,
      seedFromPlan: addFromPlan,
      seedFromCustomize: addFromCustomize,
      updateLine,
      removeLine,
      clearCart,
    }),
    [
      lines,
      hydrated,
      addFromPlan,
      addFromCustomize,
      updateLine,
      removeLine,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
