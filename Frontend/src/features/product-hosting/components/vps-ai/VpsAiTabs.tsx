"use client";

/**
 * Four capsule tabs — Troubleshoot / Set up / Deploy / Secure.
 */
import type { KeyboardEvent } from "react";
import { VPS_AI_DEMOS, type DemoId } from "./vpsAiData";

type VpsAiTabsProps = {
  activeId: DemoId;
  baseId: string;
  onSelect: (id: DemoId) => void;
};

export function VpsAiTabs({ activeId, baseId, onSelect }: VpsAiTabsProps) {
  function onKeyDown(e: KeyboardEvent, index: number) {
    const last = VPS_AI_DEMOS.length - 1;
    let next = index;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      next = index === last ? 0 : index + 1;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      next = index === 0 ? last : index - 1;
    } else if (e.key === "Home") {
      e.preventDefault();
      next = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      next = last;
    } else {
      return;
    }
    const demo = VPS_AI_DEMOS[next];
    if (!demo) return;
    onSelect(demo.id);
    document.getElementById(`${baseId}-tab-${demo.id}`)?.focus();
  }

  return (
    <div
      className="vpsAiTabs"
      role="tablist"
      aria-label="VPS AI assistance topics"
    >
      {VPS_AI_DEMOS.map((demo, i) => {
        const selected = demo.id === activeId;
        return (
          <button
            key={demo.id}
            type="button"
            role="tab"
            id={`${baseId}-tab-${demo.id}`}
            aria-selected={selected}
            aria-controls={`${baseId}-panel`}
            tabIndex={selected ? 0 : -1}
            className="vpsAiTab"
            onClick={() => onSelect(demo.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {demo.tabLabel}
          </button>
        );
      })}
    </div>
  );
}
