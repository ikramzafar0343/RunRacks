"use client";

/**
 * Site-wide: logo/nav/in-app links and route changes land at the top of the page.
 */
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import {
  scrollDocumentToTop,
  shouldScrollToTopForClick,
} from "@/shared/lib/scrollToTop";

function scrollToTopPinned() {
  scrollDocumentToTop();
  // Next soft-nav can re-apply a cached scroll position after same-route clicks.
  window.setTimeout(scrollDocumentToTop, 0);
  window.setTimeout(scrollDocumentToTop, 50);
  window.setTimeout(scrollDocumentToTop, 120);
}

function NavigationScrollResetEffects() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ?? "";

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) return;
    scrollToTopPinned();
  }, [pathname, search]);

  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (!shouldScrollToTopForClick(anchor, event)) return;
      scrollToTopPinned();
    }

    // Capture so we run before Next Link soft-nav scroll restore.
    document.addEventListener("click", onDocumentClick, true);
    return () => document.removeEventListener("click", onDocumentClick, true);
  }, []);

  return null;
}

export function NavigationScrollReset() {
  return (
    <Suspense fallback={null}>
      <NavigationScrollResetEffects />
    </Suspense>
  );
}
