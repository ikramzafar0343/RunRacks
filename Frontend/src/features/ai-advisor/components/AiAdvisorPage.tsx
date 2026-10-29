/**
 * Server-friendly page composition for /ai.
 */
import { AiAdvisor } from "@/features/ai-advisor/components/AiAdvisor";

type AiAdvisorPageProps = {
  topic?: string | null;
};

export function AiAdvisorPage({ topic = null }: AiAdvisorPageProps) {
  return (
    <main className="flex flex-1 flex-col">
      <AiAdvisor topicParam={topic} />
    </main>
  );
}
