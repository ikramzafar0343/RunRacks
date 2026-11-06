# Node.js + PostgreSQL Backend Production Rules

**Status:** Mandatory engineering and release policy. **Reviewed:** 6 November 2026. **Audience:** Backend developers, Cursor/coding agents, reviewers, and operators. **Companion:** `Rules/FRONTEND_PRODUCTION_ENGINEERING_RULES.md`. **Applicability:** `Rules/CONTROL_RECORD.md`.

**Expansion:** All 111 enterprise topics are mapped in section 28; additional release evidence is in section 29.

**RunRacks decisions that override a generic default in this file:**

- WHMCS is the system of record for customers, access, pricing, products, orders, invoices, and billing. `Backend/` is the only WHMCS client. Postgres caches and local content only. Do not invent prices, login, or `ready: true` when WHMCS or the database is not configured.
- The package manager is npm, with one committed lockfile per package. The "pnpm by default" tooling line below does not apply to this repository.
- A T001–T111 topic is not an instruction to install Kafka, Kubernetes, a payment ledger, row-level security, or any other product this repository does not use. Record those as not applicable until the product exists.

This document extends the frontend standards to the authoritative Node.js backend, PostgreSQL, payments, Kafka, and background processing. A duplicate HTTP request, browser refresh, double click, repeated form submission, webhook redelivery, or worker restart must not accidentally repeat the same business effect. This requires durable identifiers, transactional constraints, and recovery protocols; UI disabling and rate limiting alone are insufficient.

## 1. Non-negotiable engineering contract

- Use Node.js with strict TypeScript and PostgreSQL. Preserve feature-based ownership, SOLID where applicable, DRY, KISS, camelCase/PascalCase code naming, and the 300-line maximum for maintained code files. Numerical budgets and architecture choices here are project policy, not claims that official documentation mandates them.
- Ship only complete, purposeful implementations. No demos, fake integrations, temporary repositories, production mocks, sample credentials, empty handlers, fabricated success responses, TODO-based behavior, unused functions, commented-out code, or speculative abstractions. Test doubles and fixtures are allowed only in isolated tests.
- Every function, algorithm, dependency, cache, queue, index, and design pattern must have a real requirement and a verifiable benefit. Prefer deleting unnecessary work to adding infrastructure around it.
- No silent alternate databases, payment providers, mock modes, catch-and-ignore blocks, swallowed failures, hidden retry chains, or defaults that disguise missing configuration. Explicit pending, unavailable, rejected, and recovery states are real product behavior and must remain distinguishable.
- Use official documentation matching the installed versions. Pin supported releases and the dependency lockfile; verify runtime, driver, database, Kafka client, and hosting compatibility together. Do not infer Node.js client behavior from a Java Kafka configuration example. [B01], [B04]
- Do not promise that queries can never become slow or that a third party provides universal exactly-once execution. Enforce measurable latency budgets, capacity limits, duplicate-effect invariants, and fault-injection tests. Never claim production readiness from documentation or a successful build alone.

## 2. Stack decisions and deployment model

| Concern | Default decision and limits |
| --- | --- |
| HTTP API | Supported Node.js LTS + TypeScript + Fastify. Keep one HTTP framework; an existing supported alternative requires an explicit project decision, not a parallel framework. |
| Database access | PostgreSQL with parameterized `pg` queries behind feature-owned persistence functions. Introduce an ORM/query builder only for a demonstrated benefit; retain SQL visibility and one transaction model. |
| Migrations | One versioned migration runner with a migration ledger, deployment locking, and reviewed SQL. The selected runner and its transaction behavior must be recorded before implementation. |
| Validation/contracts | Fastify-compatible JSON Schema plus one supported TypeScript type-provider approach; derive OpenAPI and boundary types from a single contract source where practical. |
| HTTP runtime | Stateless serverless functions or managed serverless containers using a supported adapter; reuse safe clients only as an optimization. |
| Kafka/runtime workers | Managed long-running consumer/relay workers, including serverless container worker services. Managed Kafka-triggered functions are acceptable only with verified retry, ordering, checkpoint, and batch-failure semantics. |
| Durable state | PostgreSQL, managed Kafka, and controlled object storage. A managed shared limiter/cache may be added for a real requirement; it is not the payment source of truth. |
| Tooling | One pinned package manager, pnpm by default to match the frontend; one formatter, typed ESLint, one unit-test runner, integration tests, and repeatable load testing. |

- Do not start a Kafka polling loop, scheduler, WebSocket server, or business-critical background promise inside an HTTP function. Serverless does not mean every workload belongs in a short-lived request invocation. [B03]
- Begin with a modular monolith and separately runnable workers. Split into independently deployed services only for proven ownership, isolation, regulatory, or scaling needs. Kafka does not require microservices, event sourcing, or an event for every CRUD operation.
- Record actual regions, provider capabilities, connection limits, broker topology, payment API version, traffic forecasts, SLOs, and recovery objectives. Missing required infrastructure is a release blocker; never replace it with an in-memory imitation.

## 3. Clean feature architecture and frontend ownership

The paths below are ownership rules, not empty folders to scaffold. `{featureName}` stands for a real capability. Keep the existing `Frontend/` and `Backend/` split when the repository uses it.

| Location inside `Backend/` | Responsibility |
| --- | --- |
| `src/app/` | Composition root: register routes, construct adapters, configure hooks, start the selected runtime. |
| `src/features/{featureName}/domain/` | Pure business rules, meaningful value types, state transitions, and invariants. |
| `src/features/{featureName}/application/` | Use cases, transaction orchestration, capability contracts, and authorization decisions. |
| `src/features/{featureName}/http/` | Thin route files, request/response schemas, and HTTP-to-use-case mapping. |
| `src/features/{featureName}/infrastructure/` | SQL repositories, external provider adapters, and concrete persistence/event implementations. |
| `src/features/{featureName}/events/` | Required event schemas and handlers; invoke application use cases. |
| `src/platform/` | Domain-independent database pool, telemetry, configuration, authentication integration, and required messaging/limiter capabilities. |
| `src/workers/` | Worker composition and lifecycle only; feature business logic stays in its feature. |
| `migrations/`, `tests/`, `scripts/` | Immutable applied migrations, cross-feature integration/failure tests, and real operational automation. |

- Dependency rule: domain code knows no Fastify, SQL driver, Kafka client, environment globals, or payment SDK. Application code uses domain rules and narrow capability contracts; adapters implement those contracts. The composition root connects them without a mandatory DI container.
- Do not create pass-through domain/application/repository layers for a trivial operation. Keep a small feature small while preserving its I/O boundary and transaction ownership. No generic repository exposing unrestricted access to every table.
- Each feature owns its tables and invariants. Cross-feature coordination uses explicit application contracts or an intentional shared transaction; no hidden writes to another feature's tables. Independently deployed services do not bypass ownership through direct database access.
- The backend owns authentication enforcement, persistence, migrations, payments, authoritative pricing, jobs, and domain rules. Next.js Server Actions/BFF routes adapt the UI and call the backend; they must not recreate business transactions or receive PostgreSQL credentials.
- Organize HTTP routes in feature files with explicit registration. Node.js/Fastify does not inherit Next.js filesystem routing. Do not invent a magic file-to-public-endpoint router; publish only registered, documented endpoints.
- Enforce dependency boundaries and cycles in CI. Shared contracts must not pull backend implementation or secrets into frontend bundles. Propagate authenticated identity through a verified session/token contract, never an untrusted `x-user-id` header.

## 4. Design patterns: use only what the problem requires

| Principle/pattern | Required use and restriction |
| --- | --- |
| SOLID | One reason to change; composable real variants; substitutable contracts; small capability interfaces; dependencies inverted at I/O seams. Do not force class hierarchies onto simple functions. |
| DRY / KISS / YAGNI | Share stable business knowledge; prefer explicit functions. Do not abstract unrelated code solely because it looks similar or build future features. |
| Repository / Adapter | Encapsulate purposeful queries and external contracts. Never hide transaction scope, query cost, pagination, or failure semantics. |
| Unit of Work | One explicit transaction scope for changes that must commit together; use the same database connection throughout. |
| Idempotency | Identify one logical command and its durable outcome so retries cannot repeat its effect. Combine with business uniqueness. |
| State machine | Define allowed payment, order, refund, and workflow transitions; prevent invalid or repeated transitions atomically. |
| Transactional outbox / inbox | Coordinate committed database state with at-least-once event delivery and duplicate-safe consumption. |
| Saga | Only for a genuine multi-system workflow; persist progress and compensation commands. Compensation is another fallible operation, not a database rollback. |
| Strategy / Factory / CQRS | Use only for actual interchangeable behavior, construction variation, or measured read/write needs. No speculative framework. |
| Circuit breaker / bulkhead | Use measured failure isolation and resource caps for slow dependencies; an open circuit must expose unavailability or pending work, never fake success. |

## 5. Naming, types, and the 300-line ceiling

- **Every maintained code/configuration/script/test/SQL file must be at most 300 lines, including comments and blank lines after formatting.** Enforce ESLint `max-lines` with `max: 300`, `skipBlankLines: false`, and `skipComments: false`; use a physical-line check for SQL and other uncovered formats. Documentation is exempt. [B36]
- Exclude only explicitly identified generated files, lockfiles, binary assets, and unmodified vendor files. Do not disguise handwritten code as generated, compress statements to evade the limit, or split into arbitrary numbered fragments. Split by responsibility and preserve atomic migration groups.
- Use camelCase for functions, variables, properties, feature folders, and non-class files such as `createPayment.ts` or `payment.routes.ts`; PascalCase for types, interfaces, and necessary classes. Use named exports and meaningful operation names; no `I` interface prefixes or vague catch-all helper modules.
- JSON properties use camelCase. SQL identifiers use lowercase snake_case as a deliberate database convention, mapped at the adapter boundary; avoid quoted camelCase table names. URL segments use kebab-case; environment names use uppercase snake_case. Keep these exceptions explicit and consistent.
- Enable TypeScript `strict`, `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes`. Do not use `any`, unsafe casting, broad lint suppressions, ignored promises, or non-null assertions to conceal incomplete validation. TypeScript does not validate runtime input. [B37]
- Model outcomes with discriminated unions; distinguish absent, empty, pending, failed, and unknown. Use exact decimal/integer representations for money and large identifiers; serialize values outside JavaScript's safe integer range as documented strings.

## 6. Algorithms and Node.js resource discipline

- For nontrivial algorithms, document the business invariant, maximum input size, time/memory growth, dependency calls, and failure behavior. Choose the simplest algorithm meeting the bound; do not add custom sorting, cryptography, caching, or locking when a proven primitive suffices.
- Bound request bytes, decompressed size, object depth, array lengths, regex input, pagination, batch size, recursion, fan-out, and output size. An O(n) operation on an unbounded input is still a denial-of-service risk. [B02]
- No synchronous filesystem, expensive compression, image processing, PDF generation, bulk JSON work, or CPU-heavy cryptography in hot request paths. Use bounded worker pools or durable jobs for CPU-heavy tasks; never spawn a process/thread per request.
- Use asynchronous APIs and stream large permitted transfers with backpressure. Respect downstream capacity, disconnects, and cleanup. Do not buffer a complete report/upload merely because async functions are available. [B05]
- Parallelize independent I/O only up to explicit dependency capacity. No unbounded `Promise.all`, `forEach(async ...)`, unmanaged promise queues, or parallel queries on a single transaction connection presented as a speed optimization.
- Track event-loop delay, heap/RSS, garbage collection, active requests, pool wait, and queue age. Fix repeated work, N+1 calls, unsafe regexes, oversized serialization, and leaked resources before increasing infrastructure size.
- Use monotonic clocks for durations and UTC instants for event timestamps. Inject clock/random/provider dependencies only where determinism or substitution adds value; do not build a universal abstraction around every native function.

## 7. HTTP contracts, validation, and honest responses

