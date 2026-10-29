/**
 * Admin RDP hero — text + CTAs + tilted image band, Sage & Ink.
 */
import Link from "next/link";
import { TiltedGridHero } from "@/components/ui/tilted-grid-hero";
import { ADMIN_RDP } from "@/features/admin-rdp/model/adminRdpContent";
import "@/features/admin-rdp/components/admin-rdp-hero.css";

export function ArdpHero() {
  const { hero, heroGallery } = ADMIN_RDP;
  const images = heroGallery.map((img) => ({
    src: img.src,
    alt: img.alt,
  }));

  return (
    <section className="ardpHero" aria-labelledby="ardp-hero-title">
      <div className="ardpHeroInner">
        <p className="ardpHeroEyebrow">{hero.eyebrow}</p>
        <h1 id="ardp-hero-title" className="ardpHeroTitle">
          {hero.lines.map((line) => (
            <span key={line} className="ardpHeroTitleLine">
              {line}
            </span>
          ))}
        </h1>
        <p className="ardpHeroLead">{hero.lead}</p>
        <div className="ardpHeroCtas">
          <Link href={hero.primaryCta.href} className="ardpHeroCtaPrimary">
            {hero.primaryCta.label}
          </Link>
          <Link href={hero.secondaryCta.href} className="ardpHeroCtaSecondary">
            {hero.secondaryCta.label}
          </Link>
        </div>
      </div>
      <TiltedGridHero
        images={images}
        className="ardpHeroGrid mt-10 h-[260px] w-full sm:h-[320px] lg:h-[380px]"
        speed={4}
        curve={80}
        axis={56}
        tileHeight={32}
        aspectRatio={1}
      />
    </section>
  );
}
