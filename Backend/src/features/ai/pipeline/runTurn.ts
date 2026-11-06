/**
 * Staged owned-advisor turn — no neural models.
 */
import type { Db } from "../../../platform/db.js";
import { emptyState, parseState, type ConversationStateV1 } from "../types/state.js";
import type { ComposedTurn, HistoryTurn } from "../types/turn.js";
import { normalizeForMatch } from "./normalize.js";
import { detectDialogueActs } from "./dialogue.js";
import { extractAndMergeEntities } from "./entities.js";
import { pickPrimaryIntent, scoreIntents } from "./intents.js";
import { retrieveKnowledge } from "../retrieval/lexical.js";
import { runAiTool } from "../aiTools.js";
import { buildAnswer } from "../compose/buildAnswer.js";
import { tryMemoryFollowUp } from "../compose/memoryFollowUp.js";
import { findPlanCard } from "../pack/demoPlanCatalog.js";
import type { PlanCandidate } from "../rules/recommend.js";
import type { CatalogFreshness } from "../types/turn.js";

export async function runTurn(input: {
  db: Db | null;
  message: string;
  topic?: string | null;
  history?: HistoryTurn[];
  priorState?: unknown;
}): Promise<ComposedTurn> {
  const norm = normalizeForMatch(input.message);
  let state: ConversationStateV1 = parseState(input.priorState);
  if (!input.priorState) state = emptyState(norm.languageHint);

  const acts = detectDialogueActs(norm);
  state = extractAndMergeEntities(norm, state);

  const remembered = tryMemoryFollowUp({
    matching: norm.matching,
    state,
    evidenceIds: [],
  });
  if (remembered) return remembered;

  const scored = scoreIntents(norm, input.topic);
  const picked = pickPrimaryIntent(scored, acts, state, norm.matching);

  const knowledge = retrieveKnowledge(
    norm.matching,
    state.language === "roman_urdu" ? "roman_urdu" : "en",
  );

  let plans: PlanCandidate[] = [];
  let freshness: CatalogFreshness = "unavailable";
  if (
    ["discover", "pricing", "compare", "linux_vps", "windows_vps", "admin_rdp"].includes(
      picked.primary,
    )
  ) {
    const tool = await runAiTool(
      input.db,
      "get_public_plans",
      JSON.stringify({ limit: 20 }),
    );
    const source = String(tool.payload.source ?? "empty");
    freshness =
      source === "whmcs_cache" || source === "fresh"
        ? "fresh"
        : source === "published_catalog" || source === "demo"
          ? "demo"
          : source === "stale"
            ? "stale"
            : source === "unavailable"
              ? "unavailable"
              : "empty";
    const items = Array.isArray(tool.payload.items) ? tool.payload.items : [];
    plans = items.map((raw, i) => {
      const r = raw as {
        name?: string;
        family?: string;
        prices?: Array<{ currency?: string; cycle?: string; amountMinor?: number }>;
      };
      const price = r.prices?.[0];
      const amountMinor =
        typeof price?.amountMinor === "number" && price.amountMinor >= 0
          ? price.amountMinor
          : null;
      return {
        id: `plan_${i}_${r.name ?? "x"}`,
        name: r.name ?? "Plan",
        family: r.family ?? "",
        amountMinor,
        ...(amountMinor != null && price
          ? {
              priceLabel: `${price.currency ?? "USD"} ${(amountMinor / 100).toFixed(2)}/${price.cycle ?? "cycle"}`,
            }
          : {}),
      };
    });
  }

  const history = input.history ?? [];
  if (state.lastDisplayedPlans.length === 0) {
    for (let i = history.length - 1; i >= 0; i--) {
      const plan = findPlanCard((history[i]?.body ?? "").toLowerCase());
      if (!plan) continue;
      state = {
        ...state,
        lastDisplayedPlans: [{ id: plan.id, label: plan.name }],
      };
      break;
    }
  }

  return buildAnswer({
    primary: picked.primary,
    parts: picked.parts,
    matching: norm.matching,
    original: norm.original,
    state,
    knowledge,
    plans,
    freshness,
    acts,
    ambiguous: picked.ambiguous,
  });
}
