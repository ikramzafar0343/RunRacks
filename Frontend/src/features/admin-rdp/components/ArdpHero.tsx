/**
 * Admin RDP hero — copy + product workstation shot (Sage & Ink / Nourd).
 */
import Image from "next/image";
import Link from "next/link";
import { ADMIN_RDP } from "@/features/admin-rdp/model/adminRdpContent";
import "@/features/admin-rdp/components/admin-rdp-hero.css";
import "@/features/admin-rdp/components/admin-rdp-hero-responsive.css";

const ASSET = "/images/admin-rdp";

export function ArdpHero() {
  const { hero } = ADMIN_RDP;
  const [titleMain, titleAccent] = hero.lines;

  return (
    <section className="ardpHero" aria-labelledby="ardp-hero-title">
      <div className="ardpHeroShell">
        <div className="ardpHeroCopy">
          <h1 id="ardp-hero-title" className="ardpHeroTitle">
            <span className="ardpHeroTitleLine">{titleMain}</span>
            {titleAccent ? (
              <span className="ardpHeroTitleAccent">{titleAccent}</span>
            ) : null}
          </h1>
          <p className="ardpHeroLead">{hero.lead}</p>
          <div className="ardpHeroCtas">
            <Link href={hero.primaryCta.href} className="ardpHeroCtaPrimary">
              {hero.primaryCta.label}
              <Image
                src={`${ASSET}/arrow-right.svg`}
                alt=""
                width={19}
                height={19}
                unoptimized
              />
            </Link>
            <Link href={hero.secondaryCta.href} className="ardpHeroCtaSecondary">
              {hero.secondaryCta.label}
            </Link>
          </div>
          <div className="ardpHeroNote" role="group" aria-label="Highlights">
            <span className="ardpHeroStatusDot" aria-hidden />
            <span>{hero.notes[0]}</span>
            <span className="ardpHeroNoteDivider" aria-hidden />
            <span>{hero.notes[1]}</span>
          </div>
        </div>

        <div className="ardpHeroVisual">
          <div className="ardpHeroPlate">
            <picture>
              <source
                media="(max-width: 700px)"
                srcSet={hero.visualMobile.src}
                type="image/webp"
              />
              <Image
                className="ardpHeroImage"
                src={hero.visual.src}
                alt={hero.visual.alt}
                width={1024}
                height={576}
                sizes="(max-width: 700px) 100vw, (max-width: 1100px) 90vw, 55vw"
                preload
                unoptimized
              />
            </picture>
          </div>
        </div>
      </div>
    </section>
  );
}
