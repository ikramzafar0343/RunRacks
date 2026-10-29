"use client";

/**
 * Scroll-linked lead frame expand (92% → 100%). Desktop only.
 * Starts near full-bleed so it doesn’t read as an inset card.
 */
import { useEffect, useRef, type ReactNode } from "react";
import { subscribeScrollFrame } from "@/shared/lib/scrollFrame";

export function VpsLeadPhotoExpand({ children }: { children: ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = frameRef.current;
    if (!(node instanceof HTMLDivElement)) return;
    const frame: HTMLDivElement = node;

    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqMobile = window.matchMedia("(max-width: 767px)");
    let unsubscribe: (() => void) | null = null;
    let lastScale = "";

    function setScale(value: number) {
      const next = value.toFixed(3);
      if (next === lastScale) return;
      lastScale = next;
      frame.style.setProperty("--lead-scale", next);
      if (value >= 0.999) {
        frame.classList.add("is-lead-settled");
      } else {
        frame.classList.remove("is-lead-settled");
      }
    }

    function bindMotion() {
      unsubscribe?.();
      unsubscribe = null;

      if (mqReduce.matches || mqMobile.matches) {
        setScale(1);
        frame.classList.add("is-lead-settled");
        return;
      }

      frame.classList.remove("is-lead-settled");

      unsubscribe = subscribeScrollFrame(() => {
        const rect = frame.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const start = vh * 0.95;
        const end = vh * 0.25;
        const raw = (start - rect.top) / (start - end);
        const t = Math.min(1, Math.max(0, raw));
        setScale(0.92 + t * 0.08);
      });
    }

    bindMotion();
    mqReduce.addEventListener("change", bindMotion);
    mqMobile.addEventListener("change", bindMotion);

    return () => {
      unsubscribe?.();
      mqReduce.removeEventListener("change", bindMotion);
      mqMobile.removeEventListener("change", bindMotion);
    };
  }, []);

  return (
    <div className="vpsLeadPhotoFrame" ref={frameRef}>
      <div className="vpsLeadPhotoInner">{children}</div>
    </div>
  );
}
