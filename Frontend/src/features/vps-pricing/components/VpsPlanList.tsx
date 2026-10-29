/**
 * Filtered plan list — rows (home) or Hostinger-style card slider (page).
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { VpsPlanCard } from "@/features/vps-pricing/components/VpsPlanCard";
import { VpsPlanRow } from "@/features/vps-pricing/components/VpsPlanRow";
import type {
  BillingTermMonths,
  VpsPlan,
} from "@/features/vps-pricing/model/types";

type PlanLayout = "rows" | "cards";

const INITIAL_ROWS = 5;
const INITIAL_CARDS = 3;

function defaultSelectedId(plans: readonly VpsPlan[]): string | null {
  return plans.find((plan) => plan.featured)?.id ?? plans[0]?.id ?? null;
}

type VpsPlanListProps = {
  plans: readonly VpsPlan[];
  term: BillingTermMonths;
  locationId: string | null;
  checkoutConfigured: boolean;
  layout?: PlanLayout;
};

export function VpsPlanList({
  plans,
  term,
  locationId,
  checkoutConfigured,
  layout = "rows",
}: VpsPlanListProps) {
  const [showAll, setShowAll] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(() =>
    defaultSelectedId(plans),
  );
  const plansKey = plans.map((plan) => plan.id).join("|");
  const [boundPlansKey, setBoundPlansKey] = useState(plansKey);
  const cardTrackRef = useRef<HTMLUListElement>(null);

  if (plansKey !== boundPlansKey) {
    setBoundPlansKey(plansKey);
    setSelectedId(defaultSelectedId(plans));
    setShowAll(false);
  }

  useEffect(() => {
    cardTrackRef.current?.scrollTo({ left: 0 });
  }, [boundPlansKey]);

  const initial = layout === "cards" ? INITIAL_CARDS : INITIAL_ROWS;
  const visible = showAll ? plans : plans.slice(0, initial);
  const canToggle = plans.length > initial;
  const activeSelectedId =
    selectedId && plans.some((plan) => plan.id === selectedId)
      ? selectedId
      : defaultSelectedId(plans);

  function onToggleShowAll() {
    const next = !showAll;
    setShowAll(next);
    if (!next) {
      setExpandedId(null);
      cardTrackRef.current?.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    requestAnimationFrame(() => {
      const track = cardTrackRef.current;
      if (!track || track.scrollWidth <= track.clientWidth) return;
      const step = track.clientWidth * 0.85;
      track.scrollBy({ left: step, behavior: "smooth" });
    });
  }

  if (plans.length === 0) {
    return (
      <div className="vpsPlanList">
        <p className="vpsEmpty" role="status">
          No plans match this location and billing cycle.
        </p>
      </div>
    );
  }

  return (
    <div className="vpsPlanList" data-layout={layout}>
      {layout === "cards" ? (
        <ul
          ref={cardTrackRef}
          className="vpsPlanCardGrid"
          data-expanded={showAll ? "true" : "false"}
        >
          {visible.map((plan) => (
            <li key={plan.id}>
              <VpsPlanCard
                plan={plan}
                term={term}
                locationId={locationId}
                checkoutConfigured={checkoutConfigured}
                selected={plan.id === activeSelectedId}
                onSelect={setSelectedId}
              />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="vpsPlanStack">
          {visible.map((plan) => (
            <li key={plan.id}>
              <VpsPlanRow
                plan={plan}
                term={term}
                locationId={locationId}
                expanded={expandedId === plan.id}
                onToggle={() =>
                  setExpandedId((prev) => (prev === plan.id ? null : plan.id))
                }
                checkoutConfigured={checkoutConfigured}
              />
            </li>
          ))}
        </ul>
      )}

      {canToggle ? (
        <div className="vpsShowAllWrap">
          <button
            type="button"
            className="vpsShowAllBtn"
            onClick={() => {
              if (layout === "cards") {
                onToggleShowAll();
                return;
              }
              setShowAll((prev) => !prev);
              if (showAll) setExpandedId(null);
            }}
          >
            {showAll ? "See fewer plans" : "See all plans"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
