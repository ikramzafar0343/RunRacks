"use client";

/**
 * USA VPS hero — PulseFit layout adapted with Sage map atmosphere + hosting cards.
 */
import { PulseFitHero } from "@/components/ui/pulse-fit-hero";
import { UsaMapPlane } from "@/features/vps-usa/components/UsaMapPlane";
import {
  VPS_USA,
  VPS_USA_MAP_DOTS,
} from "@/features/vps-usa/model/vpsUsaContent";

export function VpsUsaHero() {
  const { brand, title, lead, primaryCta, secondaryCta, disclaimer, programs } =
    VPS_USA.hero;

  return (
    <PulseFitHero
      showChrome={false}
      brand={brand}
      title={title}
      subtitle={lead}
      disclaimer={disclaimer}
      primaryAction={{
        label: primaryCta.label,
        href: primaryCta.href,
      }}
      secondaryAction={{
        label: secondaryCta.label,
        href: secondaryCta.href,
      }}
      programs={programs.map((p) => ({
        image: p.image,
        category: p.category,
        title: p.title,
        href: p.href,
      }))}
      className="usaHero"
      atmosphere={
        <UsaMapPlane dots={VPS_USA_MAP_DOTS} className="usaHeroWorldMap" loop />
      }
    />
  );
}
