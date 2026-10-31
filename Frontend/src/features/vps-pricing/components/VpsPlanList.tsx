/**
 * Filtered plan list — rows (home) or Hostinger-style card grid (page).
 * All matching plans render at once (no “See all” truncation).
 */
"use client";

import { useState } from "react";
import { VpsPlanCard } from "@/features/vps-pricing/components/VpsPlanCard";
import { VpsPlanRow } from "@/features/vps-pricing/components/VpsPlanRow";
import type {
  BillingTermMonths,
  VpsPlan,
} from "@/features/vps-pricing/model/types";

type PlanLayout = "rows" | "cards";

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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(() =>
    defaultSelectedId(plans),
  );
  const plansKey = plans.map((plan) => plan.id).join("|");
  const [boundPlansKey, setBoundPlansKey] = useState(plansKey);

  if (plansKey !== boundPlansKey) {
    setBoundPlansKey(plansKey);
    setSelectedId(defaultSelectedId(plans));
    setExpandedId(null);
  }

  const activeSelectedId =
    selectedId && plans.some((plan) => plan.id === selectedId)
      ? selectedId
      : defaultSelectedId(plans);

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
        <ul className="vpsPlanCardGrid">
          {plans.map((plan) => (
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
          {plans.map((plan) => (
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
    </div>
  );
}
