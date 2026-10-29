"use client";

/**
 * Plans dock — same catalog cards as the pricing page.
 */
import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { VpsPlanList } from "@/features/vps-pricing/components/VpsPlanList";
import { DEFAULT_LOCATION_ID } from "@/features/vps-pricing/lib/urlState";
import type {
  VpsCatalogPayload,
  VpsFamily,
} from "@/features/vps-pricing/model/types";
import type { ApiSuccessBody } from "@/shared/lib/apiContracts";
import "@/features/vps-pricing/components/vps-plan-cards.css";

type AiPlansDockProps = {
  open: boolean;
  family: VpsFamily | null;
  onClose: () => void;
};

export function AiPlansDock({ open, family, onClose }: AiPlansDockProps) {
  const [catalog, setCatalog] = useState<VpsCatalogPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        if (!body.ok) {
          setError("Plans catalog is unavailable.");
          return;
        }
        setCatalog(body.data);
      })
      .catch(() => {
        if (!cancelled) setError("Plans catalog is unavailable.");
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const locationId = catalog?.regions.some((region) => region.id === DEFAULT_LOCATION_ID)
    ? DEFAULT_LOCATION_ID
    : (catalog?.regions[0]?.id ?? DEFAULT_LOCATION_ID);

  const plans = useMemo(() => {
    if (!catalog) return [];
    const wanted = family ?? "linux";
    const matched = catalog.plans.filter(
      (plan) =>
        plan.family === wanted && plan.availableRegionIds.includes(locationId),
    );
    return matched.length ? matched : catalog.plans;
  }, [catalog, family, locationId]);

  if (!open) return null;

  return (
    <aside className="aiDock" aria-label="Recommended plans">
      <div className="aiDockHead">
        <div>
          <h2 className="aiDockTitle">Plans</h2>
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

      {error ? <p className="aiDockSub">{error}</p> : null}

      {catalog ? (
        <div className="aiDockPlans">
          <VpsPlanList
            key={`${family ?? "linux"}:${locationId}`}
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
