/**
 * Location segmented buttons with country flags (matches family tabs).
 */
import Image from "next/image";
import { useEffect, useRef, type KeyboardEvent } from "react";
import type { VpsRegion } from "@/features/vps-pricing/model/types";
import "@/features/vps-pricing/components/vps-location.css";

type VpsLocationSelectProps = {
  regions: readonly VpsRegion[];
  locationId: string;
  onLocationChange: (id: string) => void;
};

function flagSrc(countryCode: string) {
  return `/flags/${countryCode}.svg`;
}

export function VpsLocationSelect({
  regions,
  locationId,
  onLocationChange,
}: VpsLocationSelectProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeId = regions.some((r) => r.id === locationId)
    ? locationId
    : (regions[0]?.id ?? locationId);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root || !window.matchMedia("(max-width: 560px)").matches) return;
    const active = root.querySelector<HTMLElement>(
      `.vpsLocationSegment[data-active="true"]`,
    );
    if (!active) return;
    const slide = active.offsetWidth;
    // Offset by half a slide → half | full | full | half
    root.scrollLeft = Math.max(0, active.offsetLeft - slide / 2);
  }, [activeId, regions]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = regions.findIndex((r) => r.id === activeId);
    if (index < 0) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const delta = event.key === "ArrowRight" ? 1 : -1;
      const next = regions[(index + delta + regions.length) % regions.length];
      if (next) onLocationChange(next.id);
    }
  }

  return (
    <div className="vpsLocationScroll" ref={scrollRef}>
      <div
        className="vpsSegmented vpsLocationSegmented"
        role="radiogroup"
        aria-label="Server location"
        onKeyDown={onKeyDown}
      >
        {regions.map((region) => {
          const active = region.id === activeId;
          return (
            <button
              key={region.id}
              type="button"
              role="radio"
              className="vpsSegment vpsLocationSegment"
              data-country={region.countryCode}
              data-active={active ? "true" : "false"}
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              onClick={() => onLocationChange(region.id)}
            >
              <Image
                src={flagSrc(region.countryCode)}
                alt=""
                width={18}
                height={12}
                className="vpsLocationFlag"
                unoptimized
              />
              <span>{region.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
