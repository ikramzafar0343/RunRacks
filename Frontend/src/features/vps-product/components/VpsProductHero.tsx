/**
 * VPS product hero — two-column copy + layered server scene (Sage & Ink / Nourd).
 */
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { VPS_PRODUCT } from "@/features/vps-product/model/vpsProductContent";
import "@/features/vps-product/components/vps-product-hero.css";
import "@/features/vps-product/components/vps-product-hero-scene.css";
import "@/features/vps-product/components/vps-product-hero-responsive.css";

const ASSET = "/images/vps";

export function VpsProductHero() {
  const { hero } = VPS_PRODUCT;

  return (
    <section
      className="vpsProductHero"
      aria-labelledby="vps-product-hero-title"
    >
      <div className="vpsProductHeroInner">
        <div className="vpsProductHeroCopy">
          <h1 id="vps-product-hero-title" className="vpsProductHeroTitle">
            <span className="vpsProductHeroTitleLine">{hero.titleLine}</span>
            <span className="vpsProductHeroTitleAccent">{hero.accentLine}</span>
          </h1>
          <div
            className="vpsProductHeroHighlights"
            role="group"
            aria-label="Hosting highlights"
          >
            {hero.highlights.map((item) => (
              <span key={item.id} className="vpsProductHeroHighlight">
                <span className="vpsProductHeroHighlightIcon" aria-hidden>
                  <Image
                    src={`${ASSET}/icons/${item.icon}.svg`}
                    alt=""
                    width={24}
                    height={24}
                    unoptimized
                  />
                </span>
                <span>{item.label}</span>
              </span>
            ))}
          </div>
          <div className="vpsProductHeroActions">
            <a href={hero.primaryCta.href} className="vpsProductHeroCtaPrimary">
              {hero.primaryCta.label}
              <Image
                src={`${ASSET}/icons/arrow-right.svg`}
                alt=""
                width={19}
                height={19}
                unoptimized
              />
            </a>
            <Link
              href={hero.secondaryCta.href as Route}
              className="vpsProductHeroCtaSecondary"
            >
              {hero.secondaryCta.label}
            </Link>
          </div>
        </div>

        <div
          className="vpsProductHeroScene"
          aria-label="VPS server stack illustration"
        >
          <span className="vpsProductHeroHalo" aria-hidden />
          <span className="vpsProductHeroOrbits" aria-hidden />
          <span className="vpsProductHeroCloud" aria-hidden />
          <span className="vpsProductHeroBaseGlow" aria-hidden />
          <Image
            className="vpsProductHeroServer"
            src={hero.visual.src}
            alt={hero.visual.alt}
            width={740}
            height={590}
            sizes="(max-width: 600px) 82vw, (max-width: 1020px) 75vw, 39vw"
            preload
            quality={85}
          />
          {hero.specs.map((spec) => (
            <div
              key={spec.id}
              className={`vpsProductHeroSpec vpsProductHeroSpec--${spec.id}`}
            >
              <span className="vpsProductHeroSpecIcon" aria-hidden>
                <Image
                  src={`${ASSET}/icons/${spec.icon}.svg`}
                  alt=""
                  width={31}
                  height={31}
                  unoptimized
                />
              </span>
              <span className="vpsProductHeroSpecText">
                <strong>{spec.label}</strong>
                <small>{spec.value}</small>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
