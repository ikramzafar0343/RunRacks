/**
 * Centered empty-state title.
 */
import { Sparkles } from "lucide-react";
import { AI_COPY } from "@/features/ai-advisor/model/aiContent";

export function AiAdvisorHeader() {
  return (
    <header className="aiAdvisorHeader aiAdvisorHeader--hero">
      <span className="aiAdvisorSparkle" aria-hidden>
        <Sparkles size={22} strokeWidth={2} />
      </span>
      <h1 className="aiAdvisorTitle">
        Ask RunRacks <span className="aiAdvisorTitleAccent">AI</span>
      </h1>
      <p className="aiAdvisorLead">{AI_COPY.lead}</p>
    </header>
  );
}
