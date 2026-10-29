/**
 * Text-only tablist with WAI-ARIA automatic activation + roving tabindex.
 */
"use client";

import type { KeyboardEvent } from "react";
import type {
  BenefitTab,
  BenefitTabId,
} from "@/features/admin-rdp-benefits/model/adminRdpBenefits.data";

export type AdminRdpBenefitsTabsProps = {
  tabs: readonly BenefitTab[];
  activeId: BenefitTabId;
  onSelect: (id: BenefitTabId) => void;
  labelledBy: string;
};

export function AdminRdpBenefitsTabs({
  tabs,
  activeId,
  onSelect,
  labelledBy,
}: AdminRdpBenefitsTabsProps) {
  const indexOf = (id: BenefitTabId) => tabs.findIndex((t) => t.id === id);

  const activateAt = (index: number) => {
    const next = tabs[(index + tabs.length) % tabs.length];
    if (next) onSelect(next.id);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = indexOf(activeId);
    if (current < 0) return;

    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        activateAt(current + 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        activateAt(current - 1);
        break;
      case "Home":
        event.preventDefault();
        activateAt(0);
        break;
      case "End":
        event.preventDefault();
        activateAt(tabs.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div
      className="ardpBenefits__tabs"
      role="tablist"
      aria-labelledby={labelledBy}
      aria-orientation="horizontal"
      onKeyDown={onKeyDown}
      data-ardp-tabs
    >
      {tabs.map((tab) => {
        const selected = tab.id === activeId;
        return (
          <button
            key={tab.id}
            id={`ardp-benefit-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`ardp-benefit-panel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            className="ardpBenefits__tab"
            onClick={() => {
              if (!selected) onSelect(tab.id);
            }}
          >
            {tab.tabLabel}
          </button>
        );
      })}
    </div>
  );
}
