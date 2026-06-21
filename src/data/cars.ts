import carsJson from "./cars.json";
import { formatINR } from "./tours";

export type CarType = "Hatchback" | "Sedan" | "SUV" | "Premium SUV" | "Tempo Traveller";

export interface Car {
  slug: string;
  name: string;
  type: CarType;
  seats: number;
  luggage: number;
  transmission: "Manual" | "Automatic";
  ac: boolean;
  image: string;
  pricePerDay: number;
  perKm: number;
  popular: boolean;
  bestFor: string;
  features: string[];
}

export const cars = carsJson as Car[];

export function getCarBySlug(slug: string): Car | undefined {
  return cars.find((c) => c.slug === slug);
}

/** Popular Siliguri-origin routes shown on the car rental page. */
export interface Route {
  to: string;
  distanceKm: number;
  hours: string;
  note: string;
}

export const POPULAR_ROUTES: Route[] = [
  { to: "Bagdogra Airport (IXB)", distanceKm: 16, hours: "40 min", note: "Meet & greet pickup" },
  { to: "Darjeeling", distanceKm: 68, hours: "3 hrs", note: "Toy-train country" },
  { to: "Gangtok, Sikkim", distanceKm: 114, hours: "4.5 hrs", note: "Permits arranged" },
  { to: "Kalimpong", distanceKm: 70, hours: "3 hrs", note: "Quiet hill town" },
  { to: "Mirik", distanceKm: 52, hours: "2.5 hrs", note: "Lake & tea gardens" },
  { to: "Gorubathan / Dooars", distanceKm: 80, hours: "3 hrs", note: "Wildlife & forests" },
];

export { formatINR };
