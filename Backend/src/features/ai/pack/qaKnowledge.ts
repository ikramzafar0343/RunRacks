/**
 * Map verified Q&A JSONL into lexical KnowledgeEntry rows.
 */
import { readFileSync } from "node:fs";
import type { KnowledgeEntry } from "../knowledge/entries.js";
import { resolvePackFile } from "./packPaths.js";

type PackSource = { id: string; url: string };

type PackQa = {
  id: string;
  intent: string;
  question: string;
  answer: string;
  language?: string;
  risk?: string;
  verified_at?: string;
  sources?: PackSource[];
  operational_guardrail?: string;
};

let cached: KnowledgeEntry[] | null = null;

function aliasSet(question: string): string[] {
  const q = question.toLowerCase().trim();
  const aliases = new Set<string>([q]);
  const stripped = q
    .replace(/^(please explain:|please |can you |could you )/i, "")
    .trim();
  if (stripped && stripped !== q) aliases.add(stripped);
  return [...aliases];
}

function toEntry(row: PackQa): KnowledgeEntry {
  const locale = row.language === "roman_urdu" ? "roman_urdu" : "en";
  const sourceRef =
    row.sources?.[0]?.id ??
    row.sources?.[0]?.url ??
    `pack:${row.id}`;
  let body = row.answer.trim();
  if (row.risk === "high" && row.operational_guardrail) {
    body = `${body} ${row.operational_guardrail.trim()}`;
  }
  return {
    id: row.id,
    category: row.intent || "pack_qa",
    title: row.question.slice(0, 120),
    aliases: aliasSet(row.question),
    locale,
    body,
    sourceRef: `pack:${sourceRef}`,
    status: "published",
    reviewedAt: row.verified_at ?? "2026-11-05",
  };
}

export function loadPackQaEntries(): KnowledgeEntry[] {
  if (cached) return cached;
  const raw = readFileSync(
    resolvePackFile("runracks_verified_qa_training.jsonl"),
    "utf8",
  );
  const entries: KnowledgeEntry[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const row = JSON.parse(trimmed) as PackQa;
    if (!row.id || !row.question || !row.answer) continue;
    entries.push(toEntry(row));
  }
  cached = entries;
  return entries;
}
