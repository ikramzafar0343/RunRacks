/**
 * Checkout review route — step 3 after cart configure.
 */
import type { Metadata } from "next";
import { CheckoutPage } from "@/features/checkout/components/CheckoutPage";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Review your RunRacks order, create an account or sign in, and continue when checkout payment is connected.",
};

export default function CheckoutRoutePage() {
  return <CheckoutPage />;
}
