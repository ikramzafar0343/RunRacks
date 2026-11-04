/**
 * Payment method layout. Place-order stays disabled; nothing is charged.
 */
import Link from "next/link";
import type { Route } from "next";
import {
  FaCcAmex,
  FaCcMastercard,
  FaCcPaypal,
  FaCcVisa,
  FaUniversity,
} from "react-icons/fa";
import { CheckoutCardFields } from "@/features/checkout/components/CheckoutCardFields";
import { PAYMENT_DEMO_NOTICE } from "@/features/checkout/components/checkoutConstants";
import type { CheckoutReady } from "@/features/checkout/components/useCheckoutForm";

function TermsAgreement({ form }: { form: CheckoutReady }) {
  return (
    <label className="checkoutTerms">
      <input
        type="checkbox"
        checked={form.termsAccepted}
        onChange={(event) => form.setTermsAccepted(event.target.checked)}
      />
      <span>
        I agree to the <Link href={"/terms" as Route}>Terms of Service</Link>{" "}
        and <Link href={"/refund" as Route}>Refund Policy</Link>
      </span>
    </label>
  );
}

export function CheckoutPaymentPanel({ form }: { form: CheckoutReady }) {
  if (form.stage !== "payment") {
    return (
      <section className="checkoutCard" aria-labelledby="co-pay-title">
        <div className="checkoutCardHead">
          <span className="checkoutCardIndex" aria-hidden>
            2
          </span>
          <div>
            <h2 id="co-pay-title" className="checkoutCardTitle">
              Payment method
            </h2>
            <p className="checkoutCardSub">
              Choose how you&apos;d like to pay. Card and PayPal payments are
              taken first; your order is placed once payment succeeds.
            </p>
          </div>
        </div>
        <p className="checkoutPayNotice">
          Payment options appear after you fill billing details and continue.
        </p>
        <hr className="checkoutDivider" />
        <TermsAgreement form={form} />
      </section>
    );
  }

  return (
    <>
      <section
        className="checkoutCard checkoutCardCollapsed"
        aria-labelledby="co-billing-title"
      >
        <div className="checkoutCollapsedHead">
          <div className="checkoutCardHead" style={{ marginBottom: 0 }}>
            <span className="checkoutCardIndex" aria-hidden>
              2
            </span>
            <div>
              <h2
                id="co-billing-title"
                className="checkoutCardTitle checkoutCardTitleActive"
              >
                Billing details
              </h2>
              <p className="checkoutCardSub">
                Used on your invoices and as the domain registrant contact.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="checkoutLinkBtn"
            onClick={form.editBilling}
          >
            Edit
          </button>
        </div>
        <div className="checkoutBillingSummary">
          <p>{form.billingName || "—"}</p>
          <p>{form.billingAddress || "—"}</p>
          <p>{form.phone.trim() || "—"}</p>
          {form.email.trim() ? (
            <p className="checkoutSummaryMuted">{form.email.trim()}</p>
          ) : null}
        </div>
      </section>

      <section className="checkoutCard" aria-labelledby="co-pay-title">
        <div className="checkoutCardHead">
          <span className="checkoutCardIndex" aria-hidden>
            3
          </span>
          <div>
            <h2
              id="co-pay-title"
              className="checkoutCardTitle checkoutCardTitleActive"
            >
              Payment method
            </h2>
            <p className="checkoutCardSub">
              Choose how you&apos;d like to pay. Card and PayPal payments are
              taken first; your order is placed once payment succeeds.
            </p>
          </div>
        </div>

        <div
          className="checkoutPayOptions"
          role="radiogroup"
          aria-label="Payment method"
        >
          <label
            className="checkoutPayOption"
            data-active={form.payMethod === "card" ? "true" : "false"}
          >
            <input
              type="radio"
              name="pay-method"
              checked={form.payMethod === "card"}
              onChange={() => form.setPayMethod("card")}
            />
            <span className="checkoutPayOptionBody">
              <span className="checkoutPayOptionTitle">
                Credit / debit card
              </span>
              <span className="checkoutPayOptionMeta">
                Pay now, securely. Your order is placed as soon as the payment
                goes through.
              </span>
            </span>
            <span className="checkoutPayOptionLogos" aria-hidden>
              <FaCcVisa size={22} color="#1A1F71" />
              <FaCcMastercard size={22} color="#EB001B" />
              <FaCcAmex size={22} color="#2E77BC" />
            </span>
          </label>

          {form.payMethod === "card" ? (
            <CheckoutCardFields form={form} />
          ) : null}

          <label
            className="checkoutPayOption"
            data-active={form.payMethod === "paypal" ? "true" : "false"}
          >
            <input
              type="radio"
              name="pay-method"
              checked={form.payMethod === "paypal"}
              onChange={() => form.setPayMethod("paypal")}
            />
            <span className="checkoutPayOptionBody">
              <span className="checkoutPayOptionTitle">PayPal</span>
              <span className="checkoutPayOptionMeta">
                Pay with your PayPal account. Your order is placed once PayPal
                confirms.
              </span>
            </span>
            <span className="checkoutPayOptionLogos" aria-hidden>
              <FaCcPaypal size={22} color="#003087" />
            </span>
          </label>

          <label
            className="checkoutPayOption"
            data-active={form.payMethod === "bank" ? "true" : "false"}
          >
            <input
              type="radio"
              name="pay-method"
              checked={form.payMethod === "bank"}
              onChange={() => form.setPayMethod("bank")}
            />
            <span className="checkoutPayOptionBody">
              <span className="checkoutPayOptionTitle">Bank transfer</span>
              <span className="checkoutPayOptionMeta">
                We place the order and email the bank details. Services start
                once the transfer arrives.
              </span>
            </span>
            <span className="checkoutBankChip" aria-hidden>
              <FaUniversity size={14} />
              Bank transfer
            </span>
          </label>
        </div>

        <p className="checkoutBanner" role="note">
          {PAYMENT_DEMO_NOTICE}
        </p>
        <hr className="checkoutDivider" />
        <TermsAgreement form={form} />
      </section>
    </>
  );
}
