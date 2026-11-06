/**
 * Replies that used to miss the question: social, trust, support, identity.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { runTurn } from "../pipeline/runTurn.js";

describe("advisor replies that must answer the question", () => {
  it("answers how about you as the advisor", async () => {
    const out = await runTurn({ db: null, message: "how about you" });
    assert.match(out.text, /advisor/i);
    assert.match(out.text, /host/i);
    assert.doesNotMatch(out.text, /retention|chatbot|privacy/i);
  });

  it("answers what are you doing without a brochure claim", async () => {
    const out = await runTurn({ db: null, message: "what are you doing" });
    assert.match(out.text, /assisting visitors/i);
    assert.match(out.text, /host/i);
    assert.doesNotMatch(out.text, /RAID-10|Tier-3|Tier-4|Anti-DDoS|15-minute/i);
  });

  it("answers what is run racks from the public catalog", async () => {
    const out = await runTurn({ db: null, message: "what is run racks" });
    assert.match(out.text, /Linux VPS/);
    assert.match(out.text, /Windows VPS/);
    assert.match(out.text, /Admin RDP/);
    assert.match(out.text, /demo/i);
    assert.doesNotMatch(out.text, /RAID-10|Tier-3|Tier-4|Anti-DDoS|15-minute|low-latency/i);
  });

  it("does not answer why i trust you with the shared-hosting paragraph", async () => {
    const out = await runTurn({ db: null, message: "why i trust you" });
    assert.match(out.text, /automated/i);
    assert.match(out.text, /demo/i);
    assert.match(out.text, /Contact/);
    assert.doesNotMatch(out.text, /shared/i);
    assert.doesNotMatch(out.text, /who should choose/i);
  });

  it("does not answer why i choose you with a Linux sales line", async () => {
    const out = await runTurn({ db: null, message: "why i choose you" });
    assert.match(out.text, /automated/i);
    assert.match(out.text, /Contact/);
    assert.doesNotMatch(out.text, /who should choose a linux vps/i);
    assert.doesNotMatch(out.text, /shared hosting/i);
  });

  it("keeps an honest preview when RunRacks is named", async () => {
    for (const message of ["why i choose run racks", "why i trust runracks"]) {
      const out = await runTurn({ db: null, message });
      assert.match(out.text, /Linux VPS/);
      assert.match(out.text, /not yet ready for a binding purchase/i);
      assert.doesNotMatch(out.text, /shared website|who should choose a linux vps/i);
    }
  });

  it("answers what type of support without asking for an error", async () => {
    const out = await runTurn({
      db: null,
      message: "what type of support runracks providing",
    });
    assert.match(out.text, /Contact/);
    assert.match(out.text, /hours|phone/i);
    assert.doesNotMatch(out.text, /what error are you seeing/i);
  });

  it("still asks for the error when the visitor wants a ticket", async () => {
    const out = await runTurn({
      db: null,
      message: "my server is down please open a ticket",
    });
    assert.match(out.text, /what error are you seeing/i);
    assert.match(out.text, /ticket/i);
  });
});
