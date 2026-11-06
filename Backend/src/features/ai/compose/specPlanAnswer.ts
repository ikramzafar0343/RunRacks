/**
 * “Create a plan with these specs” → ask type, region, and term, then show a card.
 */
import type { ConversationStateV1, CustomQuoteDraft } from "../types/state.js";
import type { ComposedTurn, UiBlock } from "../types/turn.js";
import { chipsBlock } from "./blocks.js";
import {
  calculateCustomizeQuote,
  familyLabel,
} from "../pack/customizeQuote.js";
import {
  customizeDeepLink,
  isSpecBuildQuery,
  parseHardwareSpecs,
} from "../rules/specPlanMatch.js";
import {
  REGION_CHIPS,
  TERM_CHIPS,
  TYPE_CHIPS,
  askedVsBuilt,
  describeKnownSpecs,
  draftFromMessage,
  mergeDraft,
  missingHardwareLabels,
  quoteRegion,
  quoteStep,
  specsFilled,
} from "../rules/customQuoteDraft.js";

const OPEN_LINKS: UiBlock = {
  type: "actionLinks",
  links: [
    { label: "Open Customize", href: "/customize" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
  ],
};

const NUMBERS_PROMPT =
  "I size a Customize demo build from your numbers — not a fixed catalog card. Send CPU (vCPU), RAM (GB), NVMe SSD (GB), and bandwidth (TB). Example: “cpu is 1 ram is 4 storage is 40 and bandwidth is 5”.";

function inWizard(state: ConversationStateV1): boolean {
  return (
    state.pendingClarification === "hardware_specs" ||
    state.pendingClarification === "custom_type" ||
    state.pendingClarification === "custom_region" ||
    state.pendingClarification === "custom_term"
  );
}

function withDraft(
  input: {
    state: ConversationStateV1;
    evidenceIds: string[];
  },
  draft: CustomQuoteDraft,
  templateId: string,
  pending: string | null,
  text: string,
  blocks: UiBlock[],
  extraEvidence: string[] = [],
): ComposedTurn {
  return {
    text,
    blocks,
    templateId,
    state: {
      ...input.state,
      activeIntent: "pricing",
      lastAnswerTemplateId: templateId,
      pendingClarification: pending,
      customQuote: draft,
    },
    evidenceIds: [...input.evidenceIds, ...extraEvidence],
  };
}

function respond(
  input: {
    matching: string;
    state: ConversationStateV1;
    evidenceIds: string[];
  },
  draft: CustomQuoteDraft,
  includeCompare: boolean,
): ComposedTurn {
  const step = quoteStep(draft);
  if (step === "hardware") {
    const have = describeKnownSpecs(draft);
    const missing = missingHardwareLabels(draft).join(", ");
    const text = have
      ? `Got ${have}. Still need: ${missing}.`
      : NUMBERS_PROMPT;
    return withDraft(
      input,
      draft,
      have ? "spec_missing_v1" : "spec_ask_v1",
      "hardware_specs",
      text,
      [OPEN_LINKS],
    );
  }
  if (step === "ready") return quoteTurn(input, draft);
  const question =
    step === "type"
      ? "Which type should this build be?"
      : step === "region"
        ? "Which region should this build use?"
        : "How long should we bill this build?";
  const chips =
    step === "type" ? TYPE_CHIPS : step === "region" ? REGION_CHIPS : TERM_CHIPS;
  const pending =
    step === "type"
      ? "custom_type"
      : step === "region"
        ? "custom_region"
        : "custom_term";
  const templateId =
    step === "type"
      ? "spec_ask_type_v1"
      : step === "region"
        ? "spec_ask_region_v1"
        : "spec_ask_term_v1";
  const text = includeCompare
    ? `${askedVsBuilt(draft)}\n\n${question}`
    : question;
  return withDraft(input, draft, templateId, pending, text, [
    chipsBlock(chips),
    OPEN_LINKS,
  ]);
}

function quoteTurn(
  input: {
    state: ConversationStateV1;
    evidenceIds: string[];
  },
  draft: CustomQuoteDraft,
): ComposedTurn {
  const family = draft.family;
  const region = draft.regionId ? quoteRegion(draft.regionId) : null;
  const term = draft.billingTermMonths;
  if (!family || !region || !term) {
    return withDraft(
      input,
      draft,
      "spec_ask_type_v1",
      "custom_type",
      "Which type should this build be?",
      [chipsBlock(TYPE_CHIPS), OPEN_LINKS],
    );
  }
  const quote = calculateCustomizeQuote({
    family,
    vcpu: draft.clamped.vcpu,
    ramGb: draft.clamped.ramGb,
    nvmeGb: draft.clamped.nvmeGb,
    bandwidthTb: draft.clamped.bandwidthTb,
    regionId: region.id,
    billingTermMonths: term,
    dedicatedIpv4: true,
    automatedBackups: false,
  });
  const label = familyLabel(family);
  const href = customizeDeepLink({
    family,
    vcpu: draft.clamped.vcpu,
    ramGb: draft.clamped.ramGb,
    nvmeGb: draft.clamped.nvmeGb,
    bandwidthTb: draft.clamped.bandwidthTb,
    regionId: region.id,
    billingTermMonths: term,
  });
  const termLabel = term === 1 ? "1 month" : `${term} months`;
  const customId = `custom-${family}-${draft.clamped.vcpu}-${draft.clamped.ramGb}-${draft.clamped.nvmeGb}-${draft.clamped.bandwidthTb}-${region.id}-${term}`;
  const text = [
    `${label} in ${region.name} for ${termLabel} — ${quote.priceLabel}.`,
    askedVsBuilt(draft),
    "Dedicated IPv4 is included. Automated backups are off — add those on Customize if you want.",
  ].join("\n\n");
  const card: UiBlock = {
    type: "customizeQuote",
    family,
    familyLabel: label,
    regionId: region.id,
    regionName: region.name,
    countryCode: region.countryCode,
    term,
    vcpu: draft.clamped.vcpu,
    ramGb: draft.clamped.ramGb,
    nvmeGb: draft.clamped.nvmeGb,
    bandwidthTb: draft.clamped.bandwidthTb,
    dedicatedIpv4: true,
    automatedBackups: false,
    monthlyMinor: quote.monthlyMinor,
    termTotalMinor: quote.termTotalMinor,
    notice: quote.notice,
    href,
  };
  const turn = withDraft(input, draft, "spec_custom_v1", null, text, [
    card,
    {
      type: "actionLinks",
      links: [
        { label: "Open Customize", href },
        { label: "Pricing", href: "/pricing" },
        { label: "Contact", href: "/contact" },
      ],
    },
  ], ["customize_quote", customId]);
  turn.state.lastDisplayedPlans = [{ id: customId, label: `Custom ${label}` }];
  return turn;
}

export function trySpecPlanAnswer(input: {
  matching: string;
  state: ConversationStateV1;
  evidenceIds: string[];
}): ComposedTurn | null {
  const parsed = parseHardwareSpecs(input.matching);
  const filled = specsFilled(parsed);
  const specQuery = isSpecBuildQuery(input.matching);
  const draft = input.state.customQuote;

  if (specQuery && filled >= 2 && parsed) {
    const next = draftFromMessage(parsed, input.matching);
    return respond(input, next, quoteStep(next) !== "hardware");
  }

  if (inWizard(input.state) && draft) {
    const next = mergeDraft(draft, input.matching);
    const finishedHardware =
      quoteStep(draft) === "hardware" && quoteStep(next) !== "hardware";
    return respond(input, next, finishedHardware);
  }

  if (!specQuery) return null;
  if (!parsed) {
    return {
      text: NUMBERS_PROMPT,
      blocks: [OPEN_LINKS],
      templateId: "spec_ask_v1",
      state: {
        ...input.state,
        activeIntent: "pricing",
        lastAnswerTemplateId: "spec_ask_v1",
        pendingClarification: "hardware_specs",
      },
      evidenceIds: input.evidenceIds,
    };
  }
  const next = draftFromMessage(parsed, input.matching);
  return respond(input, next, quoteStep(next) !== "hardware");
}
