/**
 * Plan names / budget mentioned in a chat turn → exact demo catalog cards.
 */
import {
  getDemoVpsCatalog,
  selectPlanPrice,
  type VpsFamily,
  type VpsPlan,
} from "@/features/vps-pricing";

const PLANS: readonly VpsPlan[] = getDemoVpsCatalog().plans;

/** Parse a USD monthly budget from natural budget phrasing. */
export function parseAskedBudgetUsd(text: string): number | null {
  const m = text.toLowerCase();
  const match =
    m.match(
      /(?:not more than|under|below|max(?:imum)?|within|up\s*to|upto)\s*(?:of\s+)?(?:usd|\$)?\s*(\d+(?:\.\d+)?)/,
    ) ??
    m.match(
      /(?:budget(?:\s+is|\s*[:=])?|can\s+afford|afford|around|about)\s*(?:usd|\$)?\s*(\d+(?:\.\d+)?)/,
    ) ??
    m.match(/\b(?:usd|\$)\s*(\d+(?:\.\d+)?)\b/) ??
    m.match(
      /\b(\d+(?:\.\d+)?)\s*(?:usd|dollars?)\b(?:\s*(?:\/\s*mo(?:nth)?|per\s+month|monthly|budget|ka|ki|ke))?/,
    );
  if (!match?.[1]) return null;
  const amount = Number.parseFloat(match[1]);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return amount;
}

function monthlyMinor(plan: VpsPlan): number | null {
  const price = selectPlanPrice(plan, 1, null);
  const minor = price?.monthlyEquivalentMinor ?? price?.amountMinor;
  return typeof minor === "number" && minor >= 0 ? minor : null;
}

/** Every demo plan whose monthly price is ≤ the stated budget. */
export function matchAskedBudgetPlanIds(text: string): string[] {
  const budget = parseAskedBudgetUsd(text);
  if (budget == null) return [];
  const maxMinor = Math.round(budget * 100);
  return [...PLANS]
    .map((plan) => ({ plan, minor: monthlyMinor(plan) }))
    .filter(
      (row): row is { plan: VpsPlan; minor: number } =>
        row.minor != null && row.minor <= maxMinor,
    )
    .sort((a, b) => a.minor - b.minor || a.plan.name.localeCompare(b.plan.name))
    .map((row) => row.plan.id);
}

type SpecNeed = {
  vcpu: number | null;
  ramGb: number | null;
  nvmeGb: number | null;
  bandwidthTb: number | null;
};

function firstNum(text: string, patterns: RegExp[]): number | null {
  for (const re of patterns) {
    const hit = text.match(re);
    if (hit?.[1]) {
      const n = Number.parseInt(hit[1], 10);
      if (Number.isFinite(n) && n > 0) return n;
    }
  }
  return null;
}

export function parseAskedHardwareSpecs(text: string): SpecNeed | null {
  const m = text.toLowerCase().replace(/\s+/g, " ").trim();
  const need: SpecNeed = {
    vcpu: firstNum(m, [
      /(?:^|\b)(?:v\s*)?cpus?(?:\s*cores?)?\s*(?:is|:|=)?\s*(\d+)/,
      /(?:^|\b)cores?\s*(?:is|:|=)?\s*(\d+)/,
      /(\d+)\s*(?:v\s*)?cpus?(?:\s*cores?)?\b/,
      /(\d+)\s*cores?\b/,
    ]),
    ramGb: firstNum(m, [
      /(?:^|\b)(?:ram|memory)\s*(?:is|:|=)?\s*(\d+)/,
      /(\d+)\s*(?:gb|g)\s*(?:of\s+)?(?:ram|memory)\b/,
    ]),
    nvmeGb: firstNum(m, [
      /(?:^|\b)(?:nvme(?:\s*ssd)?|ssd|storage|disk)\s*(?:is|:|=)?\s*(\d+)/,
      /(\d+)\s*(?:gb|g)\s*(?:nvme|ssd|storage|disk)\b/,
      /(\d+)\s*(?:nvme|ssd)\b/,
    ]),
    bandwidthTb: firstNum(m, [
      /(?:^|\b)(?:bandwidth|traffic|transfer)\s*(?:is|:|=)?\s*(\d+)/,
      /(\d+)\s*(?:tb|t)\s*(?:bandwidth|traffic|transfer|data)?\b/,
      /(\d+)\s*(?:bandwidth|traffic)\b/,
    ]),
  };
  if (
    need.vcpu == null &&
    need.ramGb == null &&
    need.nvmeGb == null &&
    need.bandwidthTb == null
  ) {
    return null;
  }
  return need;
}

/** True when the user is sizing a Customize build (not a catalog SKU). */
export function isAskedCustomSpecBuild(text: string): boolean {
  const m = text.toLowerCase();
  const hasSpecWord =
    /\b(cpu|v\s*cpu|cores?|ram|memory|nvme|ssd|storage|disk|bandwidth|traffic)\b/.test(
      m,
    );
  if (!hasSpecWord) return false;
  const wantsBuild =
    /\b(create|build|make|need|want|suggest|recommend|find|show|size|configure|custom)\b/.test(
      m,
    ) || /\bplan for me\b/.test(m);
  const need = parseAskedHardwareSpecs(m);
  const filled = need
    ? [need.vcpu, need.ramGb, need.nvmeGb, need.bandwidthTb].filter(
        (n) => n != null,
      ).length
    : 0;
  return wantsBuild || filled >= 2;
}

export function matchAskedPlanIds(text: string): string[] {
  const lower = text.toLowerCase();
  const ranked = [...PLANS].sort((a, b) => b.name.length - a.name.length);
  const used: Array<[number, number]> = [];
  const hits: Array<{ id: string; at: number }> = [];
  for (const plan of ranked) {
    const name = plan.name.toLowerCase();
    let from = 0;
    while (from < lower.length) {
      const at = lower.indexOf(name, from);
      if (at < 0) break;
      const end = at + name.length;
      const overlaps = used.some(([start, stop]) => at < stop && end > start);
      if (!overlaps) {
        hits.push({ id: plan.id, at });
        used.push([at, end]);
        break;
      }
      from = at + 1;
    }
  }
  hits.sort((a, b) => a.at - b.at);
  return hits.map((hit) => hit.id);
}

export function matchAskedFamily(text: string): VpsFamily | null {
  const m = text.toLowerCase();
  const aboutPlans = /plan|card|detail|spec|list|all|show/.test(m);
  if (!aboutPlans) return null;
  if (/admin rdp/.test(m)) return "windows-admin-rdp";
  if (/windows/.test(m)) return "windows";
  if (/\bvps\b/.test(m) || /\blinux\b/.test(m)) return "linux";
  return null;
}
