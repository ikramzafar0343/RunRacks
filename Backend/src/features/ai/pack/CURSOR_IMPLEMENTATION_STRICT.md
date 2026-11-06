# RUNRACKS - STRICT CURSOR IMPLEMENTATION CONTRACT

## Mission
Implement a production-grade **RunRacks-owned deterministic hosting advisor** using the accompanying knowledge pack. **No OpenAI, no cloud LLM APIs, no Ollama.** This is a bounded, evidence-grounded FAQ/plan advisor, not an unrestricted generative model. Do not claim it can answer everything.

## Immutable requirements
- Preserve existing RunRacks frontend layout, typography, light/dark theme, animation composition and routes.
- Serverless-compatible Next.js API; TypeScript strict mode; prefer 300 lines maximum per file; feature-based modules and typed contracts; sanitize/rate-limit all external input.
- Use the canonical facts JSON as a public-snapshot status source; make owner-reviewed active product catalog/API authoritative when available.
- Do **not** invent checkout success, invoices, provisioning, support tickets, refunds, discounts, account data, data-center capacity, SLAs, backup retention or legal commitments.
- Prevent WaseerHost policy/product content from appearing as RunRacks offers. Comparator content is benchmark-only.
- Pricing is DEMO and not orderable until real billing is live; /ai says live answers aren't connected; /contact says inbox isn't connected; /terms, /privacy, /refund are placeholders.

## Files to import
- `runracks_verified_qa_training.jsonl`: 228 authored natural-language Q&A records with risk/status/links.
- `runracks_canonical_facts.json`: source-of-truth and conflict states as of 2026-11-05.
- `runracks_agent_regression_tests.csv`: 684 QA prompts plus P0 negative tests.
- `RunRacks_AI_Advisor_100_Page_Handbook.docx/pdf`: rationale, audit and conversation test scripts.

## Step-by-step delivery
1. Inspect app and API routes; write a route map and identify existing AI/chat components without rewriting UI.
2. Create `src/features/advisor/` with `schema.ts`, `facts.ts`, `knowledge.ts`, `normalize.ts`, `intents.ts`, `entities.ts`, `retriever.ts`, `policyGate.ts`, `answerRenderer.ts`, `session.ts`, `analytics.ts`, `tests/`.
3. Normalize English/Roman Urdu queries, common typos, punctuation, synonyms, and follow-up context. Distinguish `Linux VPS`, `Windows VPS`, `Admin RDP` and `WaseerHost` entity mentions. Stop cross-brand answer contamination.
4. Use deterministic ranking: tokenization + weighted BM25/keyword synonyms + entity agreement + confidence threshold. Require exact trusted fact for high-risk commercial, legal and account claims; ask one relevant clarification on ambiguous intent. Prefer a truthful fallback over brittle exact keyword traps.
5. Implement response envelope: `{reply, intent, confidence, sourceIds, claimStatus, actionStatus, nextSteps, requiresHuman, canOrder, dataVersion}`. Every current fact must have effective-date and verifiability fields.
6. Add read-only adapters for live catalog, inventory and policies. Authenticate/bind billing/support APIs only when they are installed. Missing adapters return structured `not_connected` and must never render success.
7. Build stateful plan-finder: workload -> OS -> interactive desktop? -> users/concurrency -> RAM/CPU/disk -> region -> management/licensing -> budget -> provisional recommendation. Flag DEMO vs binding quotes.
8. Build abuse/PII rules: do not collect passwords, OTP, private keys, card data; mask accidental secrets; refuse unauthorized account requests; confirm reboots/reinstalls/deletions if real actions are ever enabled.
9. Pass every regression test; add typo variants, multilingual tests, prompt injection, and policy conflict cases; log no customer secrets.
10. Implement knowledge approval workflow (draft -> technical/legal approval -> publish -> rollback), source URL recrawl checks and alerts on expired high-risk facts.

## Live-site blockers
- /ai text says model answers not connected: the actual endpoint must be connected and tested, with verifiable status.
- /contact intake is unconnected: do not display “Sent” or generate fake ticket IDs.
- /pricing, /customize use demos: order actions disabled unless billing is connected and authorized.
- /terms /privacy /refund await legal review: high-risk answers must remain conditional.
- Linux “daily backups” vs optional backup add-on and WaseerHost renewal/domain contradictions must have explicit conflict tests.

## Definition of Done
- In staging, canonical FAQ prompts and paraphrases return accurate, concise, language-appropriate answers.
- 100% of critical negative tests reject fabricated commerce, legal and privileged action statements.
- Customer can navigate to valid product pages; every hyperlink is checked in the deployment.
- No paid third-party inference/model dependency; no arbitrary shell actions from user chat.
- A final report lists test results, missing owner approvals, verified APIs, accuracy failures and production go/no-go.
