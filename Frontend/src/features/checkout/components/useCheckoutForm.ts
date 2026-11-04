/**
 * Checkout form state. Passwords and card fields stay in memory only.
 * Country follows the cart location until the shopper picks an override.
 */
"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useCart } from "@/features/cart/lib/CartProvider";
import { familyLabel } from "@/features/cart/lib/cartPlanHelpers";
import {
  ACCOUNT_UNAVAILABLE,
  GOOGLE_UNAVAILABLE,
  newAccountError,
  isValidEmail,
  type AccountTab,
  type CheckoutStage,
  type PayMethod,
} from "@/features/checkout/components/checkoutConstants";
import { fetchVpsCatalog } from "@/features/vps-pricing/lib/fetchVpsCatalog";
import { selectPlanPrice } from "@/features/vps-pricing/lib/selectPlanPrice";
import { formatMoneyMinor } from "@/features/vps-pricing/model/formatPrice";
import type { VpsCatalogPayload } from "@/features/vps-pricing/model/types";

export function useCheckoutForm() {
  const { line, hydrated, updateLine } = useCart();
  const [catalog, setCatalog] = useState<VpsCatalogPayload | null>(null);
  const [tab, setTab] = useState<AccountTab>("new");
  const [stage, setStage] = useState<CheckoutStage>("account");
  const [payMethod, setPayMethod] = useState<PayMethod>("card");
  const [showPassword, setShowPassword] = useState(false);
  const [serversOpen, setServersOpen] = useState(true);
  const [couponOpen, setCouponOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [postcode, setPostcode] = useState("");
  const [phone, setPhone] = useState("");
  const [countryOverride, setCountryOverride] = useState<string | null>(null);
  const [cardCountryOverride, setCardCountryOverride] = useState<string | null>(
    null,
  );
  const countryId = countryOverride ?? line?.locationId ?? "";
  const cardCountryId =
    cardCountryOverride ?? countryOverride ?? line?.locationId ?? "";
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchVpsCatalog()
      .then((data) => {
        if (!cancelled) setCatalog(data);
      })
      .catch(() => {
        /* summary shows empty-safe labels */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function clearSensitiveFields() {
    setPassword("");
    setShowPassword(false);
    setCardNumber("");
    setCardExp("");
    setCardCvc("");
  }

  function switchTab(next: AccountTab) {
    setTab(next);
    clearSensitiveFields();
    setAuthNotice(null);
    setFormError(null);
  }

  function editBilling() {
    clearSensitiveFields();
    setStage("account");
    setTab("new");
    setAuthNotice(null);
    setFormError(null);
  }

  function advanceToPayment() {
    clearSensitiveFields();
    setAuthNotice(null);
    setFormError(null);
    setCardCountryOverride(null);
    setStage("payment");
  }

  function onCreateAccount(event: FormEvent) {
    event.preventDefault();
    setAuthNotice(null);
    const error = newAccountError({
      email,
      password,
      firstName,
      lastName,
      street,
      city,
      stateRegion,
      postcode,
      countryId,
      phone,
    });
    if (error) {
      setFormError(error);
      return;
    }
    setFormError(null);
    advanceToPayment();
  }

  function onSignIn(event: FormEvent) {
    event.preventDefault();
    setAuthNotice(null);
    setFormError(null);
    if (!isValidEmail(email)) {
      setFormError("Enter a valid email address.");
      return;
    }
    if (!password) {
      setFormError("Enter your password.");
      return;
    }
    clearSensitiveFields();
    setAuthNotice(
      `${ACCOUNT_UNAVAILABLE} To continue to payment layout, use New customer and fill billing details.`,
    );
  }

  function onContinueWithGoogle() {
    setFormError(null);
    clearSensitiveFields();
    setAuthNotice(GOOGLE_UNAVAILABLE);
  }

  const plan = useMemo(() => {
    if (!catalog || !line) return null;
    return catalog.plans.find((entry) => entry.id === line.planId) ?? null;
  }, [catalog, line]);

  const activeFamily = plan?.family ?? line?.custom?.family ?? null;

  const price = useMemo(() => {
    if (!line) return null;
    if (line.custom) {
      return {
        monthlyEquivalentMinor: line.custom.monthlyMinor,
        amountMinor: line.custom.termTotalMinor,
        currency: line.custom.currency,
      };
    }
    if (!plan) return null;
    return selectPlanPrice(plan, line.term, line.locationId);
  }, [plan, line]);

  if (!hydrated) return { status: "loading" as const };
  if (!line || (!plan && !line.custom) || !activeFamily) {
    return { status: "empty" as const };
  }

  const regions = catalog?.regions ?? [];
  const selectedCountry =
    regions.find((region) => region.id === countryId) ?? regions[0] ?? null;
  const cardCountry =
    regions.find((region) => region.id === cardCountryId) ?? selectedCountry;
  const billingName = `${firstName.trim()} ${lastName.trim()}`.trim();
  const billingAddress = [
    street.trim(),
    city.trim(),
    stateRegion.trim(),
    postcode.trim(),
    selectedCountry?.countryCode?.toUpperCase() ?? "",
  ]
    .filter(Boolean)
    .join(", ");
  const displayMinor =
    price?.monthlyEquivalentMinor ?? price?.amountMinor ?? null;
  const amountLabel =
    displayMinor != null && price
      ? formatMoneyMinor(displayMinor, price.currency)
      : "—";

  return {
    status: "ready" as const,
    line,
    updateLine,
    activeFamily,
    productName: line.custom?.label ?? plan?.name ?? familyLabel(activeFamily),
    amountLabel,
    termTotalLabel:
      price != null ? formatMoneyMinor(price.amountMinor, price.currency) : "—",
    setupLabel: price ? formatMoneyMinor(0, price.currency) : "$0.00",
    regions,
    countryId,
    cardCountryId,
    cardCountry,
    billingName,
    billingAddress,
    tab,
    stage,
    payMethod,
    showPassword,
    serversOpen,
    couponOpen,
    termsAccepted,
    authNotice,
    formError,
    email,
    password,
    firstName,
    lastName,
    company,
    street,
    city,
    stateRegion,
    postcode,
    phone,
    cardNumber,
    cardExp,
    cardCvc,
    setEmail,
    setPassword,
    setFirstName,
    setLastName,
    setCompany,
    setStreet,
    setCity,
    setStateRegion,
    setPostcode,
    setPhone,
    setPayMethod,
    setCardNumber,
    setCardExp,
    setCardCvc,
    setTermsAccepted,
    selectCountry: setCountryOverride,
    selectCardCountry: setCardCountryOverride,
    togglePassword: () => setShowPassword((value) => !value),
    toggleServers: () => setServersOpen((open) => !open),
    toggleCoupon: () => setCouponOpen((open) => !open),
    switchTab,
    editBilling,
    onCreateAccount,
    onSignIn,
    onContinueWithGoogle,
  };
}

export type CheckoutModel = ReturnType<typeof useCheckoutForm>;
export type CheckoutReady = Extract<CheckoutModel, { status: "ready" }>;
