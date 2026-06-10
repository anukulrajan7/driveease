import destinationsJson from "./destinations.json";
import postsJson from "./posts.json";
import offersJson from "./offers.json";
import testimonialsJson from "./testimonials.json";
import siteJson from "./site.json";

export interface Attraction {
  name: string;
  description: string;
  image: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface Destination {
  slug: string;
  name: string;
  country: string;
  tagline: string;
  image: string;
  intro: string;
  facts: {
    bestTime: string;
    idealDuration: string;
    language: string;
    currency: string;
  };
  attractions: Attraction[];
  faqs: Faq[];
}

export interface PostSection {
  heading: string;
  body: string;
}

export interface Post {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  author: { name: string; role: string };
  date: string;
  readMinutes: number;
  destinationSlug: string | null;
  featured: boolean;
  sections: PostSection[];
}

export interface Offer {
  code: string;
  title: string;
  description: string;
  tag: string;
  /** 0 means the offer doesn't change the price (e.g. EMI offers). */
  discountPercent: number;
  maxDiscount: number;
}

export function getOfferByCode(code: string): Offer | undefined {
  return offers.find((o) => o.code.toUpperCase() === code.trim().toUpperCase());
}

/** Discount in ₹ for a given subtotal, honouring the offer's cap. */
export function offerDiscount(offer: Offer, subtotal: number): number {
  if (offer.discountPercent <= 0) return 0;
  return Math.min(Math.round((subtotal * offer.discountPercent) / 100), offer.maxDiscount);
}

export interface Testimonial {
  name: string;
  trip: string;
  quote: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  contact: { email: string; phone: string; hours: string };
  stats: { value: string; label: string }[];
  awards: string[];
}

export const destinations = destinationsJson as Destination[];
export const posts = postsJson as Post[];
export const offers = offersJson as Offer[];
export const testimonials = testimonialsJson as Testimonial[];
export const site = siteJson as SiteConfig;

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getPostsByDestination(destinationSlug: string): Post[] {
  return posts.filter((p) => p.destinationSlug === destinationSlug);
}

export function formatPostDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
