/**
 * Cart configure state — catalog load and edits. Payment stays unconnected.
 */
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  describeReadyCart,
  patchForCatalogPlan,
  patchForOs,
  patchForRegion,
  patchForServerType,
  patchForTerm,
} from "@/features/cart/lib/cartLineEdits";
import { plansForFamily } from "@/features/cart/lib/cartPlanHelpers";
import { useCart } from "@/features/cart/lib/CartProvider";
import type { CartBillingTerm } from "@/features/cart/model/cartTypes";
import {
  getAppOptions,
  getOsOptions,
} from "@/features/cart/model/provisionCatalog";
import { fetchVpsCatalog } from "@/features/vps-pricing/lib/fetchVpsCatalog";
import { selectPlanPrice } from "@/features/vps-pricing/lib/selectPlanPrice";
import type {
  VpsCatalogPayload,
  VpsFamily,
} from "@/features/vps-pricing/model/types";

export function useCartConfigure() {
  const { line, hydrated, updateLine, clearCart } = useCart();
  const [catalog, setCatalog] = useState<VpsCatalogPayload | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [planPickerOpen, setPlanPickerOpen] = useState(false);
  const [serversOpen, setServersOpen] = useState(true);
  const [couponOpen, setCouponOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchVpsCatalog()
      .then((data) => {
        if (!cancelled) setCatalog(data);
      })
      .catch(() => {
        if (!cancelled) setLoadError("Unable to load catalog plans.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const plan = useMemo(() => {
    if (!catalog || !line) return null;
    return catalog.plans.find((entry) => entry.id === line.planId) ?? null;
  }, [catalog, line]);

  const activeFamily: VpsFamily | null =
    plan?.family ?? line?.custom?.family ?? null;

  const region = useMemo(() => {
    if (!catalog || !line) return null;
    return (
      catalog.regions.find((entry) => entry.id === line.locationId) ??
      catalog.regions[0] ??
      null
    );
  }, [catalog, line]);

  const osList = useMemo(() => {
    if (!activeFamily) return [];
    const all = getOsOptions(activeFamily);
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((os) => os.name.toLowerCase().includes(q));
  }, [activeFamily, query]);

  const appList = useMemo(() => {
    if (!activeFamily) return [];
    const all = getAppOptions(activeFamily);
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((app) => app.name.toLowerCase().includes(q));
  }, [activeFamily, query]);

  const selectedOs = useMemo(() => {
    if (!activeFamily || !line) return null;
    return getOsOptions(activeFamily).find((os) => os.id === line.osId) ?? null;
  }, [activeFamily, line]);

  const price = useMemo(() => {
    if (!line) return null;
    if (line.custom) {
      return {
        monthlyEquivalentMinor: line.custom.monthlyMinor,
        amountMinor: line.custom.termTotalMinor,
        currency: line.custom.currency,
      };
    }
    if (!plan) return null;
    return selectPlanPrice(plan, line.term, line.locationId);
  }, [plan, line]);

  const peerPlans = useMemo(() => {
    if (!catalog || !activeFamily || !line) return [];
    return plansForFamily(catalog.plans, activeFamily).filter((entry) =>
      entry.availableRegionIds.includes(line.locationId),
    );
  }, [catalog, activeFamily, line]);

  function onRegionChange(locationId: string) {
    if (!catalog || !line || !activeFamily) return;
    const patch = patchForRegion(line, catalog.plans, locationId);
    if (patch) updateLine(patch);
  }

  function onServerTypeChange(family: VpsFamily) {
    if (!catalog || !line || !activeFamily || family === activeFamily) return;
    const patch =
      plan == null
        ? patchForServerType(line, catalog.plans, family)
        : patchForServerType(line, catalog.plans, family, plan.ramGb);
    if (!patch) return;
    updateLine(patch);
    setPlanPickerOpen(false);
  }

  function onSelectPlan(planId: string) {
    if (!catalog || !line) return;
    const patch = patchForCatalogPlan(catalog.plans, planId);
    if (!patch) return;
    updateLine(patch);
    setPlanPickerOpen(false);
  }

  function onSelectOs(osId: string) {
    if (!activeFamily) return;
    updateLine(patchForOs(activeFamily, osId));
  }

  function onTermChange(term: CartBillingTerm) {
    if (!line) return;
    updateLine(patchForTerm(line, term));
  }

  if (!hydrated) return { status: "loading" as const };
  if (!line || (!plan && !line.custom) || !activeFamily) {
    return { status: "empty" as const };
  }

  const copy = describeReadyCart({
    line,
    plan,
    activeFamily,
    selectedOsName: selectedOs?.name ?? null,
    price,
    catalogNotice: catalog?.notice ?? "",
  });

  return {
    status: "ready" as const,
    line,
    plan,
    regions: catalog?.regions ?? [],
    region,
    osList,
    appList,
    selectedOs,
    query,
    setQuery,
    planPickerOpen,
    serversOpen,
    couponOpen,
    loadError,
    peerPlans,
    activeFamily,
    ...copy,
    onRegionChange,
    onServerTypeChange,
    onSelectPlan,
    onSelectOs,
    onTermChange,
    updateLine,
    clearCart,
    togglePlanPicker: () => setPlanPickerOpen((open) => !open),
    toggleServers: () => setServersOpen((open) => !open),
    toggleCoupon: () => setCouponOpen((open) => !open),
  };
}

export type CartConfigureModel = ReturnType<typeof useCartConfigure>;
export type CartConfigureReady = Extract<
  CartConfigureModel,
  { status: "ready" }
>;
