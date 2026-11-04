/**
 * Checkout step 3 — review account + payment UI.
 * Auth/payment stay honestly unavailable; passwords never leave component memory.
 */
"use client";

import Link from "next/link";
import type { Route } from "next";
import { HiCheck, HiLockClosed, HiShieldCheck } from "react-icons/hi2";
import { MdHeadsetMic } from "react-icons/md";
import { CheckoutAccountPanel } from "@/features/checkout/components/CheckoutAccountPanel";
import { CheckoutEmptyState } from "@/features/checkout/components/CheckoutEmptyState";
import { CheckoutOrderSummary } from "@/features/checkout/components/CheckoutOrderSummary";
import { CheckoutPaymentPanel } from "@/features/checkout/components/CheckoutPaymentPanel";
import { CHECKOUT_STEPS } from "@/features/checkout/components/checkoutConstants";
import { useCheckoutForm } from "@/features/checkout/components/useCheckoutForm";
import "@/features/checkout/components/checkout-page.css";

export function CheckoutPage() {
  const form = useCheckoutForm();
  if (form.status === "loading") {
    return <CheckoutEmptyState variant="loading" />;
  }
  if (form.status === "empty") {
    return <CheckoutEmptyState variant="empty" />;
  }

  return (
    <main className="checkoutPage">
      <div className="checkoutDecor" aria-hidden>
        <svg viewBox="0 0 400 280" fill="none">
          <path
            d="M40 220C120 40 220 40 360 120"
            stroke="currentColor"
            strokeWidth="1.25"
          />
          <path
            d="M20 160C140 20 260 60 390 180"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="checkoutInner">
        <header>
          <h1 className="checkoutTitle">Checkout</h1>
          <p className="checkoutLead">
            Review your order and pay securely.{" "}
            <Link href={"/cart" as Route}>← Back to cart</Link>
          </p>
        </header>

        <ol className="checkoutStepper" aria-label="Checkout progress">
          {CHECKOUT_STEPS.map((step) => (
            <li key={step.id} className="checkoutStep" data-state={step.state}>
              <span className="checkoutStepDot" aria-hidden>
                {step.mark === "check" ? <HiCheck size={12} /> : step.mark}
              </span>
              <span className="checkoutStepLabel">{step.label}</span>
            </li>
          ))}
        </ol>

        <div className="checkoutMain">
          <div className="checkoutLeft">
            {form.stage === "account" ? (
              <CheckoutAccountPanel form={form} />
            ) : null}
            <CheckoutPaymentPanel form={form} />
            <div className="checkoutTrust">
              <div className="checkoutTrustItem">
                <span className="checkoutTrustIcon" aria-hidden>
                  <HiLockClosed size={14} />
                </span>
                <div>
                  <h3>Secure checkout</h3>
                  <p>
                    Encrypted connection, card details stay with the payment
                    provider
                  </p>
                </div>
              </div>
              <div className="checkoutTrustItem">
                <span className="checkoutTrustIcon" aria-hidden>
                  <HiShieldCheck size={14} />
                </span>
                <div>
                  <h3>Activated after payment</h3>
                  <p>
                    Setup automatically as soon as your payment is confirmed
                  </p>
                </div>
              </div>
              <div className="checkoutTrustItem">
                <span className="checkoutTrustIcon" aria-hidden>
                  <MdHeadsetMic size={14} />
                </span>
                <div>
                  <h3>24/7 Expert Support</h3>
                  <p>Our team is here to help anytime</p>
                </div>
              </div>
            </div>
          </div>
          <CheckoutOrderSummary form={form} />
        </div>

        <footer className="checkoutLegalFooter">
          <span>© {new Date().getFullYear()} RunRacks</span>
          <Link href={"/terms" as Route}>Terms of Service</Link>
          <Link href={"/privacy" as Route}>Privacy Policy</Link>
          <Link href={"/refund" as Route}>Refund Policy</Link>
        </footer>
      </div>
    </main>
  );
}
