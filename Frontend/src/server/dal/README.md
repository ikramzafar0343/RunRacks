# Data Access Layer (reserved)

This folder is intentionally empty for now.

**Later:** put authorized database reads/writes here (queries, permission checks, safe DTOs).

**Rules of thumb:**

- Import `server-only` in DAL modules.
- UI / Client Components must not talk to the DB directly — call Server Actions or Route Handlers that use the DAL.
- Do not add fake/mock repositories that pretend data was saved.
