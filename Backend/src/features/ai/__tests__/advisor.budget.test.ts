/**
 * Budget parse + in-range plan listing.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extractAndMergeEntities } from "../pipeline/entities.js";
import { normalizeForMatch } from "../pipeline/normalize.js";
import {
  filterAndRankPlans,
  isBudgetBrowseQuery,
  type PlanCandidate,
} from "../rules/recommend.js";
import { emptyState } from "../types/state.js";

const CATALOG: PlanCandidate[] = [
  {
    id: "linux-1",
    name: "VPS 1",
    family: "linux",
    amountMinor: 449,
    priceLabel: "$4.49/mo",
  },
  {
    id: "win-1",
    name: "Windows VPS 1",
    family: "windows",
    amountMinor: 899,
    priceLabel: "$8.99/mo",
  },
  {
    id: "rdp-1",
    name: "Admin RDP 1",
    family: "windows-admin-rdp",
    amountMinor: 1099,
    priceLabel: "$10.99/mo",
  },
  {
    id: "linux-2",
    name: "VPS 2",
    family: "linux",
    amountMinor: 1049,
    priceLabel: "$10.49/mo",
  },
];

describe("budget entity parse", () => {
  it("reads my budget is 10 dollars", () => {
    const norm = normalizeForMatch("my budget is 10 dollars");
    const state = extractAndMergeEntities(norm, emptyState());
    assert.equal(state.budgetAmount, 10);
    assert.equal(state.budgetCurrency, "USD");
  });

  it("reads under $10 and within 10 usd", () => {
    assert.equal(
      extractAndMergeEntities(
        normalizeForMatch("plans under $10"),
        emptyState(),
      ).budgetAmount,
      10,
    );
    assert.equal(
      extractAndMergeEntities(
        normalizeForMatch("within 10 usd monthly"),
        emptyState(),
      ).budgetAmount,
      10,
    );
  });
});

describe("budget browse ranking", () => {
  it("lists every plan at or under $10", () => {
    const state = {
      ...emptyState(),
      budgetAmount: 10,
      budgetCurrency: "USD",
      billingPeriod: "monthly" as const,
    };
    const rec = filterAndRankPlans(state, CATALOG, "demo");
    assert.equal(rec.primary?.name, "VPS 1");
    assert.deepEqual(
      rec.alternatives.map((p) => p.name),
      ["Windows VPS 1"],
    );
    assert.equal(isBudgetBrowseQuery("my budget is 10 dollars"), true);
  });
});
