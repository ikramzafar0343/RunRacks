/**
 * Decorative isometric server stacks for plan cards — Sage & Ink tokens.
 */
import type { VpsFamily } from "@/features/vps-pricing/model/types";
import type { PlanTier } from "@/features/vps-pricing/model/planTier";
import "@/features/vps-pricing/components/vps-plan-tier-art.css";

type VpsPlanTierArtProps = {
  tier: PlanTier;
  family: VpsFamily;
};

type Pt = { x: number; y: number };

/** Isometric block: top / left / right faces from top-center anchor. */
function IsoBlock({
  x,
  y,
  dx = 18,
  dy = 10,
  dz = 12,
}: {
  x: number;
  y: number;
  dx?: number;
  dy?: number;
  dz?: number;
}) {
  const top: Pt[] = [
    { x, y: y - dz },
    { x: x + dx, y: y - dz + dy },
    { x, y: y - dz + dy * 2 },
    { x: x - dx, y: y - dz + dy },
  ];
  const left: Pt[] = [
    { x: x - dx, y: y - dz + dy },
    { x, y: y - dz + dy * 2 },
    { x, y: y + dy },
    { x: x - dx, y },
  ];
  const right: Pt[] = [
    { x: x + dx, y: y - dz + dy },
    { x, y: y - dz + dy * 2 },
    { x, y: y + dy },
    { x: x + dx, y },
  ];

  const poly = (pts: Pt[]) => pts.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <g>
      <polygon className="vpsTierFaceLeft" points={poly(left)} />
      <polygon className="vpsTierFaceRight" points={poly(right)} />
      <polygon className="vpsTierFaceTop" points={poly(top)} />
    </g>
  );
}

function Stack({ x, y, count }: { x: number; y: number; count: number }) {
  const step = 14;
  return (
    <g>
      {Array.from({ length: count }, (_, i) => (
        <IsoBlock key={i} x={x} y={y - i * step} />
      ))}
    </g>
  );
}

function UbuntuBadge({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <circle className="vpsTierBadgeUbuntu" r={15} />
      {/* Simplified circle-of-friends mark */}
      <circle fill="#fff" cx={0} cy={-7.5} r={2.6} />
      <circle fill="#fff" cx={-6.5} cy={4} r={2.6} />
      <circle fill="#fff" cx={6.5} cy={4} r={2.6} />
      <path
        fill="none"
        stroke="#fff"
        strokeWidth={2.2}
        strokeLinecap="round"
        d="M-4.2 -4.2 A9 9 0 0 1 4.2 -4.2 M-7.2 2.2 A9 9 0 0 0 -1.2 8.2 M7.2 2.2 A9 9 0 0 1 1.2 8.2"
      />
    </g>
  );
}

function WindowsBadge({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <circle className="vpsTierBadgeWindows" r={15} />
      <g fill="#fff" transform="translate(-8 -7.5)">
        <rect x="0" y="0" width="7" height="7" rx="0.6" />
        <rect x="9" y="0" width="7" height="7" rx="0.6" />
        <rect x="0" y="9" width="7" height="7" rx="0.6" />
        <rect x="9" y="9" width="7" height="7" rx="0.6" />
      </g>
    </g>
  );
}

function stacksForTier(
  tier: PlanTier,
): { x: number; y: number; count: number }[] {
  // Centered compositions in viewBox 120×110
  switch (tier) {
    case 1:
      return [{ x: 60, y: 78, count: 2 }];
    case 2:
      return [
        { x: 45, y: 78, count: 2 },
        { x: 75, y: 78, count: 2 },
      ];
    case 3:
      return [
        { x: 45, y: 78, count: 2 },
        { x: 75, y: 68, count: 3 },
      ];
    case 4:
      return [
        { x: 44, y: 78, count: 3 },
        { x: 76, y: 64, count: 4 },
      ];
  }
}

export function VpsPlanTierArt({ tier, family }: VpsPlanTierArtProps) {
  const stacks = stacksForTier(tier);
  const isWindows = family === "windows" || family === "windows-admin-rdp";
  const badge = { cx: 38, cy: 86 };

  return (
    <div className="vpsPlanTierArt">
      <svg
        viewBox="0 0 120 110"
        width="100%"
        height="100%"
        aria-hidden="true"
        focusable="false"
      >
        {stacks.map((s) => (
          <Stack key={`${s.x}-${s.y}-${s.count}`} {...s} />
        ))}
        {isWindows ? (
          <WindowsBadge cx={badge.cx} cy={badge.cy} />
        ) : (
          <UbuntuBadge cx={badge.cx} cy={badge.cy} />
        )}
      </svg>
    </div>
  );
}
