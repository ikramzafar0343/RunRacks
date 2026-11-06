/**
 * Sticky summary — pricing-card layout matching plan tiles.
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { HiCheck } from "react-icons/hi2";
import {
  familyIcon,
  flagSrc,
} from "@/features/customize/components/customizeIcons";
import { CUSTOMIZE } from "@/features/customize/model/customizeContent";
import type { CustomizePriceResult } from "@/features/customize/model/customizePricing";
import { billingNoteForTerm, formatMoneyMinor } from "@/features/vps-pricing";
import "@/features/customize/components/customize-summary.css";
import type {
  BillingTermMonths,
  VpsFamily,
  VpsRegion,
} from "@/features/vps-pricing";

export type CustomizePriceCardProps = {
  family: VpsFamily;
  familyLabel: string;
  region: VpsRegion | undefined;
  term: BillingTermMonths;
  vcpu: number;
  ramGb: number;
  nvmeGb: number;
  bandwidthTb: number;
  dedicatedIpv4: boolean;
  automatedBackups: boolean;
  price: CustomizePriceResult;
  /** Override secondary compare link (e.g. `#vps-plans` when embedded). */
  plansHref?: string;
  /** Primary link when the card should open a specific build instead of Pricing. */
  primaryHref?: string;
  primaryLabel?: string;
  /** Add configured build to cart (preferred over linking to Pricing). */
  onChoosePlan?: () => void;
};

export function CustomizePriceCard({
  family,
  familyLabel,
  region,
  term,
  vcpu,
  ramGb,
  nvmeGb,
  bandwidthTb,
  dedicatedIpv4,
  automatedBackups,
  price,
  plansHref,
  primaryHref,
  primaryLabel,
  onChoosePlan,
}: CustomizePriceCardProps) {
  const features = [
    `${vcpu} vCPU`,
    `${ramGb} GB RAM`,
    `${nvmeGb} GB NVMe`,
    `${bandwidthTb} TB bandwidth`,
    ...(dedicatedIpv4 ? [CUSTOMIZE.addons.dedicatedIpv4.label] : []),
    ...(automatedBackups ? [CUSTOMIZE.addons.automatedBackups.label] : []),
  ];
  const secondaryHref = (plansHref ??
    CUSTOMIZE.summary.secondary.href) as Route;

  return (
    <article className="czPriceCard" aria-live="polite">
      <span className="czPriceCardBadge">Demo</span>

      <header className="czPriceCardHead">
        <span className="czPriceCardFamilyIcon" aria-hidden>
          {familyIcon(family)}
        </span>
        <h2 className="czPriceCardName">{familyLabel}</h2>
        {region ? (
          <p className="czPriceCardRegion">
            <Image
              src={flagSrc(region.countryCode)}
              alt=""
              width={18}
              height={12}
              className="czSpecFlag"
              unoptimized
            />
            {region.name}
          </p>
        ) : null}
      </header>

      <div className="czPriceCardPrice">
        <p className="czPriceMonthly">
          {formatMoneyMinor(price.monthlyMinor, price.currency)}
          <span className="czPriceMoSuffix">/mo</span>
        </p>
        <p className="czPriceTerm">
          {billingNoteForTerm(term)}
          {term !== 1 ? (
            <>
              {" "}
              · Total {formatMoneyMinor(price.termTotalMinor, price.currency)}
            </>
          ) : null}
        </p>
      </div>

      {onChoosePlan ? (
        <button type="button" className="czCtaPrimary" onClick={onChoosePlan}>
          {CUSTOMIZE.summary.cta.label}
        </button>
      ) : (
        <Link
          className="czCtaPrimary"
          href={
            (primaryHref ?? plansHref ?? CUSTOMIZE.summary.cta.href) as Route
          }
        >
          {primaryLabel ?? CUSTOMIZE.summary.cta.label}
        </Link>
      )}

      <ul className="czPriceCardFeatures">
        {features.map((item) => (
          <li key={item} className="czPriceCardFeature">
            <HiCheck className="czPriceCardCheck" size={16} aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <p className="czNotice">{price.notice}</p>

      <Link className="czCtaSecondary" href={secondaryHref}>
        {CUSTOMIZE.summary.secondary.label}
      </Link>
    </article>
  );
}
