"use client";

/**
 * Accessible help tooltip for statistic metric labels.
 */
import { useEffect, useId, useRef, useState } from "react";
import { HiOutlineInformationCircle } from "react-icons/hi2";

type StatisticHelpTooltipProps = {
  label: string;
  description: string;
};

export function StatisticHelpTooltip({
  label,
  description,
}: StatisticHelpTooltipProps) {
  const tipId = useId();
  const rootRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <span className="statsHelp" ref={rootRef}>
      <button
        type="button"
        className="statsHelpBtn"
        aria-label={`About ${label}`}
        aria-expanded={open}
        aria-describedby={open ? tipId : undefined}
        onClick={() => setOpen((prev) => !prev)}
      >
        <HiOutlineInformationCircle size={14} aria-hidden />
      </button>
      {open ? (
        <span className="statsHelpTip" id={tipId} role="tooltip">
          {description}
        </span>
      ) : null}
    </span>
  );
}
