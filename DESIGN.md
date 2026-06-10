# DriveEase — Design System & UX Spec

Travel booking website for **North East India** (Meghalaya, Assam, Arunachal, Nagaland, Manipur, Sikkim + Majuli & Ziro).
Built from competitor research: MakeMyTrip / EaseMyTrip (booking UX) + TripAdvisor / Lonely Planet / Thrillophilia (destinations & blog UX).

## 1. Brand

| | |
|---|---|
| Name | **DriveEase** (logo mark: mountain + dawn sun in a green tile) |
| Tagline | *Discover North East India* |
| Voice | Warm, local-expert, plain English. No hype words. |

## 2. Color theme (North East India)

Inspired by tea gardens, misty hills, and Arunachal — "land of the dawn-lit mountains".
All colors are tokens in `globals.css` — change once, applies everywhere.

| Token | Value | Use |
|---|---|---|
| `brand-*` (forest green scale, 600=#16a34a, 700=#15803d) | Primary: nav links, primary CTAs, chips, itinerary timeline |
| `accent-*` (dawn orange scale, 500=#f97316) | Action: "Book a Tour" button, badges, savings/discount text, offer tags |
| `slate-*` | Neutrals: text, borders, backgrounds |
| `emerald`/`rose` | Semantic only: included ✓ / excluded ✕, form errors |

Rule: **green = trust & structure, orange = action & deals**. Never mix roles.

## 3. Typography & layout

- Font: Geist Sans. Scale: h1 30/36px bold, h2 24px bold, body 16px, meta 14px, captions 12px.
- 8px spacing grid. Max content width 72rem (`max-w-6xl`). Cards `rounded-2xl border-slate-200 shadow-sm`.
- Breakpoints: mobile-first; `sm:` 640 (2-col grids), `md:` 768 (desktop nav), `lg:` 1024 (3-col grids + sticky sidebars).
- Images: cards 16:9 `object-cover`; heroes h-64→h-96 with `bg-gradient-to-t from-slate-900/70` overlay for text legibility. Every image from Unsplash, **URL verified (HTTP 200) before shipping**.

## 4. Information architecture

```
/                    Home: hero, offers strip, categories, featured tours,
                     destinations strip, stats band, blog teasers, testimonials, CTA
/tours               Listing: search + category/price/duration filters + visible sort
/tours/[slug]        Detail: gallery, highlights, itinerary, included/excluded, sticky price card
/book/[slug]         Guest checkout: validated form + live price summary
/confirmation        Booking reference + summary
/destinations        Grid of NE India destination guides
/destinations/[slug] Guide: hero, facts chips, attractions, tours cross-sell, stories, FAQ
/blog                Featured post + category grid
/blog/[slug]         Article: byline, sections, "plan your trip" tour cross-sell, more stories
```

Cross-linking taxonomy: every tour & post carries a `destinationSlug` → any page can query "everything about Meghalaya" (TripAdvisor pattern).

## 5. Component patterns (from research)

- **TourCard** (MakeMyTrip package card): image + category chip + badge ("Bestseller"), `xN/yD` duration, rating + reviews, strikethrough original ₹ + discount % + "You save ₹X" in accent, price per person.
- **OffersStrip**: horizontal-scroll coupon cards — bold code, copy affordance, tag chip (EaseMyTrip deals pattern).
- **StatsBand**: trust band — travellers count, rating, 24×7 support (trust-signal pattern).
- **FAQ**: native `<details>` accordions on destination pages.
- **Forms**: label every field, inline validation messages in rose, focus ring brand.

## 6. Content data — all dynamic from JSON (`src/data/*.json`)

| File | Drives |
|---|---|
| `site.json` | Brand name, tagline, contact, stats, awards (header/footer/home) |
| `tours.json` | 10 NE India tours (full itineraries, pricing, badges) |
| `destinations.json` | 9 destination guides (facts, attractions, FAQs) |
| `posts.json` | 6 blog posts (sections, author, category, read time) |
| `offers.json` | Coupon cards |
| `testimonials.json` | Traveller quotes |

Typed loaders: `src/data/tours.ts`, `src/data/content.ts`. Pages never hardcode content.

## 7. Canonical NE India catalogue

Categories: `Mountains · Wildlife · Culture · Trekking · Rivers & Lakes`

| Tour slug | Destination slug | Cat | Days | ₹/person |
|---|---|---|---|---|
| meghalaya-waterfalls-root-bridges | meghalaya | Mountains | 5 | 18,999 |
| kaziranga-rhino-safari | kaziranga | Wildlife | 3 | 14,999 |
| tawang-monastery-expedition | tawang | Mountains | 7 | 28,999 |
| gangtok-north-sikkim-explorer | sikkim | Mountains | 6 | 24,999 |
| hornbill-festival-nagaland | nagaland | Culture | 4 | 19,999 |
| majuli-river-island-retreat | majuli | Rivers & Lakes | 3 | 11,999 |
| ziro-valley-culture-trail | ziro | Culture | 4 | 16,999 |
| dzukou-valley-trek | nagaland | Trekking | 4 | 12,999 |
| loktak-lake-imphal-discovery | manipur | Rivers & Lakes | 4 | 15,999 |
| namdapha-wilderness-trail | namdapha | Wildlife | 5 | 21,999 |

Destinations: meghalaya, kaziranga, tawang, sikkim, nagaland, majuli, ziro, manipur, namdapha.

## 8. Accessibility

WCAG 2.1 AA: semantic landmarks, labelled inputs, `aria-pressed` filter chips, alt text everywhere, visible focus states, 44px tap targets on mobile.
