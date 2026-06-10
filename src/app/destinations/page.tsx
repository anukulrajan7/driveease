import type { Metadata } from "next";
import Link from "next/link";
import { destinations } from "@/data/content";
import { getToursByDestination } from "@/data/tours";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Explore our handpicked destinations — from the beaches of Goa to the heights of Ladakh. Find the perfect place for your next adventure.",
};

export default function DestinationsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-16 sm:px-6 md:pb-24">
      <h1 className="text-3xl font-serif font-bold text-slate-900 sm:text-4xl">Destinations</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        From Himalayan snow peaks to tropical coastlines — pick a destination and let us handle the
        rest.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((destination) => {
          const tourCount = getToursByDestination(destination.slug).length;
          return (
            <Link
              key={destination.slug}
              href={`/destinations/${destination.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-brand-600"
            >
              <div className="relative h-56 bg-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={destination.image}
                  alt={destination.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />

                <div className="absolute bottom-0 left-0 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
                    {destination.country}
                  </p>
                  <h2 className="text-xl font-bold text-white">{destination.name}</h2>
                  <p className="mt-0.5 line-clamp-1 text-sm text-white/90">{destination.tagline}</p>
                </div>

                <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700">
                  {tourCount} {tourCount === 1 ? "tour" : "tours"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
