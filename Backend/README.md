# RunRacks Backend

Fastify + TypeScript + PostgreSQL. Policy: [`../Rules/NODEJS_POSTGRESQL_BACKEND_PRODUCTION_RULES.md`](../Rules/NODEJS_POSTGRESQL_BACKEND_PRODUCTION_RULES.md).

**WHMCS** is system of record for customers, server access, pricing, orders, and billing. This service orchestrates and caches — it does not invent prices or access.

## Scripts

```bash
pnpm install
pnpm dev
pnpm migrate
pnpm typecheck
```

## Env

Copy `.env.example` → `.env`. Without `DATABASE_URL` / WHMCS credentials, mutating and live catalog routes return `503 NOT_CONFIGURED` (never fake success).
