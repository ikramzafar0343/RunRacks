/**
 * Pull a Customize pricing card out of an advisor block list.
 */
import type { AdvisorCustomizeQuote } from "@/features/ai-advisor/hooks/chatTypes";
import type { BillingTermMonths, VpsFamily } from "@/features/vps-pricing";

const FAMILIES = new Set<VpsFamily>(["linux", "windows", "windows-admin-rdp"]);
const TERMS = new Set<BillingTermMonths>([1, 3, 6, 12]);

function finite(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function readCustomizeQuote(block: unknown): AdvisorCustomizeQuote | null {
  if (!block || typeof block !== "object") return null;
  const row = block as Record<string, unknown>;
  if (row.type !== "customizeQuote") return null;
  if (typeof row.family !== "string" || !FAMILIES.has(row.family as VpsFamily)) {
    return null;
  }
  if (typeof row.term !== "number" || !TERMS.has(row.term as BillingTermMonths)) {
    return null;
  }
  if (
    typeof row.familyLabel !== "string" ||
    typeof row.regionId !== "string" ||
    typeof row.regionName !== "string" ||
    typeof row.countryCode !== "string" ||
    typeof row.notice !== "string" ||
    typeof row.href !== "string" ||
    typeof row.dedicatedIpv4 !== "boolean" ||
    typeof row.automatedBackups !== "boolean" ||
    !finite(row.vcpu) ||
    !finite(row.ramGb) ||
    !finite(row.nvmeGb) ||
    !finite(row.bandwidthTb) ||
    !finite(row.monthlyMinor) ||
    !finite(row.termTotalMinor)
  ) {
    return null;
  }
  return {
    family: row.family as VpsFamily,
    familyLabel: row.familyLabel,
    regionId: row.regionId,
    regionName: row.regionName,
    countryCode: row.countryCode,
    term: row.term as BillingTermMonths,
    vcpu: row.vcpu,
    ramGb: row.ramGb,
    nvmeGb: row.nvmeGb,
    bandwidthTb: row.bandwidthTb,
    dedicatedIpv4: row.dedicatedIpv4,
    automatedBackups: row.automatedBackups,
    monthlyMinor: row.monthlyMinor,
    termTotalMinor: row.termTotalMinor,
    notice: row.notice,
    href: row.href,
  };
}

export function quoteFromBlocks(
  blocks: unknown,
): AdvisorCustomizeQuote | undefined {
  if (!Array.isArray(blocks)) return undefined;
  for (const block of blocks) {
    const quote = readCustomizeQuote(block);
    if (quote) return quote;
  }
  return undefined;
}

type ReplyChip = { id: string; label: string };

export function readSuggestedPlanIds(block: unknown): string[] | null {
  if (!block || typeof block !== "object") return null;
  const row = block as { type?: unknown; plans?: unknown };
  if (row.type !== "planCards" || !Array.isArray(row.plans)) return null;
  if (row.plans.length < 1 || row.plans.length > 2) return null;
  const ids: string[] = [];
  for (const plan of row.plans) {
    if (!plan || typeof plan !== "object") return null;
    const id = (plan as { id?: unknown }).id;
    if (typeof id !== "string" || !id.startsWith("demo-")) return null;
    ids.push(id);
  }
  return ids;
}

export function planIdsFromBlocks(blocks: unknown): string[] | undefined {
  if (!Array.isArray(blocks)) return undefined;
  for (const block of blocks) {
    const ids = readSuggestedPlanIds(block);
    if (ids) return ids;
  }
  return undefined;
}

function chipsFromBlock(block: unknown): ReplyChip[] | null {
  if (!block || typeof block !== "object") return null;
  const row = block as { type?: unknown; chips?: unknown };
  if (row.type !== "replyChips" || !Array.isArray(row.chips)) return null;
  const chips = row.chips.flatMap((chip) => {
    if (!chip || typeof chip !== "object") return [];
    const item = chip as { id?: unknown; label?: unknown };
    if (typeof item.id !== "string" || typeof item.label !== "string") return [];
    if (!item.label.trim()) return [];
    return [{ id: item.id, label: item.label }];
  });
  return chips.length > 0 ? chips.slice(0, 8) : null;
}

export function absorbAdvisorBlock(
  block: unknown,
  bag: {
    chips: ReplyChip[] | undefined;
    quote: AdvisorCustomizeQuote | null;
    planIds: string[] | null;
  },
): void {
  const chips = chipsFromBlock(block);
  if (chips) bag.chips = chips;
  const quote = readCustomizeQuote(block);
  if (quote) bag.quote = quote;
  const planIds = readSuggestedPlanIds(block);
  if (planIds) bag.planIds = planIds;
}
