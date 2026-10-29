# Frontend Production Engineering Rules

> **Classification:** Mandatory repository engineering standard  
> **Scope:** Next.js App Router, React, TypeScript, frontend-to-backend integrations, testing, security, performance, and deployment  
> **Baseline:** Next.js 16 APIs; revalidate against the exact installed version before implementation  
> **Enforcement:** Code review **and** automated checks; a Markdown file alone cannot enforce behavior

---

## 0. How to interpret and enforce this document

- **MUST / MUST NOT:** Blocking requirement. Noncompliance prevents merging or release.
- **SHOULD / SHOULD NOT:** Strong default; an exception needs a concrete technical rationale recorded in the change.
- **MAY:** Optional technique selected only when a real requirement benefits from it.
- **STOP:** Do not fabricate an implementation. State the missing input or failure, identify impacted work, and continue only on independently complete tasks.
- Framework claims follow official documentation for the installed version. Architecture, naming, and the 300-line cap below are **repository policies**, not claimed framework requirements.
- More specific approved product contracts take precedence over illustrative folder names, but cannot waive security, correctness, authorization, or release checks.
- If framework behavior and this document conflict after an upgrade, verify the official version-matched documentation, update the rule, and record the decision **before** implementation.
- Apply these rules to every new file, modification, refactor, fix, integration, and generated change. Existing noncompliance touched by a change must not be made worse.
- Do not claim a feature is working, secure, deployed, tested, indexed, fast, or production-ready without evidence from actual checks.

## 1. Supported platform and dependency discipline

- Use a supported **stable** Next.js App Router release with compatible React, React DOM, TypeScript, and Node.js versions. Pin the selected versions through the manifest and a committed lockfile. [1][2]
- For **Next.js 16**, the documented minimums include Node.js **20.9.0** and TypeScript **5.1.0**; choose a currently supported production runtime rather than treating a minimum as a maintenance recommendation. [2]
- Do not mix Pages Router conventions or legacy synchronous dynamic APIs into App Router code.
- Select **one** package manager. Enforce its lockfile, frozen installs, package-manager metadata, and consistent local/CI deployment versions.
- Do not install prerelease, deprecated, abandoned, duplicate, or incompatible libraries without a reviewed technical justification.
- Prefer built-in framework/platform features when they meet requirements; avoid packages for trivial helpers.
- Every dependency MUST have a concrete consumer; review its maintenance, license, server/client compatibility, transitive security risks, and browser bundle impact.
- Run dependency and security advisory checks in CI. Triage findings by exploitability and actual exposure, not by blindly suppressing results.
- Upgrades MUST include breaking-change review, migration notes, checks, and targeted regressions. Never auto-upgrade a major framework version in an unrelated change.

## 2. Real production implementation only

- Implement the specified behavior **end to end**: UI, validated contract, real transport, authorized server logic, persistence where required, errors, and verification.
- Runtime code MUST NOT contain dummy data, fabricated counters or reviews, simulated API success, fake authentication, static stand-ins for dynamic resources, TODO branches, dead buttons, or nonfunctional navigation.
- Approved static marketing content and genuine empty states are allowed; test mocks and fixtures belong only in test/development environments.
- Do not present a form as submitted until the real operation succeeds. Do not report data as saved unless it persists and can be retrieved after a reload.
- Do not silently replace failed server responses with `[]`, `{}`, `0`, `true`, cached success, or hardcoded content.
- If contracts, permissions, credentials, configuration, approved assets, or acceptance criteria are missing, **STOP** for that portion. Clearly document the precise blocker; never guess secrets or business behavior.
- Do not create unused folders, components, endpoints, abstractions, services, configuration, or fallback providers in anticipation of hypothetical requirements.
- Remove obsolete branches, imports, console noise, commented-out implementations, unused packages, and duplicate logic in modified areas.
- No console/log exposure of production secrets or personal data. No suppressed runtime errors to make a demo appear successful.
- Preserve unrelated, working behavior. No opportunistic redesign, animation replacement, API contract breakage, or data migration unless required.

## 3. Feature-first architecture and dependency boundaries

Use the following as a **responsibility map**, not a mandate to generate empty directories. [3]

```text
src/
  app/                         # App Router files, layouts, metadata, route boundaries
  features/
    <feature>/
      components/              # Feature-specific presentation
      hooks/                   # Reusable client behavior, only when needed
      model/                   # Domain types, schemas, pure rules
      server/                  # Protected server-only data access and services
      actions/                 # Thin, client-callable Server Functions, when needed
  shared/
    ui/                        # Truly reusable, business-agnostic primitives
    lib/                       # Proven shared helpers
    config/                    # Public config separated from server config
  server/                      # Shared auth, observability, quotas, infrastructure
  styles/                      # Global tokens and base styles
public/                         # Public assets only; never secrets
tests/e2e/                      # User journeys across route/feature boundaries
```

