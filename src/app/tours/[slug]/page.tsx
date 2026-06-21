import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tours, getTourBySlug } from "@/data/tours";
import { getDestinationBySlug, getPostsByDestination } from "@/data/content";
import Rating from "@/components/Rating";
import BookingWidget from "@/components/BookingWidget";
import TourCard from "@/components/TourCard";
import MobileBookBar from "@/components/MobileBookBar";
import AltitudeAdvisory from "@/components/AltitudeAdvisory";
import PlaceVideo from "@/components/PlaceVideo";
import TripMap from "@/components/TripMap";
import JsonLd from "@/components/JsonLd";
import { clipForDestination } from "@/data/media";
import { ORIGIN, DESTINATION_COORDS, haversineKm } from "@/data/geo";
import { abs, tourProductJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const ADVISORIES: Record<string, { maxElevation: string; note: string }> = {
  "tawang-monastery-expedition": {
    maxElevation: "Sela Pass — 13,700 ft",
    note: "Night halts at Dirang are built in to acclimatise before Sela Pass.",
  },
  "gangtok-north-sikkim-explorer": {
    maxElevation: "Yumthang/Zero Point — up to 15,300 ft",
    note: "We overnight in Lachung so you climb gradually.",
  },
  "dzukou-valley-trek": {
    maxElevation: "Dzukou Valley — 8,000 ft",
    note: "Moderate altitude; the climb from Viswema is the steep part.",
  },
};

export function generateStaticParams() {
  return tours.map((tour) => ({ slug: tour.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tour = getTourBySlug(slug);
  if (!tour) return { title: "Tour not found" };
  const canonical = `/tours/${tour.slug}`;
  return {
    title: tour.title,
    description: tour.shortDescription,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: tour.title,
      description: tour.shortDescription,
      url: abs(canonical),
      images: [{ url: tour.image, alt: tour.title }],
    },
  };
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);
  if (!tour) notFound();

  const destination = getDestinationBySlug(tour.destinationSlug);
  const relatedPosts = getPostsByDestination(tour.destinationSlug).slice(0, 2);
  const coord = DESTINATION_COORDS[tour.destinationSlug];

  const seen = new Set<string>([tour.slug]);
  const relatedTours = tours
    .filter((t) => {
      if (seen.has(t.slug)) return false;
      seen.add(t.slug);
      return t.destinationSlug === tour.destinationSlug || t.category === tour.category;
    })
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 pb-24 sm:px-6 lg:pb-8">
      <JsonLd
        data={[
          tourProductJsonLd(tour),
          breadcrumbJsonLd([
            { name: "Tours", path: "/tours" },
            { name: tour.title, path: `/tours/${tour.slug}` },
          ]),
        ]}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <Link href="/tours" className="hover:text-brand-700 hover:underline">
          Tours
        </Link>{" "}
        / <span className="text-slate-700">{tour.title}</span>
      </nav>

      <PlaceVideo
        src={clipForDestination(tour.destinationSlug).src}
        poster={tour.image}
        label={tour.destination}
        caption={`${tour.durationDays}-day ${tour.category.toLowerCase()} trip`}
        className="mt-4"
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              {tour.category}
            </span>
            <span className="text-sm text-slate-500">
              {tour.destination}, {tour.country} · {tour.durationDays} days · max {tour.maxGroupSize} people
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-serif font-bold">{tour.title}</h1>
          <div className="mt-2">
            <Rating rating={tour.rating} reviewsCount={tour.reviewsCount} />
          </div>
          <p className="mt-4 leading-relaxed text-slate-700">{tour.shortDescription}</p>

          <h2 className="mt-8 text-xl font-bold">Highlights</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {tour.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm text-slate-700">
                <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-brand-600">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                {h}
              </li>
            ))}
          </ul>

          {ADVISORIES[slug] && (
            <AltitudeAdvisory
              maxElevation={ADVISORIES[slug].maxElevation}
              note={ADVISORIES[slug].note}
            />
          )}

          <h2 className="mt-8 text-xl font-bold">Day-by-day itinerary</h2>
          <ol className="mt-4 space-y-4 border-l-2 border-brand-100 pl-6">
            {tour.itinerary.map((day) => (
              <li key={day.day} className="relative">
                <span aria-hidden className="absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full bg-brand-600" />
                <h3 className="font-semibold text-slate-900">
                  Day {day.day}: {day.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{day.description}</p>
              </li>
            ))}
          </ol>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl bg-emerald-50 p-5">
              <h2 className="font-bold text-emerald-900">What&apos;s included</h2>
              <ul className="mt-3 space-y-2 text-sm text-emerald-900/90">
                {tour.included.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span aria-hidden className="mt-0.5 text-emerald-600">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-rose-50 p-5">
              <h2 className="font-bold text-rose-900">Not included</h2>
              <ul className="mt-3 space-y-2 text-sm text-rose-900/90">
                {tour.excluded.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span aria-hidden className="mt-0.5 text-rose-500">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {(destination || relatedPosts.length > 0) && (
            <div className="mt-10">
              <h2 className="text-xl font-bold text-slate-900">Plan around this trip</h2>
              <div className="mt-4 space-y-4">
                {destination && (
                  <Link
                    href={`/destinations/${destination.slug}`}
                    className="group flex items-center gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                  >
                    <div className="h-24 w-32 shrink-0 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0 flex-1 py-3 pr-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Destination guide</p>
                      <p className="mt-0.5 font-bold text-slate-900 group-hover:text-brand-700">
                        {destination.name} travel guide
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-sm text-slate-500">{destination.tagline}</p>
                    </div>
                    <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-4 shrink-0 text-slate-400">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </Link>
                )}
                {relatedPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:shadow-md"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-500">{post.category}</p>
                      <p className="mt-0.5 truncate font-semibold text-slate-900 group-hover:text-brand-700">
                        {post.title}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-slate-400">{post.readMinutes} min read</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BookingWidget tour={tour} />
        </aside>
      </div>

      {relatedTours.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-slate-900">You may also like</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTours.map((t) => (
              <TourCard key={t.slug} tour={t} />
            ))}
          </div>
        </section>
      )}

      {coord && (
        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="text-xl font-bold text-slate-900">Where you&apos;ll travel</h2>
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

      <MobileBookBar tour={tour} />
    </div>
  );
}
