# RunRacks AI Advisor — design contract (Phase 0 + 1)

Route: `/ai`  
Stack: Next.js App Router (Frontend only this cycle)  
Fonts: **Nourd** (project standard — not Sora/Manrope)  
Colors: Sage & Ink `--color-*` via `--ai-*` aliases  
Boundary: **Frontend + Rules only.** Do not create Backend/, Database/, or admin apps here.

## Outcome

Chat-centric advisor UI that helps visitors ask about RunRacks hosting products, with typed API seams ready for a future Backend/LLM. Until those exist, every mutating/chat call returns honest **503 `NOT_CONFIGURED`** — never fake answers, prices, domains, or tickets.

## Adapter matrix (current)

| Adapter | Status | UI consequence |
|---------|--------|----------------|
| LLM / AI provider | missing | Chat submit → unavailable / NOT_CONFIGURED |
| Backend API | missing | Seams stay local 503; later proxy via `BACKEND_API_BASE_URL` |
| PostgreSQL | missing | No conversation persistence claims |
| Billing quotes | demo-only catalog | Never show as “live” AI price cards |
| Registrar / domains | missing | No domain chip or lookup |
| Knowledge (blog) | content exists, no RAG index | No invented citations |
| Support handoff | routes exist | Link `/contact` — no fake ticket create |
| Admin AI | missing | Types in Rules/contracts only |

## Locked decisions

- Reuse global header and theme. No site footer on `/ai`. No parallel nav.
- Starter chips from real offerings only: VPS, Windows, pricing, contact, setup.
- `?topic=` allowlist: `vps` \| `windows` \| `pricing` \| `contact` — seed chips, **never auto-send**.
- Model must never originate prices, domain status, invoices, or ticket outcomes (future tools only).
- Env secrets server-only (`AI_PROVIDER`, `AI_API_KEY`) — never `NEXT_PUBLIC_`.
- Files ≤300 lines; feature-based under `Frontend/src/features/ai-advisor/`.

## UI structure (quiet chat, three products)

1. Existing global header  
2. Left sidebar: New chat · Plan Finder · Plans · this session. Below 900px it is a drawer opened by the Menu button  
3. Center column: short hero + three prompts (Linux VPS, Windows VPS, Admin RDP)  
4. Sticky composer: photos, files, voice-to-text, field, and send. One muted disclaimer line. Photos and files stay on the device until an upload API exists. Voice uses the browser speech API and only fills the field.  
5. Plan Finder is one step — those three products — and opens the plans column  
6. Plans column, only when opened: the same pricing-page cards (badge, compare-at, icons, OS marks, region flag, **Choose plan**). Checkout stays unconfigured. Header notice from the catalog  
7. Session chats live in the sidebar (this browser session only)  
8. User bubbles on the right. Unavailable line: “Not connected yet.” with Pricing and Contact  
9. No site footer — the chat fills the viewport  

States: `idle` → `composing` → `submitting` → `streaming` → `completed` | `failed` | `unavailable`. One active send. Sending does not open the plans column.

No domain search or region panel. Demo prices stay labeled demo. Voice and attachments do not call the AI provider.

## Public API handoff (Frontend seams → Backend later)

| Method | Path | Phase 1 behavior |
|--------|------|------------------|
| GET | `/api/v1/ai/config` | Prompts, limits, `status: "not_configured"` |
| POST | `/api/v1/ai/conversations` | 503 NOT_CONFIGURED |
| GET | `/api/v1/ai/conversations/:id` | 503 NOT_CONFIGURED |
| POST | `/api/v1/ai/conversations/:id/messages` | Validate; 503 — no fake stream |
| POST | `.../messages/:messageId/feedback` | 503 NOT_CONFIGURED |
| DELETE | `/api/v1/ai/conversations/:id` | 503 NOT_CONFIGURED |
| GET | `/api/v1/ai/sources/:sourceId` | 503 NOT_CONFIGURED |
| POST | `/api/v1/ai/handoff` | 503 + point to `/contact` |

Message body: `{ clientRequestId, message, locale?, context?: { topic? } }`.  
Stream events (reserved): `message.accepted`, `response.delta`, `response.block`, `response.complete`, `error`.

## Admin contracts (types/docs only — no routes this cycle)

`/api/v1/admin/ai/settings` · `knowledge` · `prompts` · `analytics`

## Backend / DB plug-in checklist (next cycle)

1. Implement same paths/DTOs or Frontend proxy to `BACKEND_API_BASE_URL` + allowlisted paths.  
2. Persist conversations/messages/blocks/sources.  
3. Model gateway + tool allowlist; prices/domains only via adapters.  
4. Real readiness probes for `/api/v1/ready` — never flip ready without them.  
5. Admin RBAC against admin contract paths.
