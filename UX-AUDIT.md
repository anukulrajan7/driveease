# DriveEase — World-Class UX Audit & Upgrade Plan

Method: every page reviewed live (desktop 1440px + mobile 400px) against research-backed checklists:
(a) spacing/typography systems used by Stripe/Linear/Airbnb-tier sites, (b) NN/g + Baymard carousel & motion findings.

## Findings (page-by-page, against the checklist)

| # | Finding | Rule violated | Severity |
|---|---|---|---|
| 1 | 5 pages render titles like "About Us — DriveEase \| DriveEase" (hardcoded brand + layout template) | Title hygiene | **P0 bug** |
| 2 | h1 typography inconsistent: serif display on home, plain sans everywhere else | One display face site-wide | P0 |
| 3 | About page: 680px text column pinned left in a 1152px container — large dead zone right | Article measure should be centered (60–75ch, `mx-auto`) | P0 |
| 4 | Home section rhythm uneven: `pt-12`, `py-16`, `py-12` mixed; mobile = desktop padding | Constant rhythm `py-14 md:py-24`; mobile ≈ half desktop | P1 |
| 5 | Three dark sections on home (stats, CTA, footer) — CTA sits directly on dark footer | Max 1–2 dark sections, never adjacent | P1 |
| 6 | Offers strip: free-scrolling row, no snap, visible scrollbar, no "peek" cue | Slider rules: `snap-x`, 15% next-card peek, hidden scrollbar, edge fade | P1 |
| 7 | Testimonials: 4-card grid squeezes to 1-col stack on mobile (long page) | Secondary content rows → swipeable snap slider on mobile | P1 |
| 8 | Blog category pills wrap to two rows on mobile | Filter rows → single scrollable row | P2 |
| 9 | Tours listing h1 block missing the eyebrow pattern used elsewhere | Consistent heading anatomy (eyebrow → h1 → sub) | P2 |
| 10 | Blog article column — *verified centered, no fix needed* (false positive from WhatsApp button asymmetry) | — | — |

Verified healthy: scroll-reveal trigger/distance/easing match NN/g-grade guidance (15% viewport, 24px, 700ms expo-out, 80–90ms stagger); card hover values within recommended ranges (lift 4px, image zoom 1.05@500ms); prose measure on blog correct; container/gutter system otherwise consistent; no auto-rotating carousels anywhere (correct per NN/g).

## Fixes applied (mapped to findings)
1. Strip "— DriveEase" from the 5 page titles — the layout template appends the brand exactly once.
2. `font-serif` on every page h1 (Fraunces display face site-wide).
3. Center the About column (`mx-auto`).
4. Normalize home rhythm to `py-14 md:py-24` (stats band `py-12 md:py-16`).
5. Stats band → light `brand-50` tint with deep-green numerals; page keeps one dark moment (CTA) before the footer.
6. Offers strip → scroll-snap with card peek (`w-[85%] sm:w-72`, `snap-center`), hidden scrollbar, edge-fade mask.
7. Testimonials → mobile snap slider (85% cards, peek), grid from `sm:` up.
8. Blog pills → single-row horizontal scroll on mobile.
9. Tours listing gets the standard eyebrow + serif heading block.

New utilities: `.no-scrollbar`, `.edge-fade-x` (mask-based), both motion-safe.
