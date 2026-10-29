# Header reference audit

**Reference:** https://www.greentechagency.com/  
**Inspected:** 2026-10-19 (live browser + DevTools)  
**RunRacks adaptation:** wordmark + plain “About” text only (no links/buttons this sprint)

## Verified measurements

| Property                          | Desktop (~1440×900)                                                     | Mobile (~390×844)                                    |
| --------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------- |
| Position                          | `fixed`, top 0, z-index ~1200                                           | same                                                 |
| Height                            | ~77px                                                                   | ~64px                                                |
| Background @ scroll 0 / 200 / 600 | Transparent (`rgba(0,0,0,0)`); no shrink, no solid fill, no shadow      | Transparent bar                                      |
| Inner horizontal padding          | ~100px                                                                  | ~33px                                                |
| Logo area                         | Left; image ~102×54 + wordmark                                          | Left; ~136×39 combined                               |
| Nav placement                     | Center-right cluster                                                    | Hidden; hamburger instead                            |
| Nav type (reference)              | ~15px, weight ~250, white, brand font                                   | Drawer labels                                        |
| Collapse                          | Desktop nav from ~1200px width; hamburger below                         | Open menu 44×44, `aria-controls="mobile-navigation"` |
| Mobile open                       | Right drawer, `role="dialog"`, panel ~`#0C1C26`, `body` overflow hidden | —                                                    |

## Live reference navigation (not the design-doc list)

Desktop: **About · Services** (mega menu) **· Insights · Contact** + right pill **Portfolio**.

`HEADER_DESIGN.md` listed Home / About / Services / Contact / Blog / Careers. That list was **not** what the live header showed. Layout/behavior follow inspection; RunRacks content follows product lock.

## Hover / submenu (reference only)

- Synthetic hover on About did not show a clear color change in automation; exact `:hover` style treated as **unverified** beyond white default.
- Services opens a large mega-menu overlay — **not** implemented for RunRacks (no local service hierarchy).

## RunRacks this sprint (deliberate variations)

- Nourd text wordmark **RunRacks** (no logo asset yet); not a link.
- Only plain text **About** in `<nav>` — no `next/link`, no CTA, no hamburger/drawer.
- Sage & Ink `text-heading` / `text-body` (not white-on-light); transparent fixed bar kept.
- Proportions: ~4.8rem desktop / ~4rem mobile height; gutters via `clamp` ~33px → ~100px.

## Deferred until real nav exists

- Home link on wordmark, About route, other items, Portfolio CTA, Services mega menu, mobile drawer, focus trap, scroll lock.