- Publish versioned OpenAPI contracts for every public route: method, authorization, schemas, limits, idempotency behavior, possible outcomes, pagination, and backward compatibility. Use one schema source; reject mass assignment and unknown write fields unless explicitly permitted.
- Validate path/query/header/body types, bounds, content types, and enumerations before expensive work. Treat schemas as trusted application code; never compile user-supplied schemas. Keep asynchronous database checks out of the initial Fastify schema validator. [B06]
- Return explicit DTOs with an output schema. Never return raw SQL rows, ORM objects, internal stack traces, tokens, or unrestricted provider responses. Validate untrusted provider/event responses before using them.
- Use `201` for a committed creation, `200`/`204` for appropriate completed operations, and `202` only after durable acceptance with an authorized operation-status URL. Pending is not paid, delivered, or completed. GET/HEAD must not cause business mutations.
- Use a consistent RFC 9457 problem-details contract with stable application error codes and a safe request identifier. Distinguish invalid input, unauthenticated access, forbidden access, missing resources, conflicts, quota limits, and dependency outages. Do not expose internal exceptions. [B07]
- Align backend deadlines with the frontend: the backend must finish or return a durable pending/unavailable outcome before the frontend's outer timeout. Do not let every proxy, SDK, and service independently retry the same call.
- List APIs default to 20 items and enforce a maximum of 100 unless a measured endpoint contract specifies otherwise. Bound filters, sorting choices, cursor lengths, and response fields. Bulk work uses a separate authorized, bounded contract.
- Keep responses useful on slow networks: return only required fields, bound response bytes, batch related reads where appropriate, and apply measured compression at one configured layer. Public cacheable reads may use deliberate cache headers/ETags; personalized or sensitive results must never leak through a shared cache. Do not make a small response wait for an unnecessary downstream call.
- Configure header/body read, idle connection, response-write, and proxy deadlines against actual hosting capabilities. Slow or disconnected clients must not retain unbounded buffers, database connections, or worker capacity; persist an accepted operation before detaching its execution.

## 8. Authentication, authorization, and tenant isolation

- Use a maintained identity/session integration; do not implement custom password cryptography or token formats. Validate token signature, allowed algorithm, issuer, audience, expiry, and relevant revocation/session state. Use scoped service credentials for service-to-service calls. [B08]
- Authorize every resource/action at the application boundary using current actor and tenant context. UUIDs, hidden UI controls, API keys alone, network location, and an earlier read are not authorization. Prevent object-, property-, and function-level access violations.
- Derive tenant membership from verified identity, not an arbitrary body/header value. Include tenant boundaries in queries, unique keys, foreign keys, cache keys, idempotency scopes, events, and job ownership. Test cross-tenant access using valid IDs from another tenant.
- Where PostgreSQL RLS protects shared tables, use a non-owner role without `SUPERUSER`/`BYPASSRLS`; define both read and write policies and verify owner-bypass behavior. Set verified tenant context transaction-locally on the same connection. Never leave tenant state in a pooled session. [B09]
- Use parameterized values for every SQL query. Table/column/sort identifiers require a fixed allowlist and safe identifier handling; they cannot be protected by ordinary value placeholders. [B10]
- Protect cookie-authenticated mutations against CSRF; configure explicit CORS origins where needed. Validate trusted proxy boundaries before using forwarded addresses. Restrict outbound URLs, redirects, DNS/network destinations, and protocols to prevent SSRF.
- Require TLS with certificate verification for external APIs, PostgreSQL, and Kafka. Use least-privilege runtime roles separate from migrations/admin roles. Protect administrative operations with stronger authorization, audit records, and step-up controls where warranted.

## 9. Idempotency contract: double clicks, forms, and retries

- Every mutation capable of an unintended duplicate side effect must accept a documented idempotency key or an equivalent server-controlled operation identifier. Naturally idempotent setters still need concurrency/version rules. A UI debounce or rate limit is never the duplicate-safety mechanism.
- The frontend creates one high-entropy key per logical user intent and reuses it across double clicks, network retries, refresh recovery, and status checks. A changed intent gets a new key. Share a server-issued checkout/order intent across tabs when they represent the same business action.
- Next.js Server Actions, BFF routes, gateways, and SDKs must preserve that key across the same logical command; no intermediary may generate a fresh key for each forwarding attempt. The backend owns the fingerprint, business uniqueness, and server-generated provider-operation identity. Bound key length/format and never put secrets or personal data in keys.
- Persist an idempotency record in PostgreSQL with scope, key digest, canonical request fingerprint, operation ID, processing/result state, timestamps, and a bounded safe result. Scope includes tenant, authorized actor/client context, operation, and contract version; reject a missing key on routes requiring it.
- Compute the fingerprint from validated semantic input using deterministic serialization and a cryptographic hash. Include meaningful parameters; exclude trace IDs and retry timestamps. Never overwrite the original fingerprint when the same key is reused.
- Authenticate and authorize access before replaying a result. A key is not a bearer credential. Store only a safe operation receipt/status/body; never replay session cookies, authorization headers, secrets, or a response belonging to another principal.
- Enforce key ownership with a database UNIQUE constraint, never check-then-insert or a Redis/process lock alone. Persist the business effect and its completed idempotent result atomically for database-only work. [B11], [B12]
- Different keys can still represent the same business intent. Add domain constraints such as unique checkout intent, booking reservation, invoice action, or refund request. Do not deduplicate all identical form content globally: two intentional identical submissions can be valid.
- Define retention from the supported retry/replay horizon. Initial ordinary-request retention is 7 days; financial business-operation identity lasts for the required business record lifetime. Never expire unresolved work or deduplication evidence while a supported replay can recreate its effect. Provider key retention is a separate contract. [B13]

| Duplicate condition | Required outcome |
| --- | --- |
| Same scope/key and same input, already completed | Return the recorded safe outcome; no new business effect. |
| Same scope/key with different semantic input | Reject with `409 idempotencyConflict`; no overwrite or execution. |
| Committed operation is still running or outcome unknown | Return the existing operation and pending/reconciling status; no second operation. |
| Competing local transaction owns the uncommitted key | Wait only within the lock budget, then return a documented contention response; do not invent a durable operation URL. |
| Different key, same protected business intent | Reuse the authorized existing intent/result or reject a domain conflict. |
| Key expired but business effect already exists | Domain uniqueness prevents repeating the effect; recover through the business operation, not a fresh charge. |

## 10. Database-only command protocol

1. Perform bounded shape validation, authenticate/authorize, canonicalize input, and establish the remaining deadline. Do not perform the side effect during these steps.
2. Acquire one database connection and begin a short transaction. Atomically insert the scoped key/fingerprint using a specific unique conflict target. If another committed record exists, verify the fingerprint and return its recorded result; do not use a broad conflict handler that conceals unrelated constraint violations.
3. If this transaction owns the key, enforce domain uniqueness and state/version conditions, then perform the mutation. Keep the successful response receipt and any required outbox/audit records in this same transaction.
4. Commit before sending success. If the transaction rolls back, neither the business effect nor a completed success record may remain. All statements must use the same checked-out client; always release it. [B14]
5. A bounded concurrent insert may wait for the winner; handle that explicitly. Return `409 operationInProgress` only for identified idempotency contention; unrelated overload/lock errors use their own unavailable/conflict contract. Do not treat every database error as a duplicate.
6. If the connection drops during COMMIT, the outcome is unknown. Reconnect and resolve the operation/domain key against the authoritative database before replaying the command. A lost HTTP response does not prove the write failed.

## 11. Payment, capture, refund, and external-effect protocol

- Separate transport retries, business payment intents, provider objects, captures, refunds, and ledger postings. Define legitimate multiple installments/partial captures explicitly; do not enforce a simplistic one-payment-per-order rule when the product allows them.
- The server calculates amount, currency, discounts, taxes, payable balance, and ownership from trusted data. Freeze the authorized amount/order version on the operation. Never trust a browser total or recalculate an accepted operation differently on retry.

1. In a short PostgreSQL transaction, reserve or retrieve the unique business intent; persist the operation, stable provider idempotency key, immutable request fingerprint, and durable dispatch/recovery work. Commit before making an external call.
2. A foreground executor or worker may claim the operation through an atomic lease/version transition. A lease timeout permits controlled recovery, not an assumption that an earlier external call never happened. Fencing tokens prevent stale workers from overwriting newer database state.
3. Call the provider outside the database transaction with the same stable key for that same operation. Reuse the existing provider payment object when required by its contract. Every capture/refund has its own business identity and stable provider key; never generate a new key for each retry. [B13], [B15]
4. Treat timeouts, connection loss, and ambiguous provider errors as **unknown outcome**. Reconcile through the provider operation/object, verified webhooks, and durable recovery. Do not mark the order failed or start a fresh payment merely because the HTTP request timed out.
5. Persist a verified outcome using guarded transitions and unique provider-object/effect identifiers scoped to the merchant account. Atomically write the business transition, financial postings, and resulting outbox events. Concurrent foreground responses, webhooks, and recovery workers must converge on one effect.
6. Return a final receipt only after that commit. Otherwise return `202` with the existing authorized operation-status endpoint. The client must display pending/requires-action/failed/succeeded accurately and must not infer payment success from a redirect, button click, or optimistic UI.
7. Never retry an ambiguous payment after the provider's idempotency window expires without resolving the original operation. If the provider cannot safely deduplicate or identify the result, stop automatic execution and move to a documented reconciliation/manual-review state.

- Keep explicit allowed transitions, including user authentication requirements and genuine provider reversals. A late failed event must not overwrite a verified successful capture; a real refund/dispute is a separate authorized transition/effect, not an event to ignore.
- Reserve capture/refund amounts atomically before dispatch, counting both completed effects and unresolved pending/unknown reservations against the allowed amount. Distinct request keys must not over-capture or over-refund concurrently. Release a reservation only after a verified outcome makes release safe; a timeout is insufficient.
- Reconcile local operations and ledger postings with provider charges, refunds, and settlements on a schedule. Alert on overdue unknown states and mismatches; never silently write off differences.
- Use provider-hosted/tokenized payment collection; do not store card security codes or place payment secrets in logs. Local constraints plus provider-supported idempotency are required; Kafka transactions alone cannot guarantee a single charge.

## 12. Webhooks: verification, duplicates, and event order

- Verify the provider signature on the exact raw request bytes, timestamp/replay tolerance, intended account/environment, and current signing key before accepting the event. Configure body parsing accordingly; never verify a reserialized JSON body. Bound payload size and subscribe only to required events. [B16]
- Durably insert the event into an inbox with a UNIQUE provider/account/event-ID key and an explicit processing status. If already durably stored, acknowledge safely. Return success only after durable acceptance or committed handling, never after scheduling an unawaited promise.
- Persist dispatch work with the inbox acceptance transaction when processing is asynchronous. Database unavailability must result in a retryable non-success response; a quick `200` that loses the event is prohibited.
- Inbox receipt is not completion. A worker applies the guarded business transition and marks processing complete atomically. Distinct event IDs may describe the same payment effect, so provider/business uniqueness must also protect the effect. [B16]
- Do not assume webhook ordering or use a timestamp alone as a version. Reconcile with authoritative provider state or documented object versions. Handle events received before the local provider-object mapping is complete through recoverable correlation, not discard or a new payment. [B16]
- Keep retries, dead-letter/quarantine review, signing-key rotation, and replay procedures operationally owned. Retain only necessary encrypted/redacted payload data; do not log complete payment events by default.

## 13. PostgreSQL schema, money, and invariants

- Define primary keys, NOT NULL, foreign keys, UNIQUE constraints, CHECK constraints, and appropriate exclusion constraints where they encode real invariants. API validation improves feedback; the database must still defend against concurrent workers and alternate callers. Required deduplication columns must not permit unintended NULL uniqueness gaps. [B11]
- Model tenant-safe relationships with composite tenant/resource references where necessary. Select deliberate deletion behavior; do not cascade away financial/audit history. Soft deletion and partial uniqueness require explicit restore/reuse semantics.
- Normalize core relational data. Use JSONB for genuinely variable document attributes, with a schema/version and measured query requirements; do not hide relationships, searchable critical fields, or financial invariants inside unrestricted JSON.
- Store monetary values as bounded integer minor units or deliberately scaled PostgreSQL `numeric`, plus currency. Handle currency-specific precision and rounding explicitly; never use JavaScript floating-point arithmetic for financial amounts or silently convert `numeric`/`bigint` to an unsafe Number. [B17]
- If balances, credits, payouts, or accounting are required, use immutable double-entry postings linked to a business operation. Enforce balanced entries per currency atomically through a validated posting routine/appropriate database enforcement; a simple per-row CHECK cannot prove a multi-row balance. Corrections use reversals, not editing posted history.
- Use `timestamptz` for instants, `date` for date-only facts, and a separately recorded business timezone for local schedules. Do not use timestamps as unique concurrency versions or assume sequences are gapless invoice numbering.
- Keep large media in object storage with controlled references. Define retention and deletion for business records, events, idempotency keys, inbox/outbox, logs, and uploads before they become unbounded tables.

## 14. Transactions, locks, and competing updates

