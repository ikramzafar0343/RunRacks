/**
 * Card entry layout only. Values stay in component memory and are never charged.
 */
import { HiCreditCard } from "react-icons/hi2";
import { FaCcAmex, FaCcMastercard, FaCcVisa } from "react-icons/fa";
import { CheckoutCountryPicker } from "@/features/checkout/components/checkoutFields";
import type { CheckoutReady } from "@/features/checkout/components/useCheckoutForm";

export function CheckoutCardFields({ form }: { form: CheckoutReady }) {
  return (
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
            value={form.cardNumber}
            onChange={(event) => form.setCardNumber(event.target.value)}
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
            value={form.cardExp}
            onChange={(event) => form.setCardExp(event.target.value)}
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
              value={form.cardCvc}
              onChange={(event) => form.setCardCvc(event.target.value)}
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
        <CheckoutCountryPicker
          labelId="co-card-country-label"
          regions={form.regions}
          activeId={form.cardCountryId}
          onSelect={form.selectCardCountry}
        />
        {form.cardCountry ? (
          <p className="checkoutHint">Selected: {form.cardCountry.name}</p>
        ) : null}
      </div>
    </div>
  );
}
