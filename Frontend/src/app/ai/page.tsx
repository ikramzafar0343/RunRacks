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

type AiRoutePageProps = {
  searchParams: Promise<{ topic?: string | string[] }>;
};

async function AiTopicContent({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string | string[] }>;
}) {
  const params = await searchParams;
  const raw = params.topic;
  const topicValue = Array.isArray(raw) ? raw[0] : raw;
  const topic = isAiTopic(topicValue) ? topicValue : null;

  return <AiAdvisorPage topic={topic} />;
}

export default function AiRoutePage({ searchParams }: AiRoutePageProps) {
  return (
    <Suspense fallback={<AiAdvisorPage />}>
      <AiTopicContent searchParams={searchParams} />
    </Suspense>
  );
}
