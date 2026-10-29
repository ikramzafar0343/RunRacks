/**
 * Sticky summary — pricing-card layout matching plan tiles.
 */
"use client";

import Image from "next/image";
import { HiCheck } from "react-icons/hi2";
import {
  familyIcon,
  flagSrc,
} from "@/features/customize/components/customizeIcons";
import { CUSTOMIZE } from "@/features/customize/model/customizeContent";
import type { CustomizePriceResult } from "@/features/customize/model/customizePricing";
import {
  billingNoteForTerm,
  formatMoneyMinor,
} from "@/features/vps-pricing/model/formatPrice";
import type {
  BillingTermMonths,
  VpsFamily,
  VpsRegion,
} from "@/features/vps-pricing/model/types";

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
  /** Override summary CTAs (e.g. `#vps-plans` when embedded on the VPS page). */
  plansHref?: string;
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
}: CustomizePriceCardProps) {
  const features = [
    `${vcpu} vCPU`,
    `${ramGb} GB RAM`,
    `${nvmeGb} GB NVMe`,
    `${bandwidthTb} TB bandwidth`,
    ...(dedicatedIpv4 ? [CUSTOMIZE.addons.dedicatedIpv4.label] : []),
    ...(automatedBackups ? [CUSTOMIZE.addons.automatedBackups.label] : []),
  ];
  const primaryHref = plansHref ?? CUSTOMIZE.summary.cta.href;
  const secondaryHref = plansHref ?? CUSTOMIZE.summary.secondary.href;

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

      <a className="czCtaPrimary" href={primaryHref}>
        {CUSTOMIZE.summary.cta.label}
      </a>

      <ul className="czPriceCardFeatures">
        {features.map((item) => (
          <li key={item} className="czPriceCardFeature">
            <HiCheck className="czPriceCardCheck" size={16} aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <p className="czNotice">{price.notice}</p>

      <a className="czCtaSecondary" href={secondaryHref}>
        {CUSTOMIZE.summary.secondary.label}
      </a>
    </article>
  );
}
