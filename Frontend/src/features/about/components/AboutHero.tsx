"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import { ABOUT_HERO } from "../model/aboutContent";

export function AboutHero() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        root.querySelector("[data-hero-eyebrow]"),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.55 },
      )
        .fromTo(
          root.querySelectorAll("[data-hero-line]"),
          { opacity: 0, y: 42 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 },
          "-=0.2",
        )
        .fromTo(
          root.querySelector("[data-hero-lead]"),
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.35",
        )
        .fromTo(
          root.querySelector("[data-hero-cue]"),
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          "-=0.2",
        );
    },
    { scope: rootRef },
  );

  return (
    <header ref={rootRef} className="aboutHero">
      <div className="aboutHeroInner">
        <p className="aboutEyebrow aboutEyebrow--center" data-hero-eyebrow>
          {ABOUT_HERO.eyebrow}
        </p>
        <h1 className="aboutHeroTitle">
          {ABOUT_HERO.lines.map((line) => (
            <span key={line} data-hero-line>
              {line}
            </span>
          ))}
        </h1>
        <p className="aboutHeroLead" data-hero-lead>
          {ABOUT_HERO.lead}
        </p>
        <p className="aboutScrollCue" data-hero-cue>
          {ABOUT_HERO.scrollCue}
          <ChevronDown size={14} strokeWidth={2} aria-hidden />
        </p>
      </div>
    </header>
  );
}
