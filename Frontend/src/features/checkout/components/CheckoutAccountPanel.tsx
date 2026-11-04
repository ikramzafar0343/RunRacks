/**
 * Account step — create or sign in. Neither path stores or sends a password.
 */
import Link from "next/link";
import type { Route } from "next";
import { FcGoogle } from "react-icons/fc";
import {
  CheckoutCountryPicker,
  CheckoutPasswordField,
  CheckoutTextField,
} from "@/features/checkout/components/checkoutFields";
import type { CheckoutReady } from "@/features/checkout/components/useCheckoutForm";

export function CheckoutAccountPanel({ form }: { form: CheckoutReady }) {
  return (
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

      <div className="checkoutTabs" role="tablist" aria-label="Customer type">
        <button
          type="button"
          role="tab"
          className="checkoutTab"
          aria-selected={form.tab === "new"}
          data-active={form.tab === "new" ? "true" : "false"}
          onClick={() => form.switchTab("new")}
        >
          New customer
        </button>
        <button
          type="button"
          role="tab"
          className="checkoutTab"
          aria-selected={form.tab === "existing"}
          data-active={form.tab === "existing" ? "true" : "false"}
          onClick={() => form.switchTab("existing")}
        >
          I have an account
        </button>
      </div>

      <div className="checkoutGoogleBlock">
        <button
          type="button"
          className="checkoutGoogleBtn"
          onClick={form.onContinueWithGoogle}
          title="Google sign-in is not configured yet"
        >
          <FcGoogle size={18} aria-hidden />
          Continue with Google
        </button>
        <p className="checkoutOrDivider" role="presentation">
          <span>or continue with email</span>
        </p>
      </div>

      {form.tab === "new" ? (
        <form
          className="checkoutFormGrid"
          onSubmit={form.onCreateAccount}
          autoComplete="on"
          noValidate
        >
          <CheckoutTextField
            id="co-email"
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            value={form.email}
            onChange={form.setEmail}
            required
          />
          <CheckoutPasswordField
            id="co-password"
            label="Password"
            autoComplete="new-password"
            value={form.password}
            onChange={form.setPassword}
            shown={form.showPassword}
            onToggle={form.togglePassword}
            minLength={8}
            hint="At least 8 characters."
          />
          <h3 className="checkoutSectionTitle">Billing details</h3>
          <CheckoutTextField
            id="co-first"
            label="First name"
            autoComplete="given-name"
            value={form.firstName}
            onChange={form.setFirstName}
            required
          />
          <CheckoutTextField
            id="co-last"
            label="Last name"
            autoComplete="family-name"
            value={form.lastName}
            onChange={form.setLastName}
            required
          />
          <CheckoutTextField
            id="co-company"
            label="Company (optional)"
            autoComplete="organization"
            value={form.company}
            onChange={form.setCompany}
            full
          />
          <CheckoutTextField
            id="co-street"
            label="Street address"
            autoComplete="street-address"
            value={form.street}
            onChange={form.setStreet}
            required
            full
          />
          <CheckoutTextField
            id="co-city"
            label="City"
            autoComplete="address-level2"
            value={form.city}
            onChange={form.setCity}
            required
          />
          <CheckoutTextField
            id="co-state"
            label="State / region"
            autoComplete="address-level1"
            value={form.stateRegion}
            onChange={form.setStateRegion}
            required
          />
          <CheckoutTextField
            id="co-postcode"
            label="Postcode / ZIP"
            autoComplete="postal-code"
            value={form.postcode}
            onChange={form.setPostcode}
            required
          />
          <div>
            <p className="checkoutLabel" id="co-country-label">
              Country
            </p>
            <CheckoutCountryPicker
              labelId="co-country-label"
              regions={form.regions}
              activeId={form.countryId}
              onSelect={form.selectCountry}
            />
          </div>
          <CheckoutTextField
            id="co-phone"
            label="Phone number"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={form.setPhone}
            required
            full
          />
          <div className="checkoutFieldFull">
            <button type="submit" className="checkoutBtn">
              Create account and continue
            </button>
          </div>
        </form>
      ) : (
        <form
          className="checkoutFormGrid"
          onSubmit={form.onSignIn}
          autoComplete="on"
          noValidate
        >
          <CheckoutTextField
            id="co-email-in"
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            value={form.email}
            onChange={form.setEmail}
            required
          />
          <CheckoutPasswordField
            id="co-password-in"
            label="Password"
            autoComplete="current-password"
            value={form.password}
            onChange={form.setPassword}
            shown={form.showPassword}
            onToggle={form.togglePassword}
          />
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

      {form.formError ? (
        <p className="checkoutBanner" data-tone="error" role="alert">
          {form.formError}
        </p>
      ) : null}
      {form.authNotice ? (
        <p className="checkoutBanner" role="status">
          {form.authNotice}
        </p>
      ) : null}
    </section>
  );
}
