"use client";

/**
 * Platforms logo strip — seamless marquee; static when reduced-motion.
 */
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { VPS_PRODUCT } from "@/features/vps-product/model/vpsProductContent";
import "@/features/vps-product/components/vps-client-strip.css";

export function VpsClientStrip() {
  const { logos } = VPS_PRODUCT;
  const rootRef = useRef<HTMLElement>(null);
  const [offscreen, setOffscreen] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setOffscreen(!entry?.isIntersecting),
      { threshold: 0.05 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  const brands = logos.brands;
  const drifting = brands.length >= 5;

  return (
    <section
      ref={rootRef}
      className="vpsClientStrip"
      id="vps-platforms"
      aria-labelledby="vps-platforms-heading"
    >
      <div className="vpsClientStripInner">
        <h2 id="vps-platforms-heading" className="vpsClientStripHeading">
          {logos.heading}
        </h2>
        <p className="vpsClientStripIntro">{logos.intro}</p>
      </div>

      <div className="vpsClientStripRail">
        <ul
          className="vpsClientStripTrack"
          data-paused={offscreen || !drifting ? "true" : "false"}
        >
          {brands.map((brand) => (
            <li className="vpsClientStripItem" key={brand.id}>
              <Image
                src={brand.src}
                alt={brand.name}
                width={brand.intrinsicWidth}
                height={brand.intrinsicHeight}
                sizes={`${brand.displayWidth}px`}
                style={{ width: brand.displayWidth }}
                loading="lazy"
              />
            </li>
          ))}
          {drifting
            ? brands.map((brand) => (
                <li
                  className="vpsClientStripItem vpsClientStripClone"
                  key={`clone-${brand.id}`}
                  aria-hidden="true"
                >
                  <Image
                    src={brand.src}
                    alt=""
                    width={brand.intrinsicWidth}
                    height={brand.intrinsicHeight}
                    sizes={`${brand.displayWidth}px`}
                    style={{ width: brand.displayWidth }}
                    loading="lazy"
                  />
                </li>
              ))
            : null}
        </ul>
      </div>
    </section>
  );
}
