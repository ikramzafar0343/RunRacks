"use client";

/**
 * Lightweight accessible dialog — Esc, backdrop, focus restore (no new deps).
 */
import {
  useEffect,
  useId,
  useRef,
  type ReactNode,
  type MouseEvent,
} from "react";

type AiDialogProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  size?: "md" | "lg";
};

export function AiDialog({
  open,
  title,
  onClose,
  children,
  className = "",
  size = "md",
}: AiDialogProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const focusable = panel?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusable?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previousFocus.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  function onBackdrop(event: MouseEvent) {
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <div
      className="aiDialogBackdrop"
      role="presentation"
      onMouseDown={onBackdrop}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`aiDialogPanel aiDialogPanel--${size} ${className}`.trim()}
      >
        <div className="aiDialogHead">
          <h2 id={titleId} className="aiDialogTitle">
            {title}
          </h2>
          <button
            type="button"
            className="aiDialogClose"
            aria-label="Close dialog"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="aiDialogBody">{children}</div>
      </div>
    </div>
  );
}