- Use a transaction whenever an invariant spans writes. Read Committed is the starting isolation level, not a cure for read-check-write races; use atomic conditional updates, row locks, optimistic versions, or Serializable isolation according to the actual invariant. [B18]
- Inventory and quotas use an atomic conditional decrement with a bound and checked affected-row count, or equivalent locked coordination. Do not separately read availability and later write an unchecked quantity. Prevent overselling and negative balances at the authoritative boundary.
- Updates needing conflict detection carry a version/ETag. Compare and increment it atomically; a lost update returns a conflict instead of overwriting someone else's change. A generic upsert must not overwrite protected state or circumvent transition guards.
- Lock rows in a consistent order and keep the locked set small. Do not wait for user input, call providers, publish Kafka messages, or execute report generation while holding a transaction/row lock. Use `SKIP LOCKED` for queue claims only where skipping is correct, not ordinary consistent reads. [B19], [B20]
- Retry the **whole transaction** for documented serialization/deadlock failures (`40001`, `40P01`) only when the command is retry-safe. Initial limit: two retries with jitter inside the original deadline. No external effects inside that replayed closure. Unique violations (`23505`) and timeouts require classification, not blanket retry. [B18], [B21]
- Roll back and release connections on every failure path. Destroy unusable connections. A client cancellation must not return a connection to the pool while its query/transaction is still running; use supported cancellation, server timeouts, and verified cleanup.

## 15. Query performance: prevent unbounded and unexplained work

- Every critical query needs an owner, expected cardinality, selected columns, bound, supporting access path, and latency budget. Query count must be bounded by the use case, not grow one-for-one with returned items. Eliminate N+1 access using joins, batching, or bounded composition.
- Use parameterized queries and explicit projections. No unrestricted `SELECT *`, unbounded collection fetch, application-side filtering of an entire table, or dynamic user-provided SQL. Streaming does not make an unbounded expensive query cheap. [B10]
- Use deterministic keyset pagination for large changing datasets, with a unique tie-breaker and matching sort/index. Bind cursors to the tenant, filter, and ordering; validate them. Deep OFFSET and unconditional exact COUNT over large datasets require a measured justification. [B22]
- Design indexes around actual equality/range/order/join predicates and tenant access. Review composite column order, selectivity, partial predicates, and covering benefits. Index frequently used referencing foreign keys when required; PostgreSQL does not automatically create those indexes. Do not index every column. [B11], [B23]
- Use appropriate full-text/trigram/JSON index capabilities only when needed. Avoid functions, casts, wildcard scans, and mismatched types that accidentally defeat the intended access path; test actual parameter distributions and generic/prepared-plan behavior.
- Review `EXPLAIN (ANALYZE, BUFFERS)` on representative, production-shaped staging data, including large tenants, skew, empty results, and cold/warm caches. Inspect actual versus estimated rows, loops, scans, sort/hash spills, I/O, and lock waits. A sequential scan is not automatically wrong. [B24]
- `EXPLAIN ANALYZE` executes the statement. Never casually run it on production mutations; even a rollback does not undo every possible external/sequence side effect. Use safe staging fixtures and controlled production read diagnostics. Plan cost units are not milliseconds. [B24]
- Enable `pg_stat_statements` or equivalent approved observability and slow-query sampling. Prioritize total database time, high call counts, tail latency, and regressions. It provides aggregate statistics, not a p95/p99 latency histogram; collect percentiles through suitable tracing/metrics. [B25]
- Heavy analytics, exports, rebuilds, and backfills use bounded jobs with separate concurrency/pool budgets; use replicas or read models only if their freshness is acceptable. Keep payment authorization, duplicate checks, and read-after-write decisions on an authoritative consistent path.
- A critical query that breaches its budget blocks release until the access pattern, index, data shape, or endpoint contract is fixed. Caching or raising timeouts must not conceal unexplained SQL work; document legitimate analytical exceptions separately.

## 16. Connection pools, deadlines, and replica consistency

- Budget database connections across **all** maximum API instances, worker instances, migration jobs, tools, and failover/administrative reserves. For direct pools: sum of maximum instances × pool size, plus other clients, must fit the available server connection budget. For proxies, separately budget client slots, actual PostgreSQL backends, and waiting queues. [B26]
- Do not copy a pool size of 10/20 into every serverless instance. Cap autoscaling/concurrency and acquire-wait time to match database throughput. Pooling reduces connection churn; it does not create unlimited query capacity.
- Use a managed pooler or PgBouncer mode verified for the driver/ORM. Transaction pooling does not support arbitrary session state, LISTEN, or session advisory locks. Prepared-statement support depends on the protocol, pooler version, and configuration; verify it rather than claiming all prepared statements are forbidden. [B27]
- Apply role- or transaction-scoped `statement_timeout`, `lock_timeout`, idle-transaction limits, and a supported transaction deadline. Keep `lock_timeout` below the statement deadline. Foreground, migration, and analytical roles require distinct budgets; do not impose one global timeout blindly. [B28]
- An HTTP abort or rejected JavaScript promise does not necessarily cancel a PostgreSQL query or reverse a committed payment. Propagate cancellation where supported and verify server-side completion/rollback before recycling resources.
- Bound connection establishment, TLS negotiation, queue wait, retries, and response serialization within the outer request deadline. Monitor waiters and use deliberate overload responses instead of an unbounded waiting queue.
- Read replicas can lag. Define read-your-own-writes behavior and a replica-lag threshold; never route financial invariants, idempotency resolution, or fresh authorization to an arbitrarily stale replica. No silent switch to a different database on failure.

## 17. Migrations, indexes, and database maintenance

- Run migrations once as a controlled deployment job under a separate role. No automatic schema synchronization or DDL from every application replica. Applied migrations are immutable; detect ledger/checksum drift before deployment.
- Use expand–backfill–validate–switch–contract changes across compatible releases. Backfills must be resumable, idempotent, bounded, throttled, and observable; never wrap a table-wide backfill in one long transaction. Preserve old readers/writers during rolling deployments.
- Review table rewrites, lock levels, foreign-key validation, defaults, enum changes, and storage growth. Use short lock waits and a planned retry window; do not block traffic indefinitely to acquire DDL locks.
- Where appropriate, build live-table indexes with `CREATE INDEX CONCURRENTLY` through a migration step that is not inside a transaction. Detect and remediate invalid indexes after failure; concurrent creation is not a universal zero-impact operation. [B29]
- Keep autovacuum and statistics maintenance effective. Monitor dead tuples, transaction age, long transactions, bloat, WAL growth, replication slots, and disk headroom. Do not disable autovacuum or use `VACUUM FULL` as a routine online fix. [B30]
- Partition only for demonstrated lifecycle/volume/query benefits and verify pruning. Document how partitioning affects uniqueness and retention; do not place global payment/event deduplication guarantees on partition-local constraints accidentally.
- Rehearse migrations against realistic data and load, including rollback-compatible application deployment. Prefer a forward repair to a destructive down migration after live data has changed; keep a verified recovery plan.

## 18. Transactional outbox: PostgreSQL to Kafka

- When committed state requires an event/job, write the immutable outbox event in the same PostgreSQL transaction as the state change. No sequence of “commit database, then publish” or “publish, then commit database” without durable coordination. [B31]
- Each event has a stable event ID created once, owning tenant/aggregate, aggregate version where ordered, event/schema version, time, trace/causation information, and a bounded payload. Retrying publication must reuse the original event ID and payload.
- Select one publication mechanism per outbox stream: a database-backed relay, or operationally justified CDC such as Debezium. Do not activate competing relays. For CDC, monitor connector health, retained WAL/slots, schema evolution, and recovery checkpoints. [B31]
- A polling relay atomically claims a bounded batch using row locking/`SKIP LOCKED` and durable leases, commits the claim, then publishes outside the database transaction. Mark published only after the broker's delivery acknowledgement and a guarded ownership update. Renew/recover leases safely; no long transaction held during a broker call. [B20]
- A crash after broker acknowledgement but before the published marker can produce a duplicate event. This is expected at-least-once delivery and requires consumer deduplication. Never mark published before acknowledgement to avoid duplicates.
- `SKIP LOCKED` and parallel relays do not automatically preserve business order. For ordered aggregates, use explicit per-aggregate publication sequencing/ownership plus version checks; prevent a later version from overtaking an earlier unpublished version. A Kafka key alone cannot repair an already reversed publish order.
- Track oldest unpublished age, attempts, lease recovery, throughput, and backlog bytes. Clean only safely published records under a retention policy. Never delete unpublished events because a retry count or TTL has been exceeded.

## 19. Kafka topology, event contracts, and producers

- Use Kafka for required durable asynchronous integration, replay, or stream processing. Keep synchronous authoritative writes in PostgreSQL. Kafka is not automatically a job scheduler, query database, payment lock, or justification for distributed CRUD.
- Maintain a topic catalog with owner, purpose, key, schema, expected volume, partition count, retention, cleanup policy, consumer groups, replay horizon, ACLs, and recovery procedure. Provision through reviewed infrastructure definitions; disable accidental topic creation where practical.
- Partition related events by a stable tenant/aggregate key when per-aggregate order matters. Kafka ordering is partition-scoped, not global. Handle hot keys; increasing partitions can change key placement and needs an ordering-aware migration plan.
- Define a typed event envelope: `eventId`, `eventType`, `schemaVersion`, `occurredAt`, `tenantId`, `aggregateId`, applicable `aggregateVersion`, correlation/causation IDs, and payload. Authenticate producers and validate events; do not trust tenant claims solely because a message came from a broker.
- Choose one schema format and registry/governance mechanism. Require compatibility checks against retained schemas and actual consumers. Additive changes are not automatically compatible in every format; breaking changes require deliberate versioning and a consumer migration. [B32]

| Producer/topic concern | Production rule |
| --- | --- |
| Delivery durability | Explicit idempotent producer and `acks=all` equivalents; verify the actual Node client supports and applies them. |
| In-flight/retries | Preserve the client's documented idempotence requirements; Apache producer settings require retries enabled and at most five in-flight requests per connection. Bound delivery time and buffered bytes. [B33] |
| Replication | For critical topics on a suitable cluster, replication factor 3 and minimum in-sync replicas 2 are the baseline. Verify failure-domain placement and any version-specific leader-replica behavior; do not lower durability silently during an incident. [B34] |
| Transactions | Use stable, correctly scoped transactional IDs and fencing only for real Kafka transactional workflows. Transactional readers use `read_committed`. Kafka transactions do not include PostgreSQL or payment-provider effects. [B35], [B38] |
| Size/batching | Initial complete serialized event ceiling: 100 KiB, including its envelope; use controlled object references for larger artifacts. Bound batches, delivery buffers, compression cost, and linger against latency/memory budgets. |
| Security | TLS/SASL or managed workload identity; least-privilege topic/group ACLs, environment isolation, rotation, and audited administration. No wildcard production administrator credentials in application workers. |

- Producer idempotence protects supported producer retries; it does not deduplicate arbitrary application re-sends, different event IDs, all restarts, or downstream side effects. Preserve event/business identity across every recovery path. [B35]

## 20. Kafka consumers: inbox, offsets, and concurrency

- Use one consumer group per distinct logical subscriber and coordinated instances within a group for scale. Keep a stable logical handler identity for deduplication; changing a deployment/group name must not unintentionally repeat old business effects.
- For effects written to PostgreSQL: begin a transaction, atomically insert a UNIQUE `(handler identity, event ID)` inbox marker with appropriate tenant scope, apply the guarded effect and any new outbox event, and commit together. On a duplicate marker, verify the event fingerprint/scope; do not perform the effect again.
- Commit the Kafka offset **after** the database commit. A crash between these commits causes redelivery; the inbox prevents repeating the effect. Do not mark the inbox processed before an external payment/email call and claim that solves the cross-system atomicity gap.
- External effects require a durable command created in that database transaction and the provider idempotency/reconciliation protocol in section 11. If an external service cannot deduplicate an ambiguous effect, expose that limitation and a deliberate recovery policy.
- Disable or correctly control automatic offset storage/commit so no record is acknowledged ahead of completed or durably transferred work. Explicitly verify both settings for the chosen client/managed event-source integration. Commit the next offset after the contiguous completed prefix per partition, never the maximum finished offset across gaps. [B38]
- Process a partition sequentially by default; parallelize across partitions with bounded concurrency. More advanced per-key parallelism must retain ordering and contiguous offset accounting. Rebalances, shutdown, stale callbacks, and lease loss must not allow stale owners to mutate protected state.
- Maintain heartbeats/polling within the selected group protocol's limits; pause/resume consumption when downstream capacity is exhausted. Keep batch size, processing duration, and retained messages bounded. No unbounded in-memory prefetch queue. [B38]
- Detect missing aggregate versions and unexpected duplicates; do not silently discard future events as stale. Retain inbox evidence for the supported replay horizon, or maintain durable business uniqueness for older replay. Do not clear deduplication tables to “fix” a replay.

