/**
 * Cart configure state — multi-line catalog load and edits.
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
import {
  linePrice,
  resolveCartPlan,
  summarizeCartLines,
} from "@/features/cart/lib/cartLinePricing";
import { plansForFamily } from "@/features/cart/lib/cartPlanHelpers";
import { useCart } from "@/features/cart/lib/CartProvider";
import type {
  CartBillingTerm,
  CartLine,
} from "@/features/cart/model/cartTypes";
import {
  getAppOptions,
  getOsOptions,
} from "@/features/cart/model/provisionCatalog";
import { fetchVpsCatalog } from "@/features/vps-pricing";
import { selectPlanPrice } from "@/features/vps-pricing";
import { formatMoneyMinor } from "@/features/vps-pricing";
import type { VpsCatalogPayload, VpsFamily } from "@/features/vps-pricing";

export type { CartLineSummary } from "@/features/cart/lib/cartLinePricing";

export function useCartConfigure() {
  const { lines, hydrated, updateLine, removeLine, clearCart } = useCart();
  const [catalog, setCatalog] = useState<VpsCatalogPayload | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeLineId, setActiveLineId] = useState<string | null>(null);
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

  const readyLines = useMemo(() => {
    return lines.filter((entry) => {
      if (entry.custom) return true;
      if (!catalog) return true;
      return catalog.plans.some((plan) => plan.id === entry.planId);
    });
  }, [lines, catalog]);

  const line =
    readyLines.find((entry) => entry.id === activeLineId) ??
    readyLines[0] ??
    null;

  const plan = useMemo(() => resolveCartPlan(catalog, line), [catalog, line]);
  const activeFamily: VpsFamily | null =
    plan?.family ?? line?.custom?.family ?? null;

  const lineSummaries = useMemo(
    () => summarizeCartLines(readyLines, catalog),
    [readyLines, catalog],
  );

  const cartTotals = useMemo(() => {
    const currency = lineSummaries[0]?.currency ?? "USD";
    let monthly = 0;
    let termTotal = 0;
    for (const entry of readyLines) {
      const priced = linePrice(entry, catalog);
      if (!priced) continue;
      monthly += priced.monthly;
      termTotal += priced.termTotal;
    }
    return {
      currency,
      monthlyLabel: formatMoneyMinor(monthly, currency),
      termTotalLabel: formatMoneyMinor(termTotal, currency),
      setupLabel: formatMoneyMinor(0, currency),
      count: lineSummaries.length,
    };
  }, [lineSummaries, readyLines, catalog]);

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
    return q ? all.filter((os) => os.name.toLowerCase().includes(q)) : all;
  }, [activeFamily, query]);

  const appList = useMemo(() => {
    if (!activeFamily) return [];
    const all = getAppOptions(activeFamily);
    const q = query.trim().toLowerCase();
    return q ? all.filter((app) => app.name.toLowerCase().includes(q)) : all;
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

  function patchActive(patch: Partial<Omit<CartLine, "id">>) {
    if (!line) return;
    updateLine(line.id, patch);
  }

  function onRegionChange(locationId: string) {
    if (!catalog || !line || !activeFamily) return;
    const patch = patchForRegion(line, catalog.plans, locationId);
    if (patch) patchActive(patch);
  }

  function onServerTypeChange(family: VpsFamily) {
    if (!catalog || !line || !activeFamily || family === activeFamily) return;
    const patch =
      plan == null
        ? patchForServerType(line, catalog.plans, family)
        : patchForServerType(line, catalog.plans, family, plan.ramGb);
    if (!patch) return;
    patchActive(patch);
    setPlanPickerOpen(false);
  }

  function onSelectPlan(planId: string) {
    if (!catalog || !line) return;
    const patch = patchForCatalogPlan(catalog.plans, planId);
    if (!patch) return;
    patchActive(patch);
    setPlanPickerOpen(false);
  }

  function onSelectOs(osId: string) {
    if (!activeFamily) return;
    patchActive(patchForOs(activeFamily, osId));
  }

  function onTermChange(term: CartBillingTerm) {
    if (!line) return;
    patchActive(patchForTerm(line, term));
  }

  if (!hydrated) return { status: "loading" as const, loadError: null };
  if (
    readyLines.length === 0 ||
    !line ||
    (!plan && !line.custom) ||
    !activeFamily
  ) {
    return { status: "empty" as const, loadError };
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
    lines: readyLines,
    lineSummaries,
    cartTotals,
    activeLineId: line.id,
    setActiveLineId,
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
    updateLine: patchActive,
    removeLine,
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
