# Security baseline (Backend)

| Control | Implementation |
| --- | --- |
| Secrets | Env only (`.env` gitignored); redacting logger |
| Helmet | `@fastify/helmet` |
| CORS | Explicit `CORS_ORIGINS` allowlist + credentials |
| CSRF | Origin check on non-GET (`platform/csrf.ts`) |
| Rate limit | `@fastify/rate-limit` global |
| Session | HMAC cookie `rr_session`; HttpOnly; Secure in production |
| AuthZ | `whmcs_client_id` from session only; services filtered by client |
| WHMCS | Allowlisted URL; https required in production; timeouts; no mock success |
| SQL | Parameterized `pg` queries |
| DB roles | `runracks_migrator` vs `runracks_app` (Compose init) |
| Fail closed | Missing DB/WHMCS → `503 NOT_CONFIGURED` |
