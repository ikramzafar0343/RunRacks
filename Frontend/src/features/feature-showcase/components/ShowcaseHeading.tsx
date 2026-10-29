/**
 * Showcase intro — centered, Sage green → ink on scroll (Brands pattern).
 * Client boundary is FeatureShowcaseSection (parent).
 */
import Link from "next/link";
import { useRef } from "react";
import { SHOWCASE_INTRO } from "@/features/feature-showcase/model/showcaseData";
import { useScrollInk } from "@/shared/lib/useScrollInk";

function Sparkle() {
  return (
    <svg
      className="fsSparkle"
      viewBox="0 0 12 12"
      width={11}
      height={11}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 0.5L7.2 4.8L11.5 6L7.2 7.2L6 11.5L4.8 7.2L0.5 6L4.8 4.8L6 0.5Z" />
    </svg>
  );
}

function ExploreArrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 11L11 3M11 3H5.5M11 3V8.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ShowcaseHeading() {
  const blockRef = useRef<HTMLElement>(null);
  useScrollInk(blockRef, { property: "--fs-ink" });

  return (
    <header className="fsHeader" ref={blockRef}>
      <p className="fsEyebrow">
        <Sparkle />
        <span>{SHOWCASE_INTRO.eyebrow}</span>
      </p>

      <h2 id="feature-showcase-title" className="fsHeading">
        <span className="fsHeadingLine fsHeadingLinePrimary">
          {SHOWCASE_INTRO.headingLine1}
        </span>
        <span className="fsHeadingLine fsHeadingLineSecondary">
          {SHOWCASE_INTRO.headingLine2}
        </span>
      </h2>

      <p className="fsSupporting">{SHOWCASE_INTRO.supporting}</p>

      <Link href={SHOWCASE_INTRO.ctaHref} className="fsExploreCta">
        {SHOWCASE_INTRO.ctaLabel}
        <ExploreArrow />
      </Link>
    </header>
  );
}
