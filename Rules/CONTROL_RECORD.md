# Control record — T001–T111

**Reviewed:** 6 November 2026. **Scope:** this repository after the November catalog was merged into the existing backend and frontend rules. **This is an applicability record, not a production-ready claim.**

A listed topic is not an order to install a product this repository does not use. Kafka, Kubernetes, a payment-provider ledger, row-level security, Helm, and Terraform stay out until that product exists.

Status words:

- **implemented** — this repository contains the control for the product that exists today. The reason names the limit of that evidence.
- **platform-provided** — Node.js, PostgreSQL, HTTP, or the operating system supplies it. This repository does not add a second implementation.
- **not applicable** — the topology or product is absent. Installing it only to tick a box is forbidden.

## Gates run for this record

- Frontend `check:lines` passed (561 files, max 300 physical lines).
- Frontend `check:boundaries` passed after advisor imports used the customize public contract.
- Frontend `tsc` passed after `ShowcaseCard` guarded a null video element.
- Frontend `eslint` passed with zero warnings after the advisor reply regex stopped mutating module state.
- Backend `check:lines`, `lint`, and `typecheck` passed. Backend has no `check:boundaries` script.
- SQL in the reviewed routes and repositories uses `$1` placeholders. Contact, cart, orders, and AI messages require an idempotency or client request id.
- Live catalog, login, and orders stay `NOT_CONFIGURED` when WHMCS is absent. `GET /ready` pings Postgres and returns 503 when that ping fails. On this machine the ping succeeded, so the production frontend `GET /api/v1/ready` returned ready with `databaseConfigured: true`. That is the probe result, not an env-only success. Homepage plans still showed the labeled demo because `Backend /v1/plans` returned 503.
- Production CSP on `http://127.0.0.1:3010/` is `script-src 'self' 'unsafe-inline'` with no `unsafe-eval`. The homepage theme toggle changed to “Switch to light mode”, and `/ai` rendered the advisor shell. The first `next build` failed only because the shell had `NODE_ENV=development`; the same build with `NODE_ENV=production` prerendered all 55 pages.

## Record

