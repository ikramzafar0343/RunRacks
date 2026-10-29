"use client";

/**
 * Single process stage card — floating label + drag handle / surface drag.
 */
import type {
  CSSProperties,
  KeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import type { ProcessStep } from "@/features/how-we-work/model/processSteps";

function DragDotsIcon() {
  const dots = [0, 1, 2].flatMap((row) =>
    [0, 1].map((col) => (
      <circle
        key={`${row}-${col}`}
        cx={3 + col * 6}
        cy={2.5 + row * 5.5}
        r="1.35"
        fill="currentColor"
      />
    )),
  );
  return (
    <svg width="12" height="16" viewBox="0 0 12 16" aria-hidden>
      {dots}
    </svg>
  );
}

export type ProcessCardProps = {
  step: ProcessStep;
  style?: CSSProperties;
  interactive?: boolean;
  dragging?: boolean;
  onDragPointerDown?: (e: ReactPointerEvent<HTMLElement>) => void;
  onHandleKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
};

export function ProcessCard({
  step,
  style,
  interactive = false,
  dragging = false,
  onDragPointerDown,
  onHandleKeyDown,
}: ProcessCardProps) {
  return (
    <div
      className="processNode"
      data-process-node={step.id}
      data-dragging={dragging ? "true" : undefined}
      style={style}
    >
      <span className="processNodeLabel">
        {step.number} {step.name.toUpperCase()}
      </span>
      <article
        className={`processCard processCard--${step.theme}${step.tall ? " processCard--tall" : ""}`}
        data-process-card={step.id}
        data-draggable={interactive ? "true" : undefined}
        onPointerDown={interactive ? onDragPointerDown : undefined}
      >
        {interactive ? (
          <button
            type="button"
            className="processCardDrag"
            aria-label={`Move ${step.name} stage`}
            onPointerDown={(e) => {
              e.stopPropagation();
              onDragPointerDown?.(e);
            }}
            onKeyDown={onHandleKeyDown}
          >
            <DragDotsIcon />
          </button>
        ) : null}
        <h3 className="processCardTitle">{step.name}</h3>
        <div className="processCardDetails">
          {step.details.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div className="processCardOutcome">
          <span>Outcome: {step.outcome}</span>
        </div>
      </article>
    </div>
  );
}
