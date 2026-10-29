"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import type { FeatureItem } from "../model/types";

gsap.registerPlugin(ScrollTrigger);

type FeatureRowProps = {
  feature: FeatureItem;
};

export function FeatureRow({ feature }: FeatureRowProps) {
  const rootRef = useRef<HTMLElement>(null);
  const mediaRight = feature.mediaSide === "right";

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const img = root.querySelector("img");
      const copyBits = root.querySelectorAll("[data-feature-bit]");

      gsap.fromTo(
        copyBits,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.09,
          ease: "power2.out",
          scrollTrigger: { trigger: root, start: "top 84%", once: true },
        },
      );

      if (img) {
        gsap.fromTo(
          img,
          { scale: 1.075, opacity: 0.65 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: root, start: "top 83%", once: true },
          },
        );
      }
    },
    { scope: rootRef, dependencies: [feature.id] },
  );

  return (
    <section
      ref={rootRef}
      className={
        mediaRight
          ? "aboutInner aboutFeatureRow aboutFeatureRow--mediaRight"
          : "aboutInner aboutFeatureRow"
      }
      aria-labelledby={`feature-${feature.id}`}
    >
      <div className="aboutFeatureMedia aboutMedia">
        <Image
          src={feature.image.src}
          alt={feature.image.alt}
          fill
          sizes="(max-width: 960px) 100vw, 50vw"
          style={
            feature.image.objectPosition
              ? { objectPosition: feature.image.objectPosition }
              : undefined
          }
        />
      </div>
      <div className="aboutFeatureCopy">
        <p className="aboutFeatureIndex" data-feature-bit>
          {feature.indexLabel}
        </p>
        <p className="aboutEyebrow" data-feature-bit>
          {feature.eyebrow}
        </p>
        <h3
          id={`feature-${feature.id}`}
          className="aboutFeatureTitle"
          data-feature-bit
        >
          {feature.title}
        </h3>
        <p className="aboutFeatureLead" data-feature-bit>
          {feature.lead}
        </p>
        <p className="aboutFeatureBody" data-feature-bit>
          {feature.body}
        </p>
      </div>
    </section>
  );
}
