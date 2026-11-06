/**
 * Scroll helpers — write-only, no layout reads (avoids forced reflow).
 */
export function scrollDocumentToTop() {
  if (typeof window === "undefined") return;
  window.scrollTo(0, 0);
}

/** Single deferred pin after soft nav / preloader hide. */
export function scrollToTopPinned() {
  scrollDocumentToTop();
  requestAnimationFrame(scrollDocumentToTop);
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
  if (url.hash) return false;

  if (
    url.pathname === window.location.pathname &&
    url.search !== window.location.search
  ) {
    return false;
  }

  return true;
}
