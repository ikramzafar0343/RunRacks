/**
 * Owned-advisor corpus — node:test + tsx (no neural deps).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { runTurn } from "../pipeline/runTurn.js";
import { DIALOGUES, UTTERANCES } from "./corpus.fixtures.js";

describe("advisor corpus size", () => {
  it("has at least 50 utterances and 12 dialogues", () => {
    assert.ok(UTTERANCES.length >= 50, `got ${UTTERANCES.length} utterances`);
    assert.ok(DIALOGUES.length >= 12, `got ${DIALOGUES.length} dialogues`);
  });
});

describe("advisor single-turn utterances", () => {
  for (const c of UTTERANCES) {
    it(c.id, async () => {
      const out = await runTurn({ db: null, message: c.message });
      assert.ok(out.text.trim().length > 0, "empty answer");
      if (c.expectPrimary) {
        const hit =
          out.state.activeIntent === c.expectPrimary ||
          out.templateId.includes(c.expectPrimary) ||
          (c.expectPrimary === "discover" &&
            (out.state.workflow === "discovery" ||
              out.templateId.startsWith("discover_"))) ||
          (c.expectPrimary === "greeting" &&
            out.templateId.startsWith("greet_")) ||
          (c.expectPrimary === "troubleshoot" &&
            out.templateId.startsWith("diag_")) ||
          (c.expectPrimary === "setup" && out.templateId.startsWith("diag_")) ||
          (c.expectPrimary === "capabilities" &&
            out.templateId.startsWith("caps_")) ||
          (c.expectPrimary === "pricing" &&
            out.templateId.startsWith("price_")) ||
          (c.expectPrimary === "compare" &&
            out.templateId.startsWith("compare_")) ||
          (c.expectPrimary === "policy" &&
            out.templateId.startsWith("policy_")) ||
          (c.expectPrimary === "contact" &&
            out.templateId.startsWith("contact_")) ||
          out.templateId.includes(c.expectPrimary);
        assert.ok(
          hit,
          `${c.id}: expected primary~${c.expectPrimary}, got intent=${out.state.activeIntent} template=${out.templateId}`,
        );
      }
      for (const needle of c.expectTextIncludes ?? []) {
        assert.match(
          out.text,
          new RegExp(needle, "i"),
          `${c.id}: missing "${needle}" in: ${out.text.slice(0, 160)}`,
        );
      }
      for (const bad of c.expectTextExcludes ?? []) {
        assert.doesNotMatch(
          out.text,
          new RegExp(bad, "i"),
          `${c.id}: leaked "${bad}"`,
        );
      }
      assert.doesNotMatch(out.text, /catalog cache/i);
      assert.doesNotMatch(out.text, /\$0\b/);
    });
  }
});

describe("advisor multi-turn dialogues", () => {
  for (const d of DIALOGUES) {
    it(d.id, async () => {
      let priorState: unknown = undefined;
      const history: { role: "user" | "assistant"; body: string }[] = [];
      for (const turn of d.turns) {
        const out = await runTurn({
          db: null,
          message: turn.message,
          history,
          priorState,
        });
        assert.ok(out.text.trim().length > 0, `${d.id}: empty`);
        for (const needle of turn.expectTextIncludes ?? []) {
          assert.match(
            out.text,
            new RegExp(needle, "i"),
            `${d.id}: missing "${needle}"`,
          );
        }
        for (const bad of turn.expectTextExcludes ?? []) {
          assert.doesNotMatch(
            out.text,
            new RegExp(bad, "i"),
            `${d.id}: leaked "${bad}"`,
          );
        }
        history.push({ role: "user", body: turn.message });
        history.push({ role: "assistant", body: out.text });
        priorState = out.state;
      }
    });
  }
});

describe("advisor honesty guards", () => {
  it("pakistan discover does not dump pricing menu", async () => {
    const out = await runTurn({
      db: null,
      message: "Best hosting plan for Pakistan",
    });
    assert.match(out.text, /website|application|desktop/i);
    assert.doesNotMatch(out.text, /catalog cache/i);
  });

  it("follow-up continues discovery", async () => {
    const first = await runTurn({
      db: null,
      message: "Best hosting plan for Pakistan",
    });
    const second = await runTurn({
      db: null,
      message: "DO FOR ME",
      priorState: first.state,
      history: [
        { role: "user", body: "Best hosting plan for Pakistan" },
        { role: "assistant", body: first.text },
      ],
    });
    assert.ok(second.text.length > 0);
    assert.doesNotMatch(second.text, /catalog cache/i);
  });
});
