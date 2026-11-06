/**
 * Customize pricing card inside an advisor reply.
 */
"use client";

import type { Route } from "next";
import { CustomizePriceCard } from "@/features/customize";
import type { AdvisorCustomizeQuote } from "@/features/ai-advisor/hooks/chatTypes";
import type { VpsRegion } from "@/features/vps-pricing";
import "@/features/ai-advisor/components/advisor-quote.css";

export function AdvisorQuoteCard({ quote }: { quote: AdvisorCustomizeQuote }) {
  const region: VpsRegion = {
    id: quote.regionId,
    name: quote.regionName,
    countryCode: quote.countryCode,
  };
  return (
    <div className="aiAdvisorQuote">
      <CustomizePriceCard
        family={quote.family}
        familyLabel={quote.familyLabel}
        region={region}
        term={quote.term}
        vcpu={quote.vcpu}
        ramGb={quote.ramGb}
        nvmeGb={quote.nvmeGb}
        bandwidthTb={quote.bandwidthTb}
        dedicatedIpv4={quote.dedicatedIpv4}
        automatedBackups={quote.automatedBackups}
        price={{
          currency: "USD",
          monthlyMinor: quote.monthlyMinor,
          termTotalMinor: quote.termTotalMinor,
          notice: quote.notice,
        }}
        primaryHref={quote.href as Route}
        primaryLabel="Open Customize"
      />
    </div>
  );
}
