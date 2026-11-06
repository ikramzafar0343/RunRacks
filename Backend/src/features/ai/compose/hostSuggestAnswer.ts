/**
 * “Do the best, I’m deploying, my country is X” → region note + featured plan.
 * Uses the existing country routing table. Does not invent a ping number.
 */
import type { ConversationStateV1 } from "../types/state.js";
import type { ComposedTurn } from "../types/turn.js";
import { chipsBlock, links } from "./blocks.js";
import {
  getDatacenterAdvice,
  matchLocationQuery,
} from "../catalog/locationAdvisor.js";
import {
  PUBLISHED_PLANS,
  type PublishedCatalogPlan,
} from "../catalog/publishedCatalog.js";
import { isSpecBuildQuery } from "../rules/specPlanMatch.js";

type Family = PublishedCatalogPlan["family"];

const FAMILY_LABEL: Record<Family, string> = {
  linux: "Linux VPS",
  windows: "Windows VPS",
  "windows-admin-rdp": "Admin RDP",
};

function familyFrom(matching: string): Family | null {
  if (/admin rdp|\brdp\b/.test(matching)) return "windows-admin-rdp";
  if (/\bwindows\b/.test(matching)) return "windows";
  if (/\blinux\b/.test(matching)) return "linux";
  return null;
}

function extractCountry(matching: string): string | null {
  const explicit = matching.match(
    /\b(?:my\s+)?country\s+is\s+(.+?)(?=\s+(?:suggest|recommend|accordingly|please|so)\b|$)/,
  );
  if (explicit?.[1]) {
    const raw = explicit[1].trim();
    return matchLocationQuery(raw) ?? raw;
  }
  return matchLocationQuery(matching);
}

function hasNamedStack(matching: string): boolean {
  return /\b(next\s*js|nextjs|node\s*js|nodejs|postgres(?:ql)?|website|application|api|database)\b/.test(
    matching,
  );
}

function isHostSuggestQuery(matching: string): boolean {
  const ask = /\b(best|suggest|recommend|accordingly)\b/.test(matching);
  const country = Boolean(extractCountry(matching));
  if (!ask || !country) return false;
  const deploying =
    /\bdeploy(?:ing)?\b/.test(matching) || /\bhost(?:ing)? this\b/.test(matching);
  const named =
    /\b(?:my\s+)?country\s+is\b/.test(matching) ||
    /\bsuggest accordingly\b/.test(matching);
  if (deploying || named) return true;
  return hasNamedStack(matching) && !/\b(windows|rdp)\b/.test(matching);
}

function continuesSavedHost(
  matching: string,
  state: ConversationStateV1,
): boolean {
  const saved =
    Boolean(state.stackLabel) &&
    Boolean(state.userLocation || state.unresolvedLocationMention);
  return saved && /^(suggest|recommend)$/.test(matching);
}

function isHostAdjust(matching: string): boolean {
  return (
    familyFrom(matching) != null ||
    Boolean(extractCountry(matching)) ||
    /\b(smaller|starter|cheapest|bigger|larger)\b/.test(matching)
  );
}

function familyFromState(state: ConversationStateV1): Family {
  const last = state.lastDisplayedPlans[0]?.id ?? "";
  if (last.includes("rdp") || state.workload === "remote_desktop") {
    return "windows-admin-rdp";
  }
  if (last.includes("win") || state.osPreference === "windows") return "windows";
  return "linux";
}

function stackFitSentence(
  matching: string,
  family: Family,
  savedStack: string | null,
): string | null {
  if (family !== "linux") return null;
  const named: string[] = [];
  if (/\bnext\s*js\b|\bnextjs\b/.test(matching)) named.push("Next.js");
  if (/\bnode\s*js\b|\bnodejs\b/.test(matching)) named.push("Node.js");
  if (/\bpostgres(?:ql)?\b/.test(matching)) named.push("PostgreSQL");
  const label = named.length > 0 ? named.join(", ") : savedStack;
  const generic = /\b(website|application|api|database)\b/.test(matching);
  if (!label && !generic) return null;
  const what = label ?? "That website, API, or database";
  const verb = named.length > 1 || Boolean(label?.includes(",")) ? "are" : "is";
  return `${what} ${verb} why this Linux card was chosen. The published Linux plans are the fit for a site, API, or database when Windows and Admin RDP were not requested.`;
}

