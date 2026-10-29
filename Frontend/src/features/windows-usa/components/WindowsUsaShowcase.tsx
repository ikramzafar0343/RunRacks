"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import type { Route } from "next";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { WindowsUsaShowcaseControls } from "@/features/windows-usa/components/WindowsUsaShowcaseControls";
import { WindowsUsaShowcaseMedia } from "@/features/windows-usa/components/WindowsUsaShowcaseMedia";
import {
  SHOWCASE_AUTOPLAY_MS,
  WINDOWS_USA_SHOWCASE,
  WINDOWS_USA_SHOWCASE_SLIDES,
} from "@/features/windows-usa/model/windowsUsaShowcase";
import "@/features/windows-usa/components/windows-usa-showcase.css";
import "@/features/windows-usa/components/windows-usa-showcase-media.css";
import "@/features/windows-usa/components/windows-usa-showcase-responsive.css";

gsap.registerPlugin(ScrollTrigger);
const SLIDES = WINDOWS_USA_SHOWCASE_SLIDES;
const COUNT = SLIDES.length;

export function WindowsUsaShowcase() {
  const rootRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [liveMsg, setLiveMsg] = useState("");
  const transitioning = useRef(false);
  const direction = useRef<1 | -1>(1);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const reduced = useRef(false);
  const autoplayOn = isPlaying && !hoverPaused;

  const slide = SLIDES[activeIndex]!;

  useEffect(() => {
    reduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced.current) setIsPlaying(false);
  }, []);

  const goTo = useCallback((next: number, dir: 1 | -1) => {
    if (transitioning.current) return;
    const idx = ((next % COUNT) + COUNT) % COUNT;
    direction.current = dir;

    if (reduced.current) {
      setActiveIndex(idx);
      setLiveMsg(`Slide ${idx + 1} of ${COUNT}, ${SLIDES[idx]!.title}`);
      return;
    }

    const root = rootRef.current;
    if (!root) {
      setActiveIndex(idx);
      return;
    }

    transitioning.current = true;
    const copy = root.querySelector("[data-win-copy]");
    const features = root.querySelectorAll("[data-win-feature]");
    gsap
      .timeline({
        onComplete: () => {
          setActiveIndex(idx);
          setLiveMsg(`Slide ${idx + 1} of ${COUNT}, ${SLIDES[idx]!.title}`);
        },
      })
      .to([copy, ...features], {
        autoAlpha: 0,
        x: -dir * 10,
        duration: 0.18,
        stagger: 0.02,
        ease: "power2.in",
      });
  }, []);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || reduced.current) return;

      const ctx = gsap.context(() => {
        gsap
          .timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: {
              trigger: root,
              start: "top 82%",
              once: true,
            },
          })
          .fromTo(
            "[data-win-eyebrow]",
            { autoAlpha: 0, y: 8 },
            { autoAlpha: 1, y: 0, duration: 0.45 },
          )
          .fromTo(
            "[data-win-heading]",
            { autoAlpha: 0, y: 22 },
            { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" },
            "-=0.25",
          )
          .fromTo(
            "[data-win-media]",
            { autoAlpha: 0, y: 28, scale: 0.975 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" },
            "-=0.45",
          )
          .fromTo(
            "[data-win-copy]",
            { autoAlpha: 0, x: -18 },
            { autoAlpha: 1, x: 0, duration: 0.6 },
            "-=0.5",
          )
          .fromTo(
            "[data-win-feature]",
            { autoAlpha: 0, x: 12 },
            { autoAlpha: 1, x: 0, duration: 0.45, stagger: 0.07 },
            "-=0.45",
          )
          .fromTo(
            "[data-win-footer]",
            { autoAlpha: 0, y: 7 },
            { autoAlpha: 1, y: 0, duration: 0.4 },
            "-=0.2",
          );
      }, root);

      return () => ctx.revert();
    },
    { scope: rootRef },
  );

  useGSAP(
    () => {
      if (reduced.current) {
        transitioning.current = false;
        return;
      }
      const root = rootRef.current;
      if (!root) return;
      const copy = root.querySelector("[data-win-copy]");
      const features = root.querySelectorAll("[data-win-feature]");
      const dir = direction.current;
      gsap.fromTo(
        [copy, ...features],
        { autoAlpha: 0, x: dir * 8 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.45,
          stagger: 0.04,
          ease: "power2.out",
          onComplete: () => {
            transitioning.current = false;
          },
        },
      );
    },
    { dependencies: [activeIndex], scope: rootRef },
  );

  useEffect(() => {
    if (!autoplayOn || reduced.current) return;
    const id = window.setTimeout(() => {
      goTo(activeIndex + 1, 1);
    }, SHOWCASE_AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [activeIndex, autoplayOn, goTo]);

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) setIsPlaying(false);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(activeIndex - 1, -1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(activeIndex + 1, 1);
    }
  };

  const onPointerDown = (e: ReactPointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: ReactPointerEvent) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) goTo(activeIndex + 1, 1);
    else goTo(activeIndex - 1, -1);
  };

  return (
    <section
      ref={rootRef}
      id="windows-usa-showcase"
      className="winShowcase"
      aria-labelledby="windows-usa-showcase-heading"
      aria-roledescription="carousel"
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocusCapture={() => setHoverPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setHoverPaused(false);
        }
      }}
    >
      <div className="winShowcaseInner">
        <header className="winShowcaseHeader">
          <p className="winShowcaseEyebrow" data-win-eyebrow>
            <span className="winShowcaseDot" aria-hidden />
            {WINDOWS_USA_SHOWCASE.eyebrow}
          </p>
          <h2
            id="windows-usa-showcase-heading"
            className="winShowcaseHeading"
            data-win-heading
          >
            {WINDOWS_USA_SHOWCASE.heading}
          </h2>
        </header>

        <div
          className="winShowcaseStage"
          role="group"
          aria-roledescription="slide"
          aria-label={`${activeIndex + 1} of ${COUNT}: ${slide.title}`}
        >
          <p className="winShowcaseWatermark" aria-hidden>
            {WINDOWS_USA_SHOWCASE.watermark}
          </p>

          <article className="winShowcaseCopy" data-win-copy>
            <h3 className="winShowcaseTitle">{slide.title}</h3>
            <p className="winShowcaseDesc">{slide.description}</p>
            <Link href={slide.detailsHref as Route} className="winShowcaseCta">
              {WINDOWS_USA_SHOWCASE.ctaLabel}
            </Link>
          </article>

          <WindowsUsaShowcaseMedia
            mediaSrc={slide.mediaSrc}
            mediaAlt={slide.mediaAlt}
            preload={activeIndex === 0}
          />

          <ul className="winShowcaseFeatures">
            {slide.capabilities.map((cap) => (
              <li key={cap} className="winShowcaseFeature" data-win-feature>
                {cap}
              </li>
            ))}
          </ul>
        </div>

        <WindowsUsaShowcaseControls
          activeIndex={activeIndex}
          slideCount={COUNT}
          playing={isPlaying}
          onPrevious={() => goTo(activeIndex - 1, -1)}
          onNext={() => goTo(activeIndex + 1, 1)}
          onTogglePlay={() => setIsPlaying((p) => !p)}
        />
      </div>
      <p className="sr-only" aria-live="polite">
        {liveMsg}
      </p>
    </section>
  );
}
