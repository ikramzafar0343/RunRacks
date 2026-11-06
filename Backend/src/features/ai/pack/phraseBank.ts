/**
 * Ask-phrases bound to a reviewed answer (exact match after normalize).
 * Leads and tails paraphrase the same fact — they do not add new claims.
 */
import { readFileSync } from "node:fs";
import { normalizeForMatch } from "../pipeline/normalize.js";
import { CURATED } from "./phraseCurated.js";
import { resolvePackFile } from "./packPaths.js";
import {
  DEMO_PLAN_CARDS,
  formatPlanCard,
  listFamily,
} from "./demoPlanCatalog.js";
import { addComparisonPhrases } from "./phraseCompare.js";
import { addQaAnswerPhrases } from "./qaAnswersImport.js";
import { addTrainingPhrases } from "./trainingSheet.js";

export type PhraseHit = { id: string; answer: string };

const LEADS = [
  "",
  "please ",
  "please explain ",
  "can you ",
  "could you ",
  "could you please ",
  "can you please ",
  "tell me ",
  "kindly ",
  "i want to know ",
  "i need to know ",
  "help me understand ",
  "help me with ",
  "quick question ",
  "one question ",
  "real quick ",
  "just tell me ",
  "answer this ",
  "explain this ",
  "hey ",
  "hi ",
  "ok ",
  "so ",
  "well ",
  "btw ",
];

const TAILS = [
  "",
  " please",
  " thanks",
  " thank you",
  " now",
  " right now",
  " for me",
  " if you can",
  " in simple words",
  " in short",
  " quickly",
  " today",
  " exactly",
  " clearly",
  " with details",
  " step by step",
  " for runracks",
  " on runracks",
];

type Row = {
  id: string;
  question: string;
  answer: string;
  risk?: string;
  operational_guardrail?: string;
};

let index: Map<string, PhraseHit> | null = null;
let phraseCount = 0;
let comparisonPhrases = 0;
let trainingPhrases = 0;
let qaAnswerPhrases = 0;

function keyOf(text: string): string {
  return normalizeForMatch(text).matching;
}

export function registerPhrase(
  map: Map<string, PhraseHit>,
  phrase: string,
  hit: PhraseHit,
  overwrite = true,
): boolean {
  const key = keyOf(phrase);
  if (key.length < 8 || RESERVED.has(key)) return false;
  if (map.has(key)) {
    if (overwrite) map.set(key, hit);
    return false;
  }
  phraseCount += 1;
  map.set(key, hit);
  return true;
}

function remember(map: Map<string, PhraseHit>, phrase: string, hit: PhraseHit) {
  registerPhrase(map, phrase, hit, true);
}

function expand(
  map: Map<string, PhraseHit>,
  phrase: string,
  hit: PhraseHit,
) {
  for (const lead of LEADS) {
    for (const tail of TAILS) remember(map, `${lead}${phrase}${tail}`, hit);
  }
}

function packRows(): Row[] {
  const raw = readFileSync(
    resolvePackFile("runracks_verified_qa_training.jsonl"),
    "utf8",
  );
  const rows: Row[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const row = JSON.parse(trimmed) as Row;
    if (!row.id || !row.question || !row.answer) continue;
    rows.push(row);
  }
  return rows;
}

const RESERVED = new Set([
  "what can you do",
  "who are you",
  "linux vps",
  "windows vps",
  "admin rdp",
  "how much does vps cost",
  "what is the cost",
  "refund policy",
  "what is your sla",
  "are backups included",
  "do you have ddos protection",
  "open a ticket",
  "i need support",
  "contact sales",
  "fix my server please",
  "compare linux and windows vps",
  "linux vs windows",
  "difference between vps and rdp",
  "ssh not working",
  "help me choose a linux vps",
  "help me choose a windows vps",
  "help me choose an admin rdp plan",
]);

