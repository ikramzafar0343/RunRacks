/**
 * Three product prompts. Selecting one fills the composer.
 */
import { AppWindow, Monitor, Server } from "lucide-react";
import type { AiStarterIconId, AiStarterWithIcon } from "@/features/ai-advisor/model/aiContent";

type StarterPromptListProps = {
  starters: readonly AiStarterWithIcon[];
  onSelect: (starter: AiStarterWithIcon) => void;
  hidden?: boolean;
};

function StarterIcon({ id }: { id: AiStarterIconId }) {
  const props = { size: 18, strokeWidth: 2, "aria-hidden": true as const };
  if (id === "monitor") return <Monitor {...props} />;
  if (id === "rdp") return <AppWindow {...props} />;
  return <Server {...props} />;
}

export function StarterPromptList({
  starters,
  onSelect,
  hidden = false,
}: StarterPromptListProps) {
  if (hidden) return null;

  return (
    <ul className="aiAdvisorChips" aria-label="Suggested questions">
      {starters.map((starter) => (
        <li key={starter.id}>
          <button
            type="button"
            className="aiAdvisorChip"
            onClick={() => onSelect(starter)}
          >
            <span className="aiAdvisorChipIcon">
              <StarterIcon id={starter.icon} />
            </span>
            <span className="aiAdvisorChipLabel">{starter.label}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
