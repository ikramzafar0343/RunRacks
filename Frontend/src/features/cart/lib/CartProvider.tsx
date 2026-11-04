/**
 * Client cart context — single-line configure cart until live checkout exists.
 */
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CART_STORAGE_KEY,
  clampCartTerm,
  customPlanId,
  type CartCustomSpec,
  type CartLine,
} from "@/features/cart/model/cartTypes";
import { defaultProvisionForFamily } from "@/features/cart/model/provisionCatalog";
import { readCartState, writeCartState } from "@/features/cart/lib/cartStorage";
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

type CartContextValue = {
  line: CartLine | null;
  itemCount: number;
  hydrated: boolean;
  seedFromPlan: (input: SeedCartInput) => void;
  seedFromCustomize: (input: SeedCustomizeInput) => void;
  updateLine: (patch: Partial<CartLine>) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function emptyProvision(family?: VpsFamily) {
  return family
    ? defaultProvisionForFamily(family)
    : { osId: "", osVersion: null as string | null, appId: null as string | null };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [line, setLine] = useState<CartLine | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLine(readCartState().line);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeCartState({ line });
  }, [line, hydrated]);

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key !== CART_STORAGE_KEY) return;
      setLine(readCartState().line);
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const seedFromPlan = useCallback((input: SeedCartInput) => {
    const provision = emptyProvision(input.family);
    setLine({
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
    });
  }, []);

  const seedFromCustomize = useCallback((input: SeedCustomizeInput) => {
    const provision = defaultProvisionForFamily(input.custom.family);
    setLine({
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
    });
  }, []);

  const updateLine = useCallback((patch: Partial<CartLine>) => {
    setLine((prev) => {
      if (!prev) return prev;
      return { ...prev, ...patch };
    });
  }, []);

  const clearCart = useCallback(() => {
    setLine(null);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      line,
      itemCount: line ? 1 : 0,
      hydrated,
      seedFromPlan,
      seedFromCustomize,
      updateLine,
      clearCart,
    }),
    [line, hydrated, seedFromPlan, seedFromCustomize, updateLine, clearCart],
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
