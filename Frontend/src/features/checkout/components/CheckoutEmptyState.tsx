/**
 * Checkout empty and hydration states.
 */
import Link from "next/link";
import type { Route } from "next";

export function CheckoutEmptyState({
  variant,
}: {
  variant: "loading" | "empty";
}) {
  if (variant === "loading") {
    return (
      <main className="checkoutPage">
        <div className="checkoutInner">
          <p className="checkoutLead">Loading checkout…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="checkoutPage checkoutPage--empty">
      <div className="checkoutInner checkoutEmpty">
        <p className="checkoutEmptyBrand">RunRacks</p>
        <h1 className="checkoutTitle">Nothing to check out</h1>
        <p>
          Your cart is empty. Add a plan from Pricing or Customize, then return
          here when you are ready.
        </p>
        <div className="checkoutEmptyActions">
          <Link href={"/pricing" as Route} className="checkoutEmptyCta">
            View plans
          </Link>
          <Link href={"/cart" as Route} className="checkoutEmptyCtaAlt">
            Back to cart
          </Link>
        </div>
      </div>
    </main>
  );
}
