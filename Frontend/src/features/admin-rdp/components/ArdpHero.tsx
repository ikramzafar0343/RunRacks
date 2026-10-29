/**
 * Admin RDP hero — two-column copy + layered workstation scene (Sage & Ink / Nourd).
 */
import Image from "next/image";
import Link from "next/link";
import { ADMIN_RDP } from "@/features/admin-rdp/model/adminRdpContent";
import "@/features/admin-rdp/components/admin-rdp-hero.css";

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

        <div className="ardpHeroVisual" aria-label="Windows Admin RDP workstation scene">
          <Image
            className="ardpHeroHalo"
            src={`${ASSET}/hero-background-halo.svg`}
            alt=""
            width={970}
            height={590}
            unoptimized
            aria-hidden
          />
          <Image
            className="ardpHeroOrbits"
            src={`${ASSET}/hero-orbit-lines.svg`}
            alt=""
            width={970}
            height={590}
            unoptimized
            aria-hidden
          />
          <Image
            className="ardpHeroImage"
            src={hero.visual.src}
            alt={hero.visual.alt}
            width={960}
            height={472}
            sizes="(max-width: 700px) 100vw, (max-width: 1100px) 90vw, 55vw"
            preload
          />
          <div
            className="ardpHeroFloat ardpHeroFloat--connection"
            aria-label={`${hero.cards.connection.title}: ${hero.cards.connection.detail}`}
          >
            <Image
              className="ardpHeroFloatIcon"
              src={`${ASSET}/windows-logo.svg`}
              alt=""
              width={32}
              height={32}
              unoptimized
            />
            <span className="ardpHeroFloatText">
              <strong>{hero.cards.connection.title}</strong>
              <small>
                <i aria-hidden />
                {hero.cards.connection.detail}
              </small>
            </span>
          </div>
        </div>
      </div>
      <div className="ardpHeroRule" aria-hidden />
    </section>
  );
}