function answerText(row: Row): string {
  if (row.risk === "high" && row.operational_guardrail) {
    return `${row.answer.trim()} ${row.operational_guardrail.trim()}`;
  }
  return row.answer.trim();
}

function addPlans(map: Map<string, PhraseHit>) {
  const asks = [
    "specs",
    "details",
    "plan card",
    "price",
    "cost",
    "ram",
    "cpu",
    "storage",
    "what is included",
    "tell me about",
    "full specs of",
    "configuration of",
  ];
  for (const plan of DEMO_PLAN_CARDS) {
    const hit = { id: plan.id, answer: formatPlanCard(plan) };
    for (const ask of asks) {
      expand(map, `${plan.name} ${ask}`, hit);
      expand(map, `${ask} ${plan.name}`, hit);
    }
    expand(map, plan.name, hit);
  }
  const linux = {
    id: "family-linux",
    answer: listFamily("Linux VPS"),
  };
  expand(map, "linux vps plans", linux);
  expand(map, "list all the plans of vps", linux);
  expand(map, "list all vps plans", linux);
  expand(map, "list all plans of vps", linux);
  expand(map, "show all vps plans", linux);
  expand(map, "all the vps plan cards", linux);
  const windows = {
    id: "family-windows",
    answer: listFamily("Windows VPS"),
  };
  expand(map, "windows vps plans", windows);
  expand(map, "list all the plans of windows", windows);
  expand(map, "list all the plans of windows vps", windows);
  expand(map, "list all windows vps plans", windows);
  expand(map, "list all windows plans", windows);
  expand(map, "show all windows vps plans", windows);
  expand(map, "all the windows vps plan cards", windows);
  const rdp = {
    id: "family-rdp",
    answer: listFamily("Admin RDP"),
  };
  expand(map, "admin rdp plans", rdp);
  expand(map, "list all the plans of admin rdp", rdp);
  expand(map, "list all the plans of rdp", rdp);
  expand(map, "list all admin rdp plans", rdp);
  expand(map, "list all rdp plans", rdp);
  expand(map, "show all admin rdp plans", rdp);
  expand(map, "all the admin rdp plan cards", rdp);
}

export function isReservedPhraseKey(key: string): boolean {
  return RESERVED.has(key);
}

function buildIndex(): Map<string, PhraseHit> {
  phraseCount = 0;
  const map = new Map<string, PhraseHit>();
  for (const block of CURATED) {
    const hit = { id: block.id, answer: block.answer };
    for (const phrase of block.phrases) expand(map, phrase, hit);
  }
  for (const row of packRows()) {
    expand(map, row.question, { id: row.id, answer: answerText(row) });
  }
  addPlans(map);
  comparisonPhrases = addComparisonPhrases(map, registerPhrase);
  trainingPhrases = addTrainingPhrases(map, registerPhrase);
  qaAnswerPhrases = addQaAnswerPhrases(map, registerPhrase);
  return map;
}

export function phraseIndex(): Map<string, PhraseHit> {
  if (!index) index = buildIndex();
  return index;
}

export function phraseBankSize(): number {
  phraseIndex();
  return phraseCount;
}

export function comparisonPhraseCount(): number {
  phraseIndex();
  return comparisonPhrases;
}

export function trainingPhraseCount(): number {
  phraseIndex();
  return trainingPhrases;
}

export function qaAnswerPhraseCount(): number {
  phraseIndex();
  return qaAnswerPhrases;
}

export function lookupPhrase(matching: string): PhraseHit | null {
  const map = phraseIndex();
  const direct = map.get(matching);
  if (direct) return direct;
  const leads = [...LEADS].filter(Boolean).sort((a, b) => b.length - a.length);
  for (const lead of leads) {
    if (!matching.startsWith(lead)) continue;
    const rest = matching.slice(lead.length).trim();
    const hit = map.get(rest);
    if (hit) return hit;
  }
  return null;
}
