"use client";

/**
 * Scoped scroll reveal — content stays visible if motion is reduced or GSAP fails.
 */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

type RevealProps = {
  children: ReactNode;
  className?: string;
  selector?: string;
  y?: number;
  start?: string;
};

export function Reveal({
  children,
  className,
  selector = "[data-reveal]",
  y = 28,
  start = "top 84%",
}: RevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const targets = root.querySelectorAll<HTMLElement>(selector);
      if (!targets.length) return;

      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: root,
            start,
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
