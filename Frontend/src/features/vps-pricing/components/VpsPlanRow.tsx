/**
 * Single VPS plan row: summary, expand, price, disabled cart CTA.
 * Client boundary is VpsPlanList (parent).
 */
import { HiMinus, HiPlus, HiOutlineShoppingBag } from "react-icons/hi2";
import { VpsPlanDetails } from "@/features/vps-pricing/components/VpsPlanDetails";
import {
  billingNoteForTerm,
  formatMoneyMinor,
} from "@/features/vps-pricing/model/formatPrice";
import { selectPlanPrice } from "@/features/vps-pricing/lib/selectPlanPrice";
import type {
  BillingTermMonths,
  VpsPlan,
} from "@/features/vps-pricing/model/types";

type VpsPlanRowProps = {
  plan: VpsPlan;
  term: BillingTermMonths;
  locationId: string | null;
  expanded: boolean;
  onToggle: () => void;
  checkoutConfigured: boolean;
};

export function VpsPlanRow({
  plan,
  term,
  locationId,
  expanded,
  onToggle,
  checkoutConfigured,
}: VpsPlanRowProps) {
  const price = selectPlanPrice(plan, term, locationId);
  const panelId = `vps-details-${plan.id}`;
  const displayMinor =
    price?.monthlyEquivalentMinor ?? price?.amountMinor ?? null;
  const amountLabel =
    displayMinor != null && price
      ? formatMoneyMinor(displayMinor, price.currency)
      : "—";

  return (
    <article className="vpsPlanCard">
      <div className="vpsPlanSummary">
        <button
          type="button"
          className="vpsExpandBtn"
          aria-expanded={expanded}
          aria-controls={panelId}
          aria-label={
            expanded ? `Collapse ${plan.name}` : `Expand ${plan.name}`
          }
          onClick={onToggle}
        >
          {expanded ? (
            <HiMinus size={14} aria-hidden />
          ) : (
            <HiPlus size={14} aria-hidden />
          )}
        </button>

        <h3 className="vpsPlanName">{plan.name}</h3>

        <p className="vpsPlanStat">
          <strong>{plan.vcpu}</strong> <span>vCPU</span>
        </p>
        <p className="vpsPlanStat">
          <strong>{plan.ramGb} GB</strong> <span>RAM</span>
        </p>
        <p className="vpsPlanStat">
          <strong>{plan.nvmeGb} GB</strong> <span>NVMe</span>
        </p>

        <div className="vpsPlanPrice">
          {price?.isStartingPrice ? (
            <span className="vpsPriceFrom">From</span>
          ) : null}
          <p className="vpsPriceAmount">
            {amountLabel}
            {displayMinor != null ? (
              <span className="vpsPricePeriod">/mo</span>
            ) : null}
          </p>
          <p className="vpsPriceNote">{billingNoteForTerm(term)}</p>
          {term !== 1 && price ? (
            <p className="vpsPriceTotal">
              Total {formatMoneyMinor(price.amountMinor, price.currency)}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          className="vpsCartButton"
          disabled={!checkoutConfigured || !plan.purchasable}
          title={checkoutConfigured ? "Add to cart" : "Checkout not configured"}
        >
          <HiOutlineShoppingBag size={15} aria-hidden />
          Add to cart
        </button>
      </div>

      {expanded ? (
        <VpsPlanDetails
          plan={plan}
          panelId={panelId}
          selectedLocationId={locationId}
        />
      ) : null}
    </article>
  );
}
