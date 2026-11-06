/**
 * Cart configure page — multi-line; payment provider still not live.
 */
"use client";

import Link from "next/link";
import { useEffect } from "react";
import { HiCheck, HiLockClosed, HiShieldCheck } from "react-icons/hi2";
import { MdHeadsetMic } from "react-icons/md";
import { CartEmptyState } from "@/features/cart/components/CartEmptyState";
import { CartLinesRail } from "@/features/cart/components/CartLinesRail";
import { CartOrderSummary } from "@/features/cart/components/CartOrderSummary";
import { CartPlanConfigPanel } from "@/features/cart/components/CartPlanConfigPanel";
import { useCartConfigure } from "@/features/cart/components/useCartConfigure";
import { NOTIFY_COPY } from "@/shared/ui/notify/notifyCopy";
import { useNotify } from "@/shared/ui/notify/NotifyProvider";
import "@/features/cart/components/cart-page.css";

const STEPS = [
  { id: "choose", label: "Choose Plan", state: "done", mark: "check" },
  { id: "configure", label: "Configure", state: "active", mark: "2" },
  { id: "review", label: "Review & Checkout", state: "todo", mark: "3" },
  { id: "complete", label: "Complete", state: "todo", mark: "4" },
] as const;

export function CartConfigurePage() {
  const cart = useCartConfigure();
  const { toast, confirm } = useNotify();

  const loadError =
    cart.status === "ready" || cart.status === "empty" ? cart.loadError : null;

  useEffect(() => {
    if (loadError) {
      toast({ tone: "error", ...NOTIFY_COPY.catalogError });
    }
  }, [loadError, toast]);

  if (cart.status === "loading") {
    return <CartEmptyState variant="loading" />;
  }
  if (cart.status === "empty") {
    return <CartEmptyState variant="empty" />;
  }

  const ready = cart;

  async function onRemoveActive() {
    const ok = await confirm({
      ...NOTIFY_COPY.confirmRemove,
      tone: "error",
    });
    if (!ok) return;
    ready.removeLine(ready.line.id);
    toast({ tone: "success", ...NOTIFY_COPY.removedLine });
  }

  async function onClearAll() {
    const ok = await confirm({
      ...NOTIFY_COPY.confirmClear,
      tone: "error",
    });
    if (!ok) return;
    ready.clearCart();
    toast({ tone: "success", ...NOTIFY_COPY.clearedCart });
  }

  return (
    <main className="cartPage">
      <div className="cartPageDecor" aria-hidden>
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

      <div className="cartPageInner">
        <header>
          <h1 className="cartPageTitle">Your cart</h1>
          <p className="cartPageLead">
            Configure each server, then continue when checkout is connected.
          </p>
        </header>

        <ol className="cartStepper" aria-label="Checkout progress">
          {STEPS.map((step) => (
            <li key={step.id} className="cartStep" data-state={step.state}>
              <span className="cartStepDot" aria-hidden>
                {step.mark === "check" ? <HiCheck size={12} /> : step.mark}
              </span>
              <span className="cartStepLabel">{step.label}</span>
            </li>
          ))}
        </ol>

        <CartLinesRail cart={ready} onClearAll={() => void onClearAll()} />

        {ready.loadError ? (
          <p className="cartPageLead" role="alert">
            {ready.loadError}
          </p>
        ) : null}

        <div className="cartMain">
          <CartPlanConfigPanel
            cart={ready}
            onRemove={() => void onRemoveActive()}
          />
          <CartOrderSummary
            cart={ready}
            onCouponHint={() =>
              toast({ tone: "info", ...NOTIFY_COPY.couponNotLive })
            }
          />
        </div>

        <p className="cartDomainNote">
          Cloud servers don&apos;t need a domain.{" "}
          <Link href="/contact">Add a domain anyway</Link>
        </p>

        <div className="cartTrust">
          <div className="cartTrustItem">
            <HiLockClosed size={16} aria-hidden />
            <div>
              <h3>Secure checkout</h3>
              <p>
                Encrypted connection, card details stay with the payment
                provider
              </p>
            </div>
          </div>
          <div className="cartTrustItem">
            <HiShieldCheck size={16} aria-hidden />
            <div>
              <h3>Activated after payment</h3>
              <p>Setup automatically as soon as your payment is confirmed</p>
            </div>
          </div>
          <div className="cartTrustItem">
            <MdHeadsetMic size={16} aria-hidden />
            <div>
              <h3>24/7 Expert Support</h3>
              <p>Our team is here to help anytime</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
