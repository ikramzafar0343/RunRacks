# Blog article detail — production design contract

Primary route: `/blog/[slug]`  
Component family: article detail only (extend `Frontend/src/features/blog/`)  
Visual direction: Premium editorial, clean typography, deliberate whitespace, readable long-form.

## Locked product decisions

- Reuse existing blog feature; no parallel `components/blog-detail/` tree.
- Author byline is **RunRacks** (Organization). Do not invent Person authors or author archives.
- Tags render as non-link chips when present (no `/blog/tag/` routes).
- No reading-progress bar (site has no existing progress UI).
- No Support CTA on article detail (reading-first).
- No invented article prose; omit optional modules when data is missing.

## Page structure

1. Global header  
2. Breadcrumbs: Home / Blog / Category / Current article  
3. Article header: category · dates · read time → H1 → deck → author  
4. Featured image (omit if missing)  
5. Reading layout: left sticky TOC (desktop) + main column (~720px)  
6. End: tags → share → author profile → back to blog  
7. Related: “You may also like” (3–4 real cards) or omit  
8. Global footer  

## Layout targets

| Token | Desktop | Tablet | Mobile |
|-------|---------|--------|--------|
| Outer max | 1240px | 100% | 100% |
| Side gutter | 48px | 32px | 20px (16px @320) |
| Header max | ~980px | ~860px | 100% |
| Body width | 720px | 680–720px | 100% |
| TOC rail | 208–232px left sticky | Collapsible | Collapsible |
| Cover | 16:9, ~1000–1120px | full gutters | full gutters |

## Typography (Sage & Ink tokens)

Use `--color-heading`, `--color-body`, `--color-muted`, `--color-brand`, `--color-border` only.

| Element | Desktop | Mobile | Weight / LH |
|---------|---------|--------|-------------|
| Breadcrumb | 13–14px | 12–13px | 400–500 / 1.5 |
| Category | 12–13px | 12px | 600–700 |
| Meta | 13–14px | 12–13px | 400–500 |
| H1 | 48–58px | 32–38px | 700 / 1.08–1.16 |
| Deck | 19–21px | 16–18px | 400–500 / 1.55–1.65 |
| Body | 17–18px | 16–17px | 400 / 1.75–1.85 |
| H2 | 30–34px | 25–28px | 700 / 1.2–1.3 |
| H3 | 23–26px | 20–22px | 600–700 |
| TOC links | 13–14px | 14px | 400–600 |

Large headings may use `letter-spacing: -0.02em`. Body left-aligned, never justified.

## Behavior

- TOC from real H2/H3; omit if fewer than 2 headings.
- Sticky TOC below site header; native `#` anchors; scroll-spy `aria-current="location"`.
- Mobile TOC: disclosure after cover; collapse after follow; respect reduced motion.
- Share: copy canonical URL + platform intents; working controls only.
- Related: same category first, fill by recency; exclude self; omit if empty.
- Unpublished slug → hard 404.
- SSR content + metadata; JSON-LD BlogPosting + BreadcrumbList matching visible content.

## Anti-patterns

No second header/footer, no full-bleed 1100px body, no shadowed article card, no fake stats, no invented related posts, no new fonts/palette, no marketing clutter on the reading surface.
