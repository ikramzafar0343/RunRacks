"use client";

/**
 * Scroll reveal for USA editorial bands — stays visible if motion is reduced.
 */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

type UsaRevealProps = {
  children: ReactNode;
  className?: string;
  y?: number;
};

export function UsaReveal({ children, className, y = 32 }: UsaRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const targets = root.querySelectorAll<HTMLElement>("[data-usa-reveal]");
      if (!targets.length) return;

      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: {
            trigger: root,
            start: "top 82%",
            once: true,
          },
        },
      );
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
