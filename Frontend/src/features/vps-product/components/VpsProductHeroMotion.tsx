"use client";

/**
 * Centered VPS hero — Nourd type, Lucide trust icons, GSAP entrance.
 */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import type { Route } from "next";
import { useRef } from "react";
import { VpsProductHeroFeatures } from "@/features/vps-product/components/VpsProductHeroFeatures";
import { VPS_HERO_ICONS } from "@/features/vps-product/components/vpsHeroIcons";
import { VPS_PRODUCT } from "@/features/vps-product/model/vpsProductContent";

export function VpsProductHeroMotion() {
  const rootRef = useRef<HTMLElement>(null);
  const {
    titleLines,
    accentLine,
    lead,
    primaryCta,
    secondaryCta,
    trust,
  } = VPS_PRODUCT.hero;

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
      const lines = root.querySelectorAll<HTMLElement>("[data-hero-line]");
      const leadEl = root.querySelector<HTMLElement>("[data-hero-lead]");
      const actions = root.querySelector<HTMLElement>("[data-hero-actions]");
      const trustEl = root.querySelector<HTMLElement>("[data-hero-trust]");
      const cards = root.querySelectorAll<HTMLElement>("[data-hero-card]");

      root.dataset.motion = "ready";

      if (reduce.matches) {
        gsap.set([lines, leadEl, actions, trustEl, cards], {
          clearProps: "all",
          opacity: 1,
          y: 0,
        });
        return;
      }

      gsap.fromTo(
        lines,
        { yPercent: 14, opacity: 0.92 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.06,
          ease: "power3.out",
          clearProps: "willChange",
        },
      );

      gsap.fromTo(
        [leadEl, actions, trustEl].filter(Boolean),
        { y: 12, opacity: 0.92 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          delay: 0.18,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "willChange",
        },
      );

      gsap.fromTo(
        cards,
        { y: 16, opacity: 0.92 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          delay: 0.28,
          stagger: 0.05,
          ease: "power3.out",
          clearProps: "willChange",
        },
      );
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
          {titleLines.map((line) => (
            <span className="vpsProductHeroLineMask" key={line}>
              <span className="vpsProductHeroLine" data-hero-line>
                {line}
              </span>
            </span>
          ))}
          <span className="vpsProductHeroLineMask">
            <span
              className="vpsProductHeroLine vpsProductHeroLine--accent"
              data-hero-line
            >
              {accentLine}
            </span>
          </span>
        </h1>

        <p className="vpsProductHeroLead" data-hero-lead>
          {lead}
        </p>

        <div className="vpsProductHeroActions" data-hero-actions>
          <a
            href={primaryCta.href}
            className="vpsProductHeroCta vpsProductHeroCta--primary"
          >
            {primaryCta.label}
          </a>
          <Link
            href={secondaryCta.href as Route}
            className="vpsProductHeroCta vpsProductHeroCta--secondary"
          >
            {secondaryCta.label}
          </Link>
        </div>

        <ul className="vpsProductHeroTrust" data-hero-trust aria-label="VPS highlights">
          {trust.map((item) => {
            const Icon = VPS_HERO_ICONS[item.icon];
            return (
              <li key={item.id} className="vpsProductHeroTrustItem">
                <Icon size={16} strokeWidth={1.75} aria-hidden />
                <span>{item.label}</span>
              </li>
            );
          })}
        </ul>

        <VpsProductHeroFeatures />
      </div>
    </section>
  );
}
