/**
 * Centered clarity headline — character opacity scrub (same pattern as Admin RDP manifesto).
 */
"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMemo, useRef, type ReactNode } from "react";
import { ADMIN_RDP_USA_CLARITY } from "@/features/admin-rdp-usa/model/adminRdpUsaClarity";

gsap.registerPlugin(ScrollTrigger);

type AccentKind = "none" | "a" | "b";

function renderWordSafeChars(
  text: string,
  keyPrefix: string,
  accent: AccentKind,
): ReactNode[] {
  const accentClass =
    accent === "a"
      ? " ardpClarityAccentA"
      : accent === "b"
        ? " ardpClarityAccentB"
        : "";

  const tokens = text.split(/(\s+)/).filter((part) => part.length > 0);
  return tokens.map((token, tokenIndex) => {
    if (/^\s+$/.test(token)) {
      return (
        <span
          key={`${keyPrefix}-sp-${tokenIndex}`}
          className="ardpClarityFillSpace"
        >
          {"\u00A0"}
        </span>
      );
    }
    return (
      <span
        key={`${keyPrefix}-w-${tokenIndex}`}
        className={`ardpClarityFillWord${accentClass}`}
      >
        {Array.from(token).map((ch, charIndex) => (
          <span
            key={`${keyPrefix}-w-${tokenIndex}-c-${charIndex}`}
            className="ardpClarityFillChar"
            data-ardp-clarity-char="true"
          >
            {ch}
          </span>
        ))}
      </span>
    );
  });
}

export function AdminRdpUsaClarityHeading() {
  const rootRef = useRef<HTMLHeadingElement>(null);
  const { headingId, heading } = ADMIN_RDP_USA_CLARITY;

  const fullText = useMemo(
    () =>
      `${heading.before}${heading.accentA}${heading.mid}${heading.accentB}${heading.after}`,
    [heading],
  );

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const chars = root.querySelectorAll<HTMLElement>(
        "[data-ardp-clarity-char]",
      );
      if (!chars.length) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (reduce.matches) {
        gsap.set(chars, { opacity: 1 });
        return;
      }

      gsap.set(chars, { opacity: 0.1 });

      const tween = gsap.to(chars, {
        opacity: 1,
        stagger: 0.02,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top 78%",
          end: "bottom 36%",
          scrub: true,
        },
      });

      ScrollTrigger.refresh();

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: rootRef, dependencies: [fullText] },
  );

  return (
    <h2
      ref={rootRef}
      id={headingId}
      className="ardpClarityHeading ardpClarityFill"
    >
      <span className="sr-only">{fullText}</span>
      <span aria-hidden="true">
        {renderWordSafeChars(heading.before, "before", "none")}
        {renderWordSafeChars(heading.accentA, "accent-a", "a")}
        {renderWordSafeChars(heading.mid, "mid", "none")}
        {renderWordSafeChars(heading.accentB, "accent-b", "b")}
        {renderWordSafeChars(heading.after, "after", "none")}
      </span>
    </h2>
  );
}
