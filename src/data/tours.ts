import toursJson from "./tours.json";

export type TourCategory = "Mountains" | "Wildlife" | "Culture" | "Trekking" | "Rivers & Lakes";

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface Tour {
  id: string;
  slug: string;
  title: string;
  destination: string;
  country: string;
  category: TourCategory;
  durationDays: number;
  pricePerPerson: number;
  originalPricePerPerson: number;
  badge: string | null;
  destinationSlug: string;
  rating: number;
  reviewsCount: number;
  image: string;
  shortDescription: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  included: string[];
  excluded: string[];
  maxGroupSize: number;
}

export const tours = toursJson as Tour[];

export const CATEGORIES: TourCategory[] = ["Mountains", "Wildlife", "Culture", "Trekking", "Rivers & Lakes"];

export const SERVICE_FEE_RATE = 0.05;

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getTourBySlug(slug: string): Tour | undefined {
  return tours.find((t) => t.slug === slug);
}

export function getToursByDestination(destinationSlug: string): Tour[] {
  return tours.filter((t) => t.destinationSlug === destinationSlug);
}

export function discountPercent(tour: Tour): number {
  return Math.round(
    ((tour.originalPricePerPerson - tour.pricePerPerson) / tour.originalPricePerPerson) * 100
  );
}
