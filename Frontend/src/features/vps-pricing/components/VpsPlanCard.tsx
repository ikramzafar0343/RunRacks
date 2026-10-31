/**
 * Hostinger-style VPS plan card — demo catalog; checkout stays disabled.
 */
import { Cpu, HardDrive, MemoryStick, type LucideIcon } from "lucide-react";
import { VpsPlanDetailContent } from "@/features/vps-pricing/components/VpsPlanDetailValue";
import { VpsPlanTierArt } from "@/features/vps-pricing/components/VpsPlanTierArt";
import {
  billingNoteForTerm,
  formatMoneyMinor,
} from "@/features/vps-pricing/model/formatPrice";
import { planTierFromPlan } from "@/features/vps-pricing/model/planTier";
import { selectPlanPrice } from "@/features/vps-pricing/lib/selectPlanPrice";
import type {
  BillingTermMonths,
  VpsPlan,
} from "@/features/vps-pricing/model/types";
import "@/features/vps-pricing/components/vps-plan-detail-icons.css";

const HARDWARE_ICONS = {
  vcpu: Cpu,
  ram: MemoryStick,
  nvme: HardDrive,
} as const satisfies Record<string, LucideIcon>;

type VpsPlanCardProps = {
  plan: VpsPlan;
  term: BillingTermMonths;
  locationId: string | null;
  checkoutConfigured: boolean;
  selected: boolean;
  onSelect: (planId: string) => void;
};

export function VpsPlanCard({
  plan,
  term,
  locationId,
  checkoutConfigured,
  selected,
  onSelect,
}: VpsPlanCardProps) {
  const price = selectPlanPrice(plan, term, locationId);
  const displayMinor =
    price?.monthlyEquivalentMinor ?? price?.amountMinor ?? null;
  const amountLabel =
    displayMinor != null && price
      ? formatMoneyMinor(displayMinor, price.currency)
      : "—";
  const compareAt = price?.compareAtMonthlyMinor;
  const showCompare =
    compareAt != null &&
    displayMinor != null &&
    price != null &&
    compareAt > displayMinor;
  const compareLabel =
    showCompare && price ? formatMoneyMinor(compareAt, price.currency) : null;

  const hardware: Array<{
    key: keyof typeof HARDWARE_ICONS;
    label: string;
    Icon: LucideIcon;
  }> = [
    {
      key: "vcpu",
      label: `${plan.vcpu} vCPU`,
      Icon: HARDWARE_ICONS.vcpu,
    },
    {
      key: "ram",
      label: `${plan.ramGb} GB RAM`,
      Icon: HARDWARE_ICONS.ram,
    },
    {
      key: "nvme",
      label: `${plan.nvmeGb} GB NVMe`,
      Icon: HARDWARE_ICONS.nvme,
    },
  ];

  const canCheckout = checkoutConfigured && plan.purchasable;

  return (
    <article
      className="vpsPlanTile"
      data-featured={selected ? "true" : "false"}
      aria-current={selected ? "true" : undefined}
      onClick={() => onSelect(plan.id)}
    >
      {plan.badge ? (
        <span className="vpsPlanTileBadge">{plan.badge}</span>
      ) : null}

      <div className="vpsPlanTileHead">
        <div className="vpsPlanTileArt" aria-hidden="true">
          <VpsPlanTierArt tier={planTierFromPlan(plan)} family={plan.family} />
        </div>
        <h3 className="vpsPlanTileName">{plan.name}</h3>
        {plan.tagline ? (
          <p className="vpsPlanTileTagline">
            {plan.tagline.split("|").map((line) => (
              <span key={line} className="vpsPlanTileTaglineLine">
                {line.trim()}
              </span>
            ))}
          </p>
        ) : null}
      </div>

      <div className="vpsPlanTilePrice">
        {compareLabel ? (
          <p className="vpsPlanTileCompare">{compareLabel}</p>
        ) : null}
        <p className="vpsPlanTileAmount">
          {amountLabel}
          {displayMinor != null ? (
            <span className="vpsPlanTilePeriod">/mo</span>
          ) : null}
        </p>
      </div>

      <button
        type="button"
        className="vpsPlanTileCta"
        aria-pressed={selected}
        title={
          canCheckout ? "Choose plan" : "Select plan · checkout not configured"
        }
        onClick={(event) => {
          event.stopPropagation();
          onSelect(plan.id);
        }}
      >
        Choose plan
      </button>

      <p className="vpsPlanTileBilling">
        {billingNoteForTerm(term)}
        {term !== 1 && price ? (
          <> · Total {formatMoneyMinor(price.amountMinor, price.currency)}</>
        ) : null}
      </p>

      <ul className="vpsPlanTileFeatures">
        {hardware.map(({ key, label, Icon }) => (
          <li key={key} className="vpsPlanTileFeature vpsPlanTileFeatureHardware">
            <Icon
              className="vpsPlanTileHardwareIcon"
              aria-hidden
              size={18}
              strokeWidth={2.25}
            />
            <span>{label}</span>
          </li>
        ))}
        {plan.details.map((item) => (
          <li
            key={`${plan.id}-${item.label}`}
            className="vpsPlanTileFeature vpsPlanTileFeatureDetail"
          >
            <span className="vpsPlanTileDetailLine">
              <VpsPlanDetailContent
                item={item}
                family={plan.family}
                availableRegionIds={plan.availableRegionIds}
                selectedLocationId={locationId}
              />
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}
