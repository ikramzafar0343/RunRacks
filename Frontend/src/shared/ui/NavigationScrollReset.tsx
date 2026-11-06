"use client";

/**
 * Manual scroll restoration only. Path top-pin runs once when the preloader hides.
 */
import { Suspense, useEffect } from "react";

function NavigationScrollResetEffects() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
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
