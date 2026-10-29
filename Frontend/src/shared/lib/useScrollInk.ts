"use client";

/**
 * Shared rAF-throttled scroll ink for sage→ink heading blends.
 * Uses the global scroll frame bus (one window listener for all subscribers).
 */
import { useEffect, type RefObject } from "react";
import { subscribeScrollFrame } from "@/shared/lib/scrollFrame";

type ScrollInkOptions = {
  /** CSS custom property to set (0–1), e.g. --brands-ink */
  property: string;
  startRatio?: number;
  endRatio?: number;
};

export function useScrollInk(
  ref: RefObject<HTMLElement | null>,
  { property, startRatio = 0.82, endRatio = 0.28 }: ScrollInkOptions,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return subscribeScrollFrame(() => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const start = vh * startRatio;
      const end = vh * endRatio;
      const raw = (start - rect.top) / (start - end);
      const ink = Math.min(1, Math.max(0, raw));
      el.style.setProperty(property, ink.toFixed(3));
    });
  }, [ref, property, startRatio, endRatio]);
}
