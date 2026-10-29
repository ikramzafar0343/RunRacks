# RunRacks Frontend

Next.js App Router frontend for RunRacks.

## Scripts

```bash
npm run dev
npm run verify
```

`verify` runs lint, line-count, typecheck, and production build.

## Fonts

Nourd loads from `src/styles/fonts/` via `next/font/local` and is the site-wide typeface.

## Backend seams

- `GET /api/health` — frontend process health
- `GET /api/v1/ready` — returns 503 until `DATABASE_URL` and `BACKEND_API_BASE_URL` are configured

See `.env.example` for variable names only.
