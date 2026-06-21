/**
 * Services offered by Siliguri Holidays. Car rental leads; the rest follow.
 * `iconKey` is mapped to a lucide icon in the components (data stays serialisable).
 * Car rental links out to its full page (/car-rental); every other service has
 * a detail page at /services/[slug] with a fillable, stored enquiry form.
 */

export type ServiceIcon =
  | "car"
  | "corporate"
  | "hotel"
  | "airport"
  | "station"
  | "holiday";

export interface Service {
  slug: string;
  title: string;
  /** Short line for cards. */
  short: string;
  /** Hero subtitle on the detail page. */
  tagline: string;
  /** Opening paragraph on the detail page. */
  intro: string;
  /** "What's covered" bullets. */
  offers: string[];
  iconKey: ServiceIcon;
  image: string;
  /** When set, the card links here instead of /services/[slug]. */
  externalHref?: string;
}

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=70`;

export const SERVICES: Service[] = [
  {
    slug: "car-rental",
    title: "Car Rental & Cabs",
    short: "Sedans to 12-seater Tempo Travellers with verified hill drivers — at your doorstep.",
    tagline: "Wheels for the hills, with drivers who know every bend.",
    intro:
      "Our core service — a clean, well-kept fleet with verified local drivers, ready at your doorstep across Siliguri and the hills. Sedans, SUVs, Innova Crysta and Tempo Travellers for groups, all booked without paying upfront.",
    offers: [
      "Verified, courteous hill drivers",
      "Sedans, SUVs & 12-seater Tempo Travellers",
      "Doorstep pickup anywhere in Siliguri",
      "Permits and paperwork sorted",
      "Transparent quote before you commit",
    ],
    iconKey: "car",
    image: img("photo-1544735716-392fe2489ffa"),
    externalHref: "/car-rental",
  },
  {
    slug: "corporate-wedding",
    title: "Corporate & Wedding",
    short: "Doorstep fleet for offsites, conferences and weddings — convoys, guest shuttles, GST billing.",
    tagline: "No need to worry — our cars reach your doorstep.",
    intro:
      "Whether it's a company offsite, a conference, or the big wedding week, we put a coordinated fleet at your doorstep. Multi-vehicle convoys, guest shuttles between venues, airport runs for outstation guests, and clean monthly/GST billing for businesses.",
    offers: [
      "Decorated car for the couple + guest shuttles",
      "Multi-vehicle convoys with a single coordinator",
      "Corporate offsites, conferences & daily staff transport",
      "Airport & hotel runs for outstation guests",
      "GST invoicing and monthly billing for companies",
      "Backup vehicles on standby",
    ],
    iconKey: "corporate",
    image: img("photo-1519225421980-715cb0215aed"),
  },
  {
    slug: "hotel-booking",
    title: "Hotel Booking + Taxi",
    short: "Need a comfortable stay? We book the hotel and arrange a taxi to your destination.",
    tagline: "A comfortable bed and a ride to it — sorted together.",
    intro:
      "If you need a comfortable hotel, our operators help you book one that fits your budget and plans — and arrange the taxi to take you there. One call covers both your stay and your ride.",
    offers: [
      "Handpicked hotels & homestays for every budget",
      "Taxi to your hotel and onward sightseeing",
      "Local know-how on the right area to stay",
      "Group and family room blocks",
      "One point of contact for stay + transport",
    ],
    iconKey: "hotel",
    image: img("photo-1566073771259-6a8506099945"),
  },
  {
    slug: "airport-transfer",
    title: "Airport Transfer",
    short: "Bagdogra (IXB) pickups and drops — quick, comfortable, anywhere in the region.",
    tagline: "We'll get you there quickly and comfortably.",
    intro:
      "Hassle-free Bagdogra Airport (IXB) pickups and drops, anywhere in the city or onward to the hills. Meet-and-greet at arrivals, flight-time tracking, and a clean car waiting — experience travel without the stress.",
    offers: [
      "Meet & greet at Bagdogra arrivals",
      "Flight tracking — we adjust to delays",
      "Onward transfers to Darjeeling, Gangtok & beyond",
      "Child seats and extra luggage on request",
      "24×7 availability for early/late flights",
    ],
    iconKey: "airport",
    image: img("photo-1436491865332-7a61a109cc05"),
  },
  {
    slug: "station-transport",
    title: "Station Transport",
    short: "NJP & Siliguri railway pickups and city taxis, timed to your train.",
    tagline: "From the platform to your destination, comfortably.",
    intro:
      "Let our team arrange your NJP / Siliguri railway station pickup or a taxi to take you anywhere in the city. We track your train and have the car ready when you step off — a comfortable, hassle-free journey every time.",
    offers: [
      "NJP & Siliguri Junction pickups",
      "Train-time tracking",
      "City taxis and onward hill transfers",
      "Help with luggage",
      "Round-the-clock booking",
    ],
    iconKey: "station",
    image: img("photo-1474487548417-781cb71495f3"),
  },
  {
    slug: "holiday-booking",
    title: "Holiday Bookings",
    short: "Planning a trip? We arrange the whole holiday — stays, cars and sightseeing.",
    tagline: "The whole holiday, planned around you.",
    intro:
      "Planning a getaway? Siliguri Holidays puts together your entire trip — stays, cars, sightseeing and permits — so it's memorable and genuinely enjoyable. Tell us your dates and interests; we'll shape the rest.",
    offers: [
      "Custom itineraries across the North East",
      "Stays, cars and sightseeing in one plan",
      "Permits and logistics handled end-to-end",
      "Local guides and authentic experiences",
      "Flexible, no-payment-now enquiry",
    ],
    iconKey: "holiday",
    image: img("photo-1454496522488-7a8e488e8606"),
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

/** Service titles for enquiry-form dropdowns. */
export const SERVICE_TITLES = SERVICES.map((s) => s.title);