- Routes compose features; features depend on shared code; server feature modules can depend on shared server infrastructure. Reverse imports are forbidden.
- One feature MUST NOT import another feature's private files. Expose a narrow, typed public contract when cross-feature use is genuinely necessary.
- Shared modules MUST NOT depend on feature or route modules. Detect circular dependencies and dependency-boundary violations in CI.
- Keep domain operations separate from rendering, transport, validation, and persistence. Avoid over-layering trivial operations.
- A server data-access layer (DAL) MUST centralize protected queries, permission checks, and safe response shapes where sensitive data is involved. [4]
- Maintain one source of truth for each business rule, permission, schema meaning, and API contract. Duplicate derived state and duplicated business conditions are prohibited.
- No all-purpose `utils.ts`, monolithic context, universal repository, god component, or catch-all `services.ts`.
- Co-locate feature-specific styles and tests. Extract shared behavior only when multiple real consumers share the same semantics.
- Favor clear dependency direction, pure functions, explicit imports, and small interfaces over inheritance or elaborate patterns.

## 4. File and naming rules

| Element | Required convention | Example |
|---|---|---|
| React component and filename | PascalCase | `ProfileCard.tsx` |
| Type / interface / necessary class | PascalCase | `ProfileRecord` |
| Function / variable / prop / object property | camelCase | `getProfile`, `profileId` |
| Hook / hook filename | `use` + PascalCase | `useProfileForm.ts` |
| Non-component source file | camelCase, descriptive | `profileSchema.ts` |
| Feature directory / static URL segment | kebab-case | `account-settings` |
| Module-wide fixed constant / environment key | UPPER_SNAKE_CASE | `MAX_FILE_BYTES` |
| Boolean | positive `is`, `has`, `can`, `should` prefix | `hasPermission` |
| Event callback / handler | `on` / `handle` | `onChange`, `handleSave` |
| Tests / scoped CSS | source name + conventional suffix | `ProfileCard.test.tsx` |

- Framework-reserved filenames and required exports take precedence: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `global-error.tsx`, `not-found.tsx`, `route.ts`, and other documented conventions.
- Preserve exact field names mandated by external APIs at the boundary; map into internal camelCase types explicitly.
- Prefer named exports for application modules; use default exports where framework conventions require them.
- Import casing MUST match the real filename on case-sensitive hosts. Use configured `@/` imports across feature boundaries and clear relative imports locally.
- Paths, identifiers, and variables MUST communicate their responsibility. Avoid meaningless abbreviations and vague naming.

## 5. Hard maximum: 300 physical lines per authored file

- Every hand-authored source file, test, script, stylesheet, and configuration file MUST be **at most 300 physical lines**, including whitespace and comments.
- This is a project policy, **not** a Next.js requirement. A 299-line file is not automatically well designed; prefer concise, cohesive modules.
- Refactor by responsibility before reaching the ceiling. Do not minify code, combine statements unnaturally, or hide code in giant template strings to bypass it.
- Exempt generated output, lockfiles, vendored libraries, binary assets, and machine-created declarations via a narrowly reviewed allowlist. Never relabel authored code as generated.
- Configure the ESLint `max-lines` rule with `max: 300`, `skipBlankLines: false`, and `skipComments: false` for supported source types. [5]
- Enforce an additional portable line-count script in CI for authored file types not covered by ESLint; count lines correctly without a phantom trailing line.
- Lint disables, ignore comments, or one-off overrides MUST NOT be used to conceal a line-cap violation.

## 6. TypeScript and schema contracts

