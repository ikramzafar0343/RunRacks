# Database (docs & preservation)

This folder is **not** a second migration runner. Applied SQL lives under [`Backend/migrations/`](../Backend/migrations/).

| Path | Purpose |
| --- | --- |
| `inventory/` | What Frontend owns today that must not be lost |
| `schema/` | Human ER / WHMCS id mapping notes |
| `seeds/` | Exported snapshots before any Frontend cutover |

**Authority:** WHMCS is system of record for customers, services/access, pricing, orders, and billing. Postgres holds synced read models, marketing content, contact rows, and idempotency — never a rival price book or customer directory.
