/**
 * Checkout order summary. Place order stays disabled until billing is connected.
 */
import Link from "next/link";
import type { Route } from "next";
import {
  HiChevronDown,
  HiInformationCircle,
  HiLockClosed,
  HiShieldCheck,
} from "react-icons/hi2";
import {
  CART_PAYMENT_MARKS,
  cartFamilyIcon,
} from "@/features/cart/components/cartProvisionIcons";
import { familyLabel } from "@/features/cart/lib/cartPlanHelpers";
import { checkoutTermTitle } from "@/features/checkout/components/checkoutConstants";
import type { CheckoutReady } from "@/features/checkout/components/useCheckoutForm";
import { DEMO_PRICING_ANSWER } from "@/shared/content/demoPricingCopy";

export function CheckoutOrderSummary({ form }: { form: CheckoutReady }) {
  const { line } = form;
  return (
    <aside className="checkoutCard" aria-labelledby="co-summary-title">
      <div className="checkoutSummaryHead">
        <h2 id="co-summary-title">Order summary</h2>
        <Link href={"/cart" as Route} className="checkoutLinkBtn">
          Edit Cart
        </Link>
      </div>

      <div className="checkoutSummaryBlock">
        <button
          type="button"
          className="checkoutSummaryToggle"
          aria-expanded={form.serversOpen}
          onClick={form.toggleServers}
        >
          <span>Servers (1)</span>
          <HiChevronDown size={16} aria-hidden />
        </button>
        {form.serversOpen ? (
          <div className="checkoutProductRow">
            <span className="checkoutProductIcon" aria-hidden>
              {cartFamilyIcon(form.activeFamily, 16)}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="checkoutSummaryLine" style={{ marginTop: 0 }}>
                <span>
                  {form.productName}
                  <span className="checkoutSummaryMuted">
                    {" "}
                    · {familyLabel(form.activeFamily)}
                    {line.custom ? " · Custom" : ""}
                  </span>
                </span>
                <span>{form.amountLabel}</span>
              </div>
              <div className="checkoutSummaryLine checkoutSummaryMuted">
                <span>{checkoutTermTitle(line.term)} Billing</span>
                <span>{form.amountLabel}/mo</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="checkoutSetupFee">
        <span>Setup fee</span>
        <span>{form.setupLabel}</span>
      </div>

      <div className="checkoutSummaryBlock">
        <button
          type="button"
          className="checkoutSummaryToggle"
          aria-expanded={form.couponOpen}
          onClick={form.toggleCoupon}
        >
          <span>Have a coupon code?</span>
          <HiChevronDown size={16} aria-hidden />
        </button>
        {form.couponOpen ? (
          <input
            className="checkoutInput"
            style={{ marginTop: "0.45rem" }}
            value={line.coupon}
            placeholder="Coupon code"
            onChange={(event) =>
              form.updateLine({ coupon: event.target.value })
            }
            aria-label="Coupon code"
            autoComplete="off"
          />
        ) : null}
      </div>

      <div className="checkoutSummaryLine" style={{ marginTop: "0.85rem" }}>
        <span>Subtotal</span>
        <span>{form.amountLabel}</span>
      </div>
      <div className="checkoutSummaryLine checkoutSummaryMuted">
        <span>
          Taxes{" "}
          <HiInformationCircle
            size={12}
            style={{ display: "inline", verticalAlign: "-1px" }}
            aria-hidden
          />
        </span>
        <span>Shown after you sign in</span>
      </div>

      <div className="checkoutTotalRow">
        <span>Total due today</span>
        <strong>{form.termTotalLabel}</strong>
      </div>
      <p className="checkoutHint">
        Billed in your account currency when you sign in. {DEMO_PRICING_ANSWER}
      </p>

      <button
        type="button"
        className="checkoutPayBtn"
        disabled
        title="Checkout payment and account systems are not configured"
      >
        <HiLockClosed size={15} aria-hidden />
        Place order · {form.termTotalLabel}
      </button>
      <p className="checkoutSignInNote">
        Sign in or create your account to place the order. Payment stays
        disabled until billing is connected.
      </p>

      <div className="checkoutGuarantee">
        <HiShieldCheck size={18} aria-hidden />
        <div>
          <h3>30-Day Money Back Guarantee</h3>
          <p>On hosting. Domain fees are non-refundable.</p>
        </div>
      </div>

      <div className="checkoutAccept">
        <p className="checkoutAcceptLabel">We accept</p>
        <ul className="checkoutPayMarks">
          {CART_PAYMENT_MARKS.map(({ id, label, Icon, color }) => (
            <li key={id} className="checkoutPayMark">
              <Icon size={28} color={color} style={{ color }} aria-hidden />
              <span className="sr-only">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
