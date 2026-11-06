/**
 * Phrase bank size and a few exact answers.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  comparisonPhraseCount,
  lookupPhrase,
  phraseBankSize,
  qaAnswerPhraseCount,
  trainingPhraseCount,
} from "../pack/phraseBank.js";
import {
  honestAnswerForQuestion,
  loadQaAnswerQuestions,
} from "../pack/qaAnswersImport.js";
import { loadTrainingQuestions } from "../pack/trainingSheet.js";
import { composePricingAnswer } from "../compose/honestyAnswer.js";
import { normalizeForMatch } from "../pipeline/normalize.js";
import { runTurn } from "../pipeline/runTurn.js";
import { emptyState } from "../types/state.js";

describe("phrase bank", () => {
  it("indexes more than 50000 phrases", () => {
    assert.ok(phraseBankSize() >= 50000, `phrases ${phraseBankSize()}`);
  });

  it("answers a led pack question with the reviewed text", () => {
    const key = normalizeForMatch(
      "please explain what does hosting actually do",
    ).matching;
    const hit = lookupPhrase(key);
    assert.ok(hit);
    assert.match(hit.answer, /storage, computing and network/i);
  });

  it("lists every Linux VPS card when asked for all VPS plans", () => {
    const key = normalizeForMatch("list all the plans of vps").matching;
    const hit = lookupPhrase(key);
    assert.equal(hit?.id, "family-linux");
    assert.match(hit?.answer ?? "", /VPS 1:/);
    assert.match(hit?.answer ?? "", /VPS 6:/);
    assert.doesNotMatch(hit?.answer ?? "", /Choose Windows VPS for hosting/);
  });

  it("lists every Windows and Admin RDP card the same way", () => {
    const windows = lookupPhrase(
      normalizeForMatch("list all the plans of windows vps").matching,
    );
    assert.equal(windows?.id, "family-windows");
    assert.match(windows?.answer ?? "", /Windows VPS 1:/);
    assert.match(windows?.answer ?? "", /Windows VPS 11:/);
    assert.doesNotMatch(windows?.answer ?? "", /• VPS 1:/);
    const rdp = lookupPhrase(
      normalizeForMatch("list all the plans of admin rdp").matching,
    );
    assert.equal(rdp?.id, "family-rdp");
    assert.match(rdp?.answer ?? "", /Admin RDP 1:/);
    assert.match(rdp?.answer ?? "", /Admin RDP 11:/);
    assert.doesNotMatch(rdp?.answer ?? "", /• Windows VPS 1:/);
  });

  it("lists hosting regions and demo billing durations", async () => {
    const regions = await runTurn({
      db: null,
      message: "list of regions for hosting server",
    });
    assert.match(regions.text, /United States/);
    assert.match(regions.text, /Japan/);
    assert.match(regions.text, /Singapore/);
    const bills = await runTurn({
      db: null,
      message: "types of duration and bills accordingly",
    });
    assert.match(bills.text, /1 month/);
    assert.match(bills.text, /3 months/);
    assert.match(bills.text, /6 months/);
    assert.match(bills.text, /12 months/);
    assert.match(bills.text, /\$4\.49/);
    assert.match(bills.text, /\$13\.47/);
    assert.match(bills.text, /\$53\.88/);
    assert.match(bills.text, /demo/i);
  });

  it("trains plan and other-website comparisons", async () => {
    assert.ok(
      comparisonPhraseCount() >= 100000,
      `comparison phrases ${comparisonPhraseCount()}`,
    );
    const pair = await runTurn({
      db: null,
      message: "compare vps 1 and vps 2",
    });
    assert.match(pair.text, /VPS 1/);
    assert.match(pair.text, /VPS 2/);
    assert.match(pair.text, /\$4\.49/);
    assert.match(pair.text, /\$10\.49/);
    assert.match(pair.text, /demo/i);
    const cross = await runTurn({
      db: null,
      message: "vps 1 vs windows vps 1",
    });
    assert.match(cross.text, /Windows VPS 1/);
    assert.match(cross.text, /2 vCPU/);
    assert.match(cross.text, /4 vCPU/);
    const site = await runTurn({
      db: null,
      message: "compare runracks with hostinger",
    });
    assert.match(site.text, /Hostinger/);
    assert.match(site.text, /will not invent/i);
    assert.doesNotMatch(site.text, /Hostinger is \$/);
    const reserved = await runTurn({
      db: null,
      message: "compare linux and windows vps",
    });
    assert.match(reserved.text, /Linux VPS/i);
    assert.match(reserved.text, /Windows VPS/i);
    assert.doesNotMatch(reserved.templateId, /^compare_site/);
    assert.doesNotMatch(reserved.templateId, /^compare_plans/);
  });

  it("answers every uploaded training question without invented live claims", async () => {
    assert.ok(
      trainingPhraseCount() >= 1000,
      `training phrases ${trainingPhraseCount()}`,
    );
    const rows = loadTrainingQuestions();
    assert.equal(rows.length, 1128);
    const bans = [
      /100%\s*uptime guarantee/i,
      /30[- ]day refund guarantee/i,
      /jazzcash account/i,
      /easypaisa account/i,
      /\bwaseerhost\b.*\bas runracks\b/i,
      /order (is |was )?confirmed/i,
    ];
    for (const row of rows) {
      const key = normalizeForMatch(row.question).matching;
      const hit = lookupPhrase(key);
      assert.ok(hit && hit.answer.trim().length > 20, `${row.id} ${row.question}`);
      for (const ban of bans) {
        assert.doesNotMatch(hit!.answer, ban, `${row.id} ${hit!.id}`);
      }
    }
    const gpu = await runTurn({ db: null, message: "Do you offer GPU servers?" });
    assert.match(gpu.text, /not separate products/i);
    const jazz = await runTurn({
      db: null,
      message: "Kya main JazzCash se payment kar sakta hoon?",
    });
    assert.match(jazz.text, /nahi|cannot confirm/i);
    assert.doesNotMatch(jazz.text, /jazzcash account/i);
    const cheap = await runTurn({
      db: null,
      message: "Sab se sasta VPS kitne ka hai?",
    });
    assert.match(cheap.text, /\$4\.49/);
    assert.match(cheap.text, /demo/i);
    const sla = await runTurn({ db: null, message: "Do you have an SLA?" });
    assert.match(sla.text, /pending|will not/i);
    assert.doesNotMatch(sla.text, /100%\s*uptime guarantee/i);
    const ping = await runTurn({
      db: null,
      message: "What is the ping from Pakistan to Singapore?",
    });
    assert.match(ping.text, /will not give a ping/i);
    assert.doesNotMatch(ping.text, /\b\d+\s*ms\b/);
    const pay = await runTurn({
      db: null,
      message: "What payment methods do you accept?",
    });
    assert.match(pay.text, /cannot confirm/i);
    assert.doesNotMatch(pay.text, /cryptocurrencies/i);
    assert.doesNotMatch(pay.text, /accept jazzcash/i);
  });

  it("sanitizes chat Q&A JSONL questions without shipping unsafe assistant text", async () => {
    assert.ok(
      qaAnswerPhraseCount() >= 2000,
      `qa answer phrases ${qaAnswerPhraseCount()}`,
    );
    const questions = loadQaAnswerQuestions();
    assert.equal(questions.length, 2744);
    const bans = [
      /99\.9%\s*uptime/i,
      /100%\s*uptime guarantee/i,
      /30[- ]day refund guarantee/i,
      /jazzcash account/i,
      /easypaisa account/i,
      /\bwaseerhost\b.*\bas runracks\b/i,
      /order (is |was )?confirmed/i,
      /free weekly backups/i,
    ];
    for (const question of questions) {
      const key = normalizeForMatch(question).matching;
      const hit = lookupPhrase(key);
      const answer = (hit?.answer ?? honestAnswerForQuestion(question)).trim();
      assert.ok(answer.length > 20, question);
      for (const ban of bans) {
        assert.doesNotMatch(answer, ban, question);
      }
    }
    const reliable = await runTurn({
      db: null,
      message: "Is RunRacks a reliable hosting provider?",
    });
    assert.match(reliable.text, /pending|will not|cannot|demo/i);
    assert.doesNotMatch(reliable.text, /99\.9%\s*uptime/i);
    const jazz = await runTurn({
      db: null,
      message: "Can I pay with JazzCash?",
    });
    assert.match(jazz.text, /cannot confirm/i);
    assert.doesNotMatch(jazz.text, /jazzcash account/i);
    const cheap = await runTurn({
      db: null,
      message: "What is your cheapest plan?",
    });
    assert.match(cheap.text, /\$4\.49/);
    assert.match(cheap.text, /demo/i);
    assert.doesNotMatch(cheap.text, /Verified catalog snapshot/i);
  });

  it("labels a published catalog price list as demo", () => {
    const demo = composePricingAnswer({
      matching: "linux vps prices",
      state: emptyState("en"),
      plans: [
        {
          id: "p1",
          name: "VPS 1",
          family: "linux",
          priceLabel: "$4.49/mo",
          amountMinor: 449,
        },
      ],
      freshness: "demo",
      kb: undefined,
      evidenceIds: [],
    });
    assert.match(demo.text, /Demo catalog \(not live checkout\)/);
    assert.match(demo.text, /not orderable/i);
    assert.match(demo.text, /\$4\.49/);
    assert.doesNotMatch(demo.text, /Verified catalog snapshot/i);

    const fresh = composePricingAnswer({
      matching: "linux vps prices",
      state: emptyState("en"),
      plans: [
        {
          id: "p1",
          name: "VPS 1",
          family: "linux",
          priceLabel: "$4.49/mo",
          amountMinor: 449,
        },
      ],
      freshness: "fresh",
      kb: undefined,
      evidenceIds: [],
    });
    assert.match(fresh.text, /Verified catalog snapshot/);
  });

  it("answers plan and service phrasings in a turn", async () => {
    const specs = await runTurn({
      db: null,
      message: "tell me about VPS 1 specs",
    });
    assert.match(specs.text, /4 vCPU/);
    assert.match(specs.text, /\$4\.49/);
    const services = await runTurn({
      db: null,
      message: "what type of services do you provide",
    });
    assert.match(services.text, /Linux VPS/i);
    assert.match(services.text, /Admin RDP/i);
  });
});
