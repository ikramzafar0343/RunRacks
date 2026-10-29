"use client";

/**
 * Thin SVG connectors between process stages — behind cards.
 */

export type ConnectorSegment = {
  key: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type ProcessConnectorsProps = {
  segments: readonly ConnectorSegment[];
};

export function ProcessConnectors({ segments }: ProcessConnectorsProps) {
  return (
    <svg className="processConnectors" aria-hidden data-process-connectors>
      {segments.map((seg) => (
        <path
          key={seg.key}
          className="processConnectorPath"
          data-process-line={seg.key}
          d={`M ${seg.x1} ${seg.y1} L ${seg.x2} ${seg.y2}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

export function edgeToward(
  from: { x: number; y: number; w: number; h: number },
  to: { x: number; y: number; w: number; h: number },
) {
  const fromCx = from.x + from.w / 2;
  const fromCy = from.y + from.h / 2;
  const toCx = to.x + to.w / 2;
  const toCy = to.y + to.h / 2;
  const dx = toCx - fromCx;
  const dy = toCy - fromCy;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return { x: dx >= 0 ? from.x + from.w : from.x, y: fromCy };
  }
  return { x: fromCx, y: dy >= 0 ? from.y + from.h : from.y };
}
