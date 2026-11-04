/**
 * Cart configure page — seeded from Choose plan; editable region / server type / tier.
 * Continue to Payment advances to /checkout (payment provider still not live).
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useEffect, useMemo, useState } from "react";
import {
  HiCheck,
  HiChevronDown,
  HiLockClosed,
  HiMagnifyingGlass,
  HiOutlineShoppingBag,
  HiShieldCheck,
} from "react-icons/hi2";
import { MdHeadsetMic } from "react-icons/md";
import { useCart } from "@/features/cart/lib/CartProvider";
import {
  familyLabel,
  pickPlanForFamily,
  plansForFamily,
  termSavePercent,
} from "@/features/cart/lib/cartPlanHelpers";
import {
  CART_FAMILIES,
  type CartBillingTerm,
} from "@/features/cart/model/cartTypes";
import {
  PROVISION_DEMO_NOTE,
  defaultProvisionForFamily,
  getAppOptions,
  getOsOptions,
} from "@/features/cart/model/provisionCatalog";
import {
  CART_PAYMENT_MARKS,
  cartAppIcon,
  cartFamilyIcon,
  cartOsIcon,
} from "@/features/cart/components/cartProvisionIcons";
import { flagSrc } from "@/features/customize/components/customizeIcons";
import { CUSTOMIZE } from "@/features/customize/model/customizeContent";
import { calculateCustomizePrice } from "@/features/customize/model/customizePricing";
import { fetchVpsCatalog } from "@/features/vps-pricing/lib/fetchVpsCatalog";
import { selectPlanPrice } from "@/features/vps-pricing/lib/selectPlanPrice";
import {
  billingNoteForTerm,
  formatMoneyMinor,
} from "@/features/vps-pricing/model/formatPrice";
import type {
  VpsCatalogPayload,
  VpsFamily,
  VpsPlan,
} from "@/features/vps-pricing/model/types";
import { DEMO_PRICING_ANSWER } from "@/shared/content/demoPricingCopy";
import "@/features/cart/components/cart-page.css";

const STEPS = [
  { id: "choose", label: "Choose Plan", state: "done" as const },
  { id: "configure", label: "Configure", state: "active" as const },
  { id: "review", label: "Review & Checkout", state: "todo" as const },
  { id: "complete", label: "Complete", state: "todo" as const },
];

const TERMS: readonly CartBillingTerm[] = [1, 3, 6, 12];

function termTitle(term: CartBillingTerm): string {
  if (term === 1) return "1 month";
  if (term === 3) return "3 months";
  if (term === 6) return "6 months";
  return "12 months";
}

export function CartConfigurePage() {
  const { line, hydrated, updateLine, clearCart } = useCart();
  const [catalog, setCatalog] = useState<VpsCatalogPayload | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [planPickerOpen, setPlanPickerOpen] = useState(false);
  const [serversOpen, setServersOpen] = useState(true);
  const [couponOpen, setCouponOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchVpsCatalog()
      .then((data) => {
        if (!cancelled) setCatalog(data);
      })
      .catch(() => {
        if (!cancelled) setLoadError("Unable to load catalog plans.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const plan = useMemo(() => {
    if (!catalog || !line) return null;
    return catalog.plans.find((entry) => entry.id === line.planId) ?? null;
  }, [catalog, line]);

  const activeFamily: VpsFamily | null =
    plan?.family ?? line?.custom?.family ?? null;

  useEffect(() => {
    if (!hydrated || !catalog || !line) return;
    if (plan) {
      if (!line.osId) {
        updateLine(defaultProvisionForFamily(plan.family));
      }
      return;
    }
    if (line.custom) {
      if (!line.osId) {
        updateLine(defaultProvisionForFamily(line.custom.family));
      }
      return;
    }
    clearCart();
  }, [hydrated, catalog, line, plan, updateLine, clearCart]);

  const region = useMemo(() => {
    if (!catalog || !line) return null;
    return (
      catalog.regions.find((entry) => entry.id === line.locationId) ??
      catalog.regions[0] ??
      null
    );
  }, [catalog, line]);

  const osList = useMemo(() => {
    if (!activeFamily) return [];
    const all = getOsOptions(activeFamily);
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((os) => os.name.toLowerCase().includes(q));
  }, [activeFamily, query]);

  const appList = useMemo(() => {
    if (!activeFamily) return [];
    const all = getAppOptions(activeFamily);
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((app) => app.name.toLowerCase().includes(q));
  }, [activeFamily, query]);

  const selectedOs = useMemo(() => {
    if (!activeFamily || !line) return null;
    return getOsOptions(activeFamily).find((os) => os.id === line.osId) ?? null;
  }, [activeFamily, line]);

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

  const peerPlans = useMemo(() => {
    if (!catalog || !activeFamily || !line) return [];
    return plansForFamily(catalog.plans, activeFamily).filter((entry) =>
      entry.availableRegionIds.includes(line.locationId),
    );
  }, [catalog, activeFamily, line]);

  function repriceCustom(
    next: Partial<{
      locationId: string;
      term: CartBillingTerm;
      family: VpsFamily;
    }>,
  ) {
    if (!line?.custom) return null;
    const family = next.family ?? line.custom.family;
    const locationId = next.locationId ?? line.locationId;
    const term = next.term ?? line.term;
    const priced = calculateCustomizePrice({
      family,
      regionId: locationId,
      billingTermMonths: term,
      vcpu: line.custom.vcpu,
      ramGb: line.custom.ramGb,
      nvmeGb: line.custom.nvmeGb,
      bandwidthTb: line.custom.bandwidthTb,
      dedicatedIpv4: line.custom.dedicatedIpv4,
      automatedBackups: line.custom.automatedBackups,
    });
    const label =
      CUSTOMIZE.families.find((entry) => entry.id === family)?.label ??
      line.custom.label;
    return {
      ...line.custom,
      family,
      label,
      monthlyMinor: priced.monthlyMinor,
      termTotalMinor: priced.termTotalMinor,
      currency: priced.currency,
    };
  }

  function onRegionChange(locationId: string) {
    if (!catalog || !line || !activeFamily) return;
    if (line.custom) {
      const custom = repriceCustom({ locationId });
      updateLine({ locationId, ...(custom ? { custom } : {}) });
      return;
    }
    if (!plan) return;
    let nextPlan: VpsPlan | null = plan;
    if (!plan.availableRegionIds.includes(locationId)) {
      nextPlan = pickPlanForFamily(
        catalog.plans,
        plan.family,
        locationId,
        plan.ramGb,
      );
    }
    updateLine({
      locationId,
      ...(nextPlan && nextPlan.id !== plan.id ? { planId: nextPlan.id } : {}),
    });
  }

  function onServerTypeChange(family: VpsFamily) {
    if (!catalog || !line || !activeFamily) return;
    if (family === activeFamily) return;
    if (line.custom) {
      const custom = repriceCustom({ family });
      updateLine({
        ...(custom ? { custom, planId: `custom:${family}` } : {}),
        ...defaultProvisionForFamily(family),
      });
      setPlanPickerOpen(false);
      return;
    }
    const next = pickPlanForFamily(
      catalog.plans,
      family,
      line.locationId,
      plan?.ramGb,
    );
    if (!next) return;
    updateLine({
      planId: next.id,
      custom: null,
      ...defaultProvisionForFamily(family),
    });
    setPlanPickerOpen(false);
  }

  function onSelectPlan(planId: string) {
    if (!catalog || !line) return;
    const next = catalog.plans.find((entry) => entry.id === planId);
    if (!next) return;
    updateLine({
      planId: next.id,
      custom: null,
      ...defaultProvisionForFamily(next.family),
    });
    setPlanPickerOpen(false);
  }

  function onSelectOs(osId: string) {
    if (!activeFamily) return;
    const os = getOsOptions(activeFamily).find((entry) => entry.id === osId);
    updateLine({
      osId,
      osVersion: os?.versions[0] ?? null,
      appId: null,
    });
  }

  function onTermChange(term: CartBillingTerm) {
    if (!line) return;
    if (line.custom) {
      const custom = repriceCustom({ term });
      updateLine({ term, ...(custom ? { custom } : {}) });
      return;
    }
    updateLine({ term });
  }

  if (!hydrated) {
    return (
      <main className="cartPage cartPage--empty">
        <div className="cartPageInner cartEmpty">
          <p className="cartEmptyLead">Loading your cart…</p>
        </div>
      </main>
    );
  }

  if (!line || (!plan && !line.custom) || !activeFamily) {
    return (
      <main className="cartPage cartPage--empty">
        <div className="cartPageDecor" aria-hidden>
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
        <div className="cartPageInner cartEmpty">
          <p className="cartEmptyBrand">RunRacks</p>
          <div className="cartEmptyIcon" aria-hidden>
            <HiOutlineShoppingBag size={28} />
          </div>
          <h1 className="cartEmptyTitle">Your cart is empty</h1>
          <p className="cartEmptyLead">
            Nothing to configure yet. Choose a catalog plan on Pricing, or build
            one on Customize — your server lands here next.
          </p>
          <div className="cartEmptyActions">
            <Link href={"/pricing" as Route} className="cartEmptyCta">
              View plans
            </Link>
            <Link
              href={"/customize" as Route}
              className="cartEmptyCtaSecondary"
            >
              Customize
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const displayMinor =
    price?.monthlyEquivalentMinor ?? price?.amountMinor ?? null;
  const amountLabel =
    displayMinor != null && price
      ? formatMoneyMinor(displayMinor, price.currency)
      : "—";
  const termTotalLabel =
    price != null
      ? formatMoneyMinor(price.amountMinor, price.currency)
      : "—";
  const selectedLabel = selectedOs
    ? `${selectedOs.name}${line.osVersion ? ` ${line.osVersion}` : ""}`
    : "None";
  const isLinux = activeFamily === "linux";
  const sshHelper = isLinux
    ? "Without a key a root password is shown once in your panel."
    : "Administrator / RDP access details are issued after provisioning — no password is generated on this demo page.";

  const productName = line.custom?.label ?? plan?.name ?? familyLabel(activeFamily);
  const productBadge = line.custom ? "Custom build" : plan?.badge;
  const productTagline = line.custom
    ? "Configured on Customize"
    : plan?.tagline?.replace(/\|/g, " ") ?? null;

  const specs = line.custom
    ? [
        `${line.custom.vcpu} vCPU`,
        `${line.custom.ramGb} GB RAM`,
        `${line.custom.nvmeGb} GB NVMe`,
        `${line.custom.bandwidthTb} TB bandwidth`,
        ...(line.custom.dedicatedIpv4
          ? [CUSTOMIZE.addons.dedicatedIpv4.label]
          : []),
        ...(line.custom.automatedBackups
          ? [CUSTOMIZE.addons.automatedBackups.label]
          : []),
      ]
    : [
        `${plan!.vcpu} vCPU`,
        `${plan!.ramGb} GB RAM`,
        `${plan!.nvmeGb} GB NVMe`,
        ...(plan!.trafficTb != null ? [`${plan!.trafficTb} TB bandwidth`] : []),
      ];

  return (
    <main className="cartPage">
      <div className="cartPageDecor" aria-hidden>
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

      <div className="cartPageInner">
        <header>
          <h1 className="cartPageTitle">Your cart</h1>
          <p className="cartPageLead">
            Pick your billing term and region, configure the start image, then
            continue when checkout is connected.
          </p>
        </header>

        <ol className="cartStepper" aria-label="Checkout progress">
          {STEPS.map((step) => (
            <li key={step.id} className="cartStep" data-state={step.state}>
              <span className="cartStepDot" aria-hidden>
                {step.state === "done" ? <HiCheck size={12} /> : step.id === "configure" ? "2" : step.id === "review" ? "3" : "4"}
              </span>
              <span className="cartStepLabel">{step.label}</span>
            </li>
          ))}
        </ol>

        {loadError ? (
          <p className="cartPageLead" role="alert">
            {loadError}
          </p>
        ) : null}

        <div className="cartMain">
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
                  Your {familyLabel(activeFamily)}, where it runs, and what it
                  starts with. Choose the billing term.
                </p>
              </div>
            </div>

            <div className="cartProductRow">
              <span className="cartProductIcon" aria-hidden>
                {cartFamilyIcon(activeFamily, 20)}
              </span>
              <div className="cartProductMeta">
                <p className="cartProductName">
                  {productName}
                  {productBadge ? (
                    <span className="cartProductBadge">{productBadge}</span>
                  ) : null}
                </p>
                <p className="cartProductTag">
                  {familyLabel(activeFamily)}
                  {productTagline ? ` · ${productTagline}` : null}
                </p>
              </div>
              <button
                type="button"
                className="cartLinkBtn"
                onClick={() => setPlanPickerOpen((open) => !open)}
              >
                {planPickerOpen ? "Hide plans" : "Change plan"}
              </button>
              <button
                type="button"
                className="cartLinkBtn cartLinkBtnDanger"
                onClick={clearCart}
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
                  onClick={() => onServerTypeChange(family.id)}
                >
                  <span className="cartServerTypeIcon" aria-hidden>
                    {cartFamilyIcon(family.id, 14)}
                  </span>
                  {family.label}
                </button>
              ))}
            </div>

            {planPickerOpen ? (
              <div className="cartPlanPick">
                <p className="cartFieldLabel" style={{ marginTop: 0 }}>
                  {familyLabel(activeFamily)} plans
                  {line.custom ? " (picking a catalog plan replaces this custom build)" : ""}
                </p>
                <ul className="cartPlanPickList">
                  {peerPlans.map((peer) => {
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
                            !line.custom && peer.id === plan?.id
                              ? "true"
                              : "false"
                          }
                          onClick={() => onSelectPlan(peer.id)}
                        >
                          <span className="cartPlanPickRow">
                            <span className="cartPlanPickIcon" aria-hidden>
                              {cartFamilyIcon(peer.family, 16)}
                            </span>
                            <span>
                              <span className="cartPlanPickName">
                                {peer.name}
                              </span>
                              <span className="cartPlanPickMeta">
                                {peer.vcpu} vCPU · {peer.ramGb} GB RAM ·{" "}
                                {peer.nvmeGb} GB NVMe · {peerLabel}/mo
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
              {(catalog?.regions ?? []).map((entry) => {
                const active = entry.id === line.locationId;
                return (
                  <button
                    key={entry.id}
                    type="button"
                    role="radio"
                    className="cartCountryBtn"
                    aria-checked={active}
                    data-active={active ? "true" : "false"}
                    onClick={() => onRegionChange(entry.id)}
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
            {region ? (
              <p className="cartHelper">
                Selected location:{" "}
                <Image
                  src={flagSrc(region.countryCode)}
                  alt=""
                  width={16}
                  height={11}
                  className="cartInlineFlag"
                  unoptimized
                />{" "}
                {region.name}
              </p>
            ) : null}

            <div className="cartOsHead">
              <h3>Operating system or app</h3>
              <p className="cartOsSelected">
                Selected:{" "}
                {selectedOs ? (
                  <span className="cartOsSelectedMark">
                    <span aria-hidden>{cartOsIcon(selectedOs.id, 14)}</span>
                    {selectedLabel}
                  </span>
                ) : (
                  selectedLabel
                )}
              </p>
            </div>

            <div className="cartSearchWrap">
              <HiMagnifyingGlass size={14} aria-hidden />
              <input
                className="cartSearch"
                type="search"
                placeholder="Search OS or apps"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search OS or apps"
              />
            </div>

            <p className="cartGroupLabel">Operating systems</p>
            <ul className="cartOsGrid">
              {osList.map((os) => (
                <li key={os.id}>
                  <button
                    type="button"
                    className="cartChoice cartOsChoice"
                    data-active={line.osId === os.id ? "true" : "false"}
                    onClick={() => onSelectOs(os.id)}
                  >
                    <span className="cartOsLogo" aria-hidden>
                      {cartOsIcon(os.id, 22)}
                    </span>
                    <span>
                      <span className="cartChoiceName">{os.name}</span>
                      <span className="cartChoiceMeta">
                        {os.versionCount} version
                        {os.versionCount === 1 ? "" : "s"}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            {selectedOs && selectedOs.versions.length > 0 ? (
              <>
                <p className="cartFieldLabel">{selectedOs.name} versions</p>
                <div className="cartVersions" role="group">
                  {selectedOs.versions.map((version) => (
                    <button
                      key={version}
                      type="button"
                      className="cartVersionBtn"
                      data-active={
                        line.osVersion === version ? "true" : "false"
                      }
                      onClick={() => updateLine({ osVersion: version })}
                    >
                      {version}
                    </button>
                  ))}
                </div>
              </>
            ) : null}

            <p className="cartGroupLabel">Apps</p>
            <ul className="cartAppGrid">
              {appList.map((app) => (
                <li key={app.id}>
                  <button
                    type="button"
                    className="cartChoice cartAppChoice"
                    data-active={line.appId === app.id ? "true" : "false"}
                    onClick={() =>
                      updateLine({
                        appId: line.appId === app.id ? null : app.id,
                      })
                    }
                  >
                    <span className="cartAppLogo" aria-hidden>
                      {cartAppIcon(app.id, 18)}
                    </span>
                    <span>
                      <span className="cartChoiceName">{app.name}</span>
                      <span className="cartChoiceMeta">{app.blurb}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="cartCreds">
              <div>
                <label className="cartFieldLabel" htmlFor="cart-hostname">
                  Host name (required)
                </label>
                <input
                  id="cart-hostname"
                  className="cartInput"
                  value={line.hostname}
                  placeholder="web01.example.com"
                  onChange={(event) =>
                    updateLine({ hostname: event.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="cartFieldLabel" htmlFor="cart-ssh">
                  {isLinux
                    ? "SSH public key (optional)"
                    : "Access note (optional)"}
                </label>
                <textarea
                  id="cart-ssh"
                  className="cartTextarea"
                  value={line.sshKey}
                  placeholder={
                    isLinux ? "ssh-ed25519 AAAA..." : "Optional notes for setup"
                  }
                  onChange={(event) => updateLine({ sshKey: event.target.value })}
                />
                <p className="cartHelper">{sshHelper}</p>
              </div>
            </div>

            <p className="cartFieldLabel">Billing term</p>
            <div className="cartBillingGrid">
              {TERMS.map((term) => {
                const customTermPrice = line.custom
                  ? calculateCustomizePrice({
                      family: line.custom.family,
                      regionId: line.locationId,
                      billingTermMonths: term,
                      vcpu: line.custom.vcpu,
                      ramGb: line.custom.ramGb,
                      nvmeGb: line.custom.nvmeGb,
                      bandwidthTb: line.custom.bandwidthTb,
                      dedicatedIpv4: line.custom.dedicatedIpv4,
                      automatedBackups: line.custom.automatedBackups,
                    })
                  : null;
                const termPrice = plan
                  ? selectPlanPrice(plan, term, line.locationId)
                  : null;
                const termMinor = customTermPrice
                  ? customTermPrice.monthlyMinor
                  : (termPrice?.monthlyEquivalentMinor ??
                    termPrice?.amountMinor ??
                    null);
                const termCurrency =
                  customTermPrice?.currency ?? termPrice?.currency ?? "USD";
                const termLabel =
                  termMinor != null
                    ? formatMoneyMinor(termMinor, termCurrency)
                    : "—";
                const save = plan
                  ? termSavePercent(plan, term, line.locationId)
                  : null;
                return (
                  <button
                    key={term}
                    type="button"
                    className="cartBillingCard"
                    data-active={line.term === term ? "true" : "false"}
                    onClick={() => onTermChange(term)}
                  >
                    <p className="cartBillingTitle">
                      {termTitle(term)}
                      {line.term === term ? " ✓" : ""}
                    </p>
                    {term === 1 ? (
                      <span className="cartChoiceMeta">Pay monthly</span>
                    ) : save != null ? (
                      <span className="cartBillingSave">Save {save}%</span>
                    ) : null}
                    <p className="cartBillingPrice">{termLabel}/mo</p>
                  </button>
                );
              })}
            </div>
            <p className="cartBillingNote">
              {termTotalLabel} today for {termTitle(line.term)}.{" "}
              {billingNoteForTerm(line.term)}. Demo catalog — cancel anytime once
              live billing exists.
            </p>

            <ul className="cartSpecs">
              {specs.map((item) => (
                <li key={item}>
                  <HiCheck size={14} aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="cartDemoNote" role="note">
              {PROVISION_DEMO_NOTE} {catalog?.notice ?? ""}
            </p>
          </section>

          <aside className="cartCard" aria-labelledby="cart-summary-title">
            <div className="cartSummaryHead">
              <h2 id="cart-summary-title">Order summary</h2>
              <Link href="/pricing" className="cartLinkBtn">
                Edit Cart
              </Link>
            </div>

            <div className="cartSummaryBlock">
              <button
                type="button"
                className="cartSummaryToggle"
                aria-expanded={serversOpen}
                onClick={() => setServersOpen((open) => !open)}
              >
                <span>Servers (1)</span>
                <HiChevronDown size={16} aria-hidden />
              </button>
              {serversOpen ? (
                <>
                  <div className="cartSummaryLine">
                    <span>{productName}</span>
                    <span>{amountLabel}</span>
                  </div>
                  <div className="cartSummaryLine cartSummaryMuted">
                    <span>{termTitle(line.term)} billing</span>
                    <span>{amountLabel}/mo</span>
                  </div>
                </>
              ) : null}
            </div>

            <div className="cartSetupFee">
              <span>Setup fee</span>
              <span>
                {price
                  ? formatMoneyMinor(0, price.currency)
                  : "$0.00"}
              </span>
            </div>

            <div className="cartSummaryBlock">
              <button
                type="button"
                className="cartSummaryToggle"
                aria-expanded={couponOpen}
                onClick={() => setCouponOpen((open) => !open)}
              >
                <span>Have a coupon code?</span>
                <HiChevronDown size={16} aria-hidden />
              </button>
              {couponOpen ? (
                <input
                  className="cartInput"
                  style={{ marginTop: "0.45rem" }}
                  value={line.coupon}
                  placeholder="Coupon code"
                  onChange={(event) =>
                    updateLine({ coupon: event.target.value })
                  }
                  aria-label="Coupon code"
                />
              ) : null}
            </div>

            <div className="cartSummaryLine" style={{ marginTop: "0.85rem" }}>
              <span>Subtotal</span>
              <span>{amountLabel}</span>
            </div>
            <div className="cartSummaryLine cartSummaryMuted">
              <span>Taxes</span>
              <span>Calculated when checkout is connected</span>
            </div>

            <div className="cartTotalRow">
              <span>Total due today</span>
              <strong>{termTotalLabel}</strong>
            </div>
            <p className="cartHelper">
              Billed in your account currency when you sign in.{" "}
              {DEMO_PRICING_ANSWER}
            </p>

            <Link
              href={"/checkout" as Route}
              className="cartPayBtn cartPayBtnLink"
              title="Continue to review — payment provider is not configured yet"
            >
              <HiLockClosed size={15} aria-hidden />
              Continue to Payment
            </Link>

            <div className="cartGuarantee">
              <HiShieldCheck size={18} aria-hidden />
              <div>
                <h3>30-Day Money Back Guarantee</h3>
                <p>
                  Demo policy label for the configure UI — live refund terms
                  apply when checkout is connected.
                </p>
              </div>
            </div>

            <div className="cartAccept">
              <p className="cartAcceptLabel">We accept</p>
              <ul className="cartPayMarks">
                {CART_PAYMENT_MARKS.map(({ id, label, Icon, color }) => (
                  <li key={id} className="cartPayMark">
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

        <p className="cartDomainNote">
          Cloud servers don&apos;t need a domain.{" "}
          <Link href="/contact">Add a domain anyway</Link>
        </p>

        <div className="cartTrust">
          <div className="cartTrustItem">
            <HiLockClosed size={16} aria-hidden />
            <div>
              <h3>Secure checkout</h3>
              <p>
                Encrypted connection, card details stay with the payment
                provider
              </p>
            </div>
          </div>
          <div className="cartTrustItem">
            <HiShieldCheck size={16} aria-hidden />
            <div>
              <h3>Activated after payment</h3>
              <p>
                Setup automatically as soon as your payment is confirmed
              </p>
            </div>
          </div>
          <div className="cartTrustItem">
            <MdHeadsetMic size={16} aria-hidden />
            <div>
              <h3>24/7 Expert Support</h3>
              <p>Our team is here to help anytime</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
