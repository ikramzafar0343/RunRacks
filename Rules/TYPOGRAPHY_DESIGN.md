# Typography design — RunRacks (Sage & Ink)

Portable reference for copying this type system into another project.  
Source of truth in this repo: `Frontend/src/styles/fonts.ts`, `Frontend/src/styles/tokens.css`, `Frontend/src/app/globals.css`, `Frontend/src/app/layout.tsx`.

---

## 1. Brand rule

| Rule | Detail |
|------|--------|
| **One family** | **Nourd** only — body, UI, and headings |
| **Do not use** | Inter, Geist, Roboto, Arial, system UI stacks, or decorative display fonts as primary type |
| **Antialiasing** | `antialiased` on `<html>` |
| **Default body** | `font-sans` + `text-body` on `<body>` |

Nourd is a soft geometric sans. Hierarchy comes from **weight, size, tracking, and color** — not a second typeface.

---

## 2. Font files & weights

Files live under `Frontend/src/styles/fonts/` (prefer **WOFF2** in production).

| File | CSS weight | Typical use |
|------|------------|-------------|
| `nourd_light.woff2` | **300** | Large airy headlines, footer wordmarks, light display moments |
| `nourd_regular.woff2` | **400** | Body copy, nav links, default UI |
| `nourd_medium.woff2` | **500** | Brand wordmark, section titles (moderate emphasis) |
| `nourd_semi_bold.woff2` | **600** | CTAs, labels, card titles, strong UI chrome |
| `nourd_bold.woff2` | **700** | Primary heroes, page H1s, featured titles |
| `nourd_heavy.ttf` | *(source only)* | Not loaded via `next/font` today — keep as source asset |

**Weight map (Tailwind):**

| Class | Weight |
|-------|--------|
| `font-extralight` / custom 300 | 300 |
| `font-normal` | 400 |
| `font-medium` | 500 |
| `font-semibold` | 600 |
| `font-bold` | 700 |

---

## 3. Loading (`next/font/local`)

Two local faces, both Nourd:

1. **`nourd`** — full weight range → CSS var `--font-nourd`  
   - `preload: false` (avoids unused-weight preload warnings)
2. **`nourdHeading`** — bold only → CSS var `--font-nourd-heading`  
   - `preload: true` (LCP hero titles often use 700)

```ts
// styles/fonts.ts (pattern)
import localFont from "next/font/local";

export const nourd = localFont({
  src: [
    { path: "./fonts/nourd_light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/nourd_regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/nourd_medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/nourd_semi_bold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/nourd_bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-nourd",
  display: "swap",
  preload: false,
});

export const nourdHeading = localFont({
  src: [{ path: "./fonts/nourd_bold.woff2", weight: "700", style: "normal" }],
  variable: "--font-nourd-heading",
  display: "swap",
  preload: true,
});
```

**Root layout:**

```tsx
<html className={`${nourd.variable} ${nourdHeading.variable} h-full antialiased`}>
  <body className="min-h-full flex flex-col font-sans bg-canvas text-body">
```

---

## 4. CSS / Tailwind bridge

In `globals.css` `@theme inline`:

```css
--font-sans: var(--font-nourd), ui-sans-serif, sans-serif;
--font-heading: var(--font-nourd-heading), var(--font-nourd), ui-sans-serif, sans-serif;
--font-display: var(--font-nourd-heading), var(--font-nourd), ui-sans-serif, sans-serif;
```

| Utility | Resolves to |
|---------|-------------|
| `font-sans` | Full Nourd stack (default everything) |
| `font-heading` / `font-display` | Bold face first, then full Nourd |

**Feature CSS** that does not use Tailwind should still bind:

```css
font-family: var(--font-nourd), ui-sans-serif, sans-serif;
/* or */
font-family: var(--font-nourd), system-ui, sans-serif;
```

---

## 5. Text color roles (semantic)

From `tokens.css` — always use these, not raw hex in components.