## 21. Retry, quarantine, replay, and saga rules

- Classify transient dependency failures, permanent validation failures, unsupported schemas, and invariant violations. Retry only the transient retry-safe category, in one owning layer, with exponential backoff/jitter, attempt and elapsed-time bounds, and unchanged business/event identity.
- No recursive immediate retries, infinite loops, hot retry topics, or sleeping request functions. Use durable scheduling/attempt state. Delayed retry topics can reorder a key; enforce ordering/version rules before choosing them.
- A dead-letter/quarantine record must contain the original identity, schema, safe error classification, attempts, origin topic/partition/offset, owner, and replay instructions. Quarantine does not mean the business operation succeeded.
- Never commit the source offset before the failed event is durably retained. Use a supported Kafka transaction for Kafka-to-Kafka transfer plus offsets, or a durable database quarantine/outbox handoff before committing. Otherwise a crash can silently lose the event.
- For critical ordered financial workflows, stop the affected key/partition or durably block later dependent effects until the failure is resolved. Sending the event to a DLQ and continuing blindly is prohibited. Alert on age and unresolved business impact, not only queue length.
- Replay is an audited operation with a scope, rate limit, schema compatibility check, preserved identity, and duplicate-safe handlers. Repairs that intentionally create a new effect need an explicit new repair command; do not rewrite event IDs or erase evidence to bypass deduplication.
- Persist saga progress and compensations where a multi-system process requires them. Each compensation is separately idempotent, retryable only under its contract, and observable. A compensation failure remains an unresolved operation until repaired.

## 22. Caching, distributed rate limits, and overload

- Add caching only after query and payload work is understood. Every cache has an owner, key including tenant/security scope, TTL, invalidation rules, memory bound, and stated freshness. Never use a cache as the authoritative payment ledger, deduplication record, or inventory invariant.
- Invalidate after commit through a reliable mechanism when correctness requires it. Control cache stampedes with bounded request coalescing and tested expiry behavior. Cache outages/cold starts must not trigger unlimited database traffic; apply admission controls.
- Enforce shared atomic rate limits by operation and verified principal/tenant, with coarse host/IP limits before expensive work. Reuse the frontend's initial API policies where applicable and add cost-based limits for exports, uploads, OTPs, and paid external calls. A per-process Map is not a distributed limiter.
- Record each policy's algorithm, rate/window, burst, verified key, expiry, check deadline, outage behavior, and owner. Initial matching defaults are 60 costly public reads/minute with burst 10, 30 ordinary authenticated mutations/minute with burst 5, and 5 contact submissions/10 minutes per verified IP. Authentication, payment, and destructive routes require explicit identity/provider-aware account, IP, tenant, and cost limits before release. Keep one policy definition; avoid charging the same quota twice at BFF and backend boundaries unintentionally.
- Return `429` plus `Retry-After` for a genuinely exceeded quota; use `503` for an unavailable critical limiter/dependency. Protected operations fail closed if their abuse control cannot be applied. Never silently use an unlimited local fallback.
- Separate request-rate limits, in-flight concurrency, connection capacity, storage quotas, and total spending limits. Prevent one tenant or batch job from exhausting every pool. Reserve operational capacity for reconciliation, health, and administration.
- When Kafka is unavailable, safely committed outbox work may remain pending within explicit backlog and delay limits. Stop admitting further work before durable storage/latency limits are exhausted; never discard events or call an asynchronous operation completed prematurely.

## 23. Runtime lifecycle, secrets, files, and shutdown

- Validate required configuration at the correct startup/build phase. No production defaults to localhost, development credentials, public buckets, test payment mode, or disabled security. Isolate preview/test/production data and credentials.
- Store secrets in the deployment's secret manager with least privilege and rotation. Never commit real environment files, expose database/Kafka credentials to Next.js client bundles, disable TLS verification, or include sensitive values in build artifacts and logs.
- Keep request/worker state durable where correctness needs persistence. Module-level SDK/pool reuse is allowed, but sessions, locks, ownership, and job completion cannot depend on a warm process or local disk.
- Use authorized direct-to-object-storage uploads with short-lived scoped grants where appropriate. Verify size, type/content, ownership, and required malware screening before publication; use private buckets and controlled downloads. CPU-heavy media optimization belongs in bounded processing jobs.
- Containers/workers handle termination by stopping admission, pausing consumers, finishing bounded in-flight work, committing only safe offsets, releasing/recovering leases, closing pools, and flushing telemetry within a shutdown deadline. Functions persist required work before returning.
- Readiness reflects whether required work can be served; liveness detects a stuck process without restarting every instance merely because a dependency is temporarily down. Protect detailed diagnostic endpoints and keep basic health responses cheap.
- Treat uncaught exceptions/unhandled rejections as failed process state: capture a safe diagnostic and terminate through the platform's recovery mechanism. Do not continue a potentially corrupted process or perform financial side effects in shutdown handlers.

## 24. Observability and measurable performance gates

These are initial project budgets for ordinary interactive operations at the recorded target load, not vendor promises. Measure server work including pool wait, upstream calls, serialization, and commits; report browser/network latency separately and retain cold-start results. Individual critical frontend routes may require tighter budgets.

| Metric/control | Initial requirement |
| --- | --- |
| Ordinary API read / write latency | p95 ≤ 300 ms reads / 500 ms writes; p99 ≤ 1,000 ms, excluding workflows explicitly returned as durable pending. |
| Cold invocation | p95 ≤ 1,500 ms for ordinary reads; measure rather than mixing cold/warm samples. |
| Critical OLTP query | p95 ≤ 50 ms, p99 ≤ 200 ms on production-shaped data; investigate recurring queries over 100 ms and block unexplained regressions. |
| Foreground database limits | Acquisition wait ≤ 250 ms; lock timeout 250 ms; statement timeout 1,000 ms; transaction deadline 2,000 ms, with remaining-request budget taking precedence. |
| Foreground HTTP deadline | 3 s reads / 8 s ordinary writes, shorter than frontend outer deadlines; provider-specific long work becomes a durable operation. |
| Event-loop delay | p99 ≤ 50 ms under intended load; no sustained heap growth or unbounded queue growth in soak tests. |
| Ordinary JSON body / event | 256 KiB request-body default; 100 KiB event default; explicit bounded exceptions for real bulk/upload contracts. |
| Durable inbox acknowledgement | Target p95 ≤ 500 ms without business processing; webhook-provider deadlines remain authoritative. |
| Outbox and critical consumer age | Target p95 ≤ 5 s; alert if oldest unresolved critical work exceeds 30 s during normal operation; stop unsafe admission at documented backlog limits. |
| Failure correctness | Zero duplicate financial postings, unauthorized cross-tenant effects, lost accepted commands, or silently skipped critical events in required fault tests. |

- Use OpenTelemetry tracing across HTTP, PostgreSQL, outbox, Kafka, and provider operations, initializing instrumentation before the relevant application libraries. Carry safe operation/event/correlation IDs without treating trace context as authorization. [B39]
- Record latency histograms, error classification, query count/time, pool saturation, blocked transactions, database CPU/I/O/WAL/disk, cache behavior, Kafka lag/age/rebalances, outbox age, deduplication hits, unknown payments, and reconciliation mismatches. Use bounded-cardinality metric labels.
- Logs are structured and redacted; audit records identify actor, tenant, action, target, result, and operation ID without raw secrets or payment payloads. Financial/security audit evidence is distinct from sampled diagnostic logs and must follow durable retention/access policy.
- Define availability SLO, measurement window, dependency contribution, error budget, alert owner, and incident runbook before launch. Separate expected user errors from system failures without hiding customer-visible dependency outages.
- Changes exceeding a budget require a documented endpoint-specific product/engineering decision and new evidence. Never merely raise timeouts, remove assertions, disable tracing, or redefine a metric to pass.

## 25. Mandatory concurrency and failure acceptance tests

Use real PostgreSQL and Kafka integration environments for the guarantees that depend on them; Testcontainers is suitable for isolated integration infrastructure. Mocked unit tests alone cannot prove transactions, locking, broker offsets, or provider behavior. Exercise the actual payment sandbox/official test environment without live charges. [B40]

| Test | Required assertion |
| --- | --- |
| 100 simultaneous submissions of one key through at least 4 API instances | One committed business effect; all other outcomes reference it or expose documented contention, never duplicate creation. |
| Same key with altered amount/body | Conflict with zero additional effects; original fingerprint/result unchanged. |
| Two tabs/new keys for one checkout intent | One authorized payment intent/effect under the domain rule; legitimate separate purchases still work. |
| DB commit succeeds but HTTP response is lost | Retry resolves the existing result; no second order, stock movement, or ledger posting. |
| Provider accepts charge then connection drops | Operation becomes unknown/pending; recovery/webhook finds the original charge without a new payment key. |
| Duplicate and out-of-order webhooks, including different events for one effect | One valid transition/posting, no regression from a stale event, no lost recoverable receipt. |
| Provider-key expiry with unresolved payment | No blind fresh charge; reconciliation/review remains active. |
| Relay crashes after Kafka acknowledgement | Redelivery retains event ID and downstream effect occurs once. |
| Consumer crashes after DB commit but before offset commit | Redelivery is a no-op for the completed effect and progresses safely. |
| Consumer rebalance, expired lease, and out-of-order completion | Stale owners cannot overwrite state; no offset committed past an unresolved gap. |
| Poison event / failed quarantine publication | No silent loss; critical ordering and durable retention remain intact. |
| Competing inventory, balance, capture, and refund updates | No negative stock, lost update, overspend, excess capture/refund, or unbalanced ledger. |
| Cross-tenant IDs, forged forwarding headers, and direct endpoint calls | Authorization, rate limits, and deduplication scopes remain enforced. |
| Database/cache/broker outage, cold start, and connection exhaustion | Bounded waits and memory; truthful outcomes; accepted work remains durable. |
| Migration, rollback-compatible deploy, backup restore, and event replay | Compatibility and consistency survive; prior payments are reconciled before external effects resume. |

- Add focused unit/property tests for state transitions, rounding, signatures/canonicalization, validation, and pure algorithms; test negative paths. No ceremonial coverage targets or snapshots that mirror implementation without validating behavior.
- Load-test forecast peak with realistic data/skew and an agreed burst, then soak long enough to expose resource leaks. Include cold caches, large tenants, broker interruption, replica lag, and slow upstreams. Use k6 thresholds or equivalent executable pass/fail gates; report p95/p99, errors, saturation, and cost together. [B41]

## 26. Backups, disaster recovery, and reconciliation

- Configure encrypted backups and PostgreSQL point-in-time recovery with monitored WAL archival and tested restoration. A replica is not a backup; logical dumps alone do not constitute a WAL-based PITR system. Record retention, access controls, and recovery ownership. [B42]
- Set explicit business-approved RPO and RTO before release, especially for financial records; do not invent a universal acceptable loss window. Exercise restoration into an isolated environment and record the achieved recovery time and recovered data point.
- Database restoration can move state behind completed provider effects or committed Kafka offsets. Before resuming workers/payments, reconcile provider objects, ledger postings, inbox/outbox, and consumer checkpoints to a known recovery point. Never replay stale payment dispatches blindly or advance offsets past missing database effects.
- Maintain broker/registry configuration and replay/recovery procedures in addition to database backups. Kafka retention, inbox deduplication retention, and backup recovery windows must support the declared replay plan; compaction does not preserve every historical business event.
- Run owned reconciliation jobs for unresolved payments, missing ledger/provider matches, stale leases, accepted jobs without progress, and unpublished outbox records. Give every anomaly a tracked disposition, retry/review deadline, and safe repair procedure.
- Test credential rotation, failover, capacity loss, and regional recovery where the service contract requires them. Protect restore/admin capabilities with stronger access and audit; verify recovery drills do not trigger real customer notifications or payments.

## 27. CI/CD, handoff, and definition of done

