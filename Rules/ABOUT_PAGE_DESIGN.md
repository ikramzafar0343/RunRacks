# About Us page — design contract (RunRacks)

Route: `/about`  
Stack: Next.js App Router, Tailwind + scoped CSS, GSAP ScrollTrigger  
Fonts: **Nourd** (project standard — not Sora/Manrope)  
Colors: Sage & Ink `--color-*` tokens (map from design `--rr-*`)

## Locked product decisions

- No invented metrics, offices, staff quotes, or awards.
- Capability strip uses verified qualitative themes only (no count-up fakes).
- Team/stories: function cards + brand principles; image alts must not claim employee identity.
- CTAs: `/pricing` (View plans), `/products/vps`.
- Reuse global header/footer; eleven-section order preserved (hero → … → CTA).

## Section order

1. Hero — About RunRacks  
2. Capability / trust strip  
3. Built around you intro  
4. Four alternating editorial features  
5. Six-step journey timeline (editorial phases, no fake years)  
6. Six culture values  
7. Dark technology + people panel  
8. Four people/function cards  
9. Principles carousel (not fake testimonials)  
10. Closing support CTA  
11. Existing footer  

## Motion

Content visible by default. GSAP enhances when motion is allowed. Respect `prefers-reduced-motion`. Clean up triggers on unmount.
