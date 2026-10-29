"use client";

/**
 * Brandium-style text highlight — per-character opacity 0.1 → 1 scrubbed on scroll.
 * Characters sit inside nowrap word shells so lines never break mid-word.
 */

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMemo, useRef, type ReactNode } from "react";
import { ADMIN_RDP } from "@/features/admin-rdp/model/adminRdpContent";
import "@/features/admin-rdp/components/admin-rdp-manifesto.css";

gsap.registerPlugin(ScrollTrigger);

/** Split text into word tokens + whitespace; chars animate inside each word. */
function renderWordSafeChars(text: string, keyPrefix: string): ReactNode[] {
  const tokens = text.split(/(\s+)/).filter((part) => part.length > 0);
  return tokens.map((token, tokenIndex) => {
    if (/^\s+$/.test(token)) {
      return (
        <span
          key={`${keyPrefix}-sp-${tokenIndex}`}
          className="ardpWordFillSpace"
        >
          {"\u00A0"}
        </span>
      );
    }
    return (
      <span key={`${keyPrefix}-w-${tokenIndex}`} className="ardpWordFillWord">
        {Array.from(token).map((ch, charIndex) => (
          <span
            key={`${keyPrefix}-w-${tokenIndex}-c-${charIndex}`}
            className="ardpWordFillChar"
            data-ardp-char="true"
          >
            {ch}
          </span>
        ))}
      </span>
    );
  });
}

export function ArdpWordFill() {
  const rootRef = useRef<HTMLDivElement>(null);
  const paragraphs = ADMIN_RDP.manifesto.paragraphs;
  const joined = useMemo(() => paragraphs.join(" "), [paragraphs]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const chars = root.querySelectorAll<HTMLElement>("[data-ardp-char]");
      if (!chars.length) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (reduce.matches) {
        gsap.set(chars, { opacity: 1 });
        return;
      }

      // Dim only after hydrate; CSS defaults to opacity 1 for slow/no-JS.
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

      // Layout settled after pricing/hero above; refresh pin math.
      ScrollTrigger.refresh();

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: rootRef, dependencies: [joined] },
  );

  return (
    <section className="ardpManifesto" aria-label="Admin RDP overview">
      <div className="ardpManifestoInner ardpWordFill" ref={rootRef}>
        <div className="sr-only">{joined}</div>
        <div aria-hidden="true">
          {paragraphs.map((paragraph) => (
            <p className="ardpWordFillPara" key={paragraph.slice(0, 32)}>
              {renderWordSafeChars(paragraph, paragraph.slice(0, 12))}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