- Required automated gates: frozen dependency install, formatter, zero-warning lint, strict type check, 300-line/import-boundary checks, meaningful tests, real database/broker integration tests, schema/contract compatibility, production build, migration rehearsal, dependency/secret scanning, and applicable performance budgets. Scripts must fail on failure, never simply exit successfully.
- Deploy reproducible artifacts with separate environment configuration, least-privilege identities, reviewed infrastructure changes, and a staged rollout/rollback plan. Never run destructive migrations or replay production events as an incidental application startup task.
- Each delivered feature must include its contracts, domain invariants, authorization rules, idempotency scope, transaction boundaries, SQL/index evidence, resource bounds, event semantics if used, observability, and failure/recovery tests. Do not generate unused interfaces or Kafka topics just to complete a template.
- Before enabling payments or Kafka effects, prove the relevant acceptance cases in section 25. Verify the chosen provider/client's actual behavior, not only a mocked approximation or a code review assertion.
- Keep a concise operating record of deployed versions, host limits, pool math, topic settings, schema ownership, rate policies, timeout budgets, RPO/RTO, dashboards, alerts, and recovery owners. Record actual decisions rather than leaving implementation placeholders.
- Completion reports must state what changed, which checks actually ran, observed results, remaining risks/blockers, and any infrastructure not yet configured. A rules document, an SDK installation, or a successful HTTP response is not evidence of enterprise readiness.

## 28. Enterprise production controls — T001–T111

This control catalog is normative and covers every requested topic exactly once, using the same T001–T111 IDs in both documents. Apply each rule at its owning boundary together with the detailed baseline rules above. A topic being listed is not an instruction to install another product or create unused code.

- Maintain a project control record with each ID, applicability, accountable owner, implementation/platform responsibility, evidence, and last review. Use implemented, platform-provided, or not applicable with a concrete reason; missing required capability/evidence is a release blocker. Do not mark a required safeguard not applicable merely because it is difficult.
- Managed serverless remains the deployment default. Docker, Kubernetes, Helm, service meshes, sharding, multi-region writers, distributed transactions, and additional transports require a real requirement, measured tradeoff, supported platform, and operating owner before adoption. Provider-managed responsibilities still require capability verification.
- Keep one purposeful implementation per responsibility. Select the appropriate release strategy and live-update transport for each workload; do not build every option or automatic transport/provider fallback chains. Failure must remain explicit, bounded, observable, and recoverable.
- Preserve the 300-line ceiling for maintained code, Dockerfiles, CI configuration, Terraform, Kubernetes/Helm files, tests, SQL, and operational scripts. Split by responsibility; documentation and explicitly controlled generated/lock/vendor artifacts retain their stated exemptions.
- Existing numerical performance and timeout budgets remain in force. A live stream, long poll, migration, or durable job needs a separately documented bounded contract; it cannot silently raise ordinary request deadlines. Values and architecture choices here are project policy, not universal vendor guarantees.
- Never claim that this catalog proves zero slow queries, zero outages, or enterprise readiness. Release requires the applicable evidence, including failure/recovery behavior and actual provider integration.

| Ownership boundary | Required contract |
| --- | --- |
| Browser / Next.js | Accessible UI, rendering, safe sessions, BFF adaptation, stable command identity, useful slow-network behavior, and truthful operation status. |
| Node.js backend | Authorization, domain invariants, transactions, authoritative pricing/payments, durable jobs, and reconciliation. |
| PostgreSQL / messaging | Explicit durability, ordering, deduplication, retention, consistency, resource limits, and recovery. |
| Platform / operations | Ingress, certificates, deployment, compute/network limits, secrets/IAM, backups, observability, and incident ownership. |

### 28.1. Backend, APIs & Infrastructure — T001–T013

- **T001 — Rate Limiting.** Use the atomic shared policy in section 22, with separate request, concurrency, tenant, and monetary limits. Specify regional consistency, trusted identity, outage behavior, and expiry. Test independent instances, forged forwarding headers, bursts, and limiter loss.
- **T002 — Caching.** Every cache needs measured benefit, bounded keys/bytes, tenant scope, freshness, and repair behavior. Prevent an old concurrent reader from repopulating stale state after invalidation through version-aware writes or an explicitly acceptable stale window. Financial invariants remain in PostgreSQL.
- **T003 — Load Balancing.** Distribute traffic to ready instances across appropriate failure domains. Bound upstream connections and drain on removal. Choose algorithms from measured request/stream cost; sticky routing is not a correctness mechanism. Verify overload behavior and long-lived connections during scale-down.
- **T004 — Reverse Proxies.** Restrict direct origin access and configure one trusted forwarding boundary. Normalize allowed headers, reject malformed framing, bound request/response sizes and connection time, and preserve webhook raw bytes. Proxy buffering and idle limits must match explicitly supported streaming endpoints.
- **T005 — API Gateways.** Assign gateway ownership for ingress authentication integration, coarse quotas, routing, and request limits; application authorization remains authoritative. Avoid duplicating domain orchestration in the gateway. Disable unreviewed mutation retries and verify origin access cannot bypass required controls.
- **T006 — CI/CD.** Run section 27 gates, contract compatibility, migration rehearsal, security scans, and failure tests. Produce traceable immutable artifacts, dependency inventory, and provenance where supported. Separate build/deploy privileges; deploy the exact tested digest with a measured release and recovery plan.
- **T007 — Docker.** For container workloads use reproducible multi-stage builds, an unprivileged user, minimal runtime dependencies, digest pinning, and secret-free layers. Configure signal handling, writable paths, and resource limits; scan and test the actual image. Docker packaging does not mandate Kubernetes. [E02]
- **T008 — Kubernetes.** Adopt Kubernetes only with justified workload needs and an operational owner. Use supported managed infrastructure, least-privilege service accounts, network policies, resource requests/limits, placement, graceful termination, and suitable disruption budgets. A disruption budget does not guarantee survival of every failure. [E03]
- **T009 — Service Discovery.** Use managed discovery or Kubernetes Services/DNS where applicable. Verify readiness, endpoint churn, resolver behavior, and connection reuse. Authenticate the destination independently of its discovery record; avoid a custom registry or service mesh without a demonstrated requirement. [E04]
- **T010 — Circuit Breakers.** Define dependency-specific failure classification, rolling window, minimum sample, open duration, and bounded half-open probes. Do not count ordinary validation/authorization failures as provider outages. Keep resource bulkheads and retry budgets; document whether breaker state is local or coordinated.
- **T011 — Timeouts.** Retain section 24 foreground budgets and allocate remaining time across queueing, pool acquisition, SQL, network, and serialization. Verify actual cancellation/cleanup behavior; timeout is not rollback. Long-lived streams and durable jobs have separate bounded execution and idle budgets.
- **T012 — Retries.** Classify retryable errors; cap attempts and elapsed time in one owner. Coordinate SDK, gateway, worker, and transaction retries to prevent multiplication. Replay full retry-safe transactions only as section 14 permits; ambiguous provider outcomes follow reconciliation, not a new charge.
- **T013 — Exponential Backoff.** Specify base, cap, attempt limit, and deadline; full jitter can sample uniformly from zero to min(cap, base × 2^attempt). Treat Retry-After as a lower bound and do not exceed the caller budget. Persist delayed job retries; never hot-loop a failing queue. [E09]

### 28.2. Messaging, Distributed Systems & Real-Time Communication — T014–T024

- **T014 — Idempotency.** Apply sections 9–12 end to end: durable scoped key/fingerprint, database business uniqueness, stable provider keys, atomic receipts, and recovery. Test different keys for the same intent, concurrent captures/refunds, and expired provider keys. A transport key alone cannot prevent every duplicate business effect.
- **T015 — Message Queues.** Use a durable queue only where asynchronous processing is required. Define acknowledgement/offset, retention, delivery, visibility/lease, ordering, concurrency, and poison-message behavior for the selected broker. Acknowledge only after a committed effect or durable handoff; bound queued bytes and oldest age.
- **T016 — Pub/Sub.** Distinguish broadcast from durable work delivery. Redis Pub/Sub is at-most-once; do not use it alone for required payments, jobs, or reliable invalidation. Select durable messaging when replay matters and define subscriber identity, authorization, retention, and missed-message recovery. [E10]
- **T017 — Event-Driven Architecture.** Publish meaningful committed domain facts through the outbox. Define producer/consumer ownership, schema, key, version, compatibility, and business lag. Keep events bounded and free of unnecessary sensitive data; avoid synchronous chains disguised as asynchronous events.
- **T018 — Distributed Transactions.** Prefer one PostgreSQL transaction for local invariants, and outbox/inbox plus sagas across systems. PostgreSQL, Kafka, and a provider do not share a transaction. Two-phase commit requires explicit supported participants, coordinator recovery, prepared-transaction monitoring, and a justified availability cost.
- **T019 — Saga Pattern.** Use a persisted saga only for a real multi-service workflow. Define step identity, timeout, retry, compensation, pivot/irreversible effects, terminal states, and manual repair. Guard against duplicate and out-of-order commands; compensation failures remain owned unresolved work.
- **T020 — Dead Letter Queues.** Apply section 21 durable quarantine rules: retain original identity and origin, classify failure, alert an owner, and control audited replay. Retention must outlast the repair window. Do not advance offsets before durable quarantine or skip critical ordered dependencies.
- **T021 — Cron Jobs.** Use managed scheduling or a controlled CronJob with durable per-occurrence identity, timezone/DST policy, overlap/misfire handling, catch-up bounds, retries, and ownership. Duplicate or missed triggers are possible; concurrencyPolicy is not cross-system exactly-once execution. No setInterval-based production scheduler. [E06]
- **T022 — WebSockets.** Run on a supported managed real-time service or dedicated worker/container runtime. Authenticate the handshake and authorize every channel/message; validate Origin for browser clients, recheck expiry/revocation, bound frames/rates/buffers, drain on rollout, and persist business commands separately from the socket.
- **T023 — Long Polling.** Bound poll lifetime below ingress/runtime limits, concurrent subscribers, and retained state. Resume using a validated cursor and return a deliberate unchanged/timeout result. Clean up disconnects and release database clients; do not hold a PostgreSQL transaction while waiting for an event.
- **T024 — Server-Sent Events.** Serve text/event-stream through a streaming-capable path; test flushing, buffering, heartbeat, idle deadlines, quotas, and cancellation. Authenticate subscriptions and bound replay storage. Validate Last-Event-ID; define expired-cursor reset/snapshot recovery. An event ID does not create durable replay by itself. [E11]

### 28.3. Databases, Concurrency & Memory — T025–T044

