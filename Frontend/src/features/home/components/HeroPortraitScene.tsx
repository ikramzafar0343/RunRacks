/**
 * Hero portrait with floating product cue cards (illustrative only).
 */
import Image from "next/image";
import { FaWindows } from "react-icons/fa";
import { HiLockClosed } from "react-icons/hi2";
import { SiDebian, SiUbuntu } from "react-icons/si";
import type { HeroTrustBandContent } from "@/features/home/model/heroContent";
import { HeroTrustBand } from "@/features/home/components/HeroTrustBand";
import "@/features/home/components/home-hero-scene.css";

type HeroPortraitSceneProps = {
  visualSrc: string;
  visualAlt: string;
  trustBand: HeroTrustBandContent;
  /** Windows product page uses Windows/RDP cues instead of Linux. */
  variant?: "default" | "windows";
};

export function HeroPortraitScene({
  visualSrc,
  visualAlt,
  trustBand,
  variant = "default",
}: HeroPortraitSceneProps) {
  const isWindows = variant === "windows";

  return (
    <div className="homeHeroScene homeHeroEnterVisual">
      <div className="homeHeroSceneStage">
        <article
          className="homeHeroFloat homeHeroFloatTerminal"
          aria-hidden="true"
        >
          <header className="homeHeroFloatChrome">
            <span className="homeHeroFloatDots">
              <i />
              <i />
              <i />
            </span>
            <span>{isWindows ? "Remote" : "Terminal"}</span>
          </header>
          <pre className="homeHeroFloatCode">
            <code>
              {isWindows ? (
                <>
                  <span className="homeHeroFloatPrompt">
                    mstsc /v:your-server
                  </span>
                  {"\n"}
                  <span>Session ready</span>
                </>
              ) : (
                <>
                  <span className="homeHeroFloatPrompt">
                    $ ssh root@your-server
                  </span>
                  {"\n"}
                  <span>Server created</span>
                </>
              )}
            </code>
          </pre>
        </article>

        <article className="homeHeroFloat homeHeroFloatCpu" aria-hidden="true">
          <div className="homeHeroFloatRing" />
          <div>
            <strong>CPU</strong>
            <span>Live view</span>
          </div>
        </article>

        <div className="homeHeroScenePortrait">
          <Image
            src={visualSrc}
            alt={visualAlt}
            width={576}
            height={1024}
            // Home LCP only — Windows mobile paints title first, so skip preload there.
            {...(isWindows ? {} : { preload: true })}
            sizes={
              isWindows
                ? "(max-width: 479px) 90vw, (max-width: 959px) 420px, 460px"
                : "(max-width: 768px) 68vw, 250px"
            }
            quality={75}
            className="homeHeroVisualImg"
          />
        </div>

        <article className="homeHeroFloat homeHeroFloatOs" aria-hidden="true">
          <h3>Choose your OS</h3>
          <ul>
            {isWindows ? (
              <>
                <li>
                  <FaWindows size={18} color="#00A4EF" />
                  Windows Server
                </li>
                <li>
                  <FaWindows size={18} color="#00A4EF" />
                  Admin RDP
                </li>
              </>
            ) : (
              <>
                <li>
                  <SiUbuntu size={18} color="#E95420" />
                  Ubuntu
                </li>
                <li>
                  <SiDebian size={18} color="#A80030" />
                  Debian
                </li>
              </>
            )}
          </ul>
        </article>

        <article className="homeHeroFloat homeHeroFloatRoot" aria-hidden="true">
          <HiLockClosed size={18} />
          <span>{isWindows ? "Admin access" : "Root access"}</span>
        </article>
      </div>

      <HeroTrustBand band={trustBand} />
    </div>
  );
}
