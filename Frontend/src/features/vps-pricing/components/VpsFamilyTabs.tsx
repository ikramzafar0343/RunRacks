/**
 * Hosting-type segmented control (accessible tablist).
 * Client boundary is VpsPricingSection (parent).
 */
import type { KeyboardEvent } from "react";
import type { VpsFamily } from "@/features/vps-pricing/model/types";

const OPTIONS: Array<{ id: VpsFamily; label: string }> = [
  { id: "linux", label: "Linux VPS Hosting" },
  { id: "windows", label: "Windows VPS Hosting" },
  { id: "windows-admin-rdp", label: "Windows Admin RDP" },
];

type VpsFamilyTabsProps = {
  value: VpsFamily;
  onChange: (family: VpsFamily) => void;
};

export function VpsFamilyTabs({ value, onChange }: VpsFamilyTabsProps) {
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = OPTIONS.findIndex((o) => o.id === value);
    if (index < 0) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const delta = event.key === "ArrowRight" ? 1 : -1;
      const next = OPTIONS[(index + delta + OPTIONS.length) % OPTIONS.length];
      if (next) onChange(next.id);
    }
  }

  return (
    <div className="vpsFamilyScroll">
      <div
        className="vpsSegmented vpsFamilySegmented"
        role="tablist"
        aria-label="Hosting type"
        onKeyDown={onKeyDown}
      >
        {OPTIONS.map((option) => {
          const active = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              className="vpsSegment vpsFamilySegment"
              data-family={option.id}
              data-active={active ? "true" : "false"}
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(option.id)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
