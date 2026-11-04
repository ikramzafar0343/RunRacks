/**
 * Desktop workloads: cycle active card; pause while the row is hovered/focused.
 */
import { useEffect } from "react";

const DESKTOP_MQ = "(min-width: 900px)";
const INTERVAL_MS = 4500;

type UseWorkloadAutoRotateArgs = {
  itemIds: readonly string[];
  activeId: string;
  activate: (id: string) => void;
  paused: boolean;
  enabled: boolean;
};

export function useWorkloadAutoRotate({
  itemIds,
  activeId,
  activate,
  paused,
  enabled,
}: UseWorkloadAutoRotateArgs) {
  const idsKey = itemIds.join("|");

  useEffect(() => {
    const ids = idsKey.split("|").filter(Boolean);
    if (!enabled || paused || ids.length < 2) return;
    if (typeof window === "undefined") return;

    const desktop = window.matchMedia(DESKTOP_MQ);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!desktop.matches || reduce.matches) return;

    const tick = () => {
      if (!desktop.matches || reduce.matches) return;
      if (document.visibilityState === "hidden") return;
      const index = ids.indexOf(activeId);
      const next = ids[(index + 1) % ids.length];
      if (next) activate(next);
    };

    const timer = window.setInterval(tick, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [idsKey, activate, paused, enabled, activeId]);
}
