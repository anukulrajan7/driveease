# Detailed Build Prompt — "Roamio" Travel Tour Booking Website

> This is the refined, detailed version of the original idea:
> *"Build a travel booking website where users can browse travel tours/packages and book them."*

## 1. Product Summary
Build **Roamio**, a responsive travel tour booking website using **Next.js (App Router) + TypeScript + Tailwind CSS**. Users can browse curated tour packages, filter/search them, view full tour details (itinerary, inclusions, pricing), and complete a simple booking flow ending in a confirmation with a booking reference.

## 2. Target Users & UX Principles
- Travelers of all ages → **easy to use, not fancy**: clear hierarchy, big tap targets, obvious CTAs.
- Mobile-first responsive design (works at 360px → 1440px+).
- Calm, trustworthy visual style: white background, one accent color (teal/emerald), generous whitespace, 8px spacing grid, rounded cards, subtle shadows, WCAG-friendly contrast.
- Max 2 clicks from homepage to "Book Now". No login required (guest checkout).

## 3. Pages & Routes
| Route | Purpose |
|---|---|
| `/` | Hero with search, category chips, featured tours, "why book with us", testimonials, footer |
| `/tours` | All tours: search box, category filter, price & duration filters, sort (price/rating), responsive card grid, empty state |
| `/tours/[slug]` | Tour detail: image, highlights, day-by-day itinerary, what's included/excluded, sticky price card with date + travelers selector, Book Now |
| `/book/[slug]` | Booking form: name, email, phone, date, travelers count, special requests + live price summary, validation |
| `/confirmation` | Success page with generated booking reference and summary |

## 4. Data Model (mock data, no backend)
`Tour`: id, slug, title, destination, country, category (Beach | Mountain | City | Wildlife | Culture), durationDays, pricePerPerson, rating, reviewsCount, image, shortDescription, highlights[], itinerary[{day, title, description}], included[], excluded[], maxGroupSize. Seed **9+ realistic tours** across categories and price points.

## 5. Functional Requirements
- Filters and search update results instantly (client-side).
- Booking form: required-field validation, email format check, travelers 1–maxGroupSize, date must be in future.
- Price summary recalculates live: pricePerPerson × travelers, +5% service fee.
- Confirmation page generates a readable booking ref (e.g., `RM-XXXXXX`) and shows full summary.
- Header: sticky, mobile hamburger menu. Footer: links, contact, newsletter input (visual only).

## 6. Non-Functional
- TypeScript strict, no `any`. Reusable components (TourCard, FilterBar, Rating, Button-style classes).
- Semantic HTML, alt text on images, label every form field, focus states.
- `npm run build` must pass clean.
