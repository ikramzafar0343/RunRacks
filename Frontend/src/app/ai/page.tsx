/**
 * RunRacks AI Advisor — chat UI + honest API seams.
 */
import type { Metadata } from "next";
import { Suspense } from "react";
import { AiAdvisorPage } from "@/features/ai-advisor/components/AiAdvisorPage";
import { AI_META, isAiTopic } from "@/features/ai-advisor/model/aiContent";

export const metadata: Metadata = {
  title: AI_META.title,
  description: AI_META.description,
  alternates: { canonical: "/ai" },
};

type AiQuery = { topic?: string | string[]; ask?: string | string[] };

type AiRoutePageProps = {
  searchParams: Promise<AiQuery>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function AiTopicContent({
  searchParams,
}: {
  searchParams: Promise<AiQuery>;
}) {
  const params = await searchParams;
  const topicValue = firstParam(params.topic);
  const topic = isAiTopic(topicValue) ? topicValue : null;
  const askRaw = firstParam(params.ask)?.trim() ?? "";
  const ask = askRaw ? askRaw.slice(0, 280) : null;

  return <AiAdvisorPage topic={topic} ask={ask} />;
}

export default function AiRoutePage({ searchParams }: AiRoutePageProps) {
  return (
    <Suspense fallback={<AiAdvisorPage />}>
      <AiTopicContent searchParams={searchParams} />
    </Suspense>
  );
}
