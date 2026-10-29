/**
 * Expanded factual details for a VPS plan row — logos/flags where useful.
 */
import { VpsPlanDetailValue } from "@/features/vps-pricing/components/VpsPlanDetailValue";
import type { VpsPlan } from "@/features/vps-pricing/model/types";
import "@/features/vps-pricing/components/vps-plan-detail-icons.css";

type VpsPlanDetailsProps = {
  plan: VpsPlan;
  panelId: string;
  selectedLocationId?: string | null;
};

export function VpsPlanDetails({
  plan,
  panelId,
  selectedLocationId,
}: VpsPlanDetailsProps) {
  return (
    <div className="vpsPlanDetails" id={panelId}>
      <dl className="vpsPlanDetailsGrid">
        {plan.details.map((item) => (
          <div key={`${plan.id}-${item.label}`} className="vpsPlanDetailItem">
            <dt>
              {item.label.toLowerCase() === "regions" ? "Region" : item.label}
            </dt>
            <VpsPlanDetailValue
              item={item}
              family={plan.family}
              availableRegionIds={plan.availableRegionIds}
              selectedLocationId={selectedLocationId}
            />
          </div>
        ))}
      </dl>
    </div>
  );
}
