/**
 * Checkout step 3 — review account + payment UI.
 * Auth/payment stay honestly unavailable; passwords never leave component memory.
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  HiCheck,
  HiChevronDown,
  HiCreditCard,
  HiEye,
  HiEyeSlash,
  HiInformationCircle,
  HiLockClosed,
  HiShieldCheck,
} from "react-icons/hi2";
import { FaCcAmex, FaCcMastercard, FaCcPaypal, FaCcVisa, FaUniversity } from "react-icons/fa";
import { MdHeadsetMic } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import {
  CART_PAYMENT_MARKS,
  cartFamilyIcon,
} from "@/features/cart/components/cartProvisionIcons";
import { useCart } from "@/features/cart/lib/CartProvider";
import { familyLabel } from "@/features/cart/lib/cartPlanHelpers";
import type { CartBillingTerm } from "@/features/cart/model/cartTypes";
import { flagSrc } from "@/features/customize/components/customizeIcons";
import { fetchVpsCatalog } from "@/features/vps-pricing/lib/fetchVpsCatalog";
import { selectPlanPrice } from "@/features/vps-pricing/lib/selectPlanPrice";
import { formatMoneyMinor } from "@/features/vps-pricing/model/formatPrice";
import type { VpsCatalogPayload, VpsPlan } from "@/features/vps-pricing/model/types";
import { DEMO_PRICING_ANSWER } from "@/shared/content/demoPricingCopy";
import "@/features/checkout/components/checkout-page.css";

type AccountTab = "new" | "existing";
type CheckoutStage = "account" | "payment";
type PayMethod = "card" | "paypal" | "bank";

const STEPS = [
  { id: "choose", label: "Choose Plan", state: "done" as const, mark: "check" },
  { id: "configure", label: "Configure", state: "done" as const, mark: "check" },
  {
    id: "review",
    label: "Review & Checkout",
    state: "active" as const,
    mark: "3",
  },
  { id: "complete", label: "Complete", state: "todo" as const, mark: "4" },
];

const ACCOUNT_UNAVAILABLE =
  "Account sign-in and registration are not configured yet. Your cart stays as it is. No password was stored or sent.";

const GOOGLE_UNAVAILABLE =
  "Continue with Google is not connected yet. No Google OAuth redirect ran, and no tokens were stored. Your cart is unchanged.";

const PAYMENT_DEMO_NOTICE =
  "Payment methods are shown for checkout layout only. No card data is stored, charged, or sent — live payment is not connected.";

function termTitle(term: CartBillingTerm): string {
  if (term === 1) return "1 Month";
  if (term === 3) return "3 Months";
  return "12 Months";
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function CheckoutPage() {
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
  const [countryId, setCountryId] = useState("");
  const [phone, setPhone] = useState("");

  /** Card UI fields — component memory only; never persisted or submitted. */
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardCountryId, setCardCountryId] = useState("");

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

  useEffect(() => {
    if (!line) return;
    setCountryId((prev) => prev || line.locationId);
    setCardCountryId((prev) => prev || line.locationId);
  }, [line]);

  useEffect(() => {
    return () => {
      setPassword("");
      setCardNumber("");
      setCardExp("");
      setCardCvc("");
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
    setCardCountryId(countryId || line?.locationId || "");
    setStage("payment");
  }

  const plan: VpsPlan | null = useMemo(() => {
    if (!catalog || !line) return null;
    return catalog.plans.find((entry) => entry.id === line.planId) ?? null;
  }, [catalog, line]);

  const activeFamily = plan?.family ?? line?.custom?.family ?? null;
  const productName =
    line?.custom?.label ?? plan?.name ?? (activeFamily ? familyLabel(activeFamily) : "Plan");

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
  const termTotalLabel =
    price != null ? formatMoneyMinor(price.amountMinor, price.currency) : "—";
  const setupLabel = price ? formatMoneyMinor(0, price.currency) : "$0.00";

  function onCreateAccount(event: FormEvent) {
    event.preventDefault();
    setAuthNotice(null);
    setFormError(null);
    if (!isValidEmail(email)) {
      setFormError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      setFormError("First and last name are required.");
      return;
    }
    if (!street.trim() || !city.trim() || !stateRegion.trim() || !postcode.trim()) {
      setFormError("Complete the required billing address fields.");
      return;
    }
    if (!countryId) {
      setFormError("Select a country.");
      return;
    }
    if (!phone.trim()) {
      setFormError("Phone number is required.");
      return;
    }
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

  if (!hydrated) {
    return (
      <main className="checkoutPage">
        <div className="checkoutInner">
          <p className="checkoutLead">Loading checkout…</p>
        </div>
      </main>
    );
  }

  if (!line || (!plan && !line.custom) || !activeFamily) {
    return (
      <main className="checkoutPage checkoutPage--empty">
        <div className="checkoutInner checkoutEmpty">
          <p className="checkoutEmptyBrand">RunRacks</p>
          <h1 className="checkoutTitle">Nothing to check out</h1>
          <p>
            Your cart is empty. Add a plan from Pricing or Customize, then
            return here when you are ready.
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
          {STEPS.map((step) => (
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
            {stage === "account" ? (
            <section className="checkoutCard" aria-labelledby="co-account-title">
              <div className="checkoutCardHead">
                <span className="checkoutCardIndex" aria-hidden>
                  1
                </span>
                <div>
                  <h2 id="co-account-title" className="checkoutCardTitle">
                    Your account
                  </h2>
                  <p className="checkoutCardSub">
                    Create an account or sign in. Your cart stays as it is.
                  </p>
                </div>
              </div>

              <div
                className="checkoutTabs"
                role="tablist"
                aria-label="Customer type"
              >
                <button
                  type="button"
                  role="tab"
                  className="checkoutTab"
                  aria-selected={tab === "new"}
                  data-active={tab === "new" ? "true" : "false"}
                  onClick={() => switchTab("new")}
                >
                  New customer
                </button>
                <button
                  type="button"
                  role="tab"
                  className="checkoutTab"
                  aria-selected={tab === "existing"}
                  data-active={tab === "existing" ? "true" : "false"}
                  onClick={() => switchTab("existing")}
                >
                  I have an account
                </button>
              </div>

              <div className="checkoutGoogleBlock">
                <button
                  type="button"
                  className="checkoutGoogleBtn"
                  onClick={onContinueWithGoogle}
                  title="Google sign-in is not configured yet"
                >
                  <FcGoogle size={18} aria-hidden />
                  Continue with Google
                </button>
                <p className="checkoutOrDivider" role="presentation">
                  <span>or continue with email</span>
                </p>
              </div>

              {tab === "new" ? (
                <form
                  className="checkoutFormGrid"
                  onSubmit={onCreateAccount}
                  autoComplete="on"
                  noValidate
                >
                  <div>
                    <label className="checkoutLabel" htmlFor="co-email">
                      Email
                    </label>
                    <input
                      id="co-email"
                      className="checkoutInput"
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="checkoutLabel" htmlFor="co-password">
                      Password
                    </label>
                    <div className="checkoutPasswordWrap">
                      <input
                        id="co-password"
                        className="checkoutInput"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        className="checkoutEyeBtn"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        {showPassword ? (
                          <HiEyeSlash size={16} />
                        ) : (
                          <HiEye size={16} />
                        )}
                      </button>
                    </div>
                    <p className="checkoutHint">At least 8 characters.</p>
                  </div>

                  <h3 className="checkoutSectionTitle">Billing details</h3>

                  <div>
                    <label className="checkoutLabel" htmlFor="co-first">
                      First name
                    </label>
                    <input
                      id="co-first"
                      className="checkoutInput"
                      autoComplete="given-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="checkoutLabel" htmlFor="co-last">
                      Last name
                    </label>
                    <input
                      id="co-last"
                      className="checkoutInput"
                      autoComplete="family-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="checkoutFieldFull">
                    <label className="checkoutLabel" htmlFor="co-company">
                      Company (optional)
                    </label>
                    <input
                      id="co-company"
                      className="checkoutInput"
                      autoComplete="organization"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>

                  <div className="checkoutFieldFull">
                    <label className="checkoutLabel" htmlFor="co-street">
                      Street address
                    </label>
                    <input
                      id="co-street"
                      className="checkoutInput"
                      autoComplete="street-address"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="checkoutLabel" htmlFor="co-city">
                      City
                    </label>
                    <input
                      id="co-city"
                      className="checkoutInput"
                      autoComplete="address-level2"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="checkoutLabel" htmlFor="co-state">
                      State / region
                    </label>
                    <input
                      id="co-state"
                      className="checkoutInput"
                      autoComplete="address-level1"
                      value={stateRegion}
                      onChange={(e) => setStateRegion(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="checkoutLabel" htmlFor="co-postcode">
                      Postcode / ZIP
                    </label>
                    <input
                      id="co-postcode"
                      className="checkoutInput"
                      autoComplete="postal-code"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <p className="checkoutLabel" id="co-country-label">
                      Country
                    </p>
                    <div
                      className="checkoutCountrySeg"
                      role="radiogroup"
                      aria-labelledby="co-country-label"
                    >
                      {regions.map((region) => {
                        const active = region.id === countryId;
                        return (
                          <button
                            key={region.id}
                            type="button"
                            role="radio"
                            className="checkoutCountryBtn"
                            aria-checked={active}
                            data-active={active ? "true" : "false"}
                            onClick={() => setCountryId(region.id)}
                          >
                            <Image
                              src={flagSrc(region.countryCode)}
                              alt=""
                              width={18}
                              height={12}
                              className="checkoutCountryFlag"
                              unoptimized
                            />
                            {region.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="checkoutFieldFull">
                    <label className="checkoutLabel" htmlFor="co-phone">
                      Phone number
                    </label>
                    <input
                      id="co-phone"
                      className="checkoutInput"
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="checkoutFieldFull">
                    <button type="submit" className="checkoutBtn">
                      Create account and continue
                    </button>
                  </div>
                </form>
              ) : (
                <form
                  className="checkoutFormGrid"
                  onSubmit={onSignIn}
                  autoComplete="on"
                  noValidate
                >
                  <div>
                    <label className="checkoutLabel" htmlFor="co-email-in">
                      Email
                    </label>
                    <input
                      id="co-email-in"
                      className="checkoutInput"
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="checkoutLabel" htmlFor="co-password-in">
                      Password
                    </label>
                    <div className="checkoutPasswordWrap">
                      <input
                        id="co-password-in"
                        className="checkoutInput"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="checkoutEyeBtn"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        {showPassword ? (
                          <HiEyeSlash size={16} />
                        ) : (
                          <HiEye size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="checkoutFieldFull checkoutBtnRow">
                    <button type="submit" className="checkoutBtn">
                      Sign in and continue
                    </button>
                    <Link href={"/contact" as Route} className="checkoutLinkBtn">
                      Forgot password?
                    </Link>
                  </div>
                </form>
              )}

              {formError ? (
                <p className="checkoutBanner" data-tone="error" role="alert">
                  {formError}
                </p>
              ) : null}
              {authNotice ? (
                <p className="checkoutBanner" role="status">
                  {authNotice}
                </p>
              ) : null}
            </section>
            ) : null}

            {stage === "payment" ? (
              <>
                <section
                  className="checkoutCard checkoutCardCollapsed"
                  aria-labelledby="co-billing-title"
                >
                  <div className="checkoutCollapsedHead">
                    <div className="checkoutCardHead" style={{ marginBottom: 0 }}>
                      <span className="checkoutCardIndex" aria-hidden>
                        2
                      </span>
                      <div>
                        <h2 id="co-billing-title" className="checkoutCardTitle checkoutCardTitleActive">
                          Billing details
                        </h2>
                        <p className="checkoutCardSub">
                          Used on your invoices and as the domain registrant
                          contact.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="checkoutLinkBtn"
                      onClick={editBilling}
                    >
                      Edit
                    </button>
                  </div>
                  <div className="checkoutBillingSummary">
                    <p>{billingName || "—"}</p>
                    <p>{billingAddress || "—"}</p>
                    <p>{phone.trim() || "—"}</p>
                    {email.trim() ? (
                      <p className="checkoutSummaryMuted">{email.trim()}</p>
                    ) : null}
                  </div>
                </section>

                <section className="checkoutCard" aria-labelledby="co-pay-title">
                  <div className="checkoutCardHead">
                    <span className="checkoutCardIndex" aria-hidden>
                      3
                    </span>
                    <div>
                      <h2
                        id="co-pay-title"
                        className="checkoutCardTitle checkoutCardTitleActive"
                      >
                        Payment method
                      </h2>
                      <p className="checkoutCardSub">
                        Choose how you&apos;d like to pay. Card and PayPal
                        payments are taken first; your order is placed once
                        payment succeeds.
                      </p>
                    </div>
                  </div>

                  <div className="checkoutPayOptions" role="radiogroup" aria-label="Payment method">
                    <label
                      className="checkoutPayOption"
                      data-active={payMethod === "card" ? "true" : "false"}
                    >
                      <input
                        type="radio"
                        name="pay-method"
                        checked={payMethod === "card"}
                        onChange={() => setPayMethod("card")}
                      />
                      <span className="checkoutPayOptionBody">
                        <span className="checkoutPayOptionTitle">
                          Credit / debit card
                        </span>
                        <span className="checkoutPayOptionMeta">
                          Pay now, securely. Your order is placed as soon as the
                          payment goes through.
                        </span>
                      </span>
                      <span className="checkoutPayOptionLogos" aria-hidden>
                        <FaCcVisa size={22} color="#1A1F71" />
                        <FaCcMastercard size={22} color="#EB001B" />
                        <FaCcAmex size={22} color="#2E77BC" />
                      </span>
                    </label>

                    {payMethod === "card" ? (
                      <div className="checkoutCardFields">
                        <div className="checkoutFieldFull">
                          <label className="checkoutLabel" htmlFor="co-card-num">
                            Card number
                          </label>
                          <div className="checkoutCardNumberWrap">
                            <input
                              id="co-card-num"
                              className="checkoutInput"
                              inputMode="numeric"
                              autoComplete="off"
                              autoCorrect="off"
                              spellCheck={false}
                              name="card-number-demo"
                              placeholder="1234 1234 1234 1234"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                            />
                            <span className="checkoutCardNumberLogos" aria-hidden>
                              <FaCcMastercard size={16} color="#EB001B" />
                              <FaCcVisa size={16} color="#1A1F71" />
                              <FaCcAmex size={16} color="#2E77BC" />
                            </span>
                          </div>
                        </div>
                        <div className="checkoutFormGrid">
                          <div>
                            <label className="checkoutLabel" htmlFor="co-card-exp">
                              Expiration date
                            </label>
                            <input
                              id="co-card-exp"
                              className="checkoutInput"
                              autoComplete="off"
                              name="card-exp-demo"
                              placeholder="MM / YY"
                              value={cardExp}
                              onChange={(e) => setCardExp(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="checkoutLabel" htmlFor="co-card-cvc">
                              Security code
                            </label>
                            <div className="checkoutPasswordWrap">
                              <input
                                id="co-card-cvc"
                                className="checkoutInput"
                                autoComplete="off"
                                name="card-cvc-demo"
                                placeholder="CVC"
                                value={cardCvc}
                                onChange={(e) => setCardCvc(e.target.value)}
                              />
                              <span className="checkoutEyeBtn" aria-hidden>
                                <HiCreditCard size={16} />
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="checkoutFieldFull">
                          <p className="checkoutLabel" id="co-card-country-label">
                            Country
                          </p>
                          <div
                            className="checkoutCountrySeg"
                            role="radiogroup"
                            aria-labelledby="co-card-country-label"
                          >
                            {regions.map((region) => {
                              const active = region.id === cardCountryId;
                              return (
                                <button
                                  key={region.id}
                                  type="button"
                                  role="radio"
                                  className="checkoutCountryBtn"
                                  aria-checked={active}
                                  data-active={active ? "true" : "false"}
                                  onClick={() => setCardCountryId(region.id)}
                                >
                                  <Image
                                    src={flagSrc(region.countryCode)}
                                    alt=""
                                    width={18}
                                    height={12}
                                    className="checkoutCountryFlag"
                                    unoptimized
                                  />
                                  {region.name}
                                </button>
                              );
                            })}
                          </div>
                          {cardCountry ? (
                            <p className="checkoutHint">
                              Selected: {cardCountry.name}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    ) : null}

                    <label
                      className="checkoutPayOption"
                      data-active={payMethod === "paypal" ? "true" : "false"}
                    >
                      <input
                        type="radio"
                        name="pay-method"
                        checked={payMethod === "paypal"}
                        onChange={() => setPayMethod("paypal")}
                      />
                      <span className="checkoutPayOptionBody">
                        <span className="checkoutPayOptionTitle">PayPal</span>
                        <span className="checkoutPayOptionMeta">
                          Pay with your PayPal account. Your order is placed once
                          PayPal confirms.
                        </span>
                      </span>
                      <span className="checkoutPayOptionLogos" aria-hidden>
                        <FaCcPaypal size={22} color="#003087" />
                      </span>
                    </label>

                    <label
                      className="checkoutPayOption"
                      data-active={payMethod === "bank" ? "true" : "false"}
                    >
                      <input
                        type="radio"
                        name="pay-method"
                        checked={payMethod === "bank"}
                        onChange={() => setPayMethod("bank")}
                      />
                      <span className="checkoutPayOptionBody">
                        <span className="checkoutPayOptionTitle">
                          Bank transfer
                        </span>
                        <span className="checkoutPayOptionMeta">
                          We place the order and email the bank details. Services
                          start once the transfer arrives.
                        </span>
                      </span>
                      <span className="checkoutBankChip" aria-hidden>
                        <FaUniversity size={14} />
                        Bank transfer
                      </span>
                    </label>
                  </div>

                  <p className="checkoutBanner" role="note">
                    {PAYMENT_DEMO_NOTICE}
                  </p>

                  <hr className="checkoutDivider" />
                  <label className="checkoutTerms">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                    />
                    <span>
                      I agree to the{" "}
                      <Link href={"/terms" as Route}>Terms of Service</Link> and{" "}
                      <Link href={"/refund" as Route}>Refund Policy</Link>
                    </span>
                  </label>
                </section>
              </>
            ) : (
              <section className="checkoutCard" aria-labelledby="co-pay-title">
                <div className="checkoutCardHead">
                  <span className="checkoutCardIndex" aria-hidden>
                    2
                  </span>
                  <div>
                    <h2 id="co-pay-title" className="checkoutCardTitle">
                      Payment method
                    </h2>
                    <p className="checkoutCardSub">
                      Choose how you&apos;d like to pay. Card and PayPal payments
                      are taken first; your order is placed once payment
                      succeeds.
                    </p>
                  </div>
                </div>
                <p className="checkoutPayNotice">
                  Payment options appear after you fill billing details and
                  continue.
                </p>
                <hr className="checkoutDivider" />
                <label className="checkoutTerms">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                  <span>
                    I agree to the{" "}
                    <Link href={"/terms" as Route}>Terms of Service</Link> and{" "}
                    <Link href={"/refund" as Route}>Refund Policy</Link>
                  </span>
                </label>
              </section>
            )}

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

          <aside className="checkoutCard" aria-labelledby="co-summary-title">
            <div className="checkoutSummaryHead">
              <h2 id="co-summary-title">Order summary</h2>
              <Link href={"/cart" as Route} className="checkoutLinkBtn">
                Edit Cart
              </Link>
            </div>

            <div className="checkoutSummaryBlock">
              <button
                type="button"
                className="checkoutSummaryToggle"
                aria-expanded={serversOpen}
                onClick={() => setServersOpen((o) => !o)}
              >
                <span>Servers (1)</span>
                <HiChevronDown size={16} aria-hidden />
              </button>
              {serversOpen ? (
                <>
                  <div className="checkoutProductRow">
                    <span className="checkoutProductIcon" aria-hidden>
                      {cartFamilyIcon(activeFamily, 16)}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="checkoutSummaryLine" style={{ marginTop: 0 }}>
                        <span>
                          {productName}
                          <span className="checkoutSummaryMuted">
                            {" "}
                            · {familyLabel(activeFamily)}
                            {line.custom ? " · Custom" : ""}
                          </span>
                        </span>
                        <span>{amountLabel}</span>
                      </div>
                      <div className="checkoutSummaryLine checkoutSummaryMuted">
                        <span>{termTitle(line.term)} Billing</span>
                        <span>{amountLabel}/mo</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>

            <div className="checkoutSetupFee">
              <span>Setup fee</span>
              <span>{setupLabel}</span>
            </div>

            <div className="checkoutSummaryBlock">
              <button
                type="button"
                className="checkoutSummaryToggle"
                aria-expanded={couponOpen}
                onClick={() => setCouponOpen((o) => !o)}
              >
                <span>Have a coupon code?</span>
                <HiChevronDown size={16} aria-hidden />
              </button>
              {couponOpen ? (
                <input
                  className="checkoutInput"
                  style={{ marginTop: "0.45rem" }}
                  value={line.coupon}
                  placeholder="Coupon code"
                  onChange={(e) => updateLine({ coupon: e.target.value })}
                  aria-label="Coupon code"
                  autoComplete="off"
                />
              ) : null}
            </div>

            <div className="checkoutSummaryLine" style={{ marginTop: "0.85rem" }}>
              <span>Subtotal</span>
              <span>{amountLabel}</span>
            </div>
            <div className="checkoutSummaryLine checkoutSummaryMuted">
              <span>
                Taxes{" "}
                <HiInformationCircle
                  size={12}
                  style={{ display: "inline", verticalAlign: "-1px" }}
                  aria-hidden
                />
              </span>
              <span>Shown after you sign in</span>
            </div>

            <div className="checkoutTotalRow">
              <span>Total due today</span>
              <strong>{termTotalLabel}</strong>
            </div>
            <p className="checkoutHint">
              Billed in your account currency when you sign in. {DEMO_PRICING_ANSWER}
            </p>

            <button
              type="button"
              className="checkoutPayBtn"
              disabled
              title="Checkout payment and account systems are not configured"
            >
              <HiLockClosed size={15} aria-hidden />
              Place order · {termTotalLabel}
            </button>
            <p className="checkoutSignInNote">
              Sign in or create your account to place the order. Payment stays
              disabled until billing is connected.
            </p>

            <div className="checkoutGuarantee">
              <HiShieldCheck size={18} aria-hidden />
              <div>
                <h3>30-Day Money Back Guarantee</h3>
                <p>On hosting. Domain fees are non-refundable.</p>
              </div>
            </div>

            <div className="checkoutAccept">
              <p className="checkoutAcceptLabel">We accept</p>
              <ul className="checkoutPayMarks">
                {CART_PAYMENT_MARKS.map(({ id, label, Icon, color }) => (
                  <li key={id} className="checkoutPayMark">
                    <Icon
                      size={28}
                      color={color}
                      style={{ color }}
                      aria-hidden
                    />
                    <span className="sr-only">{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
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
