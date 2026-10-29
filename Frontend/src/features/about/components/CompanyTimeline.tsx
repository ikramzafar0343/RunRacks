"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { ABOUT_TIMELINE, ABOUT_TIMELINE_INTRO } from "../model/aboutContent";

gsap.registerPlugin(ScrollTrigger);

export function CompanyTimeline() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const progress = root.querySelector<HTMLElement>(
        "[data-timeline-progress]",
      );
      const items = root.querySelectorAll<HTMLElement>("[data-timeline-item]");

      if (progress) {
        gsap.fromTo(
          progress,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root.querySelector("[data-timeline-list]"),
              start: "top 70%",
              end: "bottom 55%",
              scrub: 0.65,
            },
          },
        );
      }

      items.forEach((item) => {
        ScrollTrigger.create({
          trigger: item,
          start: "center 65%",
          end: "bottom 35%",
          onEnter: () => item.classList.add("is-active"),
          onEnterBack: () => item.classList.add("is-active"),
          onLeave: () => item.classList.remove("is-active"),
          onLeaveBack: () => item.classList.remove("is-active"),
        });

        const media = item.querySelector(".aboutTimelineMedia");
        const copy = item.querySelector(".aboutTimelineCopy");
        const flip = item.classList.contains("aboutTimelineItem--flip");

        gsap.fromTo(
          media,
          { opacity: 0, x: flip ? -44 : 44 },
          {
            opacity: 1,
            x: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 82%", once: true },
          },
        );
        gsap.fromTo(
          copy,
          { opacity: 0, x: flip ? 26 : -26 },
          {
            opacity: 1,
            x: 0,
            duration: 0.75,
            ease: "power2.out",
            scrollTrigger: { trigger: item, start: "top 82%", once: true },
          },
        );
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="aboutSection aboutSection--canvas"
      aria-labelledby="about-timeline-heading"
    >
      <div className="aboutInner">
        <div className="aboutLeadNarrow" style={{ marginBottom: "3rem" }}>
          <p className="aboutEyebrow">{ABOUT_TIMELINE_INTRO.eyebrow}</p>
          <h2 id="about-timeline-heading" className="aboutH2">
            {ABOUT_TIMELINE_INTRO.title}
          </h2>
          <p className="aboutLeadNarrow">{ABOUT_TIMELINE_INTRO.description}</p>
        </div>

        <div className="aboutTimeline">
          <div className="aboutTimelineTrack" aria-hidden>
            <div className="aboutTimelineProgress" data-timeline-progress />
          </div>
          <ol className="aboutTimelineList" data-timeline-list>
            {ABOUT_TIMELINE.map((step, index) => (
              <li
                key={step.id}
                className={
                  index % 2 === 1
                    ? "aboutTimelineItem aboutTimelineItem--flip"
                    : "aboutTimelineItem"
                }
                data-timeline-item
              >
                <div className="aboutTimelineCopy">
                  <p className="aboutTimelinePhase">{step.phase}</p>
                  <h3 className="aboutTimelineTitle">{step.title}</h3>
                  <p className="aboutTimelineBody">{step.description}</p>
                </div>
                <div className="aboutTimelineMedia aboutMedia">
                  <Image
                    src={step.image.src}
                    alt={step.image.alt}
                    fill
                    sizes="(max-width: 960px) 100vw, 40vw"
                  />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
