/**
 * Windows product hero — two title lines + homepage portrait scene + trust band.
 */
import Link from "next/link";
import { HeroPortraitScene } from "@/features/home/components/HeroPortraitScene";
import { heroContent } from "@/features/home/model/heroContent";
import { WindowsProductHeroTitle } from "@/features/product-hosting/components/WindowsProductHeroTitle";
import type { ProductHostingContent } from "@/features/product-hosting/model/productHostingContent";
import type { StartingPrice } from "@/features/product-hosting/model/startingPrice";
import { TRY_AI_CTA } from "@/shared/config/navConfig";
import "@/features/home/components/home-hero-scene.css";
import "@/features/home/components/home-hero-trust.css";
import "@/features/product-hosting/components/windows-product-hero.css";

type WindowsProductHeroProps = {
  content: ProductHostingContent;
  startingPrice: StartingPrice | null;
};

export function WindowsProductHero({
  content,
  startingPrice,
}: WindowsProductHeroProps) {
  const { hero } = content;
  const lines = hero.lines && hero.lines.length > 0 ? hero.lines : [hero.h1];

  return (
    <section className="winHero" aria-labelledby="win-hero-heading">
      <div className="winHeroInner">
        <div className="winHeroCopy">
          <WindowsProductHeroTitle lines={lines} />

          <div className="winHeroFooter">
            {startingPrice ? (
              <p className="winHeroPrice">
                <span className="winHeroPriceLead">
                  {hero.priceLeadIn ?? "From"}{" "}
                </span>
                <strong>{startingPrice.label}</strong>
                {startingPrice.compareLabel ? (
                  <s aria-label={`Was ${startingPrice.compareLabel}`}>
                    {startingPrice.compareLabel}
                  </s>
                ) : null}
                <span className="winHeroPriceUnit">/mo</span>
              </p>
            ) : null}

            <a className="winHeroCta" href="#vps-pricing">
              {hero.ctaLabel}
              <span aria-hidden="true">→</span>
            </a>
            <Link className="winHeroCtaSecondary" href={TRY_AI_CTA.href}>
              {TRY_AI_CTA.label}
            </Link>
          </div>

          <p className="winHeroNote">{hero.reassurance}</p>
        </div>

        <div className="winHeroVisual">
          <HeroPortraitScene
            visualSrc="/images/product-hosting/windows-hero-portrait.webp"
            visualAlt="Person using a laptop on a Windows VPS-ready workspace"
            trustBand={heroContent.trustBand}
            variant="windows"
          />
        </div>
      </div>
    </section>
  );
}