| Token | Light | Dark | Role |
|-------|-------|------|------|
| `--color-heading` | `#20372f` | `#f3f6f0` | Titles, brand, strong labels |
| `--color-body` | `#35463d` | `#e1e9e1` | Default paragraph / UI text |
| `--color-muted` | `#5c6b62` | `#b7c8bc` | Secondary, leads, meta, placeholders |
| `--color-brand` | `#34745a` | `#8dd1ac` | Links, accents, active nav |
| `--color-brand-contrast` | `#ffffff` | `#15251f` | Text on brand fills |
| `--color-on-lime` | `#082615` | `#082615` | Text on lime CTA press |

**Tailwind helpers:** `text-heading`, `text-body`, `text-muted` / `text-muted-foreground`, `text-brand`, `text-brand-contrast`, `text-on-lime`.

Opacity variants used often: `text-body/75`, `text-body/80`, `text-body/85`, `text-heading/90`.

---

## 6. Type roles (how to use it)

### A. Eyebrow / kicker

Small uppercase label above a section title.

| Property | Value |
|----------|--------|
| Size | `0.75rem` – `0.8rem` (sometimes `text-xs`) |
| Weight | **600** |
| Tracking | **`0.08em` – `0.25em`** (journal ~`0.12em`; story cards up to `0.2em`) |
| Case | `uppercase` |
| Color | `brand` or `muted` |

Example (blog): “THE JOURNAL” · `0.75rem / 600 / 0.12em / brand`.

### B. Display / hero H1

One dominant title in the first viewport.

| Property | Value |
|----------|--------|
| Size | Prefer **`clamp()`** or stepped Tailwind: ~`text-4xl` → `lg:text-[68px]` |
| Weight | **700** (heroes) or **600** (marketing sections) or **300** (airy large display) |
| Tracking | **`-0.03em` to `-0.045em`** (tight) |
| Line height | **`1.05` – `1.12`** |
| Color | `heading` |
| Balance | `text-balance` when multi-line |

Examples in product:

- Pricing hero: `tracking-[-0.045em] leading-[1.05] font-medium` up to `68px`
- Blog intro: `clamp(2.25rem, 5vw, 3.5rem)` / 700 / `-0.03em`
- Static pages: `text-3xl md:text-4xl font-medium tracking-tight text-heading`

### C. Section H2

| Property | Value |
|----------|--------|
| Size | ~`1.35rem` – `clamp(1.75rem, 3.6vw, 2.75rem)` or `text-3xl sm:text-4xl` |
| Weight | **600–700** |
| Tracking | `-0.02em` to `-0.035em` |
| Color | `heading` |
| Optional | `font-heading` when you want the preloaded bold face |

### D. Card / article title (H3)

| Property | Value |
|----------|--------|
| Size | ~`1.1rem` – `1.2rem` (cards); featured up to `clamp(1.6rem, 3vw, 2.15rem)` |
| Weight | **700** |
| Tracking | `-0.02em` on larger cards |
| Color | `heading` → `brand` on hover |

### E. Lead / supporting sentence

One short line under the title.

| Property | Value |
|----------|--------|
| Size | `clamp(1.05rem, 2vw, 1.2rem)` or `text-base` → `md:text-xl` |
| Weight | **400** |
| Tracking | normal (or slight tight on dense UI) |
| Color | `muted` or `text-body/80`–`/85` |
| Max width | Often `max-w-2xl` / `~40–42rem` |

### F. Body / reading

| Property | Value |
|----------|--------|
| Size | **`1.05rem`** reading column; UI body **`0.875rem`–`1rem`** |
| Weight | **400** |
| Line height | **`1.55`–`1.7`** (reading); ~`1.35`–`1.5` (UI) |
| Color | `body` |

Article H2 in body: ~`1.45rem` / 700 / `-0.02em` · Article H3: ~`1.15rem` / 700.

### G. Meta / timestamps / category chips

| Property | Value |
|----------|--------|
| Size | `0.78rem` – `0.8rem` |
| Weight | **600** |
| Tracking | **`0.04em`** |
| Case | `uppercase` |
| Color | `muted` |

### H. Nav & chrome

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Header links | `0.9375rem` | 400 | `heading` → hover `brand` |
| Dropdown items | `0.9rem` | 400 | `body` |
| Header AI CTA | `0.875rem` | **600** | `brand-contrast` on brand fill |
| Brand wordmark | `1.25rem`–`1.5rem` | **500** | `heading`, tracking `-0.02em` |

### I. Footer