- **T025 — Database Indexing.** Index measured predicates, joins, orderings, and uniqueness; examine selectivity, write amplification, storage, and index health. Keep tenant scope and supported access paths explicit. Test concurrent index migration and actual plans; no index-per-column rule or unverified index hint.
- **T026 — Query Optimization.** Apply section 15 on production-shaped data, including skew and cold caches. Inspect actual plans, spills, rows, buffers, locks, and total cost. Maintain per-query budgets and regression evidence; distinguish plan estimates from elapsed time and aggregate statistics from tail distributions.
- **T027 — N+1 Queries.** Bound SQL and downstream-call counts per use case. Use joins, selective aggregates, or bounded batches, verifying row multiplication and memory. Test query counts with larger page sizes; request-scoped batching must never mix principals or become an unbounded shared cache.
- **T028 — Connection Pooling.** Budget every API/worker replica, migration job, and operational reserve as section 16 requires. Bound acquisition wait and proxy queues; validate transaction-pooling compatibility. Reuse clients safely but never keep a transaction client across unrelated requests or tenants.
- **T029 — Read Replicas.** Route only explicitly stale-tolerant reads to replicas. Measure lag and enforce a threshold/recovery policy; authoritative writes, deduplication, balances, and fresh authorization require suitable consistency. Replica lag can grow under load and replication is not a backup. [E13]
- **T030 — Sharding.** Shard only for measured capacity or isolation requirements. Define shard key, routing authority, hot-tenant handling, resharding, cross-shard queries, uniqueness, and recovery. Preserve one authoritative location for each protected operation during migration; financial deduplication must survive old/new routing overlap.
- **T031 — Partitioning.** Partition for measured pruning or retention benefits. Automate partition lifecycle and monitor pruning/default partitions. Review global uniqueness explicitly: PostgreSQL partitioned unique keys generally require all partition-key columns; do not weaken payment/event identity accidentally. [E14]
- **T032 — Replication.** Record synchronous/asynchronous semantics, acknowledgement policy, failure domains, lag, WAL retention, and acceptable acknowledged-write loss. Synchronous replication trades availability/latency for durability; asynchronous promotion can lose recent commits. Never silently downgrade the agreed policy. [E13]
- **T033 — Leader Election.** Prefer managed database/broker leadership and a proven lease/coordination mechanism for required singleton work. Monitor renewal and fence stale writers at the protected resource. A lease winner or Kubernetes Lease alone does not guarantee side-effect fencing. Test paused old leaders resuming. [E08]
- **T034 — CAP Theorem.** Specify partition behavior per invariant: linearizable decisions cannot also remain available to every partitioned client. This is not an unconditional choose-any-two checklist. Reject/defer unsafe financial writes when authority is unavailable; explicitly permit bounded stale reads only where acceptable. [E15]
- **T035 — Eventual Consistency.** Define convergence target, maximum acceptable lag, stale-read rules, conflict resolution, ordering, and repair ownership. Measure from authoritative commit to usable projection. Availability of a stale read model must not bypass write-side authorization, inventory, or financial invariants.
- **T036 — Optimistic Locking.** Use an atomic expected-version predicate and version increment, checking affected rows. Scope the update to the authorized tenant/resource; return a documented conflict. Deduplication and optimistic locking solve different problems and may both be required.
- **T037 — Pessimistic Locking.** Use row/advisory locks only for a demonstrated invariant, with consistent acquisition order and bounded wait. Keep transactions short and use the same connection. Session advisory locks are incompatible with transaction pooling unless an explicitly supported strategy proves ownership.
- **T038 — Distributed Locks.** Prefer database constraints/transactions. When a cross-process lease is necessary, define atomic ownership, expiry, renewal, owner-checked release, fencing, and recovery. A TTL lock cannot stop a paused old holder's external effect; stable provider identity is still required.
- **T039 — Race Conditions.** Test concurrent instances, event handlers, schedulers, and recovery workers. Avoid check-then-act; guard transitions and invariants atomically. JavaScript's event loop does not prevent interleaving across awaits, processes, or external systems.
- **T040 — Deadlocks.** Keep lock order consistent and transactions short; capture safe deadlock diagnostics. Retry the full retry-safe transaction within the original budget after 40P01, as section 14 permits. Repair the access pattern instead of raising lock timeouts indefinitely.
- **T041 — Memory Leaks.** Soak-test heap, RSS, external buffers, timers, handles, listeners, pools, and backlog after warm-up. Diagnose retained objects and unbounded collections. Heap snapshots can pause/exhaust a process and contain sensitive data; capture them on controlled capacity with restricted access. [E17]
- **T042 — Garbage Collection.** Measure allocation rate, collection pauses, event-loop delay, and RSS under load. Reduce retention/allocation before changing heap limits; fit V8 heap plus native buffers within the container limit. Do not force GC per request or treat a larger heap as a leak fix.
- **T043 — Thread Safety.** Treat async interleaving and shared mutable worker memory separately. Prefer message passing and bounded worker pools. SharedArrayBuffer/native resources require documented synchronization and ownership; never share transaction clients across concurrent work. Test cancellation and worker failure. [E16]
- **T044 — Backpressure.** Honor Node stream flow control, producer delivery buffers, consumer pause/resume, pool capacity, and durable-queue admission. Bound bytes as well as item count. Stop or reject overload deliberately; only discard data whose contract explicitly allows loss.

### 28.4. Scaling, CDN & Caching — T045–T050

- **T045 — Autoscaling.** Set min/max capacity, scaling signals, stabilization, warm-up, and drain policy from measured load. Include queue age and saturation where useful; scale workers only within database/provider/broker capacity. Kubernetes CPU utilization needs appropriate resource requests. [E07]
- **T046 — Horizontal Scaling.** Keep APIs stateless and coordinate workers through durable ownership and consumer groups. Recalculate aggregate pools, quotas, and partition capacity before increasing instances. More replicas cannot repair a serial hot key, database bottleneck, or unsafe shared state.
- **T047 — Vertical Scaling.** Benchmark CPU/memory sizes against throughput, p99, GC, cold starts, and cost. Include native memory and connection needs. Resize with a verified interruption/failover plan; optimize query shape and algorithms before treating hardware as the only remedy.
- **T048 — CDN.** Use CDN caching only for explicitly public read contracts/assets. Protect origin access, bound transformation/egress cost, preserve signed private-object access, and verify cache-key variation. Authentication, mutations, webhooks, and operation-status receipts must not become public cached responses.
- **T049 — Edge Caching.** Place public cacheable responses near users without moving authoritative state arbitrarily. Set explicit freshness/stale/error rules and purge ownership. Cache authorization-sensitive data only under an approved secure design; never let an edge response overrule current write authorization.
- **T050 — Cache Invalidation.** Coordinate invalidation with committed state, using reliable outbox/versioning where required. Prevent stale repopulation, bound stampedes, and monitor propagation. Keep versioned immutable assets; never purge every tenant's cache for an unrelated change or hide failed invalidation.

### 28.5. Deployment & Release Engineering — T051–T057

- **T051 — Feature Flags.** Use flags only for actual release or operational control. Record scope, stable cohort assignment, audit, safe outage behavior, and removal criteria. Guard payments/security on the server; do not skip invariant checks through a flag. A kill switch must preserve pending-work recovery.
- **T052 — Blue-Green Deployment.** If selected, provision verified green capacity and compatible schema before switching traffic. Prevent duplicate singleton schedulers/dispatch through durable coordination. Validate data, consumer groups, secrets, and routing; switching traffic back cannot undo database or provider effects.
- **T053 — Canary Releases.** Use controlled cohorts with latency, errors, saturation, queue age, and business-invariant gates. Compare with a control over adequate traffic before promotion. Include consumer/schema compatibility; do not let canary workers execute effects twice or under a different idempotency identity.
- **T054 — Rolling Deployments.** Keep old/new APIs, schemas, events, and workers compatible for the declared coexistence window. Set available/surge capacity from dependency budgets, drain requests, and finish or safely transfer work. A Kubernetes Deployment progress timeout requires a response plan; do not assume automatic rollback. [E03]
- **T055 — Rollbacks.** Rollback code/configuration only within the tested compatibility window. Use forward repair for incompatible data changes and explicit compensation for business effects. Check schema, event, provider-operation, and reconciliation state before resuming; never blindly run destructive down migrations.
- **T056 — Health Checks.** Provide cheap, bounded, non-sensitive process/service checks and separate synthetic business probes. Avoid expensive scans, side effects, or unrestricted diagnostics. Define dependency health separately so monitoring can identify a provider outage without killing every healthy API process.
- **T057 — Liveness & Readiness Probes.** Separate liveness, readiness, and startup checks where supported. Tune timing/thresholds from boot and shutdown measurements; shared dependency failure must not cause restart storms. Validate traffic removal, graceful termination, and recovery under overload instead of copying generic probe values. [E05]

### 28.6. Monitoring & Observability — T058–T066

- **T058 — Monitoring.** Monitor API success, latency, saturation, database health, queue age, provider outcomes, and financial reconciliation. Give each dashboard a service owner and expected operating range; distinguish user-visible failure from infrastructure symptoms.
- **T059 — Logging.** Record structured timestamp, level, service, version, operation, trace, and safe error classification. Redact at collection and export boundaries; restrict retention/access. Keep required audit evidence durable and separate from sampled debug logs, with tamper resistance appropriate to the record.
- **T060 — Distributed Tracing.** Propagate bounded validated trace context across HTTP, SQL, outbox, workers, and providers where possible. Connect asynchronous work with deliberate parent/link semantics; initialize instrumentation correctly. Do not log SQL parameter values by default or trust public sampling decisions unconditionally. [E41]
- **T061 — Metrics.** Use counters for events, gauges for current state, and mergeable histograms for latency distributions. Include pool wait, event-loop delay, queue age, saturation, and correctness failures. Bound labels and retention; do not average instance p99 values to obtain a service p99. [E44]
- **T062 — Alerts.** Use symptom and burn-rate alerts plus immediate invariant/security alerts. Each needs severity, owner, escalation, runbook, and recovery criteria. Monitor delayed/unknown financial operations and lost-progress signals, not just queue length. Remove noisy alerts that never drive action. [E19]
- **T063 — SLOs (Service Level Objectives).** Define availability, latency, freshness, durable-job completion, and recovery objectives per service/critical workflow. Record population, window, target, dependency contribution, and owner. A fast accepted response is not a completed-payment SLO; correctness invariants are separate release requirements.
- **T064 — SLIs (Service Level Indicators).** Define good events/eligible events with explicit success, latency/freshness thresholds, observation point, and denominator. Include relevant dependency failures and timeouts rather than dropping them. Measure async acceptance and final completion separately with durable operation identity. [E42]
- **T065 — Error Budgets.** For an event-ratio SLO, budget = (1 − target) × eligible events; track spend/burn over the specified window. Define freeze/escalation/recovery rules and exceptions for critical repairs. A budget never authorizes duplicate financial postings, data loss, or tenant leakage. [E19], [E42]
- **T066 — Observability.** Combine metrics, logs, traces, audits, and reconciliation to explain failures and unknown outcomes. Verify a safe operation ID connects API, database, outbox, consumer, and provider records. Instrument unexplained gaps rather than declaring observability complete because an agent is installed.

### 28.7. Security & Authentication — T067–T080

- **T067 — Secrets Management.** Use a managed secret store/workload identity, scoped access, audited rotation, and revocation tests. Plan overlap and connection refresh for database/broker/provider keys. Do not bake secrets into images, Terraform outputs, logs, or deploy scripts; restarting is not revocation. [E24]
- **T068 — IAM (Identity and Access Management).** Assign least-privilege human/workload roles and separate runtime, migrations, backups, operators, and CI. Prefer federation/short-lived credentials, MFA for privileged humans, and audited emergency access. Regularly review unused permissions and cross-account/public exposure. [E25]
- **T069 — OAuth.** Use OAuth for delegated authorization and OIDC when identity is required. Validate issuer, audience, redirect/PKCE bindings, state/nonce as applicable, and token usage through the owning provider. Reject obsolete insecure flows; scopes supplement resource/tenant authorization and do not replace it. [E22]
- **T070 — JWT Rotation.** Allowlist algorithms/issuers/audiences and trusted JWKS sources; bound and coalesce unknown-key refresh to prevent fetch storms. Plan signing-key overlap and emergency revocation. Coordinate refresh-token reuse detection/rotation through the identity system; short-lived JWTs still need an explicit revocation model. [E22], [E23]
- **T071 — TLS.** Use supported TLS configuration with certificate/hostname verification at every external connection and required internal hop. Track certificate expiry/rotation. Do not accept replayable early-data mutations without a proven replay-safe design; prefer disabling early data for protected writes. [E27]
- **T072 — Encryption at Rest.** Encrypt database storage, WAL/backups, object storage, queues where required, logs, and infrastructure state with managed keys. Define key access, rotation, retention, and restore availability. Use field/envelope encryption only for a concrete threat model; preserve necessary search and recovery semantics.
- **T073 — Encryption in Transit.** Protect API, PostgreSQL, Kafka, cache, secret-store, backup-transfer, and telemetry links. Verify each hop and peer identity; use workload authentication/mTLS where required. Private networks alone do not establish confidentiality or trustworthy callers.
- **T074 — WAF (Web Application Firewall).** Place WAF protection at controlled ingress with audited, tested rules and origin-bypass protection. Start risky changes with measured evaluation where supported; preserve webhook/provider contracts. WAF filtering is one layer and does not prove SQL/XSS/SSRF safety. [E28]
- **T075 — DDoS Protection.** Use provider network protection plus application admission, concurrency and cost controls, origin restrictions, and capacity reserves. Document attack escalation and provider contacts. A per-process rate limiter or unlimited autoscaling is not adequate DDoS protection. [E28]
- **T076 — CORS.** Apply a narrow environment-aware CORS policy at one coordinated boundary. Validate allowed origins without arbitrary reflection and set appropriate cache variation. Cross-origin denial does not stop direct/non-browser API calls; enforce authentication and resource authorization independently.
- **T077 — CSRF.** Protect ambient-cookie mutations with a verified CSRF strategy, including origin/trusted-proxy handling and appropriate tokens. Do not rely on CORS or SameSite alone for every flow. WebSocket cookie authentication also needs an explicit browser-origin policy.
- **T078 — SQL Injection.** Use parameterized values and fixed identifier allowlists, least-privilege database roles, and bounded queries. Review raw SQL, dynamic ordering, JSON operators, and administrative/report paths. ORM adoption or input validation does not automatically make every query safe.
- **T079 — XSS (Cross-Site Scripting).** Treat stored content as untrusted and return explicit DTO/content types; do not concatenate user values into executable HTML/JS. Apply a documented rich-content sanitization policy where needed and coordinate with frontend rendering. Validation and output-context encoding serve different purposes.
- **T080 — SSRF (Server-Side Request Forgery).** Use explicit outbound allowlists and network egress controls; validate protocol, host, resolved IPv4/IPv6 destinations, and every redirect. Prevent DNS rebinding/address-selection gaps, credential forwarding, and metadata access. URL parsing alone is insufficient. [E26]

