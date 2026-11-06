# Production capability evidence

Honest map of the ten audited areas. **Mitigation present ≠ absolute immunity.** Numbers only from measured drills.

| Area | Implemented mechanism | How to verify | Still NOT_CONFIGURED until |
| --- | --- | --- | --- |
| Circuit breakers | `Backend/src/platform/circuitBreaker.ts` wraps WHMCS calls; open ≠ fake success | `npm test` in Backend; `/ready` lists breaker state | N/A for local; production WHMCS still needs credentials |
| Kubernetes | Dockerfiles + `deploy/k8s/*` | `kubeconform -strict deploy/k8s/` | A real cluster apply |
| Database replication | Compose primary + streaming replica | `node Backend/scripts/check-replica.mjs` | Managed cloud replicas / failover runbook ownership |
| Signing-key rotation | HMAC dual-secret (`SESSION_HMAC_SECRET` + `_PREVIOUS`) — **not JWT** | `session.rotation.test.ts` | Ops rotation calendar in each environment |
| Distributed tracing | W3C `traceparent` + optional OTLP/HTTP export | Set `OTEL_EXPORTER_OTLP_ENDPOINT`; see Jaeger | Exporter endpoint in production |
| Security | Parameterized SQL, Helmet CSP, CSRF origin check, WHMCS https-in-prod | `csrf.ssrf.test.ts` | Continuous threat review; **no “immune” claims** |
| Disaster recovery | `scripts/dr/backup.sh` + `restore-drill.sh` | Evidence: `ops/evidence/dr-last-drill.json` | Measured RPO/RTO from last drill only — not fixed SLAs |
| Performance | `perf/k6/*` | Evidence: `ops/evidence/perf-last-run.json` | Publish P99 / first-token only from that artifact |
| CI/CD | `backend-ci.yml` + `ops-readiness.yml` | Workflow green | Green CI ≠ production deploy |
| Monitoring | `/metrics`, Prometheus/Alertmanager compose, alert drill | `scripts/ops/alert-drill.mjs` | `ALERT_WEBHOOK_URL` for real delivery |

## Session HMAC rotation procedure

1. Set `SESSION_HMAC_SECRET_PREVIOUS` to the current secret.
2. Set `SESSION_HMAC_SECRET` to the new ≥32-char secret.
3. Roll Backend pods / processes.
4. After cookie TTL (7d customer / 14d AI guest), clear `SESSION_HMAC_SECRET_PREVIOUS`.

## Non-claims

- Returning HTTP 503 for missing config is **not** a circuit breaker by itself.
- Container images are **not** proof a Kubernetes cluster is running.
- PostgreSQL WAL capability is **not** proof replicas exist — Compose replica + smoke is the local proof.
- HMAC cookies are **not** JWTs.
- `x-request-id` alone is **not** full distributed tracing — OTLP export completes the path when configured.
- Passing tests is **not** production deployment readiness without the ops-readiness evidence artifacts.
