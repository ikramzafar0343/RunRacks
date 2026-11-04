/**
 * Cart order summary — multi-line totals; billing stays demo until connected.
 */
import Link from "next/link";
import type { Route } from "next";
import { HiChevronDown, HiLockClosed, HiShieldCheck } from "react-icons/hi2";
import { CART_PAYMENT_MARKS } from "@/features/cart/components/cartProvisionIcons";
import type { CartConfigureReady } from "@/features/cart/components/useCartConfigure";
import { cartTermTitle } from "@/features/cart/lib/cartLineEdits";
import { DEMO_PRICING_ANSWER } from "@/shared/content/demoPricingCopy";

type CartOrderSummaryProps = {
  cart: CartConfigureReady;
  onCouponHint: () => void;
};

export function CartOrderSummary({
  cart,
  onCouponHint,
}: CartOrderSummaryProps) {
  const { line, cartTotals, lineSummaries } = cart;
  return (
    <aside className="cartCard" aria-labelledby="cart-summary-title">
      <div className="cartSummaryHead">
        <h2 id="cart-summary-title">Order summary</h2>
        <Link href="/pricing" className="cartLinkBtn">
          Add plan
        </Link>
      </div>

      <div className="cartSummaryBlock">
        <button
          type="button"
          className="cartSummaryToggle"
          aria-expanded={cart.serversOpen}
          onClick={cart.toggleServers}
        >
          <span>Servers ({cartTotals.count})</span>
          <HiChevronDown size={16} aria-hidden />
        </button>
        {cart.serversOpen ? (
          <>
            {lineSummaries.map((row) => (
              <div key={row.id} className="cartSummaryLine">
                <span>{row.name}</span>
                <span>{row.amountLabel}</span>
              </div>
            ))}
            <div className="cartSummaryLine cartSummaryMuted">
              <span>Active: {cartTermTitle(line.term)} billing</span>
              <span>{cart.amountLabel}/mo</span>
            </div>
          </>
        ) : null}
      </div>

      <div className="cartSetupFee">
        <span>Setup fee</span>
        <span>{cartTotals.setupLabel}</span>
      </div>

      <div className="cartSummaryBlock">
        <button
          type="button"
          className="cartSummaryToggle"
          aria-expanded={cart.couponOpen}
          onClick={() => {
            cart.toggleCoupon();
            if (!cart.couponOpen) onCouponHint();
          }}
        >
          <span>Have a coupon code?</span>
          <HiChevronDown size={16} aria-hidden />
        </button>
        {cart.couponOpen ? (
          <input
            className="cartInput"
            style={{ marginTop: "0.45rem" }}
            value={line.coupon}
            placeholder="Coupon code"
            onChange={(event) =>
              cart.updateLine({ coupon: event.target.value })
            }
            aria-label="Coupon code"
          />
        ) : null}
      </div>

      <div className="cartSummaryLine" style={{ marginTop: "0.85rem" }}>
        <span>Subtotal</span>
        <span>{cartTotals.monthlyLabel}</span>
      </div>
      <div className="cartSummaryLine cartSummaryMuted">
        <span>Taxes</span>
        <span>Calculated when checkout is connected</span>
      </div>

      <div className="cartTotalRow">
        <span>Total due today</span>
        <strong>{cartTotals.termTotalLabel}</strong>
      </div>
      <p className="cartHelper">
        Billed in your account currency when you sign in. {DEMO_PRICING_ANSWER}
      </p>

      <Link
        href={"/checkout" as Route}
        className="cartPayBtn cartPayBtnLink"
        title="Continue to review — payment provider is not configured yet"
      >
        <HiLockClosed size={15} aria-hidden />
        Continue to Payment
      </Link>

      <div className="cartGuarantee">
        <HiShieldCheck size={18} aria-hidden />
        <div>
          <h3>30-Day Money Back Guarantee</h3>
          <p>
            Demo policy label for the configure UI — live refund terms apply
            when checkout is connected.
          </p>
        </div>
      </div>

      <div className="cartAccept">
        <p className="cartAcceptLabel">We accept</p>
        <ul className="cartPayMarks">
          {CART_PAYMENT_MARKS.map(({ id, label, Icon, color }) => (
            <li key={id} className="cartPayMark">
              <Icon size={28} color={color} style={{ color }} aria-hidden />
              <span className="sr-only">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