### 28.8. Database Maintenance & System Reliability — T081–T090

- **T081 — Database Migrations.** Retain section 17: one controlled migration job, immutable history, bounded backfills, lock/rewrite review, validation, and rehearsed recovery. Account for all concurrent old/new applications and workers. Concurrent index steps require correct runner transaction behavior.
- **T082 — Schema Versioning.** Track database migration versions, API versions, event schemas, and package versions separately. Enforce compatibility against retained data/messages and supported clients. Do not reuse removed field meanings or erase schema history while replay/restore requires it.
- **T083 — Disaster Recovery.** Retain section 26 RPO/RTO and reconciliation rules. Restore into isolation, verify integrity, and reconcile provider effects and broker checkpoints before restarting irreversible work. Include secret/key availability, infrastructure recovery, ownership, and a measured failback procedure.
- **T084 — Backups.** Use encrypted monitored PostgreSQL backups/PITR with tested restores and appropriate immutable/off-site protection. Include object data, schemas, infrastructure state, and required broker/configuration recovery. Set retention/access/key ownership; replicas and an untested successful backup job are insufficient.
- **T085 — Failover.** Define detection, promotion, fencing, routing, RPO impact, reconnect, and failback. Remove/fence the old writer before permitting conflicting writes, accounting for stale pools and DNS caches. Reconcile ambiguous commits/provider outcomes; infrastructure availability does not establish business consistency.
- **T086 — Multi-Region Deployment.** Record write ownership, routing, replication mode, data-location constraints, cross-region quotas, failover and conflict policy. Prefer one authoritative writer per protected entity unless the datastore/protocol proves stronger semantics. Active-active acceptance requires demonstrated global deduplication and invariant preservation.
- **T087 — Chaos Engineering.** Test crashes at commit/ack boundaries, dependency loss, partitions, disk/pool pressure, rebalance, lease expiry, and recovery. Begin in isolated production-shaped environments; define hypothesis, blast radius, abort signal, and reconciliation. Do not risk real charges or irreversible data changes in routine drills.
- **T088 — Cost Optimization.** Track cost per successful operation and its compute, SQL/I/O, storage, broker retention, egress, observability, and idle capacity. Set tenant/service budgets and anomaly alerts. Tune against SLOs; never save cost by weakening financial durability, backups, authorization, or required recovery.
- **T089 — Cold Starts.** Measure initialization, TLS, pool creation, dependency loading, and first query/provider call. Reuse safe clients, bound startup fan-out, and size reserved capacity when justified. A warm process remains disposable; correctness and accepted jobs must survive scale-to-zero.
- **T090 — Serverless Limits.** Record actual function/container/event-source limits and queue/broker integration semantics, including batch failures, retries, scaling, and payloads. Match database pools and workers to those limits. Vendor examples are not universal quotas; verify the deployed account/runtime capabilities. [E43]

### 28.9. Networking, Protocols & Performance — T091–T103

- **T091 — Latency.** Measure total elapsed service time and its queue, pool, lock, execution, network, and serialization components. Optimize the actual critical path at the forecast load; maintain separate cold/async measurements and do not hide delay by merely accepting work sooner.
- **T092 — Throughput.** Report completed operations/second together with latency, errors, resource saturation, and backlog age. Separate admitted from completed throughput. Load/soak test realistic mix, skew, bursts, and payloads; a growing queue is not sustained throughput.
- **T093 — P99 Latency.** Use service-wide histograms/raw distributions with appropriate buckets and sufficient samples. Include timeout/failure accounting and distinguish warm/cold workloads. Never average p99s or replace tail performance with a global mean; investigate the slowest successful and timed-out paths. [E44]
- **T094 — Tail Latency.** Investigate lock queues, hot keys, GC, cold connections, fan-out, storage spikes, and retries. Cap work and isolate slow dependencies. Hedged requests require measured justification and safe cancellation/semantics; never hedge payment mutations or introduce duplicate-effect risk.
- **T095 — Network Partitions.** Exercise one-way and partial failures, not only a complete outage. Keep writes behind their consistency authority and fence split-brain owners. A timeout cannot distinguish an unexecuted request from a committed request with a lost reply; recovery uses durable identities.
- **T096 — Clock Skew.** Synchronize/monitor wall clocks, use monotonic elapsed-time measurements, and bound auth/webhook timestamp tolerance. Do not order distributed effects solely by wall time. Deadlines and leases must account for the chosen mechanism's clock assumptions; validate provider timestamps separately from event versions.
- **T097 — DNS.** Use platform discovery with appropriate resolver TTL, cache, timeout, and failure behavior. Monitor lookup latency/errors and reconnect to the verified endpoint during failover. Do not bypass TLS identity or SSRF checks after resolution, and do not invent a permanent custom DNS cache.
- **T098 — TCP vs UDP.** Select supported transports for actual requirements; ordinary API/database/broker paths use their documented clients. TCP ordering/retransmission is not transaction commit or exactly-once processing. Raw UDP lacks delivery/duplicate guarantees; do not use it for unprotected financial commands. [E38], [E39]
- **T099 — HTTP/2 & HTTP/3.** Verify negotiated protocols at edge and origin independently; an HTTP/3 browser connection does not imply HTTP/3 to Node.js. Bound streams, header sizes, connections, and idle lifetimes. Test proxy/CDN behavior for streaming and errors; maintain application correctness across supported versions. [E36], [E37]
- **T100 — gRPC.** Use gRPC for justified typed service communication. Pin compatible generated contracts, reserve removed fields, set explicit deadlines, bound messages/concurrency, and propagate cancellation where supported. Verify Node client retry/stream behavior and map statuses deliberately; native gRPC and gRPC-Web differ. [E34]
- **T101 — Webhooks.** Retain raw-byte verification, durable inbox acceptance, business-effect deduplication, out-of-order handling, retries, and reconciliation from section 12. Outbound webhooks additionally need signed bounded payloads, destination SSRF controls, per-subscriber quotas, stable delivery identity, secret rotation, and audited replay.
- **T102 — API Versioning.** Version genuine breaking contracts, document compatibility/support/sunset, and measure active consumers before removal. Validate old/new clients and adapters during rollout. Additive fields may still break strict consumers; API, event, database, and package version numbers are distinct concerns.
- **T103 — Semantic Versioning.** Apply semantic versioning to declared public libraries/contracts, with changelogs and compatibility tests. Do not equate a package version with database migration order or a URL version. Pin reproducible dependency resolution and test upgrades, including behavior outside static types. [E33]

### 28.10. DevOps, Build Systems & Production Operations — T104–T111

- **T104 — Infrastructure as Code.** Manage networks, identities, database/broker settings, storage, compute, queues, and observability declaratively where supported. Assign one source of truth per resource, review plans, detect drift, and control destructive changes. Emergency changes must be reconciled into code with an audit trail.
- **T105 — Terraform.** When selected, use versioned access-controlled remote state with supported locking, isolated environments, provider locks, drift checks, and a reviewed saved plan from the intended commit. Sensitive values may remain in state/plan despite display redaction. Never disable locking to bypass contention. [E29], [E30]
- **T106 — Helm Charts.** When selected, use a small chart with values schema, pinned dependencies/images, lint/render checks, target-cluster validation, and least-privilege RBAC. Explicitly own hooks/jobs and CRD changes. A Helm rollback does not undo external effects, database migrations, or every hook resource. [E31], [E45]
- **T107 — Build Caching.** Use dependency/layer/compiler caches only with complete input keys, access controls, and invalidation. Keep credentials out of layers/exports and verify reproducibility. Cache restoration must not bypass required checks for changed inputs or silently restore incompatible native modules. [E32]
- **T108 — Dependency Hell.** Keep runtime, TypeScript, drivers, native modules, Kafka client, schema tooling, and package manager compatible. Pin lock resolution and review install scripts/licenses/security. Upgrade with actual integration/load evidence; never hide incompatibility using broad overrides without an owned, time-bounded reason.
- **T109 — Production Incidents.** Define severity, incident commander, technical owner, communication owner, timeline, escalation, mitigation, and recovery verification. Stop unsafe financial dispatch where necessary while preserving evidence. Separate customer communication from debugging and reconcile unknown operations before declaring recovery.
- **T110 — On-Call.** Staff a sustainable primary/secondary rotation matching the service commitment, with acknowledgement/escalation targets, vendor contacts, and tested access. Exercise handoffs and alert routing; review alert load and remove repetitive operational work. A dashboard without an accountable responder is insufficient. [E20]
- **T111 — Postmortems.** Use blameless evidence-based reviews with a severity-based deadline. Record scope, causal chain, detection/mitigation gaps, data/financial reconciliation, and concrete prevention actions with owners and dates. Verify action effectiveness and share lessons through the authorized operational process. [E21]

## 29. Enterprise acceptance and operating evidence

These checks extend sections 24–27; they do not replace the payment, outbox, inbox, and commit/ack crash tests. Use production-shaped isolated environments and actual supported clients/provider sandboxes. Production chaos requires the declared operational scope and stop conditions.

| Release gate | Required evidence |
| --- | --- |
| Coverage and architecture | T001–T111 applicability/owner/evidence record, actual runtime/provider/version decisions, no unused infrastructure or placeholder implementation, and maintained files within 300 lines. |
| Retry and ingress control | Count attempts across gateway, SDK, API, transaction, and worker layers under failure; verify one bounded owning policy, unchanged command identity, origin protection, forwarding trust, and truthful 429/503/pending results. |
| Database and cache correctness | Largest-tenant/skewed query plans and latency, concurrent version/lock conflicts, deadlocks, replica lag, stale cache repopulation, invalidation loss, and pool exhaustion remain within the declared behavior/budgets. |
| Scheduler and leader recovery | Duplicate/missed cron triggers, overlap, DST/timezone changes, lease expiration, and a paused old leader resuming cannot repeat protected effects. Reconcile overdue work and demonstrate resource fencing where used. |
| Messaging and real-time | Queue/broker outage, replay retention, rebalance, quarantine failure, subscriber gaps, slow consumers, token expiry, reconnect storms, and deployment drain preserve durable work and bounded resources. |
| Scaling and lifecycle | At maximum admitted API/worker scale and during scale-down, aggregate pool/connection budgets hold. Cold startup, missing metrics, unhealthy dependencies, and liveness/readiness behavior do not create restart or connection storms. |
| Release compatibility | Exercise the selected release strategy with old/new API, event, schema, flag, and worker versions. Prove rollback boundaries, retained artifacts, compatible migrations, and safe singleton/consumer ownership. |
| Identity and security | Rotate/revoke credentials and signing keys; test concurrent refresh, unknown-key storms, tenant separation, TLS verification, CSRF/CORS, SQL injection, XSS-bearing content, SSRF rebinding/redirects, and ingress/WAF bypass attempts. |
| Regional and storage recovery | Restore to the stated RPO/RTO and fence the old writer during failover. Reconcile provider effects and Kafka checkpoints before resuming. If sharding/multi-region writes are enabled, test ownership transfer and duplicate submissions across old/new routes. |
| Infrastructure and supply chain | Validate reviewed IaC plans, state locking/access, Helm templates/hooks where used, image digest/provenance, dependency compatibility, secret exclusion, and reproducible cached/clean builds. |
| Observability and operation | Demonstrate correct SLI denominators, p99 aggregation, timeout/error inclusion, actionable burn/invariant alerts, on-call escalation, an incident drill, and owned postmortem actions. |
| Capacity and cost | Report sustainable completed throughput, p95/p99, errors, backlog age, saturation, retained memory/GC, and cost under forecast peak/burst/soak; never call a growing backlog successful scaling. |

- Required handoff: architecture/ownership; contracts/invariants; idempotency and transaction boundaries; SQL/index plans; pool and scaling math; queue/event semantics; consistency/retention; secrets/IAM; actual host limits; IaC/deploy/migration plan; SLIs/SLOs/error budgets; runbooks; backup/restore/failover evidence; cost and on-call ownership.
- All evidence must state the environment, commit/artifact, test inputs/load, observed result, and limitation. A green build, successful health response, or rules document cannot substitute for these checks.

