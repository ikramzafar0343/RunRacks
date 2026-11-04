"use client";

/**
 * Site-wide: logo/nav/in-app path changes land at the top of the page.
 * Query-only updates (pricing location/term filters) keep scroll position.
 */
import { usePathname } from "next/navigation";
import { Suspense, useEffect } from "react";
import {
  scrollToTopPinned,
  shouldScrollToTopForClick,
} from "@/shared/lib/scrollToTop";

function NavigationScrollResetEffects() {
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) return;
    scrollToTopPinned();
  }, [pathname]);

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
