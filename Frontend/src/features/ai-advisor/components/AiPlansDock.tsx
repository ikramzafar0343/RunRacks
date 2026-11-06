"use client";

/**
 * Plans dock — same catalog cards as the pricing page.
 */
import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import {
  DEFAULT_LOCATION_ID,
  VpsPlanList,
  getDemoVpsCatalog,
  type VpsCatalogPayload,
  type VpsFamily,
} from "@/features/vps-pricing";
import type { ApiSuccessBody } from "@/shared/lib/apiContracts";

import "@/features/vps-pricing/components/vps-plan-cards.css";

type AiPlansDockProps = {
  open: boolean;
  family: VpsFamily | null;
  planIds: readonly string[] | null;
  onClose: () => void;
};

export function AiPlansDock({
  open,
  family,
  planIds,
  onClose,
}: AiPlansDockProps) {
  const [catalog, setCatalog] = useState<VpsCatalogPayload | null>(() =>
    getDemoVpsCatalog(),
  );

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetch("/api/v1/vps/catalog")
      .then((res) => res.json())
      .then((body: ApiSuccessBody<VpsCatalogPayload>) => {
        if (cancelled) return;
        if (!body.ok || !body.data) {
          setCatalog(getDemoVpsCatalog());
          return;
        }
        setCatalog(body.data);
      })
      .catch(() => {
        if (!cancelled) setCatalog(getDemoVpsCatalog());
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const locationId = catalog?.regions.some(
    (region) => region.id === DEFAULT_LOCATION_ID,
  )
    ? DEFAULT_LOCATION_ID
    : (catalog?.regions[0]?.id ?? DEFAULT_LOCATION_ID);

  const plans = useMemo(() => {
    if (!catalog) return [];
    if (planIds && planIds.length > 0) {
      const byId = new Map(catalog.plans.map((plan) => [plan.id, plan]));
      return planIds
        .map((id) => byId.get(id))
        .filter((plan): plan is NonNullable<typeof plan> => Boolean(plan));
    }
    const wanted = family ?? "linux";
    const familyPlans = catalog.plans.filter((plan) => plan.family === wanted);
    const inRegion = familyPlans.filter((plan) =>
      plan.availableRegionIds.includes(locationId),
    );
    return inRegion.length ? inRegion : familyPlans;
  }, [catalog, family, locationId, planIds]);

  if (!open) return null;

  return (
    <aside className="aiDock" aria-label="Recommended plans">
      <div className="aiDockHead">
        <div>
          <h2 className="aiDockTitle">
            {planIds && planIds.length > 2
              ? `Plans in budget (${plans.length})`
              : planIds && planIds.length > 0
                ? plans.map((plan) => plan.name).join(", ") || "Plans"
                : "Plans"}
          </h2>
          <p className="aiDockSub">{catalog?.notice ?? "Loading catalog…"}</p>
        </div>
        <button
          type="button"
          className="aiDialogClose"
          aria-label="Close plans"
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>

      {catalog ? (
        <div className="aiDockPlans">
          <VpsPlanList
            key={`${(planIds ?? []).join(",")}:${family ?? "linux"}:${locationId}`}
            plans={plans}
            term={1}
            locationId={locationId}
            checkoutConfigured={catalog.checkoutConfigured}
            layout="cards"
          />
        </div>
      ) : null}
    </aside>
  );
}
