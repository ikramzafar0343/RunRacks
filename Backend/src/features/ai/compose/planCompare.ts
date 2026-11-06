/**
 * Plan-to-plan and other-website comparison from the demo catalog only.
 * Other sites are named as the question, never given an invented price.
 */
import type { ConversationStateV1 } from "../types/state.js";
import type { ComposedTurn } from "../types/turn.js";
import { links } from "./blocks.js";
import {
  DEMO_PLAN_CARDS,
  money,
  type DemoPlanCard,
} from "../pack/demoPlanCatalog.js";

const RESERVED = new Set([
  "compare linux and windows vps",
  "linux vs windows",
  "difference between vps and rdp",
]);

const COMPARE_WORD =
  /\b(compare|comparison|vs|versus|difference|better|cheaper|against|rank)\b/;

export const OTHER_SITES: ReadonlyArray<{ key: string; label: string }> = [
  { key: "hostinger", label: "Hostinger" },
  { key: "digitalocean", label: "DigitalOcean" },
  { key: "digital ocean", label: "DigitalOcean" },
  { key: "vultr", label: "Vultr" },
  { key: "linode", label: "Linode" },
  { key: "akamai", label: "Akamai" },
  { key: "hetzner", label: "Hetzner" },
  { key: "contabo", label: "Contabo" },
  { key: "ovhcloud", label: "OVHcloud" },
  { key: "ovh", label: "OVH" },
  { key: "kamatera", label: "Kamatera" },
  { key: "upcloud", label: "UpCloud" },
  { key: "ionos", label: "IONOS" },
  { key: "a2 hosting", label: "A2 Hosting" },
  { key: "bluehost", label: "Bluehost" },
  { key: "siteground", label: "SiteGround" },
  { key: "interserver", label: "InterServer" },
  { key: "knownhost", label: "KnownHost" },
  { key: "liquid web", label: "Liquid Web" },
  { key: "scalahosting", label: "ScalaHosting" },
  { key: "hostwinds", label: "HostWinds" },
  { key: "dreamhost", label: "DreamHost" },
  { key: "godaddy", label: "GoDaddy" },
  { key: "namecheap", label: "Namecheap" },
  { key: "amazon web services", label: "AWS" },
  { key: "google cloud", label: "Google Cloud" },
  { key: "oracle cloud", label: "Oracle Cloud" },
  { key: "cloudways", label: "Cloudways" },
  { key: "kinsta", label: "Kinsta" },
  { key: "wp engine", label: "WP Engine" },
  { key: "hostgator", label: "HostGator" },
  { key: "racknerd", label: "RackNerd" },
  { key: "waseer host", label: "WaseerHost" },
  { key: "waseerhost", label: "WaseerHost" },
  { key: "azure", label: "Azure" },
  { key: "aws", label: "AWS" },
];

type Hit = { index: number; plan: DemoPlanCard };

function overlaps(used: Array<[number, number]>, at: number, end: number) {
  return used.some(([start, stop]) => at < stop && end > start);
}

function take(
  text: string,
  at: number,
  end: number,
  plan: DemoPlanCard,
  used: Array<[number, number]>,
  found: Hit[],
) {
  if (at < 0 || overlaps(used, at, end)) return;
  const before = at === 0 || !/[a-z0-9]/.test(text[at - 1] ?? "");
  const after = end >= text.length || !/[a-z0-9]/.test(text[end] ?? "");
  if (!before || !after) return;
  used.push([at, end]);
  found.push({ index: at, plan });
}

export function plansMentioned(matching: string): DemoPlanCard[] {
  const text = matching.toLowerCase();
  const used: Array<[number, number]> = [];
  const found: Hit[] = [];
  const ranked = [...DEMO_PLAN_CARDS].sort(
    (a, b) => b.name.length - a.name.length,
  );
  for (const plan of ranked) {
    const name = plan.name.toLowerCase();
    let from = 0;
    while (from < text.length) {
      const at = text.indexOf(name, from);
      if (at < 0) break;
      take(text, at, at + name.length, plan, used, found);
      from = at + name.length;
    }
  }
  const alias: Array<{ re: RegExp; family: DemoPlanCard["family"] }> = [
    { re: /\b(?:admin\s+)?rdp\s*(\d+)\b/g, family: "Admin RDP" },
    { re: /\b(?:windows|win)\s+vps\s*(\d+)\b/g, family: "Windows VPS" },
    { re: /\bvps\s*(\d+)\b/g, family: "Linux VPS" },
  ];
  for (const { re, family } of alias) {
    for (const match of text.matchAll(re)) {
      const num = match[1];
      const plan = DEMO_PLAN_CARDS.find(
        (card) => card.family === family && card.name.endsWith(num ?? ""),
      );
      if (!plan || match.index == null) continue;
      take(text, match.index, match.index + match[0].length, plan, used, found);
    }
  }
  found.sort((a, b) => a.index - b.index);
  const seen = new Set<string>();
  const plans: DemoPlanCard[] = [];
  for (const row of found) {
    if (seen.has(row.plan.id)) continue;
    seen.add(row.plan.id);
    plans.push(row.plan);
  }
  return plans;
}

export function namedOtherSite(matching: string): string | null {
  const text = matching.toLowerCase();
  const ranked = [...OTHER_SITES].sort((a, b) => b.key.length - a.key.length);
  for (const site of ranked) {
    const at = text.indexOf(site.key);
    if (at < 0) continue;
    const end = at + site.key.length;
    const before = at === 0 || !/[a-z0-9]/.test(text[at - 1] ?? "");
    const after = end >= text.length || !/[a-z0-9]/.test(text[end] ?? "");
    if (before && after) return site.label;
  }
  return null;
}

