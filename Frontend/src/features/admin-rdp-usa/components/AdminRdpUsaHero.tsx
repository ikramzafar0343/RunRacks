"use client";

/**
 * Admin RDP USA hero — Sage herowith-logos + Cobe globe (same shell as Windows USA).
 */
import { HeroWithLogos } from "@/components/ui/herowith-logos";
import {
  ADMIN_RDP_USA,
  ADMIN_RDP_USA_GLOBE_MARKERS,
} from "@/features/admin-rdp-usa/model/adminRdpUsaContent";

export function AdminRdpUsaHero() {
  const { hero } = ADMIN_RDP_USA;
  return (
    <HeroWithLogos
      badge={hero.badge}
      title={hero.title}
      subtitle={hero.subtitle}
      primaryCta={hero.primaryCta}
      secondaryCta={hero.secondaryCta}
      logos={hero.logos}
      logosNotice={hero.logosNotice}
      globeMarkers={ADMIN_RDP_USA_GLOBE_MARKERS}
    />
  );
}
