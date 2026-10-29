/**
 * Mobile workload row: after scroll-snap settles on a card, expand it (~1.5s).
 */
import { useEffect, type RefObject } from "react";

const MOBILE_MQ = "(max-width: 899px)";
const SETTLE_MS = 140;
const REVEAL_MS = 1500;

type UseWorkloadMobileRevealArgs = {
  rowRef: RefObject<HTMLDivElement | null>;
  activeIdRef: RefObject<string>;
  activate: (id: string) => void;
  enabled: boolean;
};

export function useWorkloadMobileReveal({
  rowRef,
  activeIdRef,
  activate,
  enabled,
}: UseWorkloadMobileRevealArgs) {
  useEffect(() => {
    if (!enabled) return;
    const row = rowRef.current;
    if (!row) return;

    const mq = window.matchMedia(MOBILE_MQ);
    let settleTimer: ReturnType<typeof setTimeout> | null = null;
    let revealTimer: ReturnType<typeof setTimeout> | null = null;
    let pendingId: string | null = null;

    const clearTimers = () => {
      if (settleTimer) clearTimeout(settleTimer);
      if (revealTimer) clearTimeout(revealTimer);
      settleTimer = null;
      revealTimer = null;
      pendingId = null;
    };

    const centeredCardId = (): string | null => {
      const rowRect = row.getBoundingClientRect();
      const centerX = rowRect.left + rowRect.width / 2;
      let bestId: string | null = null;
      let bestDist = Infinity;
      for (const el of row.querySelectorAll<HTMLElement>(
        "[data-workload-id]",
      )) {
        const id = el.dataset.workloadId;
        if (!id) continue;
        const r = el.getBoundingClientRect();
        const dist = Math.abs(r.left + r.width / 2 - centerX);
        if (dist < bestDist) {
          bestDist = dist;
          bestId = id;
        }
      }
      return bestId;
    };

    const scheduleReveal = () => {
      if (!mq.matches) return;
      const id = centeredCardId();
      if (!id || activeIdRef.current === id) return;
      if (pendingId === id && revealTimer) return;
      if (revealTimer) clearTimeout(revealTimer);
      pendingId = id;
      revealTimer = setTimeout(() => {
        if (centeredCardId() !== id) return;
        activate(id);
        row
          .querySelector<HTMLElement>(`[data-workload-id="${id}"]`)
          ?.scrollIntoView({
            inline: "center",
            block: "nearest",
            behavior: "smooth",
          });
        revealTimer = null;
        pendingId = null;
      }, REVEAL_MS);
    };

    const onScroll = () => {
      if (!mq.matches) return;
      if (revealTimer) {
        clearTimeout(revealTimer);
        revealTimer = null;
        pendingId = null;
      }
      if (settleTimer) clearTimeout(settleTimer);
      settleTimer = setTimeout(scheduleReveal, SETTLE_MS);
    };

    const onMqChange = () => {
      clearTimers();
      if (mq.matches) scheduleReveal();
    };

    row.addEventListener("scroll", onScroll, { passive: true });
    mq.addEventListener("change", onMqChange);
    if (mq.matches) {
      settleTimer = setTimeout(scheduleReveal, SETTLE_MS);
    }

    return () => {
      clearTimers();
      row.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", onMqChange);
    };
  }, [rowRef, activeIdRef, activate, enabled]);
}
