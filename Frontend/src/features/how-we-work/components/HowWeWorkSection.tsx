"use client";

/**
 * How We Work — RunRacks hosting process board (homepage).
 */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import type { Route } from "next";
import { useRef } from "react";
import { ProcessBoard } from "@/features/how-we-work/components/ProcessBoard";
import { PROCESS_INTRO } from "@/features/how-we-work/model/processSteps";
import "@/features/how-we-work/components/how-we-work.css";
import "@/features/how-we-work/components/how-we-work-board.css";

gsap.registerPlugin(ScrollTrigger);

export function HowWeWorkSection() {
  const rootRef = useRef<HTMLElement>(null);
  const { eyebrow, titleLine1, titleLine2, description, ctaLabel, ctaHref } =
    PROCESS_INTRO;

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (reduce.matches) return;

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: root,
            start: "top 78%",
            once: true,
          },
        });

        tl.fromTo(
          root.querySelector("[data-process-eyebrow]"),
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.55 },
        )
          .fromTo(
            root.querySelector("[data-process-title]"),
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.75, ease: "power3.out" },
            "-=0.35",
          )
          .fromTo(
            root.querySelector("[data-process-desc]"),
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.7 },
            "-=0.4",
          )
          .fromTo(
            root.querySelector("[data-process-cta]"),
            { autoAlpha: 0, y: 12, scale: 0.98 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.55 },
            "-=0.35",
          );

        const nodes = root.querySelectorAll("[data-process-node]");
        const board = root.querySelector(".processBoard");
        if (nodes.length && board) {
          gsap.fromTo(
            nodes,
            { autoAlpha: 0, y: 26, scale: 0.975 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              stagger: 0.11,
              ease: "power3.out",
              scrollTrigger: {
                trigger: board,
                start: "top 85%",
                once: true,
              },
            },
          );
        }

        const paths = root.querySelectorAll<SVGPathElement>(
          ".processConnectorPath",
        );
        paths.forEach((path) => {
          const len = path.getTotalLength();
          gsap.set(path, {
            strokeDasharray: len,
            strokeDashoffset: len,
          });
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 0.85,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: board,
              start: "top 85%",
              once: true,
            },
          });
        });
      }, root);

      return () => ctx.revert();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="how-we-work"
      className="processSection"
      aria-labelledby="how-we-work-title"
    >
      <div className="processDots" aria-hidden />
      <div className="processAccentDots" aria-hidden />
      <div className="processInner">
        <div className="processIntro">
          <div className="processIntroLeft">
            <p className="processEyebrow" data-process-eyebrow>
              {eyebrow}
            </p>
            <h2
              id="how-we-work-title"
              className="processTitle"
              data-process-title
            >
              <span className="processTitleLine">{titleLine1}</span>
              <span className="processTitleLine">{titleLine2}</span>
            </h2>
          </div>
          <div className="processIntroRight">
            <p className="processDescription" data-process-desc>
              {description}
            </p>
            <Link
              href={ctaHref as Route}
              className="processCta"
              data-process-cta
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
        <ProcessBoard />
      </div>
    </section>
  );
}
