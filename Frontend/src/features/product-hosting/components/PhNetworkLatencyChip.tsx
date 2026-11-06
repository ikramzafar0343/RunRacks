"use client";

/**
 * Illustrative region latency chip — drifts while the visitor stays; not live ping.
 */
import { useEffect, useState } from "react";
import {
  baselineMs,
  nextMs,
} from "@/features/product-hosting/lib/illustrativeLatency";

type PhNetworkLatencyChipProps = {
  regionId: string;
};

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function PhNetworkLatencyChip({ regionId }: PhNetworkLatencyChipProps) {
  const [ms, setMs] = useState(() => baselineMs(regionId));

  useEffect(() => {
    if (prefersReducedMotion()) return;

    let timeoutId = 0;

    function schedule() {
      if (document.hidden) {
        timeoutId = window.setTimeout(schedule, 1500);
        return;
      }
      const delay = 1200 + Math.floor(Math.random() * 1001);
      timeoutId = window.setTimeout(() => {
        setMs((prev) => nextMs(prev));
        schedule();
      }, delay);
    }

    function onVisibility() {
      if (!document.hidden) {
        window.clearTimeout(timeoutId);
        schedule();
      }
    }

    schedule();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [regionId]);

  return (
    <span
      className="phNetworkRowChip"
      title="Illustrative latency — not a live measurement"
    >
      {ms} ms
    </span>
  );
}
