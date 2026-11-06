import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  CircuitBreaker,
  resetBreakersForTests,
} from "../circuitBreaker.js";

describe("CircuitBreaker", () => {
  beforeEach(() => {
    resetBreakersForTests();
  });

  it("stays closed under the failure threshold", () => {
    const b = new CircuitBreaker({ name: "t1", failureThreshold: 3 });
    for (let i = 0; i < 2; i++) {
      const g = b.enter();
      assert.equal(g.kind, "run");
      if (g.kind === "run") g.finish(false);
    }
    assert.equal(b.snapshot().state, "closed");
  });

  it("opens after consecutive failures", () => {
    const b = new CircuitBreaker({ name: "t2", failureThreshold: 3 });
    for (let i = 0; i < 3; i++) {
      const g = b.enter();
      assert.equal(g.kind, "run");
      if (g.kind === "run") g.finish(false);
    }
    assert.equal(b.snapshot().state, "open");
    assert.equal(b.enter().kind, "open");
  });

  it("moves to half_open after cooldown then closes on success", () => {
    let now = 1_000;
    const b = new CircuitBreaker({
      name: "t3",
      failureThreshold: 2,
      openMs: 100,
      now: () => now,
    });
    for (let i = 0; i < 2; i++) {
      const g = b.enter();
      if (g.kind === "run") g.finish(false);
    }
    assert.equal(b.snapshot().state, "open");
    now += 150;
    const probe = b.enter();
    assert.equal(probe.kind, "run");
    assert.equal(b.snapshot().state, "half_open");
    if (probe.kind === "run") probe.finish(true);
    assert.equal(b.snapshot().state, "closed");
  });

  it("reopens when half_open probe fails", () => {
    let now = 1_000;
    const b = new CircuitBreaker({
      name: "t4",
      failureThreshold: 1,
      openMs: 50,
      now: () => now,
    });
    const first = b.enter();
    if (first.kind === "run") first.finish(false);
    now += 60;
    const probe = b.enter();
    if (probe.kind === "run") probe.finish(false);
    assert.equal(b.snapshot().state, "open");
  });

  it("exec returns circuit_open without running fn", async () => {
    const b = new CircuitBreaker({ name: "t5", failureThreshold: 1 });
    const g = b.enter();
    if (g.kind === "run") g.finish(false);
    let ran = false;
    const out = await b.exec(async () => {
      ran = true;
      return 1;
    });
    assert.equal(ran, false);
    assert.equal(out.ok, false);
    if (!out.ok) assert.equal(out.reason, "circuit_open");
  });
});
