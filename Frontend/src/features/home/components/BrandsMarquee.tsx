"use client";

/**
 * Dual-row logo marquee — pauses animation while off-screen.
 */
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  brandsRowOne,
  brandsRowTwo,
  type BrandLogo,
} from "@/features/home/model/brandsContent";

function BrandItems({
  brands,
  keyPrefix,
  decorative,
}: {
  brands: readonly BrandLogo[];
  keyPrefix: string;
  decorative?: boolean;
}) {
  return (
    <>
      {brands.map((brand) => (
        <li
          className={decorative ? "brandsItem brandsItemClone" : "brandsItem"}
          key={`${keyPrefix}-${brand.id}`}
          aria-hidden={decorative ? true : undefined}
        >
          <Image
            src={brand.src}
            alt={decorative ? "" : brand.name}
            width={brand.intrinsicWidth}
            height={brand.intrinsicHeight}
            className="brandsLogo"
            style={{ width: brand.displayWidth }}
            sizes={`${brand.displayWidth}px`}
            loading="lazy"
            decoding="async"
          />
        </li>
      ))}
    </>
  );
}

export function BrandsMarquee() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setPaused(!entry?.isIntersecting);
      },
      { rootMargin: "80px 0px", threshold: 0 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className="brandsMarquee"
      data-paused={paused ? "true" : "false"}
      aria-label="Platforms and technologies"
    >
      <div className="brandsMarqueeRail brandsMarqueeRailA">
        <ul className="brandsMarqueeTrack">
          <BrandItems brands={brandsRowOne} keyPrefix="a1" />
          <BrandItems brands={brandsRowOne} keyPrefix="a2" decorative />
        </ul>
      </div>

      <div className="brandsMarqueeRail brandsMarqueeRailB">
        <ul className="brandsMarqueeTrack">
          <BrandItems brands={brandsRowTwo} keyPrefix="b1" />
          <BrandItems brands={brandsRowTwo} keyPrefix="b2" decorative />
        </ul>
      </div>
    </div>
  );
}
