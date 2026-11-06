/**
 * Billing term cards on the cart configure page.
 */
import { termSavePercent } from "@/features/cart/lib/cartPlanHelpers";
import { CART_TERMS, cartTermTitle } from "@/features/cart/lib/cartLineEdits";
import type { CartConfigureReady } from "@/features/cart/components/useCartConfigure";
import { calculateCustomizePrice } from "@/features/customize";
import { selectPlanPrice } from "@/features/vps-pricing";
import { billingNoteForTerm, formatMoneyMinor } from "@/features/vps-pricing";

export function CartBillingTerms({ cart }: { cart: CartConfigureReady }) {
  const { line, plan } = cart;
  return (
    <>
      <p className="cartFieldLabel">Billing term</p>
      <div className="cartBillingGrid">
        {CART_TERMS.map((term) => {
          const customTermPrice = line.custom
            ? calculateCustomizePrice({
                family: line.custom.family,
                regionId: line.locationId,
                billingTermMonths: term,
                vcpu: line.custom.vcpu,
                ramGb: line.custom.ramGb,
                nvmeGb: line.custom.nvmeGb,
                bandwidthTb: line.custom.bandwidthTb,
                dedicatedIpv4: line.custom.dedicatedIpv4,
                automatedBackups: line.custom.automatedBackups,
              })
            : null;
          const termPrice = plan
            ? selectPlanPrice(plan, term, line.locationId)
            : null;
          const termMinor = customTermPrice
            ? customTermPrice.monthlyMinor
            : (termPrice?.monthlyEquivalentMinor ??
              termPrice?.amountMinor ??
              null);
          const termCurrency =
            customTermPrice?.currency ?? termPrice?.currency ?? "USD";
          const termLabel =
            termMinor != null ? formatMoneyMinor(termMinor, termCurrency) : "—";
          const save = plan
            ? termSavePercent(plan, term, line.locationId)
            : null;
          return (
            <button
              key={term}
              type="button"
              className="cartBillingCard"
              data-active={line.term === term ? "true" : "false"}
              onClick={() => cart.onTermChange(term)}
            >
              <p className="cartBillingTitle">
                {cartTermTitle(term)}
                {line.term === term ? " ✓" : ""}
              </p>
              {term === 1 ? (
                <span className="cartChoiceMeta">Pay monthly</span>
              ) : save != null ? (
                <span className="cartBillingSave">Save {save}%</span>
              ) : null}
              <p className="cartBillingPrice">{termLabel}/mo</p>
            </button>
          );
        })}
      </div>
      <p className="cartBillingNote">
        {cart.termTotalLabel} today for {cartTermTitle(line.term)}.{" "}
        {billingNoteForTerm(line.term)}. Demo catalog — cancel anytime once live
        billing exists.
      </p>
    </>
  );
}
