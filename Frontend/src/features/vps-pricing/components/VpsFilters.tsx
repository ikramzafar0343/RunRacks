/**
 * Location buttons + billing-cycle segmented control.
 */
import { VpsLocationSelect } from "@/features/vps-pricing/components/VpsLocationSelect";
import type {
  BillingTermMonths,
  VpsRegion,
} from "@/features/vps-pricing/model/types";

const TERMS: Array<{ id: BillingTermMonths; label: string }> = [
  { id: 1, label: "Monthly" },
  { id: 3, label: "3 Months" },
  { id: 6, label: "6 Months" },
  { id: 12, label: "12 Months" },
];

type VpsFiltersProps = {
  regions: readonly VpsRegion[];
  locationId: string;
  term: BillingTermMonths;
  onLocationChange: (id: string) => void;
  onTermChange: (term: BillingTermMonths) => void;
};

export function VpsFilters({
  regions,
  locationId,
  term,
  onLocationChange,
  onTermChange,
}: VpsFiltersProps) {
  return (
    <div className="vpsFilterBottom">
      <VpsLocationSelect
        regions={regions}
        locationId={locationId}
        onLocationChange={onLocationChange}
      />

      <div
        className="vpsSegmented vpsBillingSegmented"
        role="group"
        aria-label="Billing cycle"
      >
        {TERMS.map((option) => {
          const active = option.id === term;
          return (
            <button
              key={option.id}
              type="button"
              className="vpsSegment vpsBillingSegment"
              data-term={String(option.id)}
              data-active={active ? "true" : "false"}
              aria-pressed={active}
              onClick={() => onTermChange(option.id)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
