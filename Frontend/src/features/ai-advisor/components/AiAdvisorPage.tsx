/**
 * Server-friendly page composition for /ai.
 */
import { AiAdvisor } from "@/features/ai-advisor/components/AiAdvisor";

type AiAdvisorPageProps = {
  topic?: string | null;
  ask?: string | null;
};

export function AiAdvisorPage({
  topic = null,
  ask = null,
}: AiAdvisorPageProps) {
  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <AiAdvisor topicParam={topic} ask={ask} />
    </main>
  );
}
