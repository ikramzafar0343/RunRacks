"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ── the curved row ──────────────────────────────────────────────
 * Scroll Tilted Grid turned on its side, with the tilt drawn as a curve.
 * One row of images streams from right to left around the inside of a
 * cylinder. The centre faces you flat, the ends bend toward you so each
 * end image curves along its length, and the ends fade into the page.
 *
 * A CSS box can't bend, so every tile is cut into SLICES vertical strips,
 * each a flat facet of the cylinder showing its share of the image. The
 * strips sit still inside their tile, each turned its own few degrees
 * round the cylinder's axis, and the tile (preserve-3d) is what moves: one
 * rotateY about that same axis carries the whole tile along the arc. A
 * tile is one animation, so its strips can never drift apart or show
 * different images. Only a tile's delay differs, and that sets where on
 * the arc it sits. The band is transform-only on the compositor; the fade
 * is a static mask over it.
 *
 * JS: ResizeObserver sizes the loop (capped columns on narrow viewports).
 * Image cycle on wrap updates img.src imperatively — no React setState.
 * ─────────────────────────────────────────────────────────────── */

const SLICES = 16;
const CAMERA = 1.6;
/** Cap facets on slow devices / narrow viewports. */
const MAX_COLUMNS_NARROW = 6;
const MAX_COLUMNS_WIDE = 10;
const NARROW_BP = 700;

function arc(bend: number) {
  return (CAMERA - 1 + Math.cos(bend)) / (2 * CAMERA * Math.sin(bend));
}

const MAX_WIDTH = 55;

function measure(
  width: number,
  height: number,
  tile: number,
  aspect: number,
  gap: number,
  bend: number,
) {
  const h = Math.min(
    (tile / 100) * height,
    ((MAX_WIDTH / 100) * width) / aspect,
  );
  const radius = width * arc(bend);
  if (!(h > 0) || !(radius > 0))
    return { columns: 2, sweep: 0, unit: 0, limit: 0 };
  const deg = (rad: number) => (rad * 180) / Math.PI;
  const unit = deg(h / radius);
  const pitch = (aspect + gap / 100) * unit;
  const limit = deg(bend) + (aspect * unit) / 2;
  const cap = width < NARROW_BP ? MAX_COLUMNS_NARROW : MAX_COLUMNS_WIDE;
  const columns = Math.min(cap, Math.max(2, Math.ceil((2 * limit) / pitch)));
  const round = (n: number) => +n.toFixed(4);
  const sweep = round((columns * pitch) / 2);
  return {
    columns,
    sweep,
    unit: round(unit),
    limit: round(Math.min(sweep, limit)),
  };
}

export type TiltedGridImage = {
  src: string;
  /** Only used if you drop the decorative treatment; the band is aria-hidden. */
  alt?: string;
};

export type TiltedGridHeroProps = {
  images: TiltedGridImage[];
  /** @default 4 */
  speed?: number;
  /** @default 26 */
  tileHeight?: number;
  /** @default 16 / 9 */
  aspectRatio?: number;
  /** @default 6 */
  gap?: number;
  /** @default 56 */
  axis?: number;
  /** @default 80 */
  curve?: number;
  /** @default 12 */
  fade?: number;
  children?: React.ReactNode;
  className?: string;
};

