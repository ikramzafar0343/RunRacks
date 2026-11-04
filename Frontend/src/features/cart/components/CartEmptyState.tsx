/**
 * Cart configure empty and hydration states.
 */
import Link from "next/link";
import type { Route } from "next";
import { HiOutlineShoppingBag } from "react-icons/hi2";

export function CartEmptyState({ variant }: { variant: "loading" | "empty" }) {
  if (variant === "loading") {
    return (
      <main className="cartPage cartPage--empty">
        <div className="cartPageInner cartEmpty">
          <p className="cartEmptyLead">Loading your cart…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="cartPage cartPage--empty">
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
      <div className="cartPageInner cartEmpty">
        <p className="cartEmptyBrand">RunRacks</p>
        <div className="cartEmptyIcon" aria-hidden>
          <HiOutlineShoppingBag size={28} />
        </div>
        <h1 className="cartEmptyTitle">Your cart is empty</h1>
        <p className="cartEmptyLead">
          Nothing to configure yet. Choose a catalog plan on Pricing, or build
          one on Customize — your server lands here next.
        </p>
        <div className="cartEmptyActions">
          <Link href={"/pricing" as Route} className="cartEmptyCta">
            View plans
          </Link>
          <Link href={"/customize" as Route} className="cartEmptyCtaSecondary">
            Customize
          </Link>
        </div>
      </div>
    </main>
  );
}
