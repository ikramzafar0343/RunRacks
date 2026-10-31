"use client";

/**
 * Dotted world map (21st.dev style) — Sage lime arcs; document theme (no next-themes).
 * Dot field is a baked WebP (scripts/generate-dotted-map.mjs) — never inline SVG data URLs.
 */
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useId, useMemo, useRef, useState } from "react";
import { useDocumentTheme } from "@/shared/lib/useDocumentTheme";
import { MapFlag } from "./mapFlag";
import { createCurvedPath, projectPoint } from "./mapGeometry";
import {
  SAGE_BRAND,
  SAGE_LIME,
  type WorldMapPoint,
  type WorldMapProps,
} from "./mapTypes";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export type { WorldMapDot, WorldMapPoint } from "./mapTypes";

const DOTTED_MAP_SRC = {
  light: "/images/maps/dotted-world-light.webp",
  dark: "/images/maps/dotted-world-dark.webp",
} as const;

export function WorldMap({
  dots = [],
  points: extraPoints = [],
  lineColor,
  showLabels = true,
  labelClassName = "text-sm",
  animationDuration = 2,
  loop = true,
  className = "",
}: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const reactId = useId().replace(/:/g, "");
  const pathGradientId = `path-gradient-${reactId}`;
  const glowId = `glow-${reactId}`;
  const [hoveredLocation, setHoveredLocation] = useState<{
    label: string;
    flagCode?: string;
  } | null>(null);
  const theme = useDocumentTheme();
  const reducedMotion = usePrefersReducedMotion();
  const shouldLoop = loop && !reducedMotion;
  const isDark = theme === "dark";
  const strokeColor = lineColor ?? (isDark ? SAGE_LIME : SAGE_BRAND);

  const labelClass = isDark
    ? "border-[color-mix(in_srgb,#f3f6f0_20%,transparent)] bg-[#0a1612]/95 text-[#f3f6f0]"
    : "border-[color-mix(in_srgb,#20372f_14%,transparent)] bg-white/95 text-[#20372f]";
  const tipClass = isDark
    ? "border-[color-mix(in_srgb,#f3f6f0_20%,transparent)] bg-[#0a1612]/90 text-[#f3f6f0]"
    : "border-[color-mix(in_srgb,#20372f_14%,transparent)] bg-white/95 text-[#20372f]";

  const staggerDelay = 0.3;
  const totalAnimationTime = dots.length * staggerDelay + animationDuration;
  const pauseTime = 2;
  const fullCycleDuration = totalAnimationTime + pauseTime;

  const uniquePoints = useMemo(() => {
    const byKey = new Map<string, WorldMapPoint>();
    const merge = (point: WorldMapPoint) => {
      const key = `${point.lat.toFixed(2)},${point.lng.toFixed(2)}`;
      const prev = byKey.get(key);
      if (!prev) {
        byKey.set(key, point);
        return;
      }
      // Prefer labeled / flagged pins when the same hub appears twice.
      const next: WorldMapPoint = { lat: point.lat, lng: point.lng };
      const label = point.label ?? prev.label;
      const flagCode = point.flagCode ?? prev.flagCode;
      const labelDx = point.labelDx ?? prev.labelDx;
      const labelDy = point.labelDy ?? prev.labelDy;
      if (label !== undefined) next.label = label;
      if (flagCode !== undefined) next.flagCode = flagCode;
      if (labelDx !== undefined) next.labelDx = labelDx;
      if (labelDy !== undefined) next.labelDy = labelDy;
      byKey.set(key, next);
    };
    for (const point of extraPoints) merge(point);
    for (const dot of dots) {
      merge(dot.start);
      merge(dot.end);
    }
    return [...byKey.values()];
  }, [dots, extraPoints]);

  return (
    <div
      className={`relative w-full aspect-[2/1] md:aspect-[2.5/1] lg:aspect-[2/1] overflow-hidden font-sans bg-transparent ${className}`}
    >
      <Image
        src={isDark ? DOTTED_MAP_SRC.dark : DOTTED_MAP_SRC.light}
        className="pointer-events-none h-full w-full select-none bg-transparent object-cover [mask-image:linear-gradient(to_bottom,transparent_0%,#000_12%,#000_88%,transparent_100%),linear-gradient(to_right,transparent_0%,#000_8%,#000_92%,transparent_100%)] [mask-composite:intersect] [-webkit-mask-composite:source-in]"
        alt="world map"
        height={495}
        width={1056}
        draggable={false}
        loading="lazy"
        sizes="(max-width: 960px) 100vw, 960px"
      />
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="pointer-events-auto absolute inset-0 h-full w-full select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={pathGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={strokeColor} stopOpacity="1" />
            <stop offset="95%" stopColor={strokeColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          <filter id={glowId}>
            <feMorphology operator="dilate" radius="0.5" />
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          const pathD = createCurvedPath(startPoint, endPoint);
          const startTime = (i * staggerDelay) / fullCycleDuration;
          const endTime =
            (i * staggerDelay + animationDuration) / fullCycleDuration;
          const resetTime = totalAnimationTime / fullCycleDuration;

          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={pathD}
                fill="none"
                stroke={`url(#${pathGradientId})`}
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={
                  shouldLoop
                    ? { pathLength: [0, 0, 1, 1, 0] }
                    : { pathLength: 1 }
                }
                transition={
                  shouldLoop
                    ? {
                        duration: fullCycleDuration,
                        times: [0, startTime, endTime, resetTime, 1],
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 0,
                      }
                    : {
                        duration: reducedMotion ? 0 : animationDuration,
                        delay: reducedMotion ? 0 : i * staggerDelay,
                        ease: "easeInOut",
                      }
                }
              />

              {shouldLoop ? (
                <motion.circle
                  r="4"
                  fill={strokeColor}
                  initial={{ offsetDistance: "0%", opacity: 0 }}
                  animate={{
                    offsetDistance: [null, "0%", "100%", "100%", "100%"],
                    opacity: [0, 0, 1, 0, 0],
                  }}
                  transition={{
                    duration: fullCycleDuration,
                    times: [0, startTime, endTime, resetTime, 1],
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 0,
                  }}
                  style={{
                    offsetPath: `path('${pathD}')`,
                  }}
                />
              ) : null}
            </g>
          );
        })}

        {uniquePoints.map((point, i) => {
          const { x, y } = projectPoint(point.lat, point.lng);
          const labelW = point.flagCode ? 156 : 128;
          const labelH = 28;
          const dx = point.labelDx ?? 0;
          const dy = point.labelDy ?? 0;
          const hoverLabel = point.label || `Location ${i}`;

          return (
            <g key={`point-${point.lat}-${point.lng}-${i}`}>
              <motion.g
                onHoverStart={() =>
                  setHoveredLocation({
                    label: hoverLabel,
                    ...(point.flagCode ? { flagCode: point.flagCode } : {}),
                  })
                }
                onHoverEnd={() => setHoveredLocation(null)}
                className="cursor-pointer"
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r="3"
                  fill={strokeColor}
                  filter={`url(#${glowId})`}
                  className="drop-shadow-lg"
                />
                {!reducedMotion ? (
                  <circle cx={x} cy={y} r="3" fill={strokeColor} opacity="0.5">
                    <animate
                      attributeName="r"
                      from="3"
                      to="12"
                      dur="2s"
                      begin="0s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.6"
                      to="0"
                      dur="2s"
                      begin="0s"
                      repeatCount="indefinite"
                    />
                  </circle>
                ) : null}
              </motion.g>

              {showLabels && point.label ? (
                <motion.g
                  initial={reducedMotion ? false : { opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: reducedMotion ? 0 : 0.2 * i + 0.2,
                    duration: reducedMotion ? 0 : 0.45,
                  }}
                  className="pointer-events-none"
                >
                  <foreignObject
                    x={x - labelW / 2 + dx}
                    y={y - 34 + dy}
                    width={labelW}
                    height={labelH}
                    className="block overflow-visible"
                  >
                    <div className="flex h-full items-center justify-center">
                      <span
                        className={`${labelClassName} ${labelClass} inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 font-medium shadow-sm`}
                      >
                        {point.flagCode ? (
                          <MapFlag code={point.flagCode} />
                        ) : null}
                        {point.label}
                      </span>
                    </div>
                  </foreignObject>
                </motion.g>
              ) : null}
            </g>
          );
        })}
      </svg>

      <AnimatePresence>
        {hoveredLocation ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium backdrop-blur-sm sm:hidden ${tipClass}`}
          >
            {hoveredLocation.flagCode ? (
              <MapFlag code={hoveredLocation.flagCode} size="md" />
            ) : null}
            {hoveredLocation.label}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
