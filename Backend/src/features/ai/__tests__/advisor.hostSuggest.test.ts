/**
 * Deploy/host + country → featured plan and existing region routing.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { runTurn } from "../pipeline/runTurn.js";

const ASK =
  "do the best i am gonna deploy or host this my country is pakistan suggest accordingly";

describe("host suggest", () => {
  it("suggests the featured Linux plan and Pakistan routing", async () => {
    const out = await runTurn({ db: null, message: ASK });
    assert.equal(out.templateId, "host_suggest_v1");
    assert.match(out.text, /Pakistan/);
    assert.match(out.text, /Singapore/);
    assert.match(out.text, /Germany/);
    assert.match(out.text, /VPS 3/);
    assert.match(out.text, /\$18\.89\/mo/);
    assert.doesNotMatch(out.text, /Customize demo build/);
    assert.doesNotMatch(out.text, /ping number/i);
    const cards = out.blocks.find((block) => block.type === "planCards");
    assert.ok(cards && cards.type === "planCards");
    assert.equal(cards.plans[0]?.id, "demo-linux-3");
    assert.equal(out.state.pendingClarification, "host_suggest");
  });

  it("keeps the country when the next reply switches to Windows", async () => {
    const first = await runTurn({ db: null, message: ASK });
    const next = await runTurn({
      db: null,
      message: "Windows VPS",
      priorState: first.state,
    });
    assert.equal(next.templateId, "host_suggest_v1");
    assert.match(next.text, /Pakistan/);
    assert.match(next.text, /Windows VPS 5/);
    const cards = next.blocks.find((block) => block.type === "planCards");
    assert.ok(cards && cards.type === "planCards");
    assert.equal(cards.plans[0]?.id, "demo-win-5");
  });

  it("steps down to the entry plan without dropping the country", async () => {
    const first = await runTurn({ db: null, message: ASK });
    const next = await runTurn({
      db: null,
      message: "Smaller plan",
      priorState: first.state,
    });
    assert.equal(next.templateId, "host_suggest_v1");
    assert.match(next.text, /Pakistan/);
    assert.match(next.text, /VPS 1/);
    assert.doesNotMatch(next.text, /production card/);
  });

  it("does not invent a region for a country outside the routing table", async () => {
    const out = await runTurn({
      db: null,
      message:
        "do the best i am gonna deploy or host this my country is dubai suggest accordingly",
    });
    assert.equal(out.templateId, "host_suggest_v1");
    assert.match(out.text, /not in the routing table/i);
    assert.doesNotMatch(out.text, /Singapore/);
    assert.doesNotMatch(out.text, /Germany/);
  });

  it("suggests Linux for Next.js, Node, and PostgreSQL from Pakistan", async () => {
    const out = await runTurn({
      db: null,
      message:
        "my website is in next js backend is in node js database postgresql suggest the hosting i am from pakistan",
    });
    assert.equal(out.templateId, "host_suggest_v1");
    assert.match(out.text, /Next\.js/);
    assert.match(out.text, /why this Linux card was chosen/i);
    assert.match(out.text, /Pakistan/);
    assert.match(out.text, /Singapore/);
    assert.match(out.text, /Germany/);
    assert.match(out.text, /VPS 3/);
    assert.match(out.text, /\$18\.89\/mo/);
    assert.match(out.text, /demo/i);
    assert.doesNotMatch(out.text, /ping number/i);
    assert.doesNotMatch(out.text, /\d+\s*ms/);
    const cards = out.blocks.find((block) => block.type === "planCards");
    assert.ok(cards && cards.type === "planCards");
    assert.equal(cards.plans[0]?.id, "demo-linux-3");
  });

  it("keeps a bare Pakistan plan request on the discover prompt", async () => {
    const out = await runTurn({
      db: null,
      message: "Best hosting plan for Pakistan",
    });
    assert.notEqual(out.templateId, "host_suggest_v1");
    assert.match(out.text, /website/i);
    assert.match(out.text, /application/i);
    assert.match(out.text, /desktop/i);
  });

  it("uses the saved stack and country when the next question is why", async () => {
    const hi = await runTurn({ db: null, message: "hi" });
    const about = await runTurn({
      db: null,
      message: "how about you",
      priorState: hi.state,
    });
    assert.match(about.text, /advisor/i);
    assert.doesNotMatch(about.text, /retention|chatbot/i);
    const hosted = await runTurn({
      db: null,
      message:
        "my website is in next js backend is in node js database postgresql suggest the hosting i am from pakistan",
      priorState: about.state,
    });
    const why = await runTurn({
      db: null,
      message: "why",
      priorState: hosted.state,
    });
    assert.equal(why.templateId, "plan_why_v1");
    assert.match(why.text, /VPS 3/);
    assert.match(why.text, /Next\.js/);
    assert.match(why.text, /Linux/);
    assert.match(why.text, /Singapore|Germany/);
    assert.match(why.text, /demo/i);
    assert.doesNotMatch(why.text, /ping number/i);
    assert.doesNotMatch(why.text, /shared website/i);
  });

  it("does not treat a hardware build as a country suggestion", async () => {
    const out = await runTurn({
      db: null,
      message:
        "create plan cpu is 1 ram is 4 storage is 30 and bandwidth is 40",
    });
    assert.equal(out.templateId, "spec_ask_type_v1");
  });
});
