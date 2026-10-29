/**
 * Single window scroll/resize → one rAF tick for all subscribers.
 */
type ScrollListener = () => void;

const listeners = new Set<ScrollListener>();
let attached = false;
let frame = 0;

function flush() {
  frame = 0;
  for (const listener of listeners) listener();
}

function onScrollOrResize() {
  if (frame) return;
  frame = window.requestAnimationFrame(flush);
}

function ensureAttached() {
  if (attached || typeof window === "undefined") return;
  attached = true;
  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize, { passive: true });
}

function maybeDetach() {
  if (!attached || listeners.size > 0) return;
  attached = false;
  window.removeEventListener("scroll", onScrollOrResize);
  window.removeEventListener("resize", onScrollOrResize);
  if (frame) {
    window.cancelAnimationFrame(frame);
    frame = 0;
  }
}

/** Subscribe; runs once immediately, then on scroll/resize (rAF-batched). */
export function subscribeScrollFrame(listener: ScrollListener): () => void {
  listeners.add(listener);
  ensureAttached();
  listener();
  return () => {
    listeners.delete(listener);
    maybeDetach();
  };
}
