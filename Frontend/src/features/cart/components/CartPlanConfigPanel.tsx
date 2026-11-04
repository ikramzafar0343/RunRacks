/**
 * Left configure card — server type, region, image, and billing term.
 */
import Image from "next/image";
import { HiCheck } from "react-icons/hi2";
import { CartBillingTerms } from "@/features/cart/components/CartBillingTerms";
import { CartProvisionFields } from "@/features/cart/components/CartProvisionFields";
import { cartFamilyIcon } from "@/features/cart/components/cartProvisionIcons";
import type { CartConfigureReady } from "@/features/cart/components/useCartConfigure";
import { familyLabel } from "@/features/cart/lib/cartPlanHelpers";
import { CART_FAMILIES } from "@/features/cart/model/cartTypes";
import { flagSrc } from "@/features/customize/components/customizeIcons";
import { selectPlanPrice } from "@/features/vps-pricing/lib/selectPlanPrice";
import { formatMoneyMinor } from "@/features/vps-pricing/model/formatPrice";

export function CartPlanConfigPanel({
  cart,
  onRemove,
}: {
  cart: CartConfigureReady;
  onRemove: () => void;
}) {
  const { line, plan, activeFamily } = cart;
  return (
    <section className="cartCard" aria-labelledby="cart-config-title">
      <div className="cartCardHead">
        <span className="cartCardIndex" aria-hidden>
          1
        </span>
        <div>
          <h2 id="cart-config-title" className="cartCardTitle">
            Cloud server
          </h2>
          <p className="cartCardSub">
            Your {familyLabel(activeFamily)}, where it runs, and what it starts
            with. Choose the billing term.
          </p>
        </div>
      </div>

      <div className="cartProductRow">
        <span className="cartProductIcon" aria-hidden>
          {cartFamilyIcon(activeFamily, 20)}
        </span>
        <div className="cartProductMeta">
          <p className="cartProductName">
            {cart.productName}
            {cart.productBadge ? (
              <span className="cartProductBadge">{cart.productBadge}</span>
            ) : null}
          </p>
          <p className="cartProductTag">
            {familyLabel(activeFamily)}
            {cart.productTagline ? ` · ${cart.productTagline}` : null}
          </p>
        </div>
        <button
          type="button"
          className="cartLinkBtn"
          onClick={cart.togglePlanPicker}
        >
          {cart.planPickerOpen ? "Hide plans" : "Change plan"}
        </button>
        <button
          type="button"
          className="cartLinkBtn cartLinkBtnDanger"
          onClick={onRemove}
        >
          Remove
        </button>
      </div>

      <p className="cartFieldLabel" id="cart-server-type-label">
        Server type
      </p>
      <div
        className="cartServerTypes"
        role="group"
        aria-labelledby="cart-server-type-label"
      >
        {CART_FAMILIES.map((family) => (
          <button
            key={family.id}
            type="button"
            className="cartServerType"
            data-active={activeFamily === family.id ? "true" : "false"}
            onClick={() => cart.onServerTypeChange(family.id)}
          >
            <span className="cartServerTypeIcon" aria-hidden>
              {cartFamilyIcon(family.id, 14)}
            </span>
            {family.label}
          </button>
        ))}
      </div>

      {cart.planPickerOpen ? (
        <div className="cartPlanPick">
          <p className="cartFieldLabel" style={{ marginTop: 0 }}>
            {familyLabel(activeFamily)} plans
            {line.custom
              ? " (picking a catalog plan replaces this custom build)"
              : ""}
          </p>
          <ul className="cartPlanPickList">
            {cart.peerPlans.map((peer) => {
              const peerPrice = selectPlanPrice(
                peer,
                line.term,
                line.locationId,
              );
              const peerMinor =
                peerPrice?.monthlyEquivalentMinor ??
                peerPrice?.amountMinor ??
                null;
              const peerLabel =
                peerMinor != null && peerPrice
                  ? formatMoneyMinor(peerMinor, peerPrice.currency)
                  : "—";
              return (
                <li key={peer.id}>
                  <button
                    type="button"
                    className="cartPlanPickBtn"
                    data-active={
                      !line.custom && peer.id === plan?.id ? "true" : "false"
                    }
                    onClick={() => cart.onSelectPlan(peer.id)}
                  >
                    <span className="cartPlanPickRow">
                      <span className="cartPlanPickIcon" aria-hidden>
                        {cartFamilyIcon(peer.family, 16)}
                      </span>
                      <span>
                        <span className="cartPlanPickName">{peer.name}</span>
                        <span className="cartPlanPickMeta">
                          {peer.vcpu} vCPU · {peer.ramGb} GB RAM · {peer.nvmeGb}{" "}
                          GB NVMe · {peerLabel}/mo
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <p className="cartFieldLabel" id="cart-country-label">
        Country
      </p>
      <div
        className="cartCountrySeg"
        role="radiogroup"
        aria-labelledby="cart-country-label"
      >
        {cart.regions.map((entry) => {
          const active = entry.id === line.locationId;
          return (
            <button
              key={entry.id}
              type="button"
              role="radio"
              className="cartCountryBtn"
              aria-checked={active}
              data-active={active ? "true" : "false"}
              onClick={() => cart.onRegionChange(entry.id)}
            >
              <Image
                src={flagSrc(entry.countryCode)}
                alt=""
                width={20}
                height={14}
                className="cartCountryFlag"
                unoptimized
              />
              <span>{entry.name}</span>
            </button>
          );
        })}
      </div>
      {cart.region ? (
        <p className="cartHelper">
          Selected location:{" "}
          <Image
            src={flagSrc(cart.region.countryCode)}
            alt=""
            width={16}
            height={11}
            className="cartInlineFlag"
            unoptimized
          />{" "}
          {cart.region.name}
        </p>
      ) : null}

      <CartProvisionFields cart={cart} />
      <CartBillingTerms cart={cart} />

      <ul className="cartSpecs">
        {cart.specs.map((item) => (
          <li key={item}>
            <HiCheck size={14} aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <p className="cartDemoNote" role="note">
        {cart.demoNote}
      </p>
    </section>
  );
}
