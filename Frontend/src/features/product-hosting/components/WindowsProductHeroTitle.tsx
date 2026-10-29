"use client";

/**
 * Masked line reveal for Windows hero title — same motion pattern as VPS hero.
 */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

type WindowsProductHeroTitleProps = {
  lines: readonly string[];
};

export function WindowsProductHeroTitle({
  lines,
}: WindowsProductHeroTitleProps) {
  const rootRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
      const lineEls = root.querySelectorAll<HTMLElement>("[data-hero-line]");

      root.dataset.motion = "ready";

      if (reduce.matches) {
        gsap.set(lineEls, { clearProps: "all", opacity: 1, yPercent: 0 });
        return;
      }

      // Soft enhance only — never leave LCP title at opacity 0 pre-hydrate.
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
    },
    { scope: rootRef },
  );

  return (
    <h1
      ref={rootRef}
      id="win-hero-heading"
      className="winHeroH1"
      data-motion="ready"
    >
      {lines.map((line) => (
        <span className="winHeroLineMask" key={line}>
          <span className="winHeroLine" data-hero-line="true">
            {line}
          </span>
        </span>
      ))}
    </h1>
  );
}