export function TiltedGridHero({
  images,
  speed = 4,
  tileHeight = 26,
  aspectRatio = 16 / 9,
  gap = 6,
  axis = 56,
  curve = 80,
  fade = 12,
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & TiltedGridHeroProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const imagesRef = React.useRef(images);
  React.useEffect(() => {
    imagesRef.current = images;
  }, [images]);
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const orbit = `tgh-o-${id}`;
  const tile = `tgh-t-${id}`;
  const bend = (Math.min(85, Math.max(5, curve)) * Math.PI) / 180;

  /** SSR/first-paint fallback so the band is never opacity-gated empty. */
  const [layout, setLayout] = React.useState(() =>
    measure(1200, 560, tileHeight, aspectRatio, gap, bend),
  );

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      const next = measure(width, height, tileHeight, aspectRatio, gap, bend);
      setLayout((prev) =>
        prev?.columns === next.columns &&
        prev.sweep === next.sweep &&
        prev.unit === next.unit
          ? prev
          : next,
      );
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [tileHeight, aspectRatio, gap, bend]);

  // Warm only the first gallery URL — avoid contending with LCP on slow links.
  React.useEffect(() => {
    const first = images[0]?.src;
    if (!first) return;
    const img = new Image();
    img.src = first;
  }, [images]);

  const { columns, sweep, unit, limit } = layout;
  const len = Math.max(images.length, 1);

  const u = (n: number) =>
    `calc(${+n.toFixed(4)} * min(${tileHeight}cqh, ${+(
      MAX_WIDTH / aspectRatio
    ).toFixed(4)}cqw))`;

  const r = 100 * arc(bend);
  const radius = `${+r.toFixed(3)}cqw`;
  const turn = (deg: number) =>
    `translateZ(${radius}) rotateY(${+deg.toFixed(4)}deg) translateZ(-${radius})`;

  const hide = +(((sweep - limit) / (2 * sweep || 1)) * 100).toFixed(4);
  const css =
    `@keyframes ${orbit}{` +
    `from{transform:${turn(-sweep)}}to{transform:${turn(sweep)}}` +
    `0%,${hide}%,${100 - hide}%,100%{visibility:hidden}` +
    `${hide + 0.001}%,${100 - hide - 0.001}%{visibility:visible}}` +
    `@media(prefers-reduced-motion:reduce){.${tile}{animation-play-state:paused}}`;

  const share = aspectRatio / SLICES;
  const duration = columns * speed;
  const mask = `linear-gradient(90deg,transparent,#000 ${fade}%,#000 ${
    100 - fade
  }%,transparent)`;

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      {...props}
      style={{ containerType: "size", ...props.style }}
    >
      <style>{css}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: 1,
          perspective: `${+(r * CAMERA).toFixed(3)}cqw`,
          perspectiveOrigin: `50% ${axis}%`,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      >
        {Array.from({ length: columns }, (_, t) => {
          const first = columns - 1 - t;
          const img = images[first % len];
          return (
            <div
              key={t}
              className={cn(tile, "absolute")}
              data-tgh-first={first}
              style={{
                left: `calc(50% - ${u(aspectRatio / 2)})`,
                top: `calc(${axis}% - ${u(0.5)})`,
                width: u(aspectRatio),
                height: u(1),
                transformStyle: "preserve-3d",
                animation: `${orbit} ${duration}s linear ${-t * speed}s infinite`,
              }}
              onAnimationIteration={(e) => {
                const gallery = imagesRef.current;
                if (!gallery.length) return;
                const lap = Math.round(e.elapsedTime / duration);
                const seed = Number(
                  (e.currentTarget as HTMLElement).dataset.tghFirst ?? first,
                );
                const next = gallery[(lap * columns + seed) % gallery.length];
                if (!next?.src) return;
                const nodes = e.currentTarget.querySelectorAll("img");
                for (const node of nodes) {
                  if (node.getAttribute("src") !== next.src) {
                    node.setAttribute("src", next.src);
                  }
                }
              }}
            >
              {Array.from({ length: SLICES }, (_, k) => (
                <div
                  key={k}
                  className="absolute top-0 overflow-hidden"
                  style={{
                    left: u((aspectRatio - share) / 2),
                    // Wide overlap on every facet so 3D AA never flashes a seam.
                    width: `calc(${u(share)} + 4px)`,
                    height: u(1),
                    transform: turn(
                      (aspectRatio / 2 - (k + 0.5) * share) * unit,
                    ),
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    zIndex: k,
                  }}
                >
                  {img ? (
                    // Decorative band is aria-hidden; native img is intentional.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={img.src}
                      alt={k === 0 ? (img.alt ?? "") : ""}
                      draggable={false}
                      decoding="async"
                      className="absolute top-0 max-w-none object-cover"
                      style={{
                        left: `calc(${u(-k * share)} - 2px)`,
                        width: `calc(${u(aspectRatio)} + 4px)`,
                        height: u(1),
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                      }}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {children}
    </div>
  );
}

export default TiltedGridHero;
