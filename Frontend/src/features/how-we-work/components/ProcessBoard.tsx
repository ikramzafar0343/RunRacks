"use client";

/**
 * Process board — freeform desktop positions, drag/keyboard, rearrange/reset.
 */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ProcessCard } from "@/features/how-we-work/components/ProcessCard";
import {
  ProcessConnectors,
  edgeToward,
  type ConnectorSegment,
} from "@/features/how-we-work/components/ProcessConnectors";
import {
  alternateDesktopLayout,
  clampPosition,
  defaultDesktopLayout,
  resolveBoardMode,
  scaleLayout,
  type BoardMode,
  type ProcessLayoutMap,
} from "@/features/how-we-work/model/processLayouts";
import {
  PROCESS_BOARD,
  PROCESS_CARD,
  PROCESS_CONNECTIONS,
  PROCESS_STEPS,
  type ProcessStepId,
} from "@/features/how-we-work/model/processSteps";

type Pos = { x: number; y: number };

type DragState = {
  id: ProcessStepId;
  origin: Pos;
  startLayout: Pos;
};

type MoveMode = { id: ProcessStepId; snapshot: Pos };

function cardSize(tall: boolean | undefined, scale: number) {
  return {
    w: PROCESS_CARD.width * scale,
    h: (tall ? PROCESS_CARD.tallHeight : PROCESS_CARD.height) * scale,
  };
}

function hasFinePointer() {
  return window.matchMedia("(pointer: fine)").matches;
}

