/**
 * Centered product hero with catalog starting price.
 */
import type { ProductHostingContent } from "@/features/product-hosting/model/productHostingContent";
import type { StartingPrice } from "@/features/product-hosting/model/startingPrice";

type PhHeroProps = {
  content: ProductHostingContent;
  startingPrice: StartingPrice | null;
};

export function PhHero({ content, startingPrice }: PhHeroProps) {
  const { hero } = content;

  return (
    <section className="phHero" aria-labelledby="ph-hero-heading">
      <div className="phHeroGlow" aria-hidden="true" />
      <div className="phInner phHeroInner">
        <h1 id="ph-hero-heading" className="phHeroH1">
          {hero.h1}
        </h1>
        <p className="phHeroSupport">{hero.support}</p>
        {startingPrice ? (
          <p className="phHeroPrice">
            From <strong>{startingPrice.label}</strong>
            {startingPrice.compareLabel ? (
              <s aria-label={`Was ${startingPrice.compareLabel}`}>
                {startingPrice.compareLabel}
              </s>
            ) : null}
            <span> /mo</span>
          </p>
        ) : null}
        <div className="phHeroCtas">
          <a className="phBtn phBtn--primary" href="#vps-pricing">
            {hero.ctaLabel}
          </a>
        </div>
        <p className="phHeroNote">{hero.reassurance}</p>
      </div>
    </section>
  );
}
