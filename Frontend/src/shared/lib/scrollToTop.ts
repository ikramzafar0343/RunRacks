/**
 * Force the document viewport to y=0 (window + html/body scroll roots).
 */
export function scrollDocumentToTop() {
  if (typeof window === "undefined") return;

  const pin = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  pin();
  // Re-pin after layout/paint so soft nav + sticky header don't leave mid-page.
  requestAnimationFrame(() => {
    pin();
    requestAnimationFrame(pin);
  });
}

/** Pin top again after Next soft-nav can restore a cached scroll position. */
export function scrollToTopPinned() {
  scrollDocumentToTop();
  window.setTimeout(scrollDocumentToTop, 0);
  window.setTimeout(scrollDocumentToTop, 50);
  window.setTimeout(scrollDocumentToTop, 120);
}

/** True when this click should reset scroll for an in-app path (no hash). */
export function shouldScrollToTopForClick(
  anchor: HTMLAnchorElement,
  event: MouseEvent,
): boolean {
  if (event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return false;
  }
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;

  const raw = anchor.getAttribute("href");
  if (!raw || raw.startsWith("#")) return false;
  if (
    raw.startsWith("mailto:") ||
    raw.startsWith("tel:") ||
    raw.startsWith("javascript:")
  ) {
    return false;
  }

  let url: URL;
  try {
    url = new URL(raw, window.location.href);
  } catch {
    return false;
  }

  if (url.origin !== window.location.origin) return false;
  // Keep intentional section landing (e.g. /pricing#pricing-plans).
  if (url.hash) return false;

  return true;
}
