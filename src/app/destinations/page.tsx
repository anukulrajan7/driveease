import type { Metadata } from "next";
import { destinations } from "@/data/content";
import { getToursByDestination } from "@/data/tours";
import { clipForDestination } from "@/data/media";
import DestinationVideoCard from "@/components/DestinationVideoCard";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Explore North East India — Meghalaya, Sikkim, Kaziranga, Tawang, Nagaland and more. Pick a destination and let our local team handle the rest.",
};

export default function DestinationsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-16 sm:px-6 md:pb-24">
      <h1 className="text-3xl font-serif font-bold text-slate-900 sm:text-4xl">Destinations</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        From Himalayan snow passes to river islands and tea country — pick a destination and let our
        Siliguri team handle the rest. Hover any card for a quick look.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((destination) => (
          <DestinationVideoCard
            key={destination.slug}
            href={`/destinations/${destination.slug}`}
            image={destination.image}
            videoSrc={clipForDestination(destination.slug).src}
            name={destination.name}
            country={destination.country}
            tagline={destination.tagline}
            tourCount={getToursByDestination(destination.slug).length}
          />
        ))}
      </div>
    </div>
  );
}
