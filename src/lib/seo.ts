import type { Tour } from "@/data/tours";
import type { Destination, Post } from "@/data/content";
import { site } from "@/data/content";

/**
 * Single source of truth for the production origin. Used by metadataBase,
 * sitemap, robots, and every JSON-LD block. Swap this to the real domain
 * (or set NEXT_PUBLIC_SITE_URL at build time) when going live.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://siliguriholidays.example"
).replace(/\/$/, "");

export const abs = (path = "/"): string =>
  path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** Org + WebSite identity. Rendered once in the root layout. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${SITE_URL}/#organization`,
    name: site.name,
    url: SITE_URL,
    description: site.description,
    email: site.contact.email,
    telephone: site.contact.phone,
    areaServed: "North East India",
    address: {
      "@type": "PostalAddress",
      addressRegion: "North East India",
      addressCountry: "IN",
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: site.name,
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/tours?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Breadcrumb trail. Pass {name, path} pairs in order, root → current. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

/**
 * Tour package as a Product with AggregateRating. Pricing is handled as a
 * personalised quote (enquiry flow), so no Offer/price is advertised — this
 * keeps package pages eligible for review-star rich snippets without claiming
 * a price the page doesn't show.
 */
export function tourProductJsonLd(tour: Tour) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${abs(`/tours/${tour.slug}`)}#product`,
    name: tour.title,
    description: tour.shortDescription,
    image: tour.image,
    category: tour.category,
    brand: { "@type": "Brand", name: site.name },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: tour.rating,
      reviewCount: tour.reviewsCount,
      bestRating: 5,
      worstRating: 1,
    },
  };
}

/** Destination as a TouristDestination, linking its attractions. */
export function destinationJsonLd(destination: Destination) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: destination.name,
    description: destination.intro,
    image: destination.image,
    url: abs(`/destinations/${destination.slug}`),
    touristType: "Leisure travellers",
    includesAttraction: destination.attractions.map((a) => ({
      "@type": "TouristAttraction",
      name: a.name,
      description: a.description,
      image: a.image,
    })),
  };
}

/** A service offering (car rental, transfers, etc.) provided by the agency. */
export function serviceJsonLd(s: { slug: string; title: string; short: string; image: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${abs(`/services/${s.slug}`)}#service`,
    name: s.title,
    serviceType: s.title,
    description: s.short,
    image: s.image,
    areaServed: "Siliguri and North East India",
    url: abs(`/services/${s.slug}`),
    provider: { "@id": `${SITE_URL}/#organization` },
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/** Blog post as an Article. */
export function articleJsonLd(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author.name },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: abs(`/blog/${post.slug}`),
  };
}
