import type { Metadata } from "next";
import { offers } from "@/data/content";
import OfferCard from "./OfferCard";

export const metadata: Metadata = {
  title: "Offers & Deals",
  description: "Exclusive coupon codes and deals for DriveEase tours across North East India.",
};

export default function OffersPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-16 sm:px-6 md:pb-24">
      <p className="text-sm font-semibold uppercase tracking-widest text-accent-600">
        Exclusive deals
      </p>
      <h1 className="mt-1 text-3xl font-serif font-bold text-slate-900 sm:text-4xl">Offers &amp; deals</h1>
      <p className="mt-2 text-slate-600">
        Pick a code below, copy it, and paste it at checkout to save on your next adventure.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {offers.map((offer) => (
          <OfferCard key={offer.code} offer={offer} />
        ))}
      </div>
    </div>
  );
}
