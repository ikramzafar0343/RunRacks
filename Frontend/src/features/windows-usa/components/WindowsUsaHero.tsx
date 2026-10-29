"use client";

/**
 * Windows USA hero — Sage herowith-logos + Cobe globe (catalog region pins).
 */
import { HeroWithLogos } from "@/components/ui/herowith-logos";
import {
  WINDOWS_USA,
  WINDOWS_USA_GLOBE_MARKERS,
} from "@/features/windows-usa/model/windowsUsaContent";

export function WindowsUsaHero() {
  const { hero } = WINDOWS_USA;
  return (
    <HeroWithLogos
      badge={hero.badge}
      title={hero.title}
      subtitle={hero.subtitle}
      primaryCta={hero.primaryCta}
      secondaryCta={hero.secondaryCta}
      logos={hero.logos}
      logosNotice={hero.logosNotice}
      globeMarkers={WINDOWS_USA_GLOBE_MARKERS}
    />
  );
}
