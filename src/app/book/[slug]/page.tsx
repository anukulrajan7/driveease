import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tours, getTourBySlug } from "@/data/tours";
import BookingForm from "@/components/BookingForm";

export const metadata: Metadata = { title: "Book your tour" };

export function generateStaticParams() {
  return tours.map((tour) => ({ slug: tour.slug }));
}

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ date?: string; travelers?: string; coupon?: string }>;
}) {
  const [{ slug }, { date, travelers, coupon }] = await Promise.all([params, searchParams]);
  const tour = getTourBySlug(slug);
  if (!tour) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 pb-16 sm:px-6 md:pb-24">
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <Link href="/tours" className="hover:text-brand-700 hover:underline">
          Tours
        </Link>{" "}
        /{" "}
        <Link href={`/tours/${tour.slug}`} className="hover:text-brand-700 hover:underline">
          {tour.title}
        </Link>{" "}
        / <span className="text-slate-700">Book</span>
      </nav>
      <h1 className="mt-2 text-3xl font-serif font-bold">Complete your booking</h1>
      <p className="mt-1 text-slate-600">You&apos;re just one step away from your trip to {tour.destination}.</p>

      <div className="mt-8">
        <BookingForm
          tour={tour}
          initialDate={date}
          initialTravelers={travelers ? Number(travelers) : undefined}
          initialCoupon={coupon}
        />
      </div>
    </div>
  );
}
