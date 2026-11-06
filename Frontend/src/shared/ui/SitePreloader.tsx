"use client";

/**
 * Brand flash on refresh and path changes — paint-only toggles, clean scroll on hide.
 */
import { usePathname } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef } from "react";
import { shouldScrollToTopForClick } from "@/shared/lib/scrollToTop";
import { nourdHeading } from "@/styles/fonts";
import "@/shared/ui/site-preloader.css";

const BOOT_MS = 240;
const NAV_FINISH_MS = 180;
const NAV_SAFETY_TIMEOUT_MS = 4000;

/** Trigger preloader programmatically before router.push navigations */
export function triggerPagePreloader() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("rr:preloader:start"));
  }
}

function SitePreloaderEffects() {
  const pathname = usePathname() ?? "";
  const rootRef = useRef<HTMLDivElement>(null);
  const firstPath = useRef(true);
  const isNavigating = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function setOn(next: boolean) {
    const el = rootRef.current;
    if (!el) return;
    el.classList.toggle("rrPreloader--on", next);
    el.setAttribute("aria-hidden", next ? "false" : "true");
    if (next) el.setAttribute("aria-busy", "true");
    else el.removeAttribute("aria-busy");
  }

  const finishTransition = useCallback(() => {
    clearTimer();
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      requestAnimationFrame(() => {
        setOn(false);
        isNavigating.current = false;
      });
    });
  }, []);

  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      clearTimer();
      timerRef.current = setTimeout(finishTransition, BOOT_MS);
      return clearTimer;
    }

    clearTimer();

    if (
      isNavigating.current ||
      rootRef.current?.classList.contains("rrPreloader--on")
    ) {
      timerRef.current = setTimeout(finishTransition, NAV_FINISH_MS);
    } else {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      });
    }

    return clearTimer;
  }, [pathname, finishTransition]);

  useEffect(() => {
    function handleStart() {
      clearTimer();
      isNavigating.current = true;
      setOn(true);
      timerRef.current = setTimeout(finishTransition, NAV_SAFETY_TIMEOUT_MS);
    }

    function onDocumentClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (!shouldScrollToTopForClick(anchor, event)) return;

      let nextPath = "";
      try {
        nextPath = new URL(
          anchor.getAttribute("href") ?? "",
          window.location.href,
        ).pathname;
      } catch {
        return;
      }
      if (nextPath === window.location.pathname) return;

      handleStart();
    }

    window.addEventListener("rr:preloader:start", handleStart);
    document.addEventListener("click", onDocumentClick, true);
    return () => {
      window.removeEventListener("rr:preloader:start", handleStart);
      document.removeEventListener("click", onDocumentClick, true);
      clearTimer();
    };
  }, [finishTransition]);

  return (
    <div
      ref={rootRef}
      className="rrPreloader rrPreloader--on"
      aria-hidden="false"
      aria-busy="true"
      role="status"
    >
      <div className="rrPreloaderInner">
        {/* eslint-disable-next-line @next/next/no-img-element -- boot paint */}
        <img
          className="rrPreloaderMark rrPreloaderMark--light"
          src="/brand/runracks-logo-light.svg"
          alt=""
          width={56}
          height={66}
          decoding="async"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="rrPreloaderMark rrPreloaderMark--dark"
          src="/brand/runracks-logo-dark.svg"
          alt=""
          width={56}
          height={66}
          decoding="async"
        />
        <span className={`rrPreloaderWord ${nourdHeading.className}`}>
          <span className="rrPreloaderRun">RUN</span>
          <span className="rrPreloaderRacks">RACKS</span>
        </span>
        <span className="sr-only">Loading RunRacks</span>
      </div>
    </div>
  );
}

export function SitePreloader() {
  return (
    <Suspense fallback={null}>
      <SitePreloaderEffects />
    </Suspense>
  );
}
