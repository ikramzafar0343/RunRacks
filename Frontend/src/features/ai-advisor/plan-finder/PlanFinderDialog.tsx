"use client";

/**
 * One-step Plan Finder — Linux VPS, Windows VPS, or Admin RDP.
 */
import { AppWindow, Monitor, Server, type LucideIcon } from "lucide-react";
import { AiDialog } from "@/features/ai-advisor/components/AiDialog";
import { PLAN_CHOICES } from "@/features/ai-advisor/plan-finder/planFinderContent";
import type { VpsFamily } from "@/features/vps-pricing/model/types";

type PlanFinderDialogProps = {
  open: boolean;
  onClose: () => void;
  onComplete: (family: VpsFamily) => void;
};

const ICONS: Record<VpsFamily, LucideIcon> = {
  linux: Server,
  windows: Monitor,
  "windows-admin-rdp": AppWindow,
};

export function PlanFinderDialog({
  open,
  onClose,
  onComplete,
}: PlanFinderDialogProps) {
  return (
    <AiDialog open={open} title="Choose a product" onClose={onClose}>
      <div className="aiPlanGrid">
        {PLAN_CHOICES.map((choice) => {
          const Icon = ICONS[choice.family];
          return (
            <button
              key={choice.family}
              type="button"
              className="aiPlanCard aiPlanCard--icon"
              onClick={() => {
                onComplete(choice.family);
                onClose();
              }}
            >
              <span className="aiPlanCardIcon" aria-hidden>
                <Icon size={20} strokeWidth={2} />
              </span>
              <strong>{choice.title}</strong>
            </button>
          );
        })}
      </div>
    </AiDialog>
  );
}
