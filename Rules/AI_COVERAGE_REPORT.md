# AI advisor coverage report

Last updated: 2026-11-06. Owned agent only (`AI_PROVIDER=owned|disabled`).

## Integration verification (2026-11-06)

Honesty-complete FE↔BE↔DB check (no WHMCS live billing):

| Check | Result |
|-------|--------|
| Postgres install + `npm run migrate` (001–003) | Pass — fixed `002_ai` so `ai_messages.conversation_id` is `text` |
| Backend `GET /health` | Pass |
| Backend `GET /ready` | Pass when `DATABASE_URL` pings (`whmcsConfigured: false`, `aiConfigured: true`) |
| Frontend `GET /api/v1/ready` | Pass — 200 only after live Backend `/ready`; else 503 `NOT_CONFIGURED` |
| Frontend `GET /api/v1/ai/config` | Pass — owned provider ready |
| Frontend `GET /api/v1/vps/catalog` | Pass — `source: demo`, checkout not configured |
| Backend `GET /v1/plans` (empty cache, no WHMCS) | 503 `NOT_CONFIGURED` (honest) |
| AI conversation store | `store: postgres` when DB healthy |
| Catalog gateway | Pages + BFF use `getCatalogForPage()`; demo UI until WHMCS→payload mapping |
| Backend `POST /v1/catalog/sync` | WHMCS off → 503; if WHMCS on without mapping → `accepted_not_persisted` (no invented rows) |

## Knowledge pack

Runtime assets live under `Backend/src/features/ai/pack/`:

| Asset | Use |
|-------|-----|
| `runracks_verified_qa_training.jsonl` | 228 authored Q&A → lexical knowledge |
| `runracks_canonical_facts.json` | Demo pricing, pending legal, backup conflict, competitor guardrails |
| `runracks_agent_regression_tests.csv` | P0 negatives + answer-with-guardrail utterances |
| `trainingQuestions.csv` | 1,128 sheet questions → honest phrase answers (CSV answer column ignored) |
| `qaAnswersChat.jsonl` | 2,744 chat Q&A user questions only; assistant text discarded; answers via honesty layer |
| `CURSOR_IMPLEMENTATION_STRICT.md` | Delivery contract (reference) |

Handbook PDF/DOCX + pack README: `Rules/ai-pack/` (audit only; not loaded at runtime).

## Policy coverage

| Area | Status | Notes |
|------|--------|-------|
| Greetings / typo greetings | Covered | Word-boundary; ELLLLLOW → short greet, not menu dump |
| Discover / recommend | Covered | Clarifies website / app / RDP before plan pitch |
| Follow-ups (“DO FOR ME”) | Covered | Authoritative `ConversationStateV1` |
| Product blurbs (Linux / Windows / Admin RDP) | Covered | Knowledge + compose; no fake prices |
| Training sheet (1,128 Qs) | Covered | Category + risk replies; JazzCash/Easypaisa not confirmed |
| Chat Q&A JSONL (2,744 Qs) | Covered | Questions imported; unsafe assistant claims (SLA, JazzCash, free backups) not shipped |
| Pricing when catalog empty | Covered | Honest unavailable / demo fallback — no invented live prices |
| Demo / not-orderable pricing | Covered | Canonical facts + purchase gate. Published catalog freshness is `demo`, not a verified snapshot. This is the 9+ bar; WHMCS `catalog_*` mapping is the open step to 10 |
| Compare families / sites | Covered | Demo catalog pairs; other sites named only |
| Cart add from chat | Covered | Configure cart block; not a WHMCS order |
| Contact / tickets | Covered | Always `/contact`; never creates tickets |
| Policy (DDoS, backup, SLA, refund) | Partial | Pack Q&A + conflicted backup / pending legal gates |
| Competitor (WaseerHost) contamination | Covered | Fail-closed transfer block |
| Secrets / prompt injection | Covered | P0 policy gate |
| Domains / registrar | Out of scope | |
| Live WHMCS order/invoice | Out of scope | Sync does not persist `catalog_*` until mapping ships |

## Owner-gated blockers (still open)

- `/terms`, `/privacy`, `/refund` pending legal review — answers stay conditional  
- Live billing/checkout — demo amounts remain non-orderable; place-order disabled  
- Account sign-in / Google OAuth — not configured  
- Contact inbox transport — POST stays `NOT_CONFIGURED`  
- WHMCS product→`catalog_*` + Frontend `VpsCatalogPayload` mapping — not implemented (remaining step from demo 9+ to live 10)  
- Backup inclusion conflicted across public pages — customer-safe claim only  
- Numeric marketing claims (reviews, customer counts, DDoS capacity) need owner proof  

## Unverified commercial facts (must not assert as verified)

- Exact plan prices, promotions, or PKR conversions without an authorized rate source  
- DDoS / backup / license / SLA entitlements without reviewed knowledge `sourceRef`  
- Datacenter city / ping rankings  
- Managed-care inclusions unless a published knowledge entry exists  
- Competitor refund/domain/renewal terms as RunRacks offers  
- JazzCash, Easypaisa, crypto, or wallet account numbers as live payment methods  

## Test corpus

- Backend: `npm run test:advisor` + `api.smoke.test.ts` (health/ready/plans/ai/orders fail-closed).  
- Frontend: `npm test` (seams + SSE); `npm run test:smoke` (ready 200|503 honest; catalog demo); Playwright smoke hits `/ai` and ready probe.

## Runtime limits observed

- Without Postgres: `store: memory` — ephemeral history; UI shows temporary-session notice.  
- Without WHMCS→`catalog_*` inserts: `/v1/plans` 503 or empty; Frontend keeps labeled demo.  
- SSE deltas may still be sliced post-compose (not live neural tokens); complete is authoritative.
