"use client";

/**
 * Manifesto-style word scroll-fill: sage dim → heading as the copy enters view.
 * Phrases (3 words) cut target count vs per-word spans while keeping the same look.
 */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMemo, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

type VpsStoryWordFillProps = {
  paragraphs: readonly string[];
};

const WORDS_PER_PHRASE = 3;

/** Split into whitespace-preserved phrase chunks (~3 words each). */
function splitPhrases(text: string): string[] {
  const tokens = text.split(/(\s+)/).filter((part) => part.length > 0);
  const phrases: string[] = [];
  let buf = "";
  let wordCount = 0;

  for (const token of tokens) {
    if (/^\s+$/.test(token)) {
      buf += token;
      continue;
    }
    buf += token;
    wordCount += 1;
    if (wordCount >= WORDS_PER_PHRASE) {
      phrases.push(buf);
      buf = "";
      wordCount = 0;
    }
  }
  if (buf.length > 0) phrases.push(buf);
  return phrases;
}

export function VpsStoryWordFill({ paragraphs }: VpsStoryWordFillProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const joined = useMemo(() => paragraphs.join(" "), [paragraphs]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const words = root.querySelectorAll<HTMLElement>("[data-story-word]");
      if (!words.length) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (reduce.matches) {
        gsap.set(words, { color: "var(--color-heading)" });
        return;
      }

      gsap.set(words, { color: "var(--story-word-dim)" });

      const tween = gsap.to(words, {
        color: "var(--color-heading)",
        stagger: 0.12,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top 78%",
          end: "bottom 42%",
          scrub: 0.55,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: rootRef, dependencies: [joined] },
  );

  return (
    <div className="vpsProductStoryFill" ref={rootRef}>
      <div className="sr-only">{joined}</div>
      <div aria-hidden="true">
        {paragraphs.map((paragraph) => (
          <p className="vpsProductStoryFillPara" key={paragraph.slice(0, 28)}>
            {splitPhrases(paragraph).map((phrase, index) => (
              <span
                className="vpsProductStoryWord"
                data-story-word="true"
                key={`${paragraph.slice(0, 12)}-p-${index}`}
              >
                {phrase}
              </span>
            ))}
          </p>
        ))}
      </div>
    </div>
  );
}