export function ProcessBoard() {
  const boardRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<ProcessLayoutMap>(defaultDesktopLayout);
  const [boardW, setBoardW] = useState<number>(PROCESS_BOARD.width);
  const [mode, setMode] = useState<BoardMode>("freeform");
  const [drag, setDrag] = useState<DragState | null>(null);
  const [moveMode, setMoveMode] = useState<MoveMode | null>(null);
  const [liveMsg, setLiveMsg] = useState("");
  const [usingAlt, setUsingAlt] = useState(false);

  const scale = boardW / PROCESS_BOARD.width;
  const boardH = PROCESS_BOARD.height * scale;
  const interactive = mode === "freeform";
  const freeform = mode === "freeform";

  const syncMode = useCallback(() => {
    setMode(resolveBoardMode(window.innerWidth, hasFinePointer()));
  }, []);

  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const fineMq = window.matchMedia("(pointer: fine)");
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? PROCESS_BOARD.width;
      setBoardW(Math.max(w, 280));
      syncMode();
    });
    ro.observe(el);
    syncMode();
    const onFineChange = () => syncMode();
    fineMq.addEventListener("change", onFineChange);
    window.addEventListener("resize", syncMode);
    return () => {
      ro.disconnect();
      fineMq.removeEventListener("change", onFineChange);
      window.removeEventListener("resize", syncMode);
    };
  }, [syncMode]);

  const scaledLayout = useMemo(
    () => scaleLayout(layout, boardW),
    [layout, boardW],
  );

  const segments: ConnectorSegment[] = useMemo(() => {
    if (!freeform) return [];
    const boxes = Object.fromEntries(
      PROCESS_STEPS.map((s) => {
        const p = scaledLayout[s.id];
        const size = cardSize(s.tall, scale);
        return [s.id, { x: p.x, y: p.y, w: size.w, h: size.h }];
      }),
    ) as Record<ProcessStepId, { x: number; y: number; w: number; h: number }>;

    return PROCESS_CONNECTIONS.map(([from, to]) => {
      const a = edgeToward(boxes[from]!, boxes[to]!);
      const b = edgeToward(boxes[to]!, boxes[from]!);
      return { key: `${from}-${to}`, x1: a.x, y1: a.y, x2: b.x, y2: b.y };
    });
  }, [scaledLayout, scale, freeform]);

  const applyLayout = useCallback((next: ProcessLayoutMap, alt: boolean) => {
    setLayout(next);
    setUsingAlt(alt);
  }, []);

  const reset = () => {
    applyLayout(defaultDesktopLayout(), false);
    setLiveMsg("Layout reset to default positions.");
  };

  const rearrange = () => {
    const nextAlt = !usingAlt;
    applyLayout(
      nextAlt ? alternateDesktopLayout() : defaultDesktopLayout(),
      nextAlt,
    );
    setLiveMsg(
      nextAlt
        ? "Applied alternate process layout."
        : "Restored primary process layout.",
    );
  };

  const onDragPointerDown = (
    id: ProcessStepId,
    e: ReactPointerEvent<HTMLElement>,
  ) => {
    if (!interactive) return;
    const target = e.target as HTMLElement;
    if (target.closest("a")) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({
      id,
      origin: { x: e.clientX, y: e.clientY },
      startLayout: { ...layout[id] },
    });
  };

  useEffect(() => {
    if (!drag) return;
    const onMove = (e: PointerEvent) => {
      const dx = (e.clientX - drag.origin.x) / scale;
      const dy = (e.clientY - drag.origin.y) / scale;
      const step = PROCESS_STEPS.find((s) => s.id === drag.id);
      const next = clampPosition(
        { x: drag.startLayout.x + dx, y: drag.startLayout.y + dy },
        PROCESS_BOARD.width,
        PROCESS_BOARD.height,
        Boolean(step?.tall),
      );
      setLayout((prev) => ({ ...prev, [drag.id]: next }));
    };
    const onUp = () => {
      const name = PROCESS_STEPS.find((s) => s.id === drag.id)?.name ?? "stage";
      setDrag(null);
      setLiveMsg(`Moved ${name}.`);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [drag, scale]);

  const onHandleKeyDown = (
    id: ProcessStepId,
    e: KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (!interactive) return;
    const step = PROCESS_STEPS.find((s) => s.id === id);
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (moveMode?.id === id) {
        setMoveMode(null);
        setLiveMsg(`${step?.name ?? "Stage"} position saved.`);
      } else {
        setMoveMode({ id, snapshot: { ...layout[id] } });
        setLiveMsg(
          `Moving ${step?.name}. Use arrow keys to reposition. Hold Shift for larger steps. Enter to finish or Escape to cancel.`,
        );
      }
      return;
    }
    if (moveMode?.id !== id) return;
    if (e.key === "Escape") {
      e.preventDefault();
      setLayout((prev) => ({ ...prev, [id]: moveMode.snapshot }));
      setMoveMode(null);
      setLiveMsg("Move cancelled.");
      return;
    }
    const stepPx = e.shiftKey ? 30 : 10;
    let { x, y } = layout[id];
    if (e.key === "ArrowLeft") x -= stepPx;
    else if (e.key === "ArrowRight") x += stepPx;
    else if (e.key === "ArrowUp") y -= stepPx;
    else if (e.key === "ArrowDown") y += stepPx;
    else return;
    e.preventDefault();
    setLayout((prev) => ({
      ...prev,
      [id]: clampPosition(
        { x, y },
        PROCESS_BOARD.width,
        PROCESS_BOARD.height,
        Boolean(step?.tall),
      ),
    }));
  };

  return (
    <div className="processBoardWrapper" data-board-mode={mode}>
      <div
        ref={boardRef}
        className="processBoard"
        style={
          freeform
            ? {
                height: boardH,
                aspectRatio: `${PROCESS_BOARD.width} / ${PROCESS_BOARD.height}`,
              }
            : undefined
        }
      >
        {freeform ? <ProcessConnectors segments={segments} /> : null}
        {PROCESS_STEPS.map((step) => {
          const p = scaledLayout[step.id];
          const size = cardSize(step.tall, scale);
          const style: CSSProperties = freeform
            ? { position: "absolute", left: p.x, top: p.y, width: size.w }
            : {};
          return (
            <ProcessCard
              key={step.id}
              step={step}
              style={style}
              interactive={interactive}
              dragging={drag?.id === step.id}
              onDragPointerDown={(ev) => onDragPointerDown(step.id, ev)}
              onHandleKeyDown={(ev) => onHandleKeyDown(step.id, ev)}
            />
          );
        })}
      </div>
      {interactive ? (
        <div className="processBoardActions">
          <button type="button" onClick={rearrange}>
            Re-arrange
          </button>
          <button type="button" onClick={reset}>
            Reset layout
          </button>
        </div>
      ) : null}
      <p className="sr-only" aria-live="polite">
        {liveMsg}
      </p>
    </div>
  );
}
