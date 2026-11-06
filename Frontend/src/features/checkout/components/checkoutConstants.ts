/**
 * Checkout copy and account-form checks. Payment is not submitted from here.
 */
import type { CartBillingTerm } from "@/features/cart";

export type AccountTab = "new" | "existing";
export type CheckoutStage = "account" | "payment";
export type PayMethod = "card" | "paypal" | "bank";

export const CHECKOUT_STEPS = [
  { id: "choose", label: "Choose Plan", state: "done", mark: "check" },
  { id: "configure", label: "Configure", state: "done", mark: "check" },
  {
    id: "review",
    label: "Review & Checkout",
    state: "active",
    mark: "3",
  },
  { id: "complete", label: "Complete", state: "todo", mark: "4" },
] as const;

export const ACCOUNT_UNAVAILABLE =
  "Account sign-in and registration are not configured yet. Your cart stays as it is. No password was stored or sent.";

export const GOOGLE_UNAVAILABLE =
  "Continue with Google is not connected yet. No Google OAuth redirect ran, and no tokens were stored. Your cart is unchanged.";

export const PAYMENT_DEMO_NOTICE =
  "Payment methods are shown for checkout layout only. No card data is stored, charged, or sent — live payment is not connected.";

export function checkoutTermTitle(term: CartBillingTerm): string {
  if (term === 1) return "1 Month";
  if (term === 3) return "3 Months";
  if (term === 6) return "6 Months";
  return "12 Months";
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export type NewAccountInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  stateRegion: string;
  postcode: string;
  countryId: string;
  phone: string;
};

export function newAccountError(input: NewAccountInput): string | null {
  if (!isValidEmail(input.email)) return "Enter a valid email address.";
  if (input.password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  if (!input.firstName.trim() || !input.lastName.trim()) {
    return "First and last name are required.";
  }
  if (
    !input.street.trim() ||
    !input.city.trim() ||
    !input.stateRegion.trim() ||
    !input.postcode.trim()
  ) {
    return "Complete the required billing address fields.";
  }
  if (!input.countryId) return "Select a country.";
  if (!input.phone.trim()) return "Phone number is required.";
  return null;
}
