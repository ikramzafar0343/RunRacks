/**
 * VPS product hero — light copy column + deploy terminal (Sage & Ink / Nourd).
 */
import Link from "next/link";
import type { Route } from "next";
import type { LucideIcon } from "lucide-react";
import {
  BadgeDollarSign,
  CloudUpload,
  Globe,
  HardDrive,
  Headset,
  Rocket,
} from "lucide-react";
import { VpsHeroTerminal } from "@/features/vps-product/components/VpsHeroTerminal";
import { VPS_PRODUCT } from "@/features/vps-product/model/vpsProductContent";
import type { StartingPrice } from "@/features/product-hosting/model/startingPrice";
import "@/features/vps-product/components/vps-product-hero.css";
import "@/features/vps-product/components/vps-product-hero-responsive.css";

const PILL_ICONS: Record<
  (typeof VPS_PRODUCT.hero.pills)[number]["icon"],
  LucideIcon
> = {
  badgeDollarSign: BadgeDollarSign,
  hardDrive: HardDrive,
  cloudUpload: CloudUpload,
  globe: Globe,
  rocket: Rocket,
  headset: Headset,
};

export type VpsProductHeroProps = {
  startingPrice?: StartingPrice | null;
};

export function VpsProductHero({
  startingPrice = null,
}: VpsProductHeroProps = {}) {
  const { hero } = VPS_PRODUCT;

  return (
    <section
      className="vpsProductHero"
      aria-labelledby="vps-product-hero-title"
    >
      <div className="vpsProductHeroGrid" aria-hidden />
      <div className="vpsProductHeroInner">
        <div className="vpsProductHeroCopy">
          <h1 id="vps-product-hero-title" className="vpsProductHeroTitle">
            <span className="vpsProductHeroTitleLine">{hero.titleLine}</span>
            <span className="vpsProductHeroTitleAccent">{hero.accentLine}</span>
          </h1>
          <p className="vpsProductHeroLead">{hero.lead}</p>
          {startingPrice ? (
            <p className="vpsProductHeroPrice">
              {hero.pricePrefix}{" "}
              <strong className="vpsProductHeroPriceValue">
                {startingPrice.label}
              </strong>
              {hero.priceSuffix}
            </p>
          ) : null}
          <ul className="vpsProductHeroPills" aria-label="Plan highlights">
            {hero.pills.map((pill) => {
              const Icon = PILL_ICONS[pill.icon];
              return (
                <li key={pill.id} className="vpsProductHeroPill">
                  <Icon
                    className="vpsProductHeroPillIcon"
                    strokeWidth={2.25}
                    aria-hidden
                  />
                  <span>{pill.label}</span>
                </li>
              );
            })}
          </ul>
          <div className="vpsProductHeroActions">
            <a href={hero.primaryCta.href} className="vpsProductHeroCtaPrimary">
              {hero.primaryCta.label}
              <span aria-hidden>→</span>
            </a>
            <Link
              href={hero.secondaryCta.href as Route}
              className="vpsProductHeroCtaSecondary"
            >
              {hero.secondaryCta.label}
            </Link>
          </div>
        </div>
        <div className="vpsProductHeroTerminalWrap">
          <VpsHeroTerminal />
        </div>
      </div>
    </section>
  );
}