## 30. Official reference index

Sources establish API/tool behavior. Application protocols, thresholds, retention defaults, and architecture restrictions above are project policy. Stripe is a concrete official reference for provider semantics, not a requirement to choose Stripe; other providers require an equivalent verified contract. Versioned Kafka references must be checked against the actual cluster/client release.

- Runtime and HTTP: [Node releases][B01], [Event-loop guidance][B02], [Fastify serverless][B03], [Kafka Node client capabilities][B04], [Streams/backpressure][B05], [Fastify validation][B06], [HTTP problem details][B07].
- Security and SQL boundaries: [OWASP REST security][B08], [PostgreSQL RLS][B09], [Parameterized queries][B10], [Constraints][B11], [INSERT/ON CONFLICT][B12].
- Payment correctness: [Provider idempotency][B13], [node-postgres transactions][B14], [PaymentIntents][B15], [Webhook signatures/delivery][B16], [Exact numeric types][B17].
- Transactions and query plans: [Isolation][B18], [Locks][B19], [SELECT/SKIP LOCKED][B20], [SQLSTATE codes][B21], [Pagination][B22], [Composite indexes][B23], [EXPLAIN][B24], [pg_stat_statements][B25].
- Database operations: [Pool sizing][B26], [PgBouncer modes][B27], [Timeouts][B28], [Concurrent indexes][B29], [Vacuuming][B30], [PITR][B42].
- Messaging: [Debezium outbox][B31], [Schema compatibility][B32], [Producer configuration][B33], [Topic durability][B34], [Kafka delivery semantics][B35], [Consumer configuration][B38].
- Enforcement and evidence: [ESLint max-lines][B36], [TypeScript strict][B37], [OpenTelemetry][B39], [Testcontainers][B40], [k6 thresholds][B41].


### Enterprise reference additions — checked 6 November 2026

These primary references support the added controls. Product choices, ownership rules, budgets, and release gates are project policy. Provider documentation is an implementation example, not a mandate to use that provider; verify the deployed version and account limits. Existing baseline references remain below.

- [Docker build best practices][E02].
- [Kubernetes Deployments][E03].
- [Kubernetes Services and discovery][E04].
- [Kubernetes startup, liveness and readiness probes][E05].
- [Kubernetes CronJob delivery and scheduling][E06].
- [Kubernetes horizontal autoscaling][E07].
- [Kubernetes leases and leader election][E08].
- [AWS timeouts, retries, backoff and jitter][E09].
- [Redis Pub/Sub delivery semantics][E10].
- [WHATWG server-sent events and resume IDs][E11].
- [PostgreSQL standby and replication semantics][E13].
- [PostgreSQL partitioning and uniqueness][E14].
- [Gilbert and Lynch: formal CAP result][E15].
- [Node.js worker threads and shared memory][E16].
- [Node.js memory diagnostics and heap snapshots][E17].
- [Google SRE: alerting on SLOs and error-budget burn][E19].
- [Google SRE: on-call operation][E20].
- [Google SRE: blameless postmortems][E21].
- [RFC 9700: OAuth security best current practice][E22].
- [RFC 8725: JWT security best current practice][E23].
- [OWASP secrets management][E24].
- [AWS IAM security practices][E25].
- [OWASP SSRF prevention][E26].
- [RFC 8446: TLS 1.3 and early-data replay][E27].
- [AWS WAF and DDoS protection responsibilities][E28].
- [Terraform remote state locking][E29].
- [Terraform plans and sensitive plan contents][E30].
- [Helm chart best practices][E31].
- [Helm hook lifecycle and resource ownership][E45].
- [Docker build-cache optimization][E32].
- [Semantic Versioning 2.0.0][E33].
- [gRPC deadlines and application cancellation responsibility][E34].
- [RFC 9113: HTTP/2][E36].
- [RFC 9114: HTTP/3][E37].
- [RFC 9293: TCP][E38].
- [RFC 768: UDP][E39].
- [OpenTelemetry signals][E41].
- [Google SRE: implementing SLIs and SLOs][E42].
- [AWS Lambda quotas as a platform-specific limits reference][E43].
- [Prometheus histograms, quantiles and aggregation][E44].

[B01]: https://nodejs.org/en/about/previous-releases "Supported Node.js releases"
[B02]: https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop "Node.js event-loop discipline"
[B03]: https://fastify.dev/docs/latest/Guides/Serverless/ "Fastify serverless deployment"
[B04]: https://docs.confluent.io/kafka-clients/javascript/current/overview.html "Node Kafka client compatibility must be verified"
[B05]: https://nodejs.org/en/learn/modules/backpressuring-in-streams "Node.js backpressure"
[B06]: https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/ "Fastify schema validation and serialization"
[B07]: https://www.rfc-editor.org/rfc/rfc9457.html "RFC 9457 Problem Details"
[B08]: https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html "OWASP REST security"
[B09]: https://www.postgresql.org/docs/current/ddl-rowsecurity.html "PostgreSQL row-level security"
[B10]: https://node-postgres.com/features/queries "node-postgres parameterized queries"
[B11]: https://www.postgresql.org/docs/current/ddl-constraints.html "PostgreSQL constraints"
[B12]: https://www.postgresql.org/docs/current/sql-insert.html "PostgreSQL INSERT and conflict handling"
[B13]: https://docs.stripe.com/api/idempotent_requests "Stripe idempotency and retention semantics"
[B14]: https://node-postgres.com/features/transactions "Same-client database transactions"
[B15]: https://docs.stripe.com/payments/payment-intents "Payment intent lifecycle and reuse"
[B16]: https://docs.stripe.com/webhooks "Webhook verification and duplicate/out-of-order delivery"
[B17]: https://www.postgresql.org/docs/current/datatype-numeric.html "Exact and inexact numeric types"
[B18]: https://www.postgresql.org/docs/current/transaction-iso.html "PostgreSQL transaction isolation"
[B19]: https://www.postgresql.org/docs/current/explicit-locking.html "PostgreSQL locking"
[B20]: https://www.postgresql.org/docs/current/sql-select.html "Row locking and SKIP LOCKED"
[B21]: https://www.postgresql.org/docs/current/errcodes-appendix.html "PostgreSQL error codes"
[B22]: https://www.postgresql.org/docs/current/queries-limit.html "LIMIT, OFFSET, and deterministic ordering"
[B23]: https://www.postgresql.org/docs/current/indexes-multicolumn.html "Composite index behavior"
[B24]: https://www.postgresql.org/docs/current/using-explain.html "Execution-plan inspection"
[B25]: https://www.postgresql.org/docs/current/pgstatstatements.html "Query aggregate statistics"
[B26]: https://node-postgres.com/guides/pool-sizing "Connection sizing across instances"
[B27]: https://www.pgbouncer.org/features.html "Pool-mode feature compatibility"
[B28]: https://www.postgresql.org/docs/current/runtime-config-client.html "Query, lock, and transaction timeouts"
[B29]: https://www.postgresql.org/docs/current/sql-createindex.html "Concurrent index creation"
[B30]: https://www.postgresql.org/docs/current/routine-vacuuming.html "Vacuum and statistics maintenance"
[B31]: https://debezium.io/documentation/reference/stable/transformations/outbox-event-router.html "Transactional outbox routing"
[B32]: https://docs.confluent.io/platform/current/schema-registry/fundamentals/schema-evolution.html "Schema evolution and compatibility"
[B33]: https://kafka.apache.org/44/configuration/producer-configs/ "Kafka producer semantics; match the deployed version"
[B34]: https://kafka.apache.org/44/configuration/topic-configs/ "Kafka topic semantics; match the deployed version"
[B35]: https://kafka.apache.org/41/design/design/ "Kafka delivery and external-system boundaries"
[B36]: https://eslint.org/docs/latest/rules/max-lines "Code-file line enforcement"
[B37]: https://www.typescriptlang.org/tsconfig/strict.html "TypeScript strict checking"
[B38]: https://kafka.apache.org/43/configuration/consumer-configs/ "Consumer checkpoint/isolation semantics; match the deployed version"
[B39]: https://opentelemetry.io/docs/languages/js/getting-started/nodejs/ "Node.js instrumentation"
[B40]: https://node.testcontainers.org/ "Integration tests with actual service containers"
[B41]: https://grafana.com/docs/k6/latest/using-k6/thresholds/ "Executable load-test thresholds"
[B42]: https://www.postgresql.org/docs/current/continuous-archiving.html "PostgreSQL point-in-time recovery"

[E02]: https://docs.docker.com/build/building/best-practices/ "Docker build best practices"
[E03]: https://kubernetes.io/docs/concepts/workloads/controllers/deployment/ "Kubernetes Deployments"
[E04]: https://kubernetes.io/docs/concepts/services-networking/service/ "Kubernetes Services and discovery"
[E05]: https://kubernetes.io/docs/concepts/workloads/pods/probes/ "Kubernetes startup, liveness and readiness probes"
[E06]: https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/ "Kubernetes CronJob delivery and scheduling"
[E07]: https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/ "Kubernetes horizontal autoscaling"
[E08]: https://kubernetes.io/docs/concepts/architecture/leases/ "Kubernetes leases and leader election"
[E09]: https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/ "AWS timeouts, retries, backoff and jitter"
[E10]: https://redis.io/docs/latest/develop/pubsub/ "Redis Pub/Sub delivery semantics"
[E11]: https://html.spec.whatwg.org/multipage/server-sent-events.html "WHATWG server-sent events and resume IDs"
[E13]: https://www.postgresql.org/docs/current/warm-standby.html "PostgreSQL standby and replication semantics"
[E14]: https://www.postgresql.org/docs/current/ddl-partitioning.html "PostgreSQL partitioning and uniqueness"
[E15]: https://www.comp.nus.edu.sg/~gilbert/pubs/BrewersConjecture-SigAct.pdf "Gilbert and Lynch: formal CAP result"
[E16]: https://nodejs.org/api/worker_threads.html "Node.js worker threads and shared memory"
[E17]: https://nodejs.org/en/learn/diagnostics/memory/using-heap-snapshot "Node.js memory diagnostics and heap snapshots"
[E19]: https://sre.google/workbook/alerting-on-slos/ "Google SRE: alerting on SLOs and error-budget burn"
[E20]: https://sre.google/sre-book/being-on-call/ "Google SRE: on-call operation"
[E21]: https://sre.google/sre-book/postmortem-culture/ "Google SRE: blameless postmortems"
[E22]: https://www.rfc-editor.org/rfc/rfc9700.html "RFC 9700: OAuth security best current practice"
[E23]: https://www.rfc-editor.org/rfc/rfc8725.html "RFC 8725: JWT security best current practice"
[E24]: https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html "OWASP secrets management"
[E25]: https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html "AWS IAM security practices"
[E26]: https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html "OWASP SSRF prevention"
[E27]: https://www.rfc-editor.org/rfc/rfc8446.html "RFC 8446: TLS 1.3 and early-data replay"
[E28]: https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html "AWS WAF and DDoS protection responsibilities"
[E29]: https://developer.hashicorp.com/terraform/language/state/locking "Terraform remote state locking"
[E30]: https://developer.hashicorp.com/terraform/cli/commands/plan "Terraform plans and sensitive plan contents"
[E31]: https://docs.helm.sh/docs/chart_best_practices/ "Helm chart best practices"
[E32]: https://docs.docker.com/build/cache/optimize/ "Docker build-cache optimization"
[E33]: https://semver.org/ "Semantic Versioning 2.0.0"
[E34]: https://grpc.io/docs/guides/deadlines/ "gRPC deadlines and application cancellation responsibility"
[E36]: https://www.rfc-editor.org/rfc/rfc9113.html "RFC 9113: HTTP/2"
[E37]: https://www.rfc-editor.org/rfc/rfc9114.html "RFC 9114: HTTP/3"
[E38]: https://www.rfc-editor.org/rfc/rfc9293.html "RFC 9293: TCP"
[E39]: https://www.rfc-editor.org/rfc/rfc768.html "RFC 768: UDP"
[E41]: https://opentelemetry.io/docs/concepts/signals/ "OpenTelemetry signals"
[E42]: https://sre.google/workbook/implementing-slos/ "Google SRE: implementing SLIs and SLOs"
[E43]: https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html "AWS Lambda quotas as a platform-specific limits reference"
[E44]: https://prometheus.io/docs/practices/histograms/ "Prometheus histograms, quantiles and aggregation"
[E45]: https://docs.helm.sh/docs/topics/charts_hooks/ "Helm hook lifecycle and resource ownership"
