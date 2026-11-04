/**
 * Site header wired to cart badge count (keeps shared/ free of features/).
 */
"use client";

import { useCart } from "@/features/cart/lib/CartProvider";
import { headerActions, primaryNav } from "@/shared/config/navConfig";
import { SiteHeaderBar } from "@/shared/ui/SiteHeaderBar";

export function SiteHeaderWithCart() {
  const { itemCount, hydrated } = useCart();
  return (
    <SiteHeaderBar
      primaryNav={primaryNav}
      headerActions={headerActions}
      cartItemCount={itemCount}
      cartHydrated={hydrated}
    />
  );
}
