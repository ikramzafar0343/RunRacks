/**
 * Vertical brand-promise reel — CSS transform autoplay, pause-aware.
 */
"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import type { PromiseItem } from "@/features/brand-trust/model/brandTrustContent";

const CENTER_SLOT = 2;
const AUTOPLAY_MS = 3000;
const RESUME_MS = 2000;

type PromiseReelProps = {
  promises: readonly PromiseItem[];
  initialIndex: number;
};

function subscribeReducedMotion(onChange: () => void) {
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  motion.addEventListener("change", onChange);
  return () => motion.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function PromiseReel({ promises, initialIndex }: PromiseReelProps) {
  const n = promises.length;
  const safeInitial = Math.min(Math.max(initialIndex, 0), Math.max(n - 1, 0));
  const [renderIndex, setRenderIndex] = useState(n + safeInitial);
  const [instant, setInstant] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );
  const pausedRef = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const track = n > 0 ? [...promises, ...promises, ...promises] : [];

  useEffect(() => {
    if (reduced || n === 0) return;

    let interval: ReturnType<typeof setInterval> | null = null;

    const tick = () => {
      if (pausedRef.current) return;
      if (document.visibilityState === "hidden") return;
      setRenderIndex((i) => i + 1);
    };

    const start = () => {
      if (interval) clearInterval(interval);
      interval = setInterval(tick, AUTOPLAY_MS);
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        if (interval) clearInterval(interval);
        interval = null;
      } else if (!pausedRef.current) {
        start();
      }
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      if (interval) clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced, n]);

  useEffect(() => {
    return () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, []);

  function pause() {
    pausedRef.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }

  function scheduleResume() {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      pausedRef.current = false;
    }, RESUME_MS);
  }

  function onTransitionEnd() {
    if (n === 0) return;
    if (renderIndex >= n * 2) {
      setInstant(true);
      setRenderIndex((i) => i - n);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setInstant(false));
      });
    }
  }

  if (n === 0) return null;

  const offset = reduced
    ? safeInitial - CENTER_SLOT
    : renderIndex - CENTER_SLOT;
  const trackStyle = {
    "--reel-offset": String(offset),
  } as CSSProperties;

  const lines = reduced ? promises : track;

  return (
    <div
      className="promiseReel"
      onMouseEnter={reduced ? undefined : pause}
      onMouseLeave={reduced ? undefined : scheduleResume}
      onFocusCapture={reduced ? undefined : pause}
      onBlurCapture={
        reduced
          ? undefined
          : (e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                scheduleResume();
              }
            }
      }
    >
      <div
        className="promiseReelTrack"
        data-instant={instant || reduced ? "true" : "false"}
        style={{
          ...trackStyle,
          transform:
            "translate3d(0, calc(var(--reel-offset) * var(--statement-line) * -1), 0)",
        }}
        onTransitionEnd={reduced ? undefined : onTransitionEnd}
      >
        {lines.map((item, i) => {
          const active = reduced ? i === safeInitial : i === renderIndex;
          const key = reduced ? item.id : `${item.id}-${i}`;
          return (
            <p
              key={key}
              className="promiseLine"
              data-active={active ? "true" : "false"}
            >
              {item.text}
            </p>
          );
        })}
      </div>
    </div>
  );
}
