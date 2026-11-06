# RunRacks AI Advisor — design contract

Route: `/ai`  
Stack: Next.js App Router Frontend + Fastify Backend  
Fonts: **Nourd** (project standard)  
Colors: Sage & Ink `--color-*` via `--ai-*` aliases  
Provider (locked): **owned in-process agent** — `AI_PROVIDER=owned|disabled`. No OpenAI / cloud LLM keys.

## Outcome

Chat-centric advisor for RunRacks hosting. Staged pipeline: normalize → dialogue/intents/entities → lexical knowledge → catalog tools → recommend/diagnose → evidence compose. Tools / Pricing are the only price sources. Handoff → `/contact` only.

## Adapter matrix (current)

| Adapter | Status | UI consequence |
|---------|--------|----------------|
| Owned AI agent | Backend `features/ai` pipeline | Chat streams when Backend up + `AI_PROVIDER=owned` |
| Backend API | Fastify `/v1/ai/*` | Frontend proxies via `BACKEND_API_BASE_URL` |
| PostgreSQL | optional | Durable convos when healthy; memory store bound once |
| Guest session | HMAC cookie | Ownership on GET/DELETE/message/feedback |
| Billing quotes | catalog freshness enums | Never invent amounts |
| Knowledge | reviewed JSON entries + lexical retrieve | No invented citations |
| Support handoff | `/contact` | No fake ticket create |
| Admin AI | missing | Out of scope |

## Locked decisions

- Reuse global header and theme. No site footer on `/ai`.  
- Starter chips from config/starters (Linux VPS, Windows VPS, Admin RDP).  
- `?topic=` allowlist seeds chips — never auto-send.  
- Agent never originates prices, domain status, invoices, or ticket outcomes.  
- Files ≤300 lines; feature folders under `Frontend/src/features/ai-advisor/` and `Backend/src/features/ai/`.  
- Chat column ~900–1040px; bubbles ~65–75ch; temporary-session notice when `store === "memory"`.

## UI structure

1. Global header  
2. Sidebar / drawer: New chat · Plan Finder · Plans · session list  
3. Center: short hero + starters, or transcript with reply chips  
4. Sticky composer: Enter send / Shift+Enter newline / IME-safe; Stop while streaming  
5. Plans dock when opened (same pricing cards)  
6. `aria-live` on streaming bubble only  

States: `idle` → `composing` → `submitting` → `streaming` → `completed` | `failed` | `unavailable`.

## Public API

| Method | Path | Behavior |
|--------|------|----------|
| GET | `/api/v1/ai/config` | Proxy Backend config (owned disclaimer + starters) |
| POST | `/api/v1/ai/conversations` | Create + bind store + owner |
| GET/DELETE | `/api/v1/ai/conversations/:id` | Owner ACL |
| POST | `.../messages` | SSE; idempotent `clientRequestId` |
| POST | `.../feedback` | Owner ACL |
| GET | `/api/v1/ai/sources/:sourceId` | Published knowledge / blurbs |
| POST | `/api/v1/ai/handoff` | Always Contact (not configured for auto-ticket) |

## Related docs

- [`AI_OWNED_AGENT.md`](./AI_OWNED_AGENT.md) — runtime path  
- [`AI_COVERAGE_REPORT.md`](./AI_COVERAGE_REPORT.md) — gaps and corpus  