| ID | Status | Reason |
| --- | --- | --- |
| T001 | implemented | Fastify rate limit in `Backend/src/app/buildApp.ts` is 120 requests per minute per process. AI reads are 20/minute, AI messages 30/minute, and contact is 5 per 10 minutes. There is no shared limiter across instances because only one process is in scope. |
| T002 | implemented | Catalog, customer, and service rows are Postgres caches. Next.js `cacheComponents` is on. Money stays in integer minor units. There is no separate cache cluster. |
| T003 | not applicable | No load balancer or second instance is defined in this repository. |
| T004 | not applicable | No reverse proxy is owned here. `trustProxy` is only a Fastify setting for a proxy that is not configured. |
| T005 | not applicable | No API gateway. Fastify is the application boundary, and route handlers still authorize. |
| T006 | implemented | `.github/workflows/backend-ci.yml` and `frontend-ci.yml` run npm ci, lint, the line limit, typecheck, and tests. They do not deploy, scan images, or rehearse migrations. |
| T007 | implemented | `Backend/Dockerfile` and `Frontend/Dockerfile` are multi-stage and run as a non-root user. This audit did not scan or run the images. |
| T008 | not applicable | Kubernetes is not used. The Dockerfiles do not require it. |
| T009 | not applicable | No service mesh or custom registry. Callers use configured URLs. |
| T010 | implemented | `Backend/src/platform/circuitBreaker.ts` isolates the WHMCS client with a closed, open, and half-open state in the local process. Unit tests cover it. |
| T011 | implemented | The Postgres pool sets `statement_timeout`, `lock_timeout`, and `connectionTimeoutMillis` from config in `Backend/src/platform/db.ts`. |
| T012 | implemented | WHMCS calls pass the circuit breaker and return `not_configured`, `upstream`, or `circuit_open` instead of retrying a charge. Orders do not start a provider retry loop. |
| T013 | not applicable | No delayed job queue exists, so there is no persisted backoff schedule to add. |
| T014 | implemented | Contact, cart, and orders require an idempotency key and reject a reused key with a different fingerprint. AI messages require `clientRequestId`, with a unique index and an `IDEMPOTENCY_CONFLICT` response. Provider capture keys do not exist until a payment provider does. |
| T015 | not applicable | No message broker. |
| T016 | not applicable | No pub/sub transport. |
| T017 | not applicable | No transactional outbox. Handlers finish the work in the request. |
| T018 | not applicable | Local invariants use one Postgres transaction. There is no two-phase commit. |
| T019 | not applicable | No multi-service saga. |
| T020 | not applicable | No dead-letter queue. |
| T021 | not applicable | No production scheduler. |
| T022 | not applicable | No WebSocket server. |
| T023 | not applicable | No long-polling endpoint. |
| T024 | implemented | An AI turn is one `text/event-stream` response from `openSse`, with `Cache-Control: no-cache`. It is not a durable subscription and does not honor `Last-Event-ID`. |
| T025 | implemented | Migrations declare unique keys, `services_cache_client_idx`, and the AI client-request unique index. No production `EXPLAIN` was captured. |
| T026 | implemented | Reviewed catalog and region reads are parameterized and bounded with `LIMIT`. No production-shaped plan or latency budget was measured. |
| T027 | implemented | Reviewed handlers issue bounded queries for the request. No per-row query loop was found in those paths. |
| T028 | implemented | `pg.Pool` size comes from config and `withClient` releases the client. There is no PgBouncer in this repo. |
| T029 | not applicable | No read replica. `test:replica` exists so a replica is not assumed. |
| T030 | not applicable | No sharding. |
| T031 | not applicable | No table partitioning. |
| T032 | not applicable | No replication topology is configured here. |
| T033 | not applicable | No cross-process leader election. |
| T034 | not applicable | One database writer. There is no second writer to keep available during a partition. |
| T035 | not applicable | No async projection. An empty catalog cache is reported; it is not treated as a live WHMCS catalog. |
| T036 | not applicable | No version-column update path. The mutations that exist use idempotency keys. |
| T037 | not applicable | No `SELECT FOR UPDATE` path. `lock_timeout` remains set on the pool. |
| T038 | not applicable | No distributed lock service. Uniqueness is a database constraint. |
| T039 | implemented | Unique idempotency indexes and the AI payload-hash check close the check-then-act window for those writes. This audit did not run a concurrent load test. |
| T040 | not applicable | No multi-lock transaction was found to reorder. |
| T041 | platform-provided | V8 owns the heap. No soak or heap snapshot was taken, so this is not a leak-free claim. |
| T042 | platform-provided | V8 garbage collection. Request handlers do not call a forced collection. |
| T043 | platform-provided | The API is one async JavaScript thread. No `worker_threads` or `SharedArrayBuffer`. |
| T044 | platform-provided | Fastify `bodyLimit` is 64 KiB and the AI stream ends the response. There is no durable queue to pause. |
| T045 | not applicable | No autoscaler. |
| T046 | not applicable | One API process. Session state is a signed cookie, which a future second process could read, but that scale-out is not deployed. |
| T047 | not applicable | No production machine size to benchmark. |
| T048 | not applicable | No CDN. |
| T049 | implemented | Public files under `/images`, `/media`, `/home`, `/brands`, `/flags`, and `/assets` send `Cache-Control: public, max-age=86400`. Authenticated API responses are not given that header. There is no edge network in front of them. |
| T050 | not applicable | No cache-purge bus. Freshness for WHMCS-owned data is a resync into Postgres, not an invented price. |
| T051 | not applicable | No feature-flag service. |
| T052 | not applicable | No blue-green environment. |
| T053 | not applicable | No canary release. |
| T054 | not applicable | CI does not deploy, so there is no rolling release to keep compatible. |
| T055 | not applicable | No production release to roll back. Migrations stay forward-only. |
| T056 | implemented | `GET /health` is a cheap process check. `GET /ready` reports database, WHMCS, and AI state and does not report ready when the database is absent. |
| T057 | not applicable | No orchestrator probes. The backend image healthcheck only calls `/health`. |
| T058 | implemented | `GET /metrics` renders Prometheus text. `deploy/compose/prometheus` and Alertmanager files exist for local compose. No production dashboard owner was verified. |
| T059 | implemented | `Backend/src/platform/logging.ts` writes JSON and redacts password, secret, token, and WHMCS secret fields. No production log sink was inspected. |
| T060 | implemented | `tracing.ts` accepts W3C `traceparent` and exports OTLP only when `OTEL_EXPORTER_OTLP_ENDPOINT` is set. Unset means no export, not a fake span. |
| T061 | implemented | Process metrics include breaker and pool gauges. Instance histograms were not aggregated across a fleet because there is one process. |
| T062 | implemented | Prometheus alert rules and Alertmanager config exist under `deploy/compose`. This audit did not fire an alert. |
| T063 | not applicable | No SLO target, window, or owner is published. |
| T064 | not applicable | No SLI denominator is defined beyond the raw metrics. |
| T065 | not applicable | No error budget. |
| T066 | implemented | Health, redacting logs, metrics, and optional traces can explain a process failure. Payment reconciliation is blocked until WHMCS orders exist. |
| T067 | implemented | Secrets are server environment variables. WHMCS keys stay in the backend. No vault, rotation drill, or workload identity is configured. |
| T068 | not applicable | No cloud IAM. The app uses one database URL. |
| T069 | not applicable | Login calls WHMCS `ValidateLogin` and returns 503 when WHMCS is not configured. This repo is not an OAuth server. |
| T070 | not applicable | Sessions are HMAC cookies in `Backend/src/platform/session.ts`, not a JWKS rotation program. |
| T071 | platform-provided | TLS belongs to the host and to HTTPS upstream URLs. Local development is HTTP. No certificate store lives in the repo. |
| T072 | not applicable | No disk, backup, or field-encryption keys are managed here. |
| T073 | not applicable | Encrypted hops to Postgres, WHMCS, and telemetry are not evidenced. Production WHMCS URLs must be `https`, which is a URL check, not a completed network survey. |
| T074 | not applicable | No web application firewall. |
| T075 | not applicable | No provider DDoS product. The process rate limit is T001 and is not claimed as DDoS protection. |
| T076 | implemented | `@fastify/cors` allows only `corsOrigins` from config, with credentials. It does not reflect an arbitrary origin. |
| T077 | implemented | `assertTrustedOrigin` rejects cookie-bearing mutations whose `Origin` is outside the allowlist. A missing `Origin` is allowed for same-site requests that omit it. |
| T078 | implemented | Reviewed SQL uses parameter placeholders. This was a source search, not a penetration test. |
| T079 | platform-provided | React escapes text. Advisor replies render text and icons, not HTML from the model. There is no rich-text field to sanitize. |
| T080 | implemented | The only vendor URL is the configured WHMCS endpoint. Production rejects a non-`https` URL, and `csrf.ssrf.test.ts` covers that refusal. User-supplied URLs are not fetched. |
| T081 | implemented | `Backend/migrations` plus `scripts/migrate.ts` are the migration path, recorded in `schema_migrations`. No production-sized rehearsal was run. |
| T082 | implemented | Database versions are migration ids. HTTP routes are under `/v1`. Package version `0.1.0` is separate from both. |
| T083 | not applicable | No restore drill and no stated RPO or RTO. |
| T084 | not applicable | No backup job. |
| T085 | not applicable | No failover topology. |
| T086 | not applicable | No multi-region writers. |
| T087 | not applicable | No chaos suite. |
| T088 | not applicable | No cost account. |
| T089 | not applicable | The API is a long-running Node process, not scale-to-zero. |
| T090 | not applicable | Not deployed as a function. |
| T091 | not applicable | No latency measurement at forecast load. |
| T092 | not applicable | No throughput test. A health response is not throughput. |
| T093 | not applicable | No service-wide p99 sample. |
| T094 | not applicable | No tail-latency study. |
| T095 | not applicable | No partition drill. A lost order reply cannot create a second charge because the order route stops when WHMCS is absent. |
| T096 | platform-provided | `timestamptz` and the operating-system clock. No webhook timestamp window exists because there is no webhook receiver. |
| T097 | platform-provided | The system DNS resolver. No custom DNS cache. |
| T098 | platform-provided | HTTP and Postgres clients use TCP. No raw UDP. |
| T099 | platform-provided | The host negotiates HTTP. This app does not implement HTTP/3. |
| T100 | not applicable | No gRPC service. |
| T101 | not applicable | No inbound or outbound webhook product. Payment webhooks wait on a provider. |
| T102 | implemented | Public HTTP is versioned under `/v1`. There is no second supported version. |
| T103 | implemented | Each package has one npm lockfile. These apps are not published libraries. |
| T104 | not applicable | No cloud account is declared as code. Local compose is not that account. |
| T105 | not applicable | Terraform is not selected. |
| T106 | not applicable | Helm is not selected. |
| T107 | implemented | GitHub Actions caches npm from the lockfile, and Docker builds are multi-stage. A clean rebuild was not compared in this audit. |
| T108 | implemented | Node 22 and npm, with committed lockfiles. pnpm is not introduced beside npm. |
| T109 | not applicable | No incident roster or commander process. |
| T110 | not applicable | No on-call rotation. |
| T111 | not applicable | No postmortem practice is operated. |

## Still blocked

- **WHMCS.** Live customers, login, catalog prices, and orders stay `NOT_CONFIGURED` until API credentials and a database probe succeed. Demo plan cards are labeled demo and are not an order.
- **Payments.** `payment_operations` stores an order intent. It is not a provider ledger, and there is no capture, refund, or webhook receiver.
- **Hosting.** Load balancing, CDN, WAF, DDoS, backups, failover, multi-region writes, SLO numbers, and on-call have no production evidence. They are not applicable until that host exists.
- **Row-level security.** Tenant scope is `whmcs_client_id` on the customer queries that exist. Postgres RLS is not enabled, and it is not added only to tick T-level isolation.
