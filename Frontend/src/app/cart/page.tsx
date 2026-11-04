/**
 * Cart configure route — client cart seeded from Choose plan.
 */
import type { Metadata } from "next";
import { CartConfigurePage } from "@/features/cart/components/CartConfigurePage";

export const metadata: Metadata = {
  title: "Your cart",
  description:
    "Configure your RunRacks Linux VPS, Windows VPS, or Admin RDP plan — region, image, and billing term. Checkout payment stays disabled until billing is connected.",
};

export default function CartPage() {
  return <CartConfigurePage />;
}
