"use client";

/**
 * Interactive Cobe globe — Sage & Ink (no fabricated visitor/trend analytics).
 */
import createGlobe from "cobe";
import {
  useCallback,
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useDocumentTheme } from "@/shared/lib/useDocumentTheme";
import { cn } from "@/lib/utils";

export type GlobeMarker = {
  id: string;
  /** [latitude, longitude] */
  location: [number, number];
  size?: number;
};

export type GlobeAnalyticsProps = {
  markers?: readonly GlobeMarker[];
  className?: string;
  speed?: number;
};

/** Sage lime ≈ #c9fb50 */
const LIME: [number, number, number] = [0.788, 0.984, 0.314];
/** Brand green ≈ #34745a */
const BRAND: [number, number, number] = [0.204, 0.455, 0.353];
/** Ink heading ≈ #20372f */
const INK: [number, number, number] = [0.125, 0.216, 0.184];
/** Canvas ≈ #f5f6f1 */
const CANVAS: [number, number, number] = [0.961, 0.965, 0.945];

const DEFAULT_MARKERS: readonly GlobeMarker[] = [
  { id: "us", location: [40.71, -74.01], size: 0.06 },
  { id: "nl", location: [52.37, 4.9], size: 0.04 },
  { id: "sg", location: [1.35, 103.82], size: 0.04 },
  { id: "au", location: [-33.87, 151.21], size: 0.04 },
];

export function GlobeAnalytics({
  markers = DEFAULT_MARKERS,
  className = "",
  speed = 0.003,
}: GlobeAnalyticsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const isPausedRef = useRef(false);
  const theme = useDocumentTheme();
  const isDark = theme === "dark";

  const handlePointerDown = useCallback((e: ReactPointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    isPausedRef.current = true;
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi;
      thetaOffsetRef.current += dragOffset.current.theta;
      dragOffset.current = { phi: 0, theta: 0 };
    }
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        };
      }
    };
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerUp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let globe: ReturnType<typeof createGlobe> | null = null;
    let animationId = 0;
    let phi = 0;
    let ro: ResizeObserver | null = null;

    const markerList = markers.map((m) => ({
      location: m.location,
      size: m.size ?? 0.04,
      id: m.id,
    }));

    const arcs =
      markers.length > 1
        ? markers.slice(1).map((m) => ({
            from: markers[0]!.location,
            to: m.location,
            color: LIME,
          }))
        : [];

    function init() {
      if (!canvas || globe) return;
      const width = canvas.offsetWidth;
      if (width === 0) return;

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height: width,
        phi: 0,
        theta: 0.25,
        dark: isDark ? 1 : 0,
        diffuse: 1.35,
        mapSamples: 16000,
        mapBrightness: isDark ? 4.5 : 8,
        baseColor: isDark ? INK : CANVAS,
        markerColor: LIME,
        glowColor: isDark ? BRAND : CANVAS,
        markerElevation: 0,
        markers: markerList,
        arcs,
        arcColor: LIME,
        arcWidth: 0.45,
        arcHeight: 0.22,
        opacity: 0.85,
      });

      const animate = () => {
        if (!isPausedRef.current) phi += speed;
        globe?.update({
          phi: phi + phiOffsetRef.current + dragOffset.current.phi,
          theta: 0.25 + thetaOffsetRef.current + dragOffset.current.theta,
        });
        animationId = requestAnimationFrame(animate);
      };
      animate();
      canvas.style.opacity = "1";
    }

    if (canvas.offsetWidth > 0) {
      init();
    } else {
      ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width && entries[0].contentRect.width > 0) {
          ro?.disconnect();
          ro = null;
          init();
        }
      });
      ro.observe(canvas);
    }

    return () => {
      ro?.disconnect();
      if (animationId) cancelAnimationFrame(animationId);
      globe?.destroy();
      globe = null;
      if (canvas) canvas.style.opacity = "0";
    };
  }, [markers, speed, isDark]);

  return (
    <div
      className={cn("relative aspect-square select-none", className)}
      aria-label="Interactive globe highlighting United States and peer catalog regions"
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        className="h-full w-full rounded-full"
        style={{
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1.2s ease",
          touchAction: "none",
        }}
      />
    </div>
  );
}

export default GlobeAnalytics;