function line(plan: DemoPlanCard): string {
  return `• ${plan.name} (${plan.family}): ${plan.vcpu} vCPU, ${plan.ramGb} GB RAM, ${plan.nvmeGb} GB NVMe, demo ${money(plan.monthlyUsd)}/mo (compare-at ${money(plan.compareAtUsd)}/mo).`;
}

export function formatPlanComparison(plans: DemoPlanCard[]): string {
  const shown = plans.slice(0, 3);
  const cheapest = [...shown].sort((a, b) => a.monthlyUsd - b.monthlyUsd)[0]!;
  const mostRam = [...shown].sort(
    (a, b) => b.ramGb - a.ramGb || b.vcpu - a.vcpu,
  )[0]!;
  return [
    "Demo catalog comparison. These amounts are not a live quote.",
    ...shown.map(line),
    `Lowest demo monthly price here: ${cheapest.name} at ${money(cheapest.monthlyUsd)}/mo.`,
    `Most RAM here: ${mostRam.name} (${mostRam.ramGb} GB).`,
    "More RAM is not automatically the right plan. Linux VPS is for Linux workloads with root access, Windows VPS is for Windows apps, and Admin RDP is for a remote Windows desktop.",
    "Checkout is not connected, so this is not an order. Name one plan if you want it in the configure cart.",
  ].join("\n");
}

export function formatExternalComparison(site: string): string {
  return `I compare RunRacks plans with each other from the published demo catalog. I will not invent ${site}'s current price, SLA, refund, or renewal terms. ${site} policies stay with ${site}; they are not copied onto RunRacks. Ask me to compare two RunRacks plans, for example “compare VPS 1 and VPS 3”, or paste ${site}'s public vCPU, RAM, and storage and I will line those numbers up against a RunRacks card.`;
}

export function formatFamilyComparison(family: DemoPlanCard["family"]): string {
  const rows = DEMO_PLAN_CARDS.filter((plan) => plan.family === family);
  const low = rows[0]!;
  const high = rows[rows.length - 1]!;
  const bits = rows.map(
    (plan) =>
      `• ${plan.name}: ${plan.vcpu} vCPU, ${plan.ramGb} GB RAM, ${plan.nvmeGb} GB NVMe, demo ${money(plan.monthlyUsd)}/mo`,
  );
  return [
    `${family} plans side by side (demo catalog, not a live quote):`,
    ...bits,
    `${low.name} is the lowest demo monthly price in this family (${money(low.monthlyUsd)}/mo). ${high.name} is the largest spec (${high.vcpu} vCPU, ${high.ramGb} GB RAM, ${high.nvmeGb} GB NVMe, demo ${money(high.monthlyUsd)}/mo).`,
    "Every card can be filtered to the same eight regions. Checkout is not connected.",
  ].join("\n");
}

function familyRollup(matching: string): DemoPlanCard["family"] | null {
  if (!COMPARE_WORD.test(matching) && !/\b(cheapest|most ram)\b/.test(matching)) {
    return null;
  }
  if (/\blinux\b/.test(matching) && /\bwindows\b/.test(matching)) return null;
  if (/\bdifference\b/.test(matching) && /\bvps\b/.test(matching) && /\brdp\b/.test(matching)) {
    return null;
  }
  if (
    /admin rdp/.test(matching) ||
    /\brdp plans\b/.test(matching) ||
    /\bplans of (admin )?rdp\b/.test(matching)
  ) {
    return "Admin RDP";
  }
  if (/windows/.test(matching)) return "Windows VPS";
  if (
    /linux/.test(matching) ||
    /\bvps plans\b/.test(matching) ||
    /\ball vps\b/.test(matching) ||
    /\bplans of vps\b/.test(matching)
  ) {
    return "Linux VPS";
  }
  return null;
}

function answer(input: {
  matching: string;
  state: ConversationStateV1;
  evidenceIds: string[];
  templateId: string;
  text: string;
  plans: DemoPlanCard[];
}): ComposedTurn {
  const state = {
    ...input.state,
    activeIntent: "compare" as const,
    lastAnswerTemplateId: input.templateId,
    lastDisplayedPlans: input.plans.map((plan) => ({
      id: plan.id,
      label: plan.name,
    })),
  };
  return {
    text: input.text,
    blocks: [links()],
    templateId: input.templateId,
    state,
    evidenceIds: [
      ...input.evidenceIds,
      ...input.plans.map((plan) => plan.id),
    ],
  };
}

export function tryPlanCompareAnswer(input: {
  matching: string;
  state: ConversationStateV1;
  evidenceIds: string[];
}): ComposedTurn | null {
  if (RESERVED.has(input.matching)) return null;
  const plans = plansMentioned(input.matching);
  const site = namedOtherSite(input.matching);
  const comparing =
    COMPARE_WORD.test(input.matching) ||
    /\b(or|and)\b/.test(input.matching);
  if (plans.length >= 2 && comparing) {
    const shown = plans.slice(0, 3);
    const extra = site
      ? `\n${formatExternalComparison(site)}`
      : "";
    return answer({
      ...input,
      templateId: "compare_plans_v1",
      text: `${formatPlanComparison(shown)}${extra}`,
      plans: shown,
    });
  }
  if (site && COMPARE_WORD.test(input.matching)) {
    return answer({
      ...input,
      templateId: "compare_site_v1",
      text: formatExternalComparison(site),
      plans: plans.slice(0, 1),
    });
  }
  const family = plans.length > 0 ? null : familyRollup(input.matching);
  if (!family) return null;
  const rows = DEMO_PLAN_CARDS.filter((plan) => plan.family === family);
  return answer({
    ...input,
    templateId: "compare_family_v1",
    text: formatFamilyComparison(family),
    plans: [rows[0]!, rows[rows.length - 1]!],
  });
}