function pickPlan(family: Family, matching: string): PublishedCatalogPlan {
  const rows = PUBLISHED_PLANS.filter((plan) => plan.family === family).sort(
    (a, b) => a.monthlyMajor - b.monthlyMajor,
  );
  if (/\b(smaller|starter|cheapest)\b/.test(matching)) return rows[0]!;
  if (/\b(bigger|larger)\b/.test(matching)) return rows[rows.length - 1]!;
  return rows.find((plan) => plan.featured) ?? rows[0]!;
}

function switchChips(family: Family): { id: string; label: string }[] {
  const chips = [
    { id: "linux", label: "Linux VPS" },
    { id: "windows", label: "Windows VPS" },
    { id: "admin-rdp", label: "Admin RDP" },
    { id: "smaller", label: "Smaller plan" },
  ];
  return chips.filter((chip) => chip.label !== FAMILY_LABEL[family]);
}

export function tryHostSuggestAnswer(input: {
  matching: string;
  state: ConversationStateV1;
  evidenceIds: string[];
}): ComposedTurn | null {
  if (isSpecBuildQuery(input.matching)) return null;
  const pending = input.state.pendingClarification === "host_suggest";
  const fresh = isHostSuggestQuery(input.matching);
  const remembered = continuesSavedHost(input.matching, input.state);
  if (!fresh && !remembered && !(pending && isHostAdjust(input.matching))) {
    return null;
  }

  const country =
    extractCountry(input.matching) ??
    input.state.userLocation ??
    input.state.unresolvedLocationMention;
  const family =
    familyFrom(input.matching) ??
    (pending || remembered ? familyFromState(input.state) : "linux");
  const plan = pickPlan(family, input.matching);
  const advice = country ? getDatacenterAdvice(country) : null;
  const price = `$${plan.monthlyMajor.toFixed(2)}/mo`;
  const place = advice
    ? advice.adviceText
    : country
      ? `${country} is not in the routing table, so I will not invent a nearby region. Choose one of the eight catalog regions on the plan card.`
      : "Tell me the country and I’ll name the catalog regions we already route for that place.";

  const sizing = /\b(smaller|starter|cheapest)\b/.test(input.matching)
    ? "smaller"
    : /\b(bigger|larger)\b/.test(input.matching)
      ? "larger"
      : "featured";
  const why =
    sizing === "featured"
      ? "It is the production card in that family, not a claim that no other size can work."
      : `It is the ${sizing} published card in that family.`;
  const placeName = advice?.countryName ?? country ?? "your country";
  const deploying =
    /\bdeploy(?:ing)?\b/.test(input.matching) ||
    /\bhost(?:ing)? this\b/.test(input.matching);
  const text = [
    stackFitSentence(input.matching, family, input.state.stackLabel),
    deploying
      ? `You’re deploying or hosting from ${placeName}.`
      : `You’re hosting from ${placeName}.`,
    place,
    `${deploying ? "For that deploy" : "For that hosting"}, the ${sizing} ${FAMILY_LABEL[family]} card is ${plan.name}: ${plan.vcpu} vCPU, ${plan.ramGb} GB RAM, ${plan.nvmeGb} GB NVMe, ${price} labeled demo. ${why} Checkout is not orderable — confirm the region on Pricing.`,
  ]
    .filter((part): part is string => Boolean(part))
    .join("\n\n");

  const state: ConversationStateV1 = {
    ...input.state,
    workflow: "discovery",
    activeIntent: "discover",
    workload: family === "windows-admin-rdp" ? "remote_desktop" : "application",
    osPreference: family === "linux" ? "linux" : "windows",
    userLocation: advice?.countryName ?? country,
    unresolvedLocationMention: advice?.countryName ?? country,
    pendingClarification: "host_suggest",
    lastAnswerTemplateId: "host_suggest_v1",
    lastAdvisorAsk: "plan",
    lastDisplayedPlans: [{ id: plan.id, label: plan.name }],
  };

  return {
    text,
    blocks: [
      {
        type: "planCards",
        plans: [
          {
            id: plan.id,
            name: plan.name,
            reason: plan.tagline,
            priceLabel: price,
            href: "/pricing",
          },
        ],
      },
      chipsBlock(switchChips(family)),
      links(),
    ],
    templateId: "host_suggest_v1",
    state,
    evidenceIds: [...input.evidenceIds, plan.id, "location_routing"],
  };
}
