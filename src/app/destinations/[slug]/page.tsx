import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { destinations, getDestinationBySlug, getPostsByDestination, testimonials } from "@/data/content";
import { getToursByDestination } from "@/data/tours";
import { clipForDestination, NE_HERO_POSTER } from "@/data/media";
import { ORIGIN, DESTINATION_COORDS, haversineKm } from "@/data/geo";
import TourCard from "@/components/TourCard";
import PlaceVideo from "@/components/PlaceVideo";
import TripMap from "@/components/TripMap";
import AttractionsGallery from "@/components/AttractionsGallery";
import Reviews from "@/components/Reviews";
import JsonLd from "@/components/JsonLd";
import { abs, destinationJsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);
  if (!destination) return { title: "Destination not found" };
  const canonical = `/destinations/${destination.slug}`;
  const description = destination.intro.slice(0, 160);
  return {
    title: `${destination.name} — ${destination.tagline}`,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: `${destination.name} — ${destination.tagline}`,
      description,
      url: abs(canonical),
    },
  };
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);
  if (!destination) notFound();

  const tours = getToursByDestination(slug);
  const posts = getPostsByDestination(slug);
  const clip = clipForDestination(slug);
  const coord = DESTINATION_COORDS[slug];

  // Reviews for this place: prefer ones mentioning it, fall back to all.
  const matched = testimonials.filter((t) =>
    t.trip.toLowerCase().includes(destination.name.toLowerCase())
  );
  const placeReviews = matched.length >= 2 ? matched : testimonials;
  const avgRating = tours.length
    ? (tours.reduce((s, t) => s + t.rating, 0) / tours.length).toFixed(1)
    : "4.8";
  const totalReviews = tours.reduce((s, t) => s + t.reviewsCount, 0) || 1200;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 pb-16 sm:px-6 md:pb-24">
      <JsonLd
        data={[
          destinationJsonLd(destination),
          faqJsonLd(destination.faqs),
          breadcrumbJsonLd([
            { name: "Destinations", path: "/destinations" },
            { name: destination.name, path: `/destinations/${destination.slug}` },
          ]),
        ]}
      />
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <Link href="/destinations" className="hover:text-brand-700 hover:underline">
          Destinations
        </Link>{" "}
        / <span className="text-slate-700">{destination.name}</span>
      </nav>

      {/* Hero */}
      <div className="relative mt-4 overflow-hidden rounded-2xl bg-slate-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={destination.image}
          alt={destination.name}
          className="h-64 w-full object-cover sm:h-96"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
            {destination.country}
          </p>
          <h1 className="text-3xl font-serif font-bold text-white sm:text-4xl">{destination.name}</h1>
          <p className="mt-1 text-white/90">{destination.tagline}</p>
        </div>
      </div>

      {/* Facts chips */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(
          [
            { label: "Best time", value: destination.facts.bestTime },
            { label: "Ideal duration", value: destination.facts.idealDuration },
            { label: "Language", value: destination.facts.language },
            { label: "Currency", value: destination.facts.currency },
          ] as { label: string; value: string }[]
        ).map((fact) => (
          <div
            key={fact.label}
            className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {fact.label}
            </p>
            <p className="mt-0.5 text-sm font-medium text-slate-900">{fact.value}</p>
          </div>
        ))}
      </div>

      {/* Intro */}
      <p className="mt-6 leading-relaxed text-slate-700">{destination.intro}</p>

      {/* Place video */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-900">{destination.name} in motion</h2>
        <p className="mt-1 text-sm text-slate-600">A glimpse of the landscapes you&apos;ll travel through.</p>
        <PlaceVideo
          src={clip.src}
          poster={NE_HERO_POSTER}
          label={destination.name}
          caption={destination.tagline}
          className="mt-4"
        />
      </section>

      {/* Top attractions — click any card to open the lightbox */}
      <h2 className="mt-10 text-xl font-bold text-slate-900">Top attractions</h2>
      <AttractionsGallery attractions={destination.attractions} />

      {/* Tours cross-sell */}
      {tours.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-slate-900">Tours in {destination.name}</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </section>
      )}

      {/* Travel stories cross-sell */}
      {posts.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-slate-900">Travel stories</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-brand-600"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                  {post.category}
                </p>
                <h3 className="mt-1 font-semibold text-slate-900 group-hover:text-brand-700">
                  {post.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">{post.excerpt}</p>
                <p className="mt-3 text-xs text-slate-400">{post.readMinutes} min read</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-slate-900">Frequently asked questions</h2>
        <div className="mt-4 space-y-3">
          {destination.faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-xl border border-slate-200 bg-white px-5 py-4"
            >
              <summary className="cursor-pointer list-none font-semibold text-slate-900 marker:hidden">
                <span className="flex items-center justify-between gap-3">
                  {faq.question}
                  <svg
                    aria-hidden
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Traveller reviews */}
      <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200">
        <Reviews
          testimonials={placeReviews}
          avgRating={avgRating}
          totalReviews={totalReviews}
          heading={`Reviews from ${destination.name} travellers`}
        />
      </div>

      {/* Where it is — open-source map (bottom of page) */}
      {coord && (
        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="text-xl font-bold text-slate-900">Where it is</h2>
            <p className="text-sm text-slate-500">
              ~{haversineKm(ORIGIN, coord)} km from {ORIGIN.name} (as the crow flies)
            </p>
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <TripMap origin={ORIGIN} points={[coord]} selected={coord.name} className="h-[340px] w-full" />
            <p className="bg-white px-4 py-2 text-xs text-slate-500">Map data © OpenStreetMap contributors.</p>
          </div>
        </section>
      )}

      {/* CTA banner */}
      <div className="mt-12 rounded-2xl bg-brand-600 px-6 py-10 text-center text-white sm:px-10">
        <h2 className="text-2xl font-bold">Ready to explore {destination.name}?</h2>
        <p className="mt-2 text-brand-100">
          Browse all our tours and find the perfect itinerary for your trip.
        </p>
        <Link
          href="/tours"
          className="mt-5 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-brand-700 transition-colors hover:bg-brand-50 focus-visible:ring-2 focus-visible:ring-white"
        >
          View all tours
        </Link>
      </div>
    </div>
  );
}
