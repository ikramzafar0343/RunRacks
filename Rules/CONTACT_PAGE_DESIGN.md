# Contact page — design contract (RunRacks)

Route: `/contact`  
Stack: Next.js App Router, Tailwind + scoped CSS  
Fonts: **Nourd** (project standard)  
Colors: Sage & Ink `--color-*` tokens

## Competitive audit (inputs)

| Source | Take | Skip |
|--------|------|------|
| Hostinger `/contacts` | “How can we help?” channel grid | Invented offices; promo ticker |
| hosting.com `/about/contact/` | Clear hero promise; trust next to support | Fake phone/live chat; testimonial wall |
| WaseerHost `/contact` | Form + channels + contact FAQ | Fake address/phone; claim ticket delivery without backend |

## Locked product decisions

- No invented offices, phone numbers, emails, staff quotes, or awards.
- Channels use **real App Router destinations** only (`/contact` form anchor, `/ai`, `/pricing`, `/products/vps`).
- Form is real UI; **MUST NOT** claim message sent until mail/backend transport succeeds.
- Until intake is wired: `POST /api/v1/contact` returns **503** + `NOT_CONFIGURED`; UI states that plainly.
- Reuse global header/footer. There is no `/get-started` route; plan CTAs go to `/pricing` as **View plans**.
- Footer “Contact us” and Support CTA “Let’s talk” point to `/contact`.

## Section order

1. Hero — Contact RunRacks (brand-forward) + form / View plans CTAs  
2. Channel grid — engineers (form), AI chat, plans, report-issue (form topic)  
3. Message form — name, email, topic, message  
4. Contact FAQ — `FaqSection` content override  
5. Closing support band — `SupportCtaSection`  
6. Existing footer  

## Form contract

| Field | Rules |
|-------|--------|
| name | required, 2–80 chars |
| email | required, valid email |
| topic | required enum: `engineers` \| `plans` \| `migration` \| `abuse` \| `other` |
| message | required, 20–4000 chars |

States: idle → validating → pending → `validation` errors inline → `NOT_CONFIGURED` banner → (future) success only after real send.

## Motion & media

- Hero: GSAP intro timeline + ScrollTrigger scrub parallax + Observer tilt on media; atmospheric wash/orbs.
- Channels: ScrollTrigger enter/reverse stagger + per-card image scrub; Observer pointer tilt (VPS USA why-cards pattern).
- Form band: ScrollTrigger split enter + media scrub + Observer tilt on portrait.
- FAQ: ScrollTrigger.batch item reveals.
- Content stays visible under `prefers-reduced-motion`; image alts stay honest (demo / not verified staff).

## Component reuse

| Need | Reuse |
|------|--------|
| Channel cards | Support CTA card rhythm + Sage tokens + Next/Image |
| Form actions | `Button` (`src/components/ui/button.tsx`) |
| Field chrome | BlogSearch / customize input patterns |
| Scroll reveal | About `Reveal` |
| FAQ | `FaqSection` + `FaqAccordionItem` |
| Closing band | `SupportCtaSection` |
| Layout rhythm | About `--about-*` / contact scoped max-width pad |
