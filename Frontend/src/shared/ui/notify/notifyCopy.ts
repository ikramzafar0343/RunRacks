/**
 * Honest notify copy for cart / checkout actions (no fake success).
 */
export const NOTIFY_COPY = {
  addedPlan: (name: string) => ({
    title: "Added to cart",
    description: `${name} is ready to configure.`,
  }),
  addedCustom: (name: string) => ({
    title: "Custom build added",
    description: `${name} is in your cart.`,
  }),
  cartFull: {
    title: "Cart is full",
    description: "Remove a server before adding another (max 10).",
  },
  removedLine: {
    title: "Removed from cart",
    description: "That server is no longer in your cart.",
  },
  clearedCart: {
    title: "Cart cleared",
    description: "All servers were removed.",
  },
  confirmRemove: {
    title: "Remove this server?",
    description: "You can add it again from Pricing or Customize.",
    confirmLabel: "Remove",
    cancelLabel: "Keep",
  },
  confirmClear: {
    title: "Clear your cart?",
    description: "Every server in this cart will be removed.",
    confirmLabel: "Clear cart",
    cancelLabel: "Cancel",
  },
  couponNotLive: {
    title: "Coupons not connected",
    description: "Promo codes will apply when billing is live. Nothing was charged.",
  },
  paymentNotLive: {
    title: "Payment not connected",
    description:
      "Place order stays disabled until a real payment provider is wired. No card data was sent.",
  },
  accountUnavailable: {
    title: "Sign-in not configured",
    description:
      "Account auth is not live yet. No password was stored or sent.",
  },
  googleUnavailable: {
    title: "Google sign-in not connected",
    description: "No OAuth redirect ran, and no tokens were stored.",
  },
  catalogError: {
    title: "Could not load plans",
    description: "Check your connection and try again.",
  },
  viewCart: "View cart",
} as const;
