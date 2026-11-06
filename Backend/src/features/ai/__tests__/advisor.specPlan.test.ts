/**
 * Customize-based spec quotes (CPU / RAM / NVMe / bandwidth).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { runTurn } from "../pipeline/runTurn.js";
import { calculateCustomizeQuote } from "../pack/customizeQuote.js";
import {
  clampToCustomizeRanges,
  parseHardwareSpecs,
} from "../rules/specPlanMatch.js";

const SPEC =
  "create plan cpu is 1 ram is 4 storage is 30 and bandwidth is 40";

describe("hardware spec parse", () => {
  it("reads cpu is N ram is N storage is N bandwidth is N", () => {
    const need = parseHardwareSpecs(
      "cpu is 1 ram is 4 storage is 30 and bandwidth is 40",
    );
    assert.ok(need);
    assert.equal(need.vcpu, 1);
    assert.equal(need.ramGb, 4);
    assert.equal(need.nvmeGb, 30);
    assert.equal(need.bandwidthTb, 40);
  });

  it("does not steal CPU digit as RAM", () => {
    const need = parseHardwareSpecs("cpu is 1 ram is 4");
    assert.ok(need);
    assert.equal(need.vcpu, 1);
    assert.equal(need.ramGb, 4);
  });
});

describe("customize clamp", () => {
  it("clamps bandwidth 40 to Customize max 20", () => {
    const need = parseHardwareSpecs(
      "cpu is 1 ram is 4 storage is 30 and bandwidth is 40",
    )!;
    const clamped = clampToCustomizeRanges(need, "linux");
    assert.equal(clamped.vcpu, 1);
    assert.equal(clamped.ramGb, 4);
    assert.equal(clamped.nvmeGb, 40);
    assert.equal(clamped.bandwidthTb, 20);
    assert.ok(clamped.clamps.some((c) => /Bandwidth 40/.test(c)));
  });
});

describe("spec customize turn", () => {
  it("compares the request and asks for type before pricing", async () => {
    const out = await runTurn({ db: null, message: SPEC });
    assert.equal(out.templateId, "spec_ask_type_v1");
    assert.equal(out.state.pendingClarification, "custom_type");
    assert.equal(out.state.customQuote?.family, null);
    assert.equal(out.state.customQuote?.clamped.nvmeGb, 40);
    assert.equal(out.state.customQuote?.clamped.bandwidthTb, 20);
    assert.match(out.text, /You asked for/);
    assert.match(out.text, /30 GB storage/);
    assert.match(out.text, /40 TB bandwidth/);
    assert.match(out.text, /40 GB NVMe/);
    assert.match(out.text, /20 TB bandwidth/);
    assert.match(out.text, /Which type/);
    assert.doesNotMatch(out.text, /\$/);
    assert.doesNotMatch(out.text, /\bVPS 1\b/);
    assert.equal(
      out.blocks.some((block) => block.type === "customizeQuote"),
      false,
    );
    const chips = out.blocks.find((block) => block.type === "replyChips");
    assert.ok(chips && chips.type === "replyChips");
    assert.deepEqual(
      chips.chips.map((chip) => chip.label),
      ["Linux VPS", "Windows VPS", "Admin RDP"],
    );
  });

  it("asks region, then duration, then returns a pricing card", async () => {
    const first = await runTurn({ db: null, message: SPEC });
    const regionTurn = await runTurn({
      db: null,
      message: "Linux VPS",
      priorState: first.state,
    });
    assert.equal(regionTurn.templateId, "spec_ask_region_v1");
    assert.equal(regionTurn.state.customQuote?.family, "linux");
    assert.doesNotMatch(regionTurn.text, /\$/);

    const termTurn = await runTurn({
      db: null,
      message: "Germany",
      priorState: regionTurn.state,
    });
    assert.equal(termTurn.templateId, "spec_ask_term_v1");
    assert.equal(termTurn.state.customQuote?.regionId, "de");
    assert.doesNotMatch(termTurn.text, /\$/);

    const done = await runTurn({
      db: null,
      message: "12 months",
      priorState: termTurn.state,
    });
    assert.equal(done.templateId, "spec_custom_v1");
    assert.equal(done.state.pendingClarification, null);
    const card = done.blocks.find((block) => block.type === "customizeQuote");
    assert.ok(card && card.type === "customizeQuote");
    const quote = calculateCustomizeQuote({
      family: "linux",
      vcpu: 1,
      ramGb: 4,
      nvmeGb: 40,
      bandwidthTb: 20,
      regionId: "de",
      billingTermMonths: 12,
    });
    assert.equal(card.family, "linux");
    assert.equal(card.regionId, "de");
    assert.equal(card.regionName, "Germany");
    assert.equal(card.term, 12);
    assert.equal(card.vcpu, 1);
    assert.equal(card.ramGb, 4);
    assert.equal(card.nvmeGb, 40);
    assert.equal(card.bandwidthTb, 20);
    assert.equal(card.monthlyMinor, quote.monthlyMinor);
    assert.equal(card.termTotalMinor, quote.termTotalMinor);
    assert.equal(card.dedicatedIpv4, true);
    assert.equal(card.automatedBackups, false);
    assert.match(card.href, /family=linux/);
    assert.match(card.href, /region=de/);
    assert.match(card.href, /term=12/);
    assert.match(done.text, /Germany/);
    assert.match(done.text, /12 months/);
    assert.match(done.text, new RegExp(quote.priceLabel.replace("$", "\\$")));
    assert.doesNotMatch(done.text, /\bVPS 1\b/);
  });

  it("skips questions the first message already answered", async () => {
    const out = await runTurn({
      db: null,
      message:
        "create windows plan cpu is 1 ram is 4 storage is 30 and bandwidth is 40 in germany for 12 months",
    });
    assert.equal(out.templateId, "spec_custom_v1");
    const card = out.blocks.find((block) => block.type === "customizeQuote");
    assert.ok(card && card.type === "customizeQuote");
    assert.equal(card.family, "windows");
    assert.equal(card.regionId, "de");
    assert.equal(card.term, 12);
    const quote = calculateCustomizeQuote({
      family: "windows",
      vcpu: card.vcpu,
      ramGb: card.ramGb,
      nvmeGb: card.nvmeGb,
      bandwidthTb: card.bandwidthTb,
      regionId: "de",
      billingTermMonths: 12,
    });
    assert.equal(card.monthlyMinor, quote.monthlyMinor);
    assert.equal(card.termTotalMinor, quote.termTotalMinor);
  });
});
