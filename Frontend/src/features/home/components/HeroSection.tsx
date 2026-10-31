/**
 * Homepage hero — intro + portrait scene with floating product cues.
 */
import Link from "next/link";
import { HiOutlineShieldCheck } from "react-icons/hi2";
import { heroContent } from "@/features/home/model/heroContent";
import { HeroPortraitScene } from "@/features/home/components/HeroPortraitScene";
import "@/features/home/components/home-hero.css";

export function HeroSection() {
  const content = heroContent;

  return (
    <section className="homeHero" aria-label="RunRacks product introduction">
      <div className="homeHeroIntro">
        <h1 className="homeHeroHeadline homeHeroEnterHeadline">
          {content.headlineLine1}
          <br className="homeHeroHeadlineBreak" /> {content.headlineLine2}
        </h1>

        <p className="homeHeroDescription homeHeroEnterDescription">
          {content.description}
        </p>

        <div className="homeHeroEnterCta">
          <div className="homeHeroCtaRow">
            <Link href={content.ctaHref} className="homeHeroCta">
              {content.ctaLabel}
            </Link>
            <Link href={content.aiCta.href} className="homeHeroCtaSecondary">
              {content.aiCta.label}
            </Link>
          </div>
          <p className="homeHeroTrust">
            <HiOutlineShieldCheck
              className="homeHeroTrustIcon"
              size={16}
              aria-hidden="true"
            />
            {content.trust}
          </p>
        </div>
      </div>

      <HeroPortraitScene
        visualSrc={content.visualSrc}
        visualAlt={content.visualAlt}
        trustBand={content.trustBand}
      />
    </section>
  );
}
