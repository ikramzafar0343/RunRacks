/**
 * Combined curated phrase clusters — modularized across Core, Tech, and Ops.
 * Leads and tails are automatically expanded by phraseBank.ts into 100k+ combinations.
 */
import { CURATED_CORE, type CuratedBlock } from "./phraseCuratedCore.js";
import { CURATED_TECH } from "./phraseCuratedTech.js";
import { CURATED_OPS } from "./phraseCuratedOps.js";

export type { CuratedBlock };

export const CURATED: CuratedBlock[] = [
  ...CURATED_CORE,
  ...CURATED_TECH,
  ...CURATED_OPS,
];
