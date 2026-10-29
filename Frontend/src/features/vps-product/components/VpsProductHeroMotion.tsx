"use client";

/**
 * GreenTech-style masked line reveal for VPS hero (GSAP).
 */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { VPS_PRODUCT } from "@/features/vps-product/model/vpsProductContent";

export function VpsProductHeroMotion() {
  const rootRef = useRef<HTMLElement>(null);
  const { lines, supportLines } = VPS_PRODUCT.hero;

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
      const lineEls = root.querySelectorAll<HTMLElement>("[data-hero-line]");
      const support = root.querySelector<HTMLElement>("[data-hero-support]");

      root.dataset.motion = "ready";

      if (reduce.matches) {
        gsap.set([lineEls, support], { clearProps: "all", opacity: 1, y: 0 });
        return;
      }

      // Soft enhance only — never leave LCP copy at opacity 0 pre-hydrate.
      gsap.fromTo(
        lineEls,
        { yPercent: 18, opacity: 0.92 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.72,
          stagger: 0.07,
          ease: "power3.out",
          clearProps: "willChange",
        },
      );

      if (support) {
        gsap.fromTo(
          support,
          { y: 10, opacity: 0.92 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            delay: 0.2,
            ease: "power3.out",
            clearProps: "willChange",
          },
        );
      }
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="vpsProductHero"
      aria-labelledby="vps-product-hero-title"
      data-motion="ready"
    >
      <div className="vpsProductHeroInner">
        <h1 id="vps-product-hero-title" className="vpsProductHeroTitle">
          {lines.map((line) => (
            <span className="vpsProductHeroLineMask" key={line}>
              <span className="vpsProductHeroLine" data-hero-line="true">
                {line}
              </span>
            </span>
          ))}
        </h1>
        <p className="vpsProductHeroSupport" data-hero-support="true">
          {supportLines.map((line) => (
            <span className="vpsProductHeroSupportLine" key={line}>
              {line}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