- Enable `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, and other compatible strictness checks as appropriate. Keep TypeScript and lint diagnostics at **zero**. [6]
- No unbounded `any`, cast chains, `@ts-ignore`, broad non-null assertions, or suppressed rule failures to bypass incorrect typing.
- Use `unknown` for untrusted input until validated. TypeScript annotations never replace runtime validation.
- Export explicit types for stable public boundaries; infer obvious local types. Use discriminated unions for mutually exclusive results/states.
- Validate route params, query strings, form inputs, incoming JSON, environment config, and upstream responses at their trust boundaries.
- Reject unknown writable fields when updates are sensitive. Do not spread raw request bodies into database mutations or SDK calls.
- Normalize types once, closest to ingestion. Do not let transport models leak through unrelated UI modules.
- Treat nullable/optional fields according to their actual contract; do not hide required-field defects with `?.`, `?? ''`, or fabricated defaults.
- Functions MUST have one cohesive purpose, precise names, explicit side effects, sensible guard clauses, and predictable failure semantics.
- Do not add abstraction solely to conform to object-oriented SOLID terminology; apply single responsibility, contract substitutability, narrow interfaces, dependency boundaries, DRY, and KISS pragmatically.

## 7. App Router correctness

- `src/app/` MUST be the single routing authority. Do not add a second client routing system. [3]
- Use nested layouts, route groups, dynamic segments, parallel/intercepting routes, and templates only when user experience requires them.
- Use `next/link` for internal links and App Router `next/navigation` APIs for programmatic navigation.
- Enable `typedRoutes` when compatible with the repository and verify typed internal links. [7]
- In Next.js 16, follow asynchronous access for `params`, `searchParams`, `cookies()`, and `headers()`; do not use copied legacy synchronous patterns. [2]
- `page.tsx` and `route.ts` MUST NOT occupy the same exact route segment. Reserve route files for composition and response boundaries.
- Use `notFound()` or the documented error/control-flow mechanism for truly missing resources. Do not convert missing pages into `200` empty views.
- Use `generateStaticParams` only for routes appropriate for build-time generation, and follow the selected caching mode's specific constraints. [8]
- Do not overuse dynamic rendering, `force-dynamic`, `force-static`, or client-side redirects to mask data lifecycle defects.
- Introduce `src/proxy.ts` only when necessary for request interception. In Next.js 16, the `middleware` convention is deprecated; Proxy is Node.js-runtime request logic and MUST NOT be treated as final authorization. Keep matchers narrow and execution cheap. [2][9]
- Do not perform resource-heavy DB queries, unbounded external fetches, or entitlement decisions only in Proxy.
- A static export MUST NOT be chosen for a product that requires runtime Server Functions, protected dynamic reads, or unsupported server behavior. [10]

## 8. Server Components, Client Components, and secrets

- Use Server Components by default for page/layout composition and server data access. Add `'use client'` only at the smallest interactivity boundary. [11]
- Client Components handle events, browser-only APIs, local interactive state, and effects. Client Components may prerender on the server: guard browser APIs during rendering.
- A client boundary pulls imported modules into the client graph. Audit imported dependency size and ensure no privileged code crosses it.
- Mark sensitive server modules with `import 'server-only'`. A filename like `.server.ts` alone does not block accidental client imports. [11]
- Server-only logic MUST NOT be reexported via mixed barrels or imported into client modules. Dedicated `'use server'` action exports are an intentional remote-call exception.
- Treat all values returned to client code as exposed. Return minimal allowlisted DTOs, not complete account/tenant/database records.
- Values passed from Server Components to Client Components MUST respect React serialization rules.
- Do not access secret tokens, private credentials, signing keys, service accounts, or unrestricted privileged SDKs from browser code.
- Never use `'use server'` as a replacement for `server-only`, and never assume a Server Action is private because the file lives on the server. [4][12]

## 9. React rendering, state, and hooks

- Rendering MUST be pure and idempotent. Do not mutate props/state or perform network writes, timers, or subscriptions during render. [13]
- Obey the Rules of Hooks, including React's documented exception for the `use` API. No hooks conditionally or inside arbitrary callbacks.
- Keep state as local as practical; derive computed data instead of synchronizing redundant state via effects.
- Use effects only to synchronize with **external** systems. Clean up subscriptions, observers, timers, and listeners; handle races and stale async outcomes. [14]
- Shareable filters, sorting, search, and pagination SHOULD use URL state; preserve direct-link and browser back/forward behavior.
- Use stable item identifiers as keys. Avoid random keys or array-index keys where list identity can change.
- Keep uncontrolled/controlled form behavior deliberate. Do not mix independent sources of truth for the same value.
- Add global state only for data genuinely shared across distant consumers. Never add an application-wide store for simple local UI state.
- Add a server-state library only for a demonstrated need such as polling, mutation synchronization, or offline client caching. Avoid multiple overlapping data caches.
- Add `memo`, `useMemo`, or `useCallback` only for measured problems or a necessary identity contract. If React Compiler is enabled, follow its official rules; memoization MUST NOT be needed for correctness. [15]

## 10. Frontend/backend integration and dynamic data

- Define the source of truth for every resource. The frontend displays and mutates data through **real, authorized** backend contracts; it MUST NOT invent runtime state that should live in persistence.
- Separate DTOs, validated transport functions, and view models. Keep backend URLs, authentication, and private API credentials on the appropriate server boundary.
- For a separate backend, call it from protected server code when applicable; browser calls MUST be limited to intentionally public, browser-safe endpoints.
- Do not call the same Next.js application's Route Handler through HTTP from a Server Component; invoke the underlying service directly. [10]
- Resolve upstream base URLs and required environment values from validated configuration. No hardcoded production/staging hostnames inside feature files.
- Check `response.ok`, validate response bodies, and surface safe error states. A resolved `fetch()` promise does not imply HTTP success.
- Define finite total deadlines, abort/cancellation, payload limits, and concurrency bounds for network calls.
- Start independent requests concurrently where needed; never create avoidable serial waterfalls, N+1 fetches, or unlimited fan-out.
- Paginate, filter, and sort at the authoritative data source. Enforce maximum page sizes. Do not download an entire collection to render its first page.
- Every user-triggered write MUST be connected to real persistence and verified by the next authoritative read, not only local state updates.
- Admin-editable resources MUST render through live backend contracts, with correct authorization, validation, publishing visibility, and cache invalidation.
- When a record is created, updated, unpublished, reordered, or deleted, all affected public/admin views MUST reflect the change according to an explicit freshness contract.
- Avoid duplicate sources of truth between public routes, admin routes, server cache, query cache, and local state.
- Preserve backward compatibility when contracts are versioned, or coordinate an explicit multi-service rollout when a breaking change is required.

## 11. API entry points, actions, forms, and mutation semantics

- Use Server Functions/Actions for suitable first-party UI writes; Route Handlers for HTTP endpoints, callbacks, webhooks, and external integrations. Both require explicit security controls. [10][12]
- Keep actions and handlers thin. Put actual business decisions and data access in shared authorized server operations.
- On protected operations: identify the actor; validate inputs; authorize tenant and **specific resource**; apply quotas; execute the operation; return a minimal result.
- Hiding a button, filtering a navigation menu, or checking a layout does not authorize an action.
- Client validation is for immediate user feedback; server validation is mandatory and authoritative.
- Define form states: idle, invalid, submitting, succeeded, and failed as appropriate. Prevent meaningless repeated clicks, but do not treat disabled buttons as the primary idempotency guarantee.
- Return safe, typed field errors for expected validation failures; avoid raw stack traces or raw database errors in responses.
- Use HTTP status codes correctly for Route Handlers: e.g. `400` malformed input, `401` unauthenticated, `403` forbidden, `404` missing, `409` conflict, `422` semantic validation when appropriate, `429` rate limit, `5xx` server failure.
- Server Actions return typed results or throw as appropriate; they are **not** user-defined HTTP controllers.
- High-impact or non-repeatable writes MUST have server-side idempotency/concurrency protections. Do not rely on a single browser session.
- Optimistic updates MUST include correct rollback/reconciliation and permission/conflict handling. Never display irreversible success before authorization and authoritative completion.
- File uploads MUST validate type, actual content where relevant, byte size, ownership, storage policy, and safe file handling on the server; return a stable file reference only after acceptance.

## 12. Authentication, authorization, and session handling

- Select a maintained authentication strategy appropriate to the architecture, rather than inventing cryptographic session machinery without need. [4]
- Authentication, session validity, and authorization are separate checks. Implement all required levels.
- Authorize at the protected **data access or operation**, not only in route/UI/Proxy guards. Enforce row/resource/tenant isolation on reads and writes.
- Validate all object identifiers in context; a valid identifier owned by another tenant MUST NOT grant access.
- Scope authorization to the operation, target record, and permitted fields. Default to denial where scope cannot be verified.
- Configure session cookies with appropriate `HttpOnly`, `Secure`, `SameSite`, path, duration, and revocation/rotation behavior.
- Protect cookie-authenticated writes against CSRF according to the deployed origin model. Do not assume CORS provides authorization or CSRF prevention.
- Never persist access tokens or secrets in query strings or browser-visible instrumentation; review storage decisions against the actual threat model.
- Ensure logout, expiration, role updates, and permission revocation take effect in protected server reads/writes and relevant caches.
- Verify forbidden direct-route requests, direct action invocation, cross-account access, and expired sessions in integration/e2e tests.

## 13. Resource controls, rate limiting, and abuse prevention

- Browser debounce, disabled controls, and local storage do **not** enforce quotas. Rate limiting MUST occur at authoritative server entry points. [16]
- Use an atomic managed limiter/shared store suitable for a multi-instance deployment. A process-local `Map` is not a reliable production quota system.
- Every public or billable operation MUST have a documented policy: verified identity and/or trusted IP, burst, sustained window, concurrency, cost, and retry behavior.
- Authenticated quotas SHOULD key by verified actor plus tenant as needed; anonymous defenses can include source IP or challenge controls based on threat analysis.
- Accept forwarding headers only from explicitly trusted infrastructure. Avoid trusting arbitrary client-supplied IP headers.
- Enforce payload size, upload limits, query complexity, page size, execution time, background-job limits, and monetary cost separately.
- High-risk/paid operations MUST fail safely when the authoritative limiter is unavailable. Lower-risk read fallbacks require an explicit policy and monitoring.
- For HTTP endpoints, return `429` and a valid `Retry-After` when known. For actions, return a safe typed quota error and retry guidance.
- Test concurrent requests, expiry, quota isolation, outages, and legitimate users behind shared NATs; monitor false-positive rates.
- Add upstream infrastructure protection where supported; a frontend gateway limit cannot defend a separately reachable backend by itself.

## 14. Explicit rendering, caching, and freshness

- First record whether **Cache Components** is enabled. Next.js 16 offers different behavior and APIs depending on this setting. Never mix cache strategies casually. [17]
- For each cache, record audience/scope, key parameters, privacy, freshness window, invalidation trigger, and owning layer.
- Treat account-specific, permission-dependent, monetary, and security-sensitive data as private and **uncached/shared only by an explicitly reviewed safe mechanism**.
- With Cache Components, use supported `'use cache'`, `cacheLife`, `cacheTag`, and approved invalidation functions deliberately and only in documented scopes. [17][18]
- Do not call `cookies()`/`headers()` inside a shared cache scope contrary to the installed framework's semantics. Resolve request-dependent authority outside it.
- Revalidate the affected content after a successful write. Use `updateTag` where immediate read-after-write is required from a Server Action; use profile-based `revalidateTag` when stale-while-revalidate is acceptable. [18]
- Refreshing a client route is not proof that a server/shared cache was invalidated. Verify a subsequent independent read.
- For a separately hosted backend or CMS, define an explicit push/webhook or bounded polling/invalidation contract; frontend caches will not update automatically without one.
- Never cache a tenant's response under a public key. Include required tenant, locale, filter, and authorization dimensions for any reviewed scoped cache.
- Ensure create/update/delete, role changes, logout, unpublish, and locale changes behave correctly under the chosen caching policy.
- Never report an old balance, permission, availability, or irreversible write outcome as fresh merely to avoid an error.

## 15. Loading, empty, error, and conflict states

- Every applicable route/feature MUST implement meaningful loading, empty, validation, unauthenticated, forbidden, not-found, conflict, offline/timeout, and unexpected-error behavior.
- Use `loading.tsx`, Suspense, `error.tsx`, `global-error.tsx`, and `not-found.tsx` only in their documented locations and with actual fallback UX. [19]
- Loading boundaries MUST avoid flashing unrelated content or inaccessible interaction traps.
- Distinguish an authoritative empty result from failed retrieval. Never silently convert a server failure into a success-shaped empty response.
- Do not wrap framework `redirect()` / `notFound()` control flow in generic catches that swallow it.
- Retry only genuinely transient failures with bounded attempts, total deadline, and safe idempotency; never retry invalid credentials or non-idempotent writes automatically.
- Log operational failures once at the responsible boundary with correlation context, not raw secrets or large personal payloads.
- Present clear recovery instructions. Do not leak provider responses, stack traces, database statements, or private identifiers to users.

## 16. Security beyond authentication

- Validate all untrusted input and encode output by context. Prefer React's safe text rendering rather than raw HTML injection.
- If user-controlled rich HTML is required, sanitize through an actively maintained, appropriate sanitizer before rendering; avoid `dangerouslySetInnerHTML` by default.
- Restrict user-controlled server fetch targets to avoid SSRF. Validate protocols, destinations, redirects, and allowed hosts where relevant.
- Check external redirects against an allowlist; do not redirect to arbitrary unvalidated user-provided URLs.
- Configure Content Security Policy and other security headers for the actual script/font/image/analytics strategy. Test in production mode; do not deploy a CSP that breaks necessary functionality. [20]
- Never expose `NEXT_PUBLIC_` values that are intended to remain secret; all such variables can be bundled to the browser. [11]
- Keep `.env*` with real secrets out of source control. Commit documented examples with field names only; validate required config on startup/build as appropriate.
- Protect upload/download paths from traversal and unauthorized object access. Provide controlled signed URLs only when requirements warrant them.
- Do not log secrets, access tokens, payment details, full credentials, or excessive personal data. Configure retention and redaction.
- Maintain an explicit security review for new third-party scripts, dependencies, analytics, embeds, and authentication flows.
- No TLS downgrade, permissive security bypass, or disabled certificate verification in production.

## 17. Accessibility and interaction requirements

- Meet **WCAG 2.2 Level AA** for applicable UI and flows, using semantic HTML and proven keyboard interaction patterns. [21]
- Every interactive element MUST have an accessible name and appropriate native role; use `<button>` for actions and `<a>`/links for navigation.
- Inputs MUST have labels, correctly associated help/errors, meaningful required indicators, and sensible autocomplete semantics.
- All features MUST work by keyboard: tab order, Enter/Space activation, Escape where relevant, focus visibility, and managed focus after dialogs/navigation.
- Maintain readable contrast for text and non-text interactive affordances. Do not remove focus outlines to satisfy visual preferences.
- Handle async feedback via appropriate status announcements without excessive screen-reader noise.
- Ensure zoom, text enlargement, mobile touch targets, orientation changes, and content reflow do not hide essential functionality.
- Respect `prefers-reduced-motion`; provide an equivalent usable experience when animation is reduced.
- Use alt text for informative images and empty alt for purely decorative images; do not stuff alt text with unrelated search terms.
- Test complex widgets with real keyboard/screen-reader behavior, not only automated accessibility scanners.

## 18. Responsive layout, styling, and animation

- Preserve established design tokens, visual hierarchy, typography, theme, motion, spacing, and existing component behavior unless a change is explicitly requested.
- Define tokens for colors, typography, spacing, radius, shadows, breakpoints, and motion where repetition justifies them. Maintain one approved styling strategy.
- Develop mobile-first responsive layouts and validate small/large screens, tablet widths, touch interactions, zoom, and unusually long content.
- Avoid fixed dimensions that clip content, unintended horizontal overflow, and desktop-only hover-dependent interactions.
- Use CSS for simple transitions; use an animation library only for actual orchestration needs.
- Prefer transform/opacity over layout-affecting animation when possible. Measure animation impact on responsiveness and layout stability.
- Every animation MUST clean up timelines, observers, scroll triggers, and listeners during unmount/navigation. Do not attach duplicate handlers.
- Prevent scroll-lock leaks and interaction blocking when modals/drawers are dismissed or routes change.
- Motion and decorative effects MUST NOT hide content, interrupt text input, or make required actions impossible on lower-powered devices.
- Snapshot/visual regression checks SHOULD cover changed responsive components and key design-sensitive pages.

## 19. Search visibility, metadata, and content correctness

- For public indexable routes, generate unique, accurate page titles, descriptions, canonical URLs, and relevant social metadata from the authoritative content source. [22]
- Implement `metadata` or `generateMetadata` from Server Components; keep route metadata aligned with real published content and status.
- Publish valid `sitemap.xml` and `robots.txt` using documented Next.js conventions where relevant. Include only canonical, eligible, published, indexable URLs in sitemaps. [22]
- Use appropriate HTTP statuses for removed/unpublished resources and avoid accidental duplicate or thin indexable pages.
- Use semantic headings, descriptive anchors, logical information hierarchy, crawlable text, and genuine internal links.
- Structured data MUST match visible, verifiable page facts and the relevant vocabulary. Never fabricate reviews, prices, ratings, availability, authorship, or organizational claims.
- SEO, answer-engine clarity, and generative search visibility SHOULD come from useful, accurate content, descriptive entities, and well-structured answers—not keyword stuffing or hidden text.
- Dynamic content changes MUST update metadata, canonical URLs, structured data, links, and sitemap eligibility as required by their publication state.
- Treat search indexing and ranking as external outcomes; passing a technical checklist cannot guarantee rankings or rich results.
- Avoid blocking essential content behind browser-only rendering when server rendering is feasible.

## 20. Internationalization and translation completeness

- When multiple languages are required, design locale-aware routing, translation sourcing, formatting, and content ownership **before** translating isolated interface strings. [23]
- Support the full agreed locale set with explicit identifiers, not invented language codes or partial toggles.
- Switching language MUST update all translatable user-visible content in the covered experience: navigation, route content, buttons, forms, validation, empty/error states, notifications, metadata, alt text, and accessible labels.
- Implement deliberate translation behavior for database/CMS content. A static dictionary alone cannot translate records authored later unless a real translation workflow exists.
- Missing translation behavior MUST be explicit and approved (e.g., documented fallback locale); do not silently mix languages and call the page translated.
- Preserve route identity and the relevant page during a locale switch when translations exist; avoid always returning to the home page.
- Use correct `lang`, text direction (including RTL where applicable), locale-specific number/date/currency formatting, pluralization, and proper Unicode handling.
- Add locale-aware canonical/hreflang alternatives where applicable and keep locale variants aligned with published translations.
- Never translate proper technical identifiers, user data, credentials, or product codes unless that content is explicitly designated for translation.
- Test a representative page containing long text, forms, dynamic content, nested routes, errors, and SEO metadata for each supported locale.

## 21. Performance, payloads, images, fonts, and scripts

- Establish recorded budgets for key routes and devices: LCP, INP, CLS, client JS, transferred bytes, API latency, server latency, error rate, and expected load.
- Use Core Web Vitals good thresholds at p75 separately for mobile and desktop: **LCP ≤ 2.5 s; INP ≤ 200 ms; CLS ≤ 0.1**. [24]
- Audit the production build and real-user monitoring, not only a local development server or a single synthetic score.
- Prevent data waterfalls, excessive render work, large DOMs, unnecessary hydration, unbounded lists, unused polyfills, and high-cost dependencies.
- Keep heavy optional experiences behind an appropriate split boundary; do not disable server rendering as a universal speed fix.
- Use `next/image` where appropriate, correct aspect ratio/dimensions, responsive `sizes`, and restricted remote image domains. [25]
- In Next.js 16, `Image`'s `priority` is deprecated in favor of the documented `preload` prop. Preload only the actual critical image(s); avoid preloading every gallery or card. [25]
- Reserve image/iframe/video space to prevent layout shift. Lazy-load content that is not immediately needed without delaying the LCP element.
- Use `next/font` where suitable and ship only required faces, subsets, and weights. Avoid unplanned font shifts. [26]
- Load third-party scripts with documented script strategies; keep their consent, security, and performance impact reviewed. [27]
- Prefer pagination/virtualization for large lists where measurement warrants it. Keep initial HTML and important content usable before optional enhancements finish.
- Load-test meaningful concurrency, upstream timeout behavior, expensive reads, and authenticated cache paths before release.

## 22. Observability, operations, and failure recovery

- Production MUST record actionable error telemetry and key latency/availability metrics. Include request or correlation IDs that can trace an operation across frontend gateway and backend.
- Use structured logs with level, feature, operation, route, outcome, and safe timing. Redact sensitive values before collection.
- Monitor key API success/failure, authentication failures, quota denials, cache churn, client errors, Core Web Vitals, and critical business mutations as appropriate.
- Avoid double-reporting one error across multiple layers. Record the responsible boundary while preserving trace context.
- Establish alert thresholds based on actual baseline and impact; avoid noisy alerts with no response owner.
- Error reporting MUST reflect reality: a recovered retry is not the same as a successful first attempt, and an unhandled failure must not be logged as normal completion.
- Critical external integrations SHOULD have documented degraded-mode behavior. No invented success or silent data substitution.
- Document how to roll back a bad build, revoke compromised credentials, invalidate stale caches, and investigate a failed deployment.

## 23. Tests, quality gates, and verification

- Unit-test meaningful pure business logic and validation. Integration-test trust boundaries, API behavior, persistence contracts, access control, and failure paths.
- Browser-test critical workflows against a production-like build: navigation, auth, CRUD, responsive behavior, forms, and permission denials. [28]
- Async Server Components may not be meaningfully testable with all unit-testing tools; validate actual server rendering with browser/e2e tests where recommended. [28]
- Test loading, empty, error, timeout, retry, concurrent mutation, unauthorized actor, cross-tenant access, and cache invalidation when they are relevant.
- For a bug fix, add or adapt a regression check that fails for the original bug before declaring completion.
- Keep fixtures, test-only credentials, mocked services, and preview seed data completely isolated from production paths.
- UI tests MUST verify user-visible outcomes, not private implementation details; avoid fragile full-page snapshot suites with little behavioral coverage.
- Run automated accessibility checks and targeted manual keyboard tests for changed flows.
- Check production browser console for hydration mismatches, JavaScript errors, failed requests, and accessibility defects.
- Never claim a test passed if it was skipped, did not run, used a different environment, or failed intermittently without resolution.

## 24. CI: merge-blocking commands and policy enforcement

- CI MUST use a clean environment, frozen lockfile, pinned supported runtime, and real package scripts; local success alone is insufficient.
- Require, in order compatible with the project: **dependency install → formatting → lint → file-length check → route type generation where required → TypeScript check → unit/integration tests → production build → smoke/e2e tests → security checks**.
- In Next.js 16, `next lint` is removed and `next build` no longer performs lint. Run ESLint or another explicitly selected linter in a dedicated CI step. [2]
- ESLint SHOULD include framework Core Web Vitals guidance, React Hooks rules, TypeScript integration, import boundaries, unused-code checks, and `max-lines`.
- Run the equivalent of `eslint . --max-warnings 0`; never allow a growing warning baseline to become invisible technical debt.
- Type errors, lint failures, test failures, unexpected hydration errors, build failures, exposed secrets, and authorization regressions BLOCK merges/releases.
- Keep the `max-lines` cross-format check and dependency boundary checks executable in CI, not just written in this document.
- Generate typed routes before stand-alone `tsc --noEmit` if the installed version/project configuration needs it.
- CI scripts MUST correspond to installed tooling. Do not copy generic commands into the repository without verifying they execute successfully.
- Never turn off type checks, security checks, lint rules, or tests solely to make the pipeline green.
- Enforce branch protections/review requirements at the source-host level when available; code policy alone cannot enforce repository permissions.

### Minimum required script contracts

The repository MUST provide scripts that implement these capabilities, though the exact command names/tool choices may differ:

```text
format:check    Verify formatting without editing files
lint            Lint authored code; fail on warnings
check:lines     Enforce <=300 authored physical lines
check:boundaries Verify feature/shared/server import restrictions
typecheck       Generate framework types if needed, then run TypeScript
test            Run maintained unit/integration tests
build           Produce a production Next.js build
test:e2e        Run critical journeys against production-like server
verify          Run the applicable required checks and fail fast
```

- The preceding block describes contracts; it is **not** a claim that these scripts exist in any current repository.
- Do not invent a passing CI report. Publish actual command outputs or a concise record of executed results and reasons for any omissions.

## 25. Environment, deployment, and rollback

- Keep separate development, test, staging, and production configuration. Use least-privilege secrets and explicitly documented environment variables.
- Validate environment schemas before serving requests; fail clearly when a required server config is missing rather than silently using a local default.
- Verify deployment supports the selected rendering, networking, streaming, cache sharing, execution limits, and background-work requirements. [10]
- Avoid writing durable state to an ephemeral Next.js instance or relying on in-process memory across deployments.
- Verify production URLs, session domains/cookie settings, trusted proxy behavior, CORS, CSP, image sources, API base URL, and rewrite rules.
- Define readiness/health monitoring where supported, including critical dependency health interpreted separately from route availability.
- Run smoke tests after deployment: direct route load, reload, redirect, auth, one read, one permitted write where safe, cache refresh, metadata, and representative responsive path.
- Release behind a rollback-capable deployment strategy. For database/API schema changes, plan forward/backward compatibility across the rollout.
- If a production incident occurs, prioritize containment and recovery, capture evidence, then add a regression check and update this standard when needed.
- Never assert zero defects, infinite scalability, guaranteed search ranking, or unlimited throughput; demonstrate measured behavior against defined requirements.

## 26. Mandatory workflow for coding assistants and reviewers

1. **Inspect before editing:** Read the relevant route, feature, tests, config, dependency versions, established UI styles, API schemas, and related behavior.
2. **Define acceptance criteria:** State what must work, which data is authoritative, who may access it, the failure states, and the measurement/testing approach.
3. **Verify official semantics:** For uncertain or version-sensitive APIs, read the exact installed-version documentation. Do not use outdated snippets.
4. **Trace the full path:** UI → validation → auth → action/endpoint → backend/data → cache invalidation → UI reconciliation.
5. **Implement the smallest complete vertical slice:** No speculative scaffolding, simulated backends, unrelated restyling, or destructive rewrites.
6. **Review security and performance:** Check server/client boundaries, tenant checks, rate limits, resource budgets, duplicate requests, and PII exposure.
7. **Inspect all impacted states:** Success, invalid input, empty, loading, unavailable backend, forbidden, not-found, race conditions, and direct URL visits.
8. **Run relevant checks:** Lint, format, typecheck, length, tests, build, browser validation, and any feature-specific security/performance tests.
9. **Review the actual diff:** Remove dead code and redundant dependencies; confirm imports and filenames, 300-line limit, backward compatibility, and minimal scope.
10. **Report facts only:** Summarize changed files, behavior, exact verification performed, known limitations, and any unresolved blocker. Never say “complete” while required behavior remains simulated or unverified.

## 27. Blocking release checklist

A change is **NOT PRODUCTION READY** if any applicable requirement below is false:

- [ ] It implements the real acceptance criteria without runtime placeholders or fabricated success.
- [ ] Frontend, backend, database, and admin-facing flows are connected where required.
- [ ] Every protected read/write validates the actor, resource, and tenant at the authoritative boundary.
- [ ] Required schemas, rate limits, CSRF protections, payload constraints, and idempotency are active.
- [ ] Server-only secrets and sensitive DTO fields do not reach the browser.
- [ ] Success, empty, loading, invalid, forbidden, not-found, failure, and conflict states work where applicable.
- [ ] Cache privacy, expiration, revalidation, and admin/CMS edit reflection are proven.
- [ ] Route metadata, canonical tags, indexing eligibility, structured data, and translated content are accurate where applicable.
- [ ] Interactions are responsive, keyboard accessible, and do not introduce damaging motion/CLS.
- [ ] Every hand-authored file is at most 300 physical lines; naming, imports, and dependency boundaries conform.
- [ ] Format, lint (zero warnings), TypeScript, required tests, and production build pass.
- [ ] Critical direct-navigation flows pass in a real browser with no significant console/hydration errors.
- [ ] Security and performance risks introduced by this change were checked and measured as required.
- [ ] Deployment configuration, production smoke tests, monitoring, and rollback are prepared or verified as applicable.
- [ ] The implementation report identifies actual changed behavior, executed checks, and remaining limitations.

## 28. Official documentation and standards

> Documentation below supports framework/platform facts. The naming policy, feature organization, 300-line cap, mandatory scripts, and release gates are intentionally stricter **local engineering standards**.

1. [Next.js production checklist](https://nextjs.org/docs/app/guides/production-checklist)
2. [Next.js version 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
3. [Next.js project structure](https://nextjs.org/docs/app/getting-started/project-structure)
4. [Next.js authentication and authorization](https://nextjs.org/docs/app/guides/authentication)
5. [ESLint `max-lines` rule](https://eslint.org/docs/latest/rules/max-lines)
6. [TypeScript `strict` compiler option](https://www.typescriptlang.org/tsconfig/strict.html)
7. [Next.js typed routes](https://nextjs.org/docs/app/api-reference/config/next-config-js/typedRoutes)
8. [Next.js `generateStaticParams`](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
9. [Next.js Proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)
10. [Next.js backend-for-frontend guide](https://nextjs.org/docs/app/guides/backend-for-frontend)
11. [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
12. [Next.js mutations](https://nextjs.org/docs/app/getting-started/mutating-data)
13. [Rules of React](https://react.dev/reference/rules)
14. [React: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
15. [Next.js React Compiler config](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler)
16. [OWASP API resource consumption controls](https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/)
17. [Next.js caching and Cache Components](https://nextjs.org/docs/app/getting-started/caching)
18. [Next.js revalidation](https://nextjs.org/docs/app/getting-started/revalidating)
19. [Next.js error handling](https://nextjs.org/docs/app/getting-started/error-handling)
20. [Next.js Content Security Policy](https://nextjs.org/docs/app/guides/content-security-policy)
21. [W3C WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/)
22. [Next.js metadata and OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
23. [Next.js internationalization](https://nextjs.org/docs/app/guides/internationalization)
24. [Core Web Vitals](https://web.dev/articles/vitals)
25. [Next.js Image component](https://nextjs.org/docs/app/api-reference/components/image)
26. [Next.js font optimization](https://nextjs.org/docs/app/getting-started/fonts)
27. [Next.js Script component](https://nextjs.org/docs/app/api-reference/components/script)
28. [Next.js testing overview](https://nextjs.org/docs/app/guides/testing)

---

**Final decision rule:** If behavior is incomplete, privileged access is unverified, data is fabricated, an expected failure is hidden, or a required verification has not run, **do not mark the change production-ready**.
