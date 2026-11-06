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
import { CART_PAYMENT_MARKS, cartFamilyIcon } from "@/features/cart";
import { checkoutTermTitle } from "@/features/checkout/components/checkoutConstants";
import type { CheckoutReady } from "@/features/checkout/components/useCheckoutForm";
import { DEMO_PRICING_ANSWER } from "@/shared/content/demoPricingCopy";

type CheckoutOrderSummaryProps = {
  form: CheckoutReady;
  onCouponHint: () => void;
  onPlaceOrderAttempt: () => void;
};

export function CheckoutOrderSummary({
  form,
  onCouponHint,
  onPlaceOrderAttempt,
}: CheckoutOrderSummaryProps) {
  const couponValue = form.line.coupon;
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
          <span>Servers ({form.serverCount})</span>
          <HiChevronDown size={16} aria-hidden />
        </button>
        {form.serversOpen
          ? form.lineRows.map((row) => (
              <div key={row.id} className="checkoutProductRow">
                <span className="checkoutProductIcon" aria-hidden>
                  {cartFamilyIcon(row.family, 16)}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="checkoutSummaryLine" style={{ marginTop: 0 }}>
                    <span>
                      {row.name}
                      <span className="checkoutSummaryMuted">
                        {" "}
                        · {row.familyLabel}
                        {row.isCustom ? " · Custom" : ""}
                      </span>
                    </span>
                    <span>{row.amountLabel}</span>
                  </div>
                  <div className="checkoutSummaryLine checkoutSummaryMuted">
                    <span>{checkoutTermTitle(row.term)} Billing</span>
                    <span>{row.amountLabel}/mo</span>
                  </div>
                </div>
              </div>
            ))
          : null}
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
          onClick={() => {
            form.toggleCoupon();
            if (!form.couponOpen) onCouponHint();
          }}
        >
          <span>Have a coupon code?</span>
          <HiChevronDown size={16} aria-hidden />
        </button>
        {form.couponOpen ? (
          <input
            className="checkoutInput"
            style={{ marginTop: "0.45rem" }}
            value={couponValue}
            placeholder="Coupon code"
            onChange={(event) => form.updateCoupon(event.target.value)}
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
        onClick={onPlaceOrderAttempt}
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
