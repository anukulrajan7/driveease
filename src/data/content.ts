import destinationsJson from "./destinations.json";
import postsJson from "./posts.json";
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

export interface Testimonial {
  name: string;
  trip: string;
  quote: string;
  location?: string;
  rating?: number;
  source?: string;
  date?: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  contact: { email: string; phone: string; whatsapp?: string; hours: string; address?: string };
  stats: { value: string; label: string }[];
  awards: string[];
}

export const destinations = destinationsJson as Destination[];
export const posts = postsJson as Post[];
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
