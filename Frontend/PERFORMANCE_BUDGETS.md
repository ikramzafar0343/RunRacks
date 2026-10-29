# Performance budgets (Core Web Vitals)

Targets for key routes. Measure against a **production** build (`npm run build && npm run start`), not `next dev`.

| Route | LCP (p75) | INP (p75) | CLS (p75) | Soft transfer cap (document + critical path) |
|-------|-----------|-----------|-----------|-----------------------------------------------|
| `/` | ≤ 2.5 s | ≤ 200 ms | ≤ 0.1 | ≤ 1.2 MB first viewport (gzip) |
| `/products/vps` | ≤ 2.5 s | ≤ 200 ms | ≤ 0.1 | ≤ 1.4 MB |
| `/products/windows` | ≤ 2.5 s | ≤ 200 ms | ≤ 0.1 | ≤ 1.4 MB |

## Delivery notes

- `next.config.ts` sets `compress: true` (gzip for `next start`). Prefer edge **Brotli** at the reverse proxy/CDN when deployed.
- Public rasters and WOFF2 fonts are produced by `npm run optimize:assets` (wired via `prebuild`).
- `/_next/static` is immutable-cached; `/images`, `/home`, `/brands`, `/flags` use SWR cache headers.
- Demo catalog/stats/stories remain labeled demo until backend readiness is real (`/api/v1/ready` stays 503).

## How to measure

1. `npm run build && npm run start`
2. Chrome DevTools → Lighthouse (mobile + desktop) or WebPageTest on the three routes.
3. Confirm `Content-Encoding: gzip` on HTML/JS and long `Cache-Control` on `/_next/static/*`.
