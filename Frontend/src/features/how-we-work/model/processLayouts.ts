/**
 * Desktop position presets + helpers for board scaling / clamping.
 */
import {
  PROCESS_BOARD,
  PROCESS_CARD,
  PROCESS_STEPS,
  type ProcessPosition,
  type ProcessStepId,
} from "@/features/how-we-work/model/processSteps";

export type ProcessLayoutMap = Record<ProcessStepId, ProcessPosition>;

export function defaultDesktopLayout(): ProcessLayoutMap {
  return Object.fromEntries(
    PROCESS_STEPS.map((s) => [s.id, { ...s.defaultPosition }]),
  ) as ProcessLayoutMap;
}

/** Deterministic alternate stagger — still readable, no overlaps. */
export function alternateDesktopLayout(): ProcessLayoutMap {
  return {
    family: { x: 40, y: 48 },
    region: { x: 300, y: 260 },
    plans: { x: 40, y: 320 },
    access: { x: 560, y: 40 },
    start: { x: 560, y: 340 },
    support: { x: 820, y: 520 },
  };
}

export function scaleLayout(
  layout: ProcessLayoutMap,
  boardWidth: number,
): ProcessLayoutMap {
  const sx = boardWidth / PROCESS_BOARD.width;
  const next = {} as ProcessLayoutMap;
  for (const step of PROCESS_STEPS) {
    const p = layout[step.id];
    next[step.id] = { x: p.x * sx, y: p.y * sx };
  }
  return next;
}

export function clampPosition(
  pos: ProcessPosition,
  boardWidth: number,
  boardHeight: number,
  tall: boolean,
): ProcessPosition {
  const cardW = PROCESS_CARD.width * (boardWidth / PROCESS_BOARD.width);
  const cardH =
    (tall ? PROCESS_CARD.tallHeight : PROCESS_CARD.height) *
    (boardWidth / PROCESS_BOARD.width);
  return {
    x: Math.min(Math.max(0, pos.x), Math.max(0, boardWidth - cardW)),
    y: Math.min(Math.max(0, pos.y), Math.max(0, boardHeight - cardH)),
  };
}

export type BoardMode = "freeform" | "tablet" | "mobile";

/**
 * Freeform + drag from 768px with a fine pointer.
 * Touch tablets (≥768, coarse) keep a non-draggable 2-col grid.
 * Mobile (<768) is a single-column stack.
 */
export function resolveBoardMode(
  width: number,
  finePointer: boolean,
): BoardMode {
  if (width < 768) return "mobile";
  if (finePointer) return "freeform";
  return "tablet";
}

/** @deprecated Prefer resolveBoardMode — assumes fine pointer. */
export function boardModeFromWidth(width: number): BoardMode {
  return resolveBoardMode(width, true);
}
