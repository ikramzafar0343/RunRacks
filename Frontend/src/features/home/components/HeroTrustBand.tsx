/**
 * Trustpilot-style rating strip under the hero portrait.
 * Stars use Trustpilot green; avoid inventing review counts.
 */
import type { CSSProperties } from "react";
import { SiTrustpilot } from "react-icons/si";
import type { HeroTrustBandContent } from "@/features/home/model/heroContent";
import "@/features/home/components/home-hero-trust.css";

type HeroTrustBandProps = {
  band: HeroTrustBandContent;
};

const STAR_SLOTS = [1, 2, 3, 4, 5] as const;

export function HeroTrustBand({ band }: HeroTrustBandProps) {
  const reviewInner = (
    <>
      <span className="homeHeroTrustReviews">{band.reviewsLabel}</span>
      <span className="homeHeroTrustBrand">
        <SiTrustpilot size={18} aria-hidden="true" />
        {band.brand}
      </span>
    </>
  );

  return (
    <div
      className="homeHeroTrustBand"
      role="group"
      aria-label={`${band.label}, ${band.score} out of 5 on ${band.brand}. ${band.notice}`}
    >
      <p className="homeHeroTrustNotice" role="note">
        {band.notice}
      </p>
      <span className="homeHeroTrustLabel">{band.label}</span>

      <span className="homeHeroTrustStars" aria-hidden="true">
        {STAR_SLOTS.map((slot) => {
          const fill = Math.min(1, Math.max(0, band.score - (slot - 1)));
          const style = { "--fill": String(fill) } as CSSProperties;
          return (
            <span key={slot} className="homeHeroTrustStar" style={style}>
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M12 2.5l2.7 6.4 6.9.6-5.2 4.6 1.6 6.7L12 17.8 5.9 20.8l1.6-6.7L2.4 9.5l6.9-.6L12 2.5z" />
              </svg>
            </span>
          );
        })}
      </span>

      {band.href ? (
        <a
          className="homeHeroTrustLink"
          href={band.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {reviewInner}
        </a>
      ) : (
        <span className="homeHeroTrustLink homeHeroTrustLinkStatic">
          {reviewInner}
        </span>
      )}
    </div>
  );
}
