"use client";

/**
 * Client-only WorldMap mount — avoids framer-motion SSR/hydration mismatch.
 * Static light dotted map until the interactive layer mounts.
 */
import Image from "next/image";
import { useSyncExternalStore } from "react";
import { WorldMap, type WorldMapDot } from "@/components/ui/map";

const FALLBACK_MAP = "/images/maps/dotted-world-light.webp";

function subscribe() {
  return () => {};
}

function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

type UsaMapPlaneProps = {
  dots: readonly WorldMapDot[];
  className?: string;
  loop?: boolean;
};

export function UsaMapPlane({
  dots,
  className = "",
  loop = true,
}: UsaMapPlaneProps) {
  const ready = useIsClient();

  if (!ready) {
    return (
      <div className={`usaMapFallback ${className}`}>
        <Image
          src={FALLBACK_MAP}
          alt=""
          fill
          className="usaMapFallbackImg"
          sizes="100vw"
          preload
        />
      </div>
    );
  }

  return (
    <WorldMap
      dots={[...dots]}
      showLabels
      labelClassName="text-xs"
      className={className}
      loop={loop}
    />
  );
}
