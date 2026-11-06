/**
 * One or two catalog cards inside an advisor reply.
 * Prices come from the demo catalog the advisor already quoted.
 */
"use client";

import {
  DEFAULT_LOCATION_ID,
  VpsPlanList,
  getDemoVpsCatalog,
} from "@/features/vps-pricing";
import "@/features/vps-pricing/components/vps-plan-cards.css";
import "@/features/ai-advisor/components/advisor-plans.css";

const REGION_BY_CODE: Record<string, string> = {
  US: "us",
  CA: "ca",
  UK: "gb",
  NL: "nl",
  DE: "de",
  SG: "sg",
  AU: "au",
  JP: "jp",
};

/** First catalog region named in the routing sentence, never a guessed country. */
function regionFromAdvice(text: string): string | null {
  if (/not in the routing table/i.test(text)) return null;
  const code = text.match(/\(([A-Z]{2})\)/);
  return code?.[1] ? (REGION_BY_CODE[code[1]] ?? null) : null;
}

export function AdvisorPlanCards({
  planIds,
  text,
}: {
  planIds: readonly string[];
  text: string;
}) {
  const catalog = getDemoVpsCatalog();
  const byId = new Map(catalog.plans.map((plan) => [plan.id, plan]));
  const plans = planIds
    .map((id) => byId.get(id))
    .filter((plan): plan is NonNullable<typeof plan> => Boolean(plan));
  if (plans.length === 0) return null;
  const advised = regionFromAdvice(text);
  const locationId =
    advised && catalog.regions.some((region) => region.id === advised)
      ? advised
      : catalog.regions.some((region) => region.id === DEFAULT_LOCATION_ID)
        ? DEFAULT_LOCATION_ID
        : (catalog.regions[0]?.id ?? null);

  return (
    <div className="aiAdvisorPlans">
      <VpsPlanList
        plans={plans}
        term={1}
        locationId={locationId}
        checkoutConfigured={catalog.checkoutConfigured}
        layout="cards"
      />
    </div>
  );
}
