import { cars } from "./cars";
import { formatINR } from "./tours";

/**
 * SEO landing pages for high-intent "Siliguri to X taxi/fare" searches.
 * Each maps to /car-rental/<slug>. Distances/times are the real road figures
 * we quote; fares are indicative one-way estimates derived from per-km rates.
 */
export interface TaxiRoute {
  slug: string;
  /** Short, clean place name for headings: "Darjeeling". */
  place: string;
  /** Full label for body copy: "Gangtok, Sikkim". */
  fullName: string;
  distanceKm: number;
  hours: string;
  /** One-liner shown on cards and in the intro. */
  note: string;
  /** Route-specific FAQ — feeds FAQ schema + on-page accordion. */
  faqs: { question: string; answer: string }[];
}

export const TAXI_ROUTES: TaxiRoute[] = [
  {
    slug: "siliguri-to-darjeeling-taxi",
    place: "Darjeeling",
    fullName: "Darjeeling",
    distanceKm: 68,
    hours: "≈ 3 hours",
    note: "Toy-train country — tea gardens, Tiger Hill sunrise and the Batasia loop.",
    faqs: [
      { question: "How much is a taxi from Siliguri to Darjeeling?", answer: "A one-way Siliguri–Darjeeling cab starts from around the per-kilometre rates shown below (a sedan is the most popular choice). Hill routes are usually quoted as a confirmed round-trip or day rate — message us for an exact, all-inclusive price." },
      { question: "How long does the Siliguri to Darjeeling drive take?", answer: "About 3 hours to cover 68 km, depending on traffic at Kurseong and the weather on the hill section." },
      { question: "Can you pick me up from Bagdogra Airport or NJP for Darjeeling?", answer: "Yes — we run direct Bagdogra Airport and NJP station pickups straight to Darjeeling with a meet-and-greet driver." },
    ],
  },
  {
    slug: "siliguri-to-gangtok-taxi",
    place: "Gangtok",
    fullName: "Gangtok, Sikkim",
    distanceKm: 114,
    hours: "≈ 4.5 hours",
    note: "Capital of Sikkim — we arrange Sikkim permits and North Sikkim extensions.",
    faqs: [
      { question: "What is the taxi fare from Siliguri to Gangtok?", answer: "Fares depend on the vehicle (sedan, SUV or Tempo Traveller) and whether it's one-way or round-trip. See the indicative per-km estimates below and request a confirmed quote." },
      { question: "Do I need a permit for Gangtok?", answer: "No permit is needed for Gangtok city itself. For protected areas like Nathula, Tsomgo Lake and North Sikkim you do — we arrange those for you." },
      { question: "How long is the Siliguri to Gangtok cab journey?", answer: "Around 4.5 hours for 114 km along the scenic Teesta river highway (NH10)." },
    ],
  },
  {
    slug: "siliguri-to-kalimpong-taxi",
    place: "Kalimpong",
    fullName: "Kalimpong",
    distanceKm: 70,
    hours: "≈ 3 hours",
    note: "Quiet hill town — flower nurseries, monasteries and Teesta valley views.",
    faqs: [
      { question: "How far is Kalimpong from Siliguri by road?", answer: "About 70 km, roughly a 3-hour drive along NH10 beside the Teesta river." },
      { question: "Is a Siliguri to Kalimpong cab available for a day trip?", answer: "Yes — we run same-day round trips as well as drop-only fares. Tell us your plan and we'll quote accordingly." },
    ],
  },
  {
    slug: "siliguri-to-mirik-taxi",
    place: "Mirik",
    fullName: "Mirik",
    distanceKm: 52,
    hours: "≈ 2.5 hours",
    note: "Lake town surrounded by tea gardens — an easy half-day escape from Siliguri.",
    faqs: [
      { question: "How much does a Siliguri to Mirik taxi cost?", answer: "Mirik is one of the shortest hill runs from Siliguri (52 km), so it's among the most affordable. See per-km estimates below or ask for a fixed day-trip rate." },
      { question: "Can Mirik be combined with Darjeeling in one trip?", answer: "Yes — a popular route is Siliguri → Mirik → Darjeeling, taking in the tea gardens en route. We're happy to plan it." },
    ],
  },
  {
    slug: "siliguri-to-bagdogra-airport-taxi",
    place: "Bagdogra Airport",
    fullName: "Bagdogra Airport (IXB)",
    distanceKm: 16,
    hours: "≈ 40 minutes",
    note: "Meet-and-greet airport transfers — onward cabs to any hill station too.",
    faqs: [
      { question: "Do you offer Bagdogra Airport pickup and drop?", answer: "Yes — meet-and-greet pickups at Bagdogra Airport (IXB) with the driver waiting at arrivals, plus onward transfers to Darjeeling, Gangtok, Kalimpong and the Dooars." },
      { question: "How far is Bagdogra Airport from Siliguri?", answer: "Only about 16 km — a 40-minute transfer. We track your flight so the cab is ready even if you land late." },
    ],
  },
  {
    slug: "siliguri-to-dooars-taxi",
    place: "Dooars",
    fullName: "Dooars (Lataguri)",
    distanceKm: 80,
    hours: "≈ 3 hours",
    note: "Gateway to Gorumara & Jaldapara — forests, tea estates and river beds.",
    faqs: [
      { question: "Which Dooars destinations do you cover from Siliguri?", answer: "Lataguri, Gorumara, Chapramari, Murti, Samsing and Jaldapara — we tailor the route to the resorts and safari zones you're visiting." },
      { question: "Is a SUV better for the Dooars?", answer: "An SUV is comfortable for forest roads and family groups; sedans are fine for the main highways. We'll suggest the right vehicle for your itinerary." },
    ],
  },
  {
    slug: "siliguri-to-lava-lolegaon-taxi",
    place: "Lava & Lolegaon",
    fullName: "Lava & Lolegaon",
    distanceKm: 110,
    hours: "≈ 4 hours",
    note: "Pine-forest ridge towns with Kanchenjunga views and the Neora valley.",
    faqs: [
      { question: "How long is the Siliguri to Lava drive?", answer: "About 4 hours over 110 km through Kalimpong and the Neora Valley fringe — a beautiful pine-forest drive." },
      { question: "Can you cover Lava, Lolegaon and Rishop together?", answer: "Yes — these are usually done as one circuit. We'll plan the loop and quote a day/round-trip rate." },
    ],
  },
  {
    slug: "siliguri-to-pelling-taxi",
    place: "Pelling",
    fullName: "Pelling, Sikkim",
    distanceKm: 130,
    hours: "≈ 5 hours",
    note: "West Sikkim — front-row Kanchenjunga views, Pemayangtse and the skywalk.",
    faqs: [
      { question: "How far is Pelling from Siliguri?", answer: "About 130 km, a 5-hour drive into West Sikkim. Most travellers do it as part of a multi-day Sikkim trip." },
      { question: "Do I need a permit for Pelling?", answer: "Pelling itself needs no permit. We arrange any restricted-area permits if your Sikkim itinerary includes them." },
    ],
  },
];

export function getTaxiRouteBySlug(slug: string): TaxiRoute | undefined {
  return TAXI_ROUTES.find((r) => r.slug === slug);
}

/** Indicative one-way fare per vehicle, rounded to a tidy figure. */
export interface RouteFare {
  name: string;
  type: string;
  seats: number;
  perKm: number;
  estimate: number;
  estimateLabel: string;
}

export function routeFares(distanceKm: number): RouteFare[] {
  return cars.map((c) => {
    const estimate = Math.round((c.perKm * distanceKm) / 50) * 50;
    return {
      name: c.name,
      type: c.type,
      seats: c.seats,
      perKm: c.perKm,
      estimate,
      estimateLabel: formatINR(estimate),
    };
  });
}
