/**
 * Binds the uploaded 1,128 questions to honest catalog answers.
 * The CSV answer column is ignored. Its only filled cell names wallets
 * checkout does not accept.
 */
import { readFileSync } from "node:fs";
import { links } from "../compose/blocks.js";
import { normalizeForMatch } from "../pipeline/normalize.js";
import type { ConversationStateV1 } from "../types/state.js";
import type { ComposedTurn } from "../types/turn.js";
import { parseCsv } from "./parseCsv.js";
import { resolvePackFile } from "./packPaths.js";
import { hostCategory } from "./trainingCatHost.js";
import { runCategory } from "./trainingCatRun.js";
import { salesCategory } from "./trainingCatSales.js";
import { trustCategory } from "./trainingCatTrust.js";
import { CATALOG, CONTACT, DEMO, say } from "./trainingFacts.js";
import { sheetSignalReply } from "./trainingSpecific.js";

export type TrainingQuestion = {
  id: string;
  category: string;
  question: string;
};

type Hit = { id: string; answer: string };

let cached: TrainingQuestion[] | null = null;

export function loadTrainingQuestions(): TrainingQuestion[] {
  if (cached) return cached;
  const table = parseCsv(
    readFileSync(resolvePackFile("trainingQuestions.csv"), "utf8"),
  );
  const rows: TrainingQuestion[] = [];
  for (const cells of table.slice(1)) {
    const id = cells[0]?.trim() ?? "";
    const category = cells[1]?.trim() ?? "";
    const question = cells[2]?.trim() ?? "";
    if (!id || !question) continue;
    rows.push({ id, category, question });
  }
  if (rows.length !== 1128) {
    throw new Error(`training questions expected 1128, got ${rows.length}`);
  }
  cached = rows;
  return rows;
}

export function answerForTraining(category: string, matching: string): string {
  const text =
    sheetSignalReply(matching) ??
    salesCategory(category, matching) ??
    hostCategory(category, matching) ??
    runCategory(category, matching) ??
    trustCategory(category, matching) ??
    say(CATALOG, DEMO, CONTACT);
  return text.trim();
}

export function addTrainingPhrases(
  map: Map<string, Hit>,
  register: (
    map: Map<string, Hit>,
    phrase: string,
    hit: Hit,
    overwrite?: boolean,
  ) => boolean,
): number {
  let added = 0;
  const tails = ["", " please", " thanks"];
  for (const row of loadTrainingQuestions()) {
    const matching = normalizeForMatch(row.question).matching;
    const hit = {
      id: `sheet-${row.id}`,
      answer: answerForTraining(row.category, matching),
    };
    for (const tail of tails) {
      if (register(map, `${row.question}${tail}`, hit, false)) added += 1;
    }
  }
  return added;
}

export function tryTrainingAnswer(input: {
  matching: string;
  state: ConversationStateV1;
  evidenceIds: string[];
}): ComposedTurn | null {
  const text = sheetSignalReply(input.matching);
  if (!text) return null;
  const state = { ...input.state, lastAnswerTemplateId: "training_sheet_v1" };
  return {
    text,
    blocks: [links()],
    templateId: "training_sheet_v1",
    state,
    evidenceIds: [...input.evidenceIds, "training-sheet"],
  };
}
