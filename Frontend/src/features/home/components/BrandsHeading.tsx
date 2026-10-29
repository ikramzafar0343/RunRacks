"use client";

/**
 * Brands headline — Sage green on enter, blends to black as you scroll.
 */
import { useRef } from "react";
import {
  brandsEyebrow,
  brandsHeadingLine1,
  brandsHeadingLine2,
  brandsNotice,
} from "@/features/home/model/brandsContent";
import { useScrollInk } from "@/shared/lib/useScrollInk";

function BrandSparkle() {
  return (
    <svg
      className="brandsSparkle"
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

export function BrandsHeading() {
  const blockRef = useRef<HTMLDivElement>(null);
  useScrollInk(blockRef, { property: "--brands-ink" });

  return (
    <div className="brandsHeadingBlock" ref={blockRef}>
      <p className="brandsEyebrow">
        <BrandSparkle />
        <span>{brandsEyebrow}</span>
      </p>

      <h2 id="brands-heading" className="brandsHeading">
        <span className="brandsHeadingLine brandsHeadingLinePrimary">
          {brandsHeadingLine1}
        </span>
        <span className="brandsHeadingLine brandsHeadingLineSecondary">
          {brandsHeadingLine2}
        </span>
      </h2>

      <p className="brandsNotice" role="note">
        {brandsNotice}
      </p>
    </div>
  );
}