| Element | Treatment |
|---------|-----------|
| Giant watermark | Huge clamp size, **700**, uppercase, wide tracking ~`0.04em` |
| Column titles | ~`0.95rem` / **700** / slight negative tracking |
| Links / legal | `0.8rem`–`0.875rem` / 400 |

### J. Buttons / CTAs

| Property | Value |
|----------|--------|
| Weight | **600** |
| Size | ~`0.875rem`–`0.95rem` |
| Color | brand fill + contrast, or lime press (`on-lime`) |

---

## 7. Tracking cheat sheet

| Intent | Letter-spacing |
|--------|----------------|
| Hero / display | `-0.03em` … `-0.045em` |
| Section titles | `-0.02em` … `-0.035em` |
| Body | `0` / `normal` |
| Meta / uppercase labels | `+0.04em` … `+0.12em` |
| Extreme kickers (story) | up to `+0.2em`–`0.25em` |
| Footer spaced wordmark | large positive (e.g. `0.55em` on small lowercase marks) |

Tailwind: `tracking-tight` ≈ `-0.025em`; prefer explicit `tracking-[-0.03em]` for heroes.

---

## 8. Responsive sizing pattern

Prefer **one of**:

1. **`clamp(min, preferred, max)`** in feature CSS (blog, footer, AI CTA)
2. **Stepped Tailwind** — `text-4xl sm:text-5xl md:text-6xl lg:text-[68px]`

Avoid fixed large `px` sizes without a mobile step.

---

## 9. Do / don’t

**Do**

- Keep Nourd everywhere (`font-sans` default)
- Use semantic text colors (`heading` / `body` / `muted` / `brand`)
- Tighten tracking on large titles; open tracking on uppercase meta
- One H1 per page; support with a single short lead
- Respect `prefers-reduced-motion` (type itself doesn’t animate; related UI may)

**Don’t**

- Introduce a second brand font for “display”
- Mix Inter / system UI for “just this component”
- Use pure black / pure white for long body text (use tokens)
- Rely on weight alone without size/tracking for hierarchy
- Put heavy uppercase + tight tracking on long paragraphs

---

## 10. Quick port checklist

1. Copy WOFF2 files → `src/styles/fonts/`
2. Copy `fonts.ts` pattern → expose `--font-nourd` + `--font-nourd-heading`
3. Apply both `.variable` classes on `<html>`
4. Map `@theme` `--font-sans` / `--font-heading` / `--font-display`
5. Set body: `font-sans` + `text-body` + canvas background
6. Port text color tokens (`heading`, `body`, `muted`, `brand`, …)
7. Reuse the role table above for new screens

---

## 11. Minimal CSS starter (non-Tailwind)

```css
:root {
  --font-sans: var(--font-nourd), ui-sans-serif, sans-serif;
  --color-heading: #20372f;
  --color-body: #35463d;
  --color-muted: #5c6b62;
  --color-brand: #34745a;
}

body {
  font-family: var(--font-sans);
  font-weight: 400;
  color: var(--color-body);
  -webkit-font-smoothing: antialiased;
}

.eyebrow {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-brand);
}

.h1 {
  font-size: clamp(2.25rem, 5vw, 3.5rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.08;
  color: var(--color-heading);
}

.lead {
  font-size: clamp(1.05rem, 2vw, 1.2rem);
  font-weight: 400;
  line-height: 1.55;
  color: var(--color-muted);
}

.meta {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-muted);
}
```

---

## 12. Where it shows up in this repo

| Area | Path hints |
|------|------------|
| Font load | `Frontend/src/styles/fonts.ts` |
| Tokens | `Frontend/src/styles/tokens.css` |
| Theme bridge | `Frontend/src/app/globals.css` |
| Layout apply | `Frontend/src/app/layout.tsx` |
| Header / footer | `Frontend/src/shared/ui/site-*.css` |
| Blog type | `Frontend/src/features/blog/components/blog*.css` |
| Heroes | `Frontend/src/components/ui/hero-1.tsx`, product/home feature CSS |
| Cursor rule | `.cursor/rules/frontend-fonts-styling.mdc` |

---

*Last aligned with the RunRacks Frontend Nourd + Sage & Ink setup. Swap brand colors if needed; keep the weight/tracking roles intact for the same voice.*
