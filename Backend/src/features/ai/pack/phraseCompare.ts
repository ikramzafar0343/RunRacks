/**
 * Comparison ask-phrases. Each one points at a catalog answer.
 * Leads and tails do not add competitor prices.
 */
import type { PhraseHit } from "./phraseBank.js";
import {
  DEMO_PLAN_CARDS,
  type DemoPlanCard,
} from "./demoPlanCatalog.js";
import {
  formatExternalComparison,
  formatFamilyComparison,
  formatPlanComparison,
  OTHER_SITES,
} from "../compose/planCompare.js";

const LEADS = [
  "",
  "please ",
  "can you ",
  "could you ",
  "tell me ",
  "i want to ",
  "help me ",
  "show me ",
  "hey ",
  "so ",
];

const TAILS = [
  "",
  " please",
  " thanks",
  " now",
  " for me",
  " on runracks",
  " with details",
  " in simple words",
];

type Register = (
  map: Map<string, PhraseHit>,
  phrase: string,
  hit: PhraseHit,
  overwrite?: boolean,
) => boolean;

function fan(register: Register, map: Map<string, PhraseHit>, phrase: string, hit: PhraseHit) {
  for (const lead of LEADS) {
    for (const tail of TAILS) {
      register(map, `${lead}${phrase}${tail}`, hit, false);
    }
  }
}

function pairPhrases(a: DemoPlanCard, b: DemoPlanCard): string[] {
  return [
    `compare ${a.name} and ${b.name}`,
    `compare ${a.name} with ${b.name}`,
    `${a.name} vs ${b.name}`,
    `${a.name} versus ${b.name}`,
    `difference between ${a.name} and ${b.name}`,
    `which is better ${a.name} or ${b.name}`,
    `should i pick ${a.name} or ${b.name}`,
    `${a.name} compared to ${b.name}`,
  ];
}

export function addComparisonPhrases(
  map: Map<string, PhraseHit>,
  register: Register,
): number {
  let added = 0;
  const count = (
    phrase: string,
    hit: PhraseHit,
  ) => {
    const before = map.size;
    fan(register, map, phrase, hit);
    added += map.size - before;
  };

  for (const left of DEMO_PLAN_CARDS) {
    for (const right of DEMO_PLAN_CARDS) {
      if (left.id === right.id) continue;
      const hit = {
        id: `compare-${left.id}-${right.id}`,
        answer: formatPlanComparison([left, right]),
      };
      for (const phrase of pairPhrases(left, right)) count(phrase, hit);
    }
  }

  for (const site of OTHER_SITES) {
    const hit = {
      id: `compare-site-${site.label.toLowerCase().replace(/\s+/g, "-")}`,
      answer: formatExternalComparison(site.label),
    };
    const name = site.key;
    for (const phrase of [
      `compare runracks with ${name}`,
      `compare runracks to ${name}`,
      `runracks vs ${name}`,
      `runracks versus ${name}`,
      `is runracks better than ${name}`,
      `difference between runracks and ${name}`,
      `how does runracks compare to ${name}`,
      `${name} or runracks`,
    ]) {
      count(phrase, hit);
    }
  }

  for (const family of ["Linux VPS", "Windows VPS", "Admin RDP"] as const) {
    const hit = {
      id: `compare-family-${family.toLowerCase().replace(/\s+/g, "-")}`,
      answer: formatFamilyComparison(family),
    };
    const name = family.toLowerCase();
    for (const phrase of [
      `compare all ${name} plans`,
      `compare ${name} plans side by side`,
      `rank ${name} plans by price`,
      `cheapest ${name}`,
      `which ${name} has the most ram`,
    ]) {
      count(phrase, hit);
    }
  }

  return added;
}
