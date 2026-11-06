/**
 * Identity, services, and demo plan-card answers.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { runTurn } from "../pipeline/runTurn.js";

describe("advisor identity and plan cards", () => {
  it("introduces itself", async () => {
    const out = await runTurn({ db: null, message: "tell me about yourself" });
    assert.match(out.text, /hosting advisor/i);
    assert.match(out.text, /Linux VPS/i);
    assert.doesNotMatch(out.text, /general-purpose model that can answer everything/i);
  });

  it("explains RunRacks and services", async () => {
    const brand = await runTurn({ db: null, message: "what is runrack" });
    assert.match(brand.text, /Linux VPS/i);
    assert.match(brand.text, /Admin RDP/i);
    const services = await runTurn({
      db: null,
      message: "what type of services does runracks provide",
    });
    assert.match(services.text, /three hosting services/i);
    assert.match(services.text, /Windows VPS/i);
  });

  it("reads the VPS 1 card", async () => {
    const out = await runTurn({ db: null, message: "VPS 1 specs and card details" });
    assert.match(out.text, /4 vCPU/);
    assert.match(out.text, /6 GB RAM/);
    assert.match(out.text, /100 GB NVMe/);
    assert.match(out.text, /\$4\.49/);
    assert.match(out.text, /full root access/i);
    assert.match(out.text, /demo/i);
    assert.match(out.text, /not a live order|not orderable/i);
  });

  it("adds the plan just chosen when asked to put it in the cart", async () => {
    const chosen = await runTurn({ db: null, message: "choose vps 1" });
    assert.equal(chosen.state.lastDisplayedPlans[0]?.id, "demo-linux-1");
    const cart = await runTurn({
      db: null,
      message: "add it to the cart",
      priorState: chosen.state,
    });
    assert.match(cart.text, /configure cart/i);
    assert.match(cart.text, /VPS 1/);
    assert.match(cart.text, /\$4\.49/);
    assert.match(cart.text, /not an order/i);
    assert.doesNotMatch(cart.text, /demonstration add-ons/i);
    const block = cart.blocks.find((entry) => entry.type === "addToCart");
    assert.equal(block?.type === "addToCart" ? block.planId : "", "demo-linux-1");
    const fromHistory = await runTurn({
      db: null,
      message: "add it to the cart",
      history: [
        { role: "user", body: "choose vps 1" },
        { role: "assistant", body: chosen.text },
      ],
    });
    const remembered = fromHistory.blocks.find(
      (entry) => entry.type === "addToCart",
    );
    assert.equal(
      remembered && remembered.type === "addToCart" ? remembered.planId : "",
      "demo-linux-1",
    );
  });

  it("does not treat an add-on question as a cart add", async () => {
    const out = await runTurn({
      db: null,
      message: "Can I add an IP or automated backups?",
    });
    assert.match(out.text, /demonstration add-ons/i);
    assert.equal(
      out.blocks.some((entry) => entry.type === "addToCart"),
      false,
    );
  });

  it("does not confuse Windows VPS 1 with Linux VPS 1", async () => {
    const out = await runTurn({ db: null, message: "windows vps 1 details" });
    assert.match(out.text, /Windows VPS 1/);
    assert.match(out.text, /2 vCPU/);
    assert.match(out.text, /40 GB NVMe/);
    assert.doesNotMatch(out.text, /4 vCPU, 6 GB RAM/);
  });
});
