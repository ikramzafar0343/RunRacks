"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useId, useState } from "react";
import { ABOUT_PRINCIPLES, ABOUT_STORIES_INTRO } from "../model/aboutContent";

export function TeamStoriesCarousel() {
  const labelId = useId();
  const [index, setIndex] = useState(0);
  const total = ABOUT_PRINCIPLES.length;
  const current = ABOUT_PRINCIPLES[index];

  const go = useCallback(
    (next: number) => {
      setIndex((prev) => {
        const target = next;
        if (target < 0 || target >= total) return prev;
        return target;
      });
    },
    [total],
  );

  if (!current) return null;

  return (
    <section
      className="aboutSection aboutSection--surface"
      aria-labelledby="about-stories-heading"
    >
      <div className="aboutInner">
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <p className="aboutEyebrow aboutEyebrow--center">
            {ABOUT_STORIES_INTRO.eyebrow}
          </p>
          <h2
            id="about-stories-heading"
            className="aboutH2"
            style={{ marginInline: "auto" }}
          >
            {ABOUT_STORIES_INTRO.title}
          </h2>
          <p className="aboutLeadNarrow" style={{ marginInline: "auto" }}>
            {ABOUT_STORIES_INTRO.line}
          </p>
        </div>

        <div
          className="aboutStoriesPanel"
          role="region"
          aria-roledescription="carousel"
          aria-labelledby={labelId}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") go(index + 1);
            if (event.key === "ArrowLeft") go(index - 1);
          }}
          tabIndex={0}
        >
          <p id={labelId} className="sr-only">
            Brand principles, slide {index + 1} of {total}
          </p>
          <p className="aboutStoriesQuote">{current.statement}</p>
          <p className="aboutStoriesLabel">{current.label}</p>
          <div className="aboutStoriesControls">
            <button
              type="button"
              className="aboutStoriesBtn"
              aria-label="Previous principle"
              disabled={index === 0}
              onClick={() => go(index - 1)}
            >
              <ChevronLeft size={18} strokeWidth={2} aria-hidden />
            </button>
            <span className="aboutStoriesMeta" aria-hidden>
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>
            <div className="aboutStoriesBars" aria-hidden>
              {ABOUT_PRINCIPLES.map((item, i) => (
                <span
                  key={item.id}
                  className={i === index ? "is-active" : undefined}
                />
              ))}
            </div>
            <button
              type="button"
              className="aboutStoriesBtn"
              aria-label="Next principle"
              disabled={index === total - 1}
              onClick={() => go(index + 1)}
            >
              <ChevronRight size={18} strokeWidth={2} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
