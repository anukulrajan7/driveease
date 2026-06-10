import type { Metadata } from "next";
import Link from "next/link";
import { getTourBySlug, formatINR, SERVICE_FEE_RATE } from "@/data/tours";

export const metadata: Metadata = { title: "Booking confirmed" };

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{
    ref?: string;
    tour?: string;
    name?: string;
    email?: string;
    date?: string;
    travelers?: string;
    coupon?: string;
    discount?: string;
  }>;
}) {
  const { ref, tour: tourSlug, name, email, date, travelers, coupon, discount: discountParam } =
    await searchParams;
  const tour = tourSlug ? getTourBySlug(tourSlug) : undefined;

  if (!ref || !tour || !name || !date || !travelers) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-2xl font-serif font-bold">No booking found</h1>
        <p className="mt-2 text-slate-600">It looks like you landed here without completing a booking.</p>
        <Link
          href="/tours"
          className="mt-6 inline-block rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
        >
          Browse Tours
        </Link>
      </div>
    );
  }

  const count = Number(travelers) || 1;
  const subtotal = tour.pricePerPerson * count;
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
  const couponDiscount = coupon && discountParam ? Number(discountParam) : 0;
  const total = subtotal + serviceFee - couponDiscount;
  const formattedDate = new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <svg aria-hidden width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <h1 className="mt-4 text-3xl font-serif font-bold">Booking confirmed!</h1>
        <p className="mt-2 text-slate-600">
          Thanks, {name.split(" ")[0]}! {email ? `A confirmation has been sent to ${email}.` : ""}
        </p>
        <p className="mt-4 inline-block rounded-lg bg-slate-100 px-4 py-2 font-mono text-lg font-bold tracking-wider text-slate-900">
          {ref}
        </p>
        <p className="mt-1 text-xs text-slate-500">Your booking reference — keep it handy</p>
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200">
        <div className="relative h-40 bg-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={tour.image} alt={tour.title} className="h-full w-full object-cover" />
        </div>
        <div className="p-6">
          <h2 className="text-xl font-bold">{tour.title}</h2>
          <p className="text-sm text-slate-500">
            {tour.destination}, {tour.country} · {tour.durationDays} days
          </p>

          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">Lead traveller</dt>
              <dd className="font-medium text-slate-900">{name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Departure</dt>
              <dd className="font-medium text-slate-900">{formattedDate}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Travellers</dt>
              <dd className="font-medium text-slate-900">{count}</dd>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-3">
              <dt className="text-slate-600">Subtotal</dt>
              <dd className="font-medium text-slate-900">{formatINR(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Service fee (5%)</dt>
              <dd className="font-medium text-slate-900">{formatINR(serviceFee)}</dd>
            </div>
            {coupon && couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <dt>Coupon {coupon}</dt>
                <dd className="font-medium">− {formatINR(couponDiscount)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-slate-200 pt-3 text-base">
              <dt className="font-bold text-slate-900">Total paid</dt>
              <dd className="font-bold text-brand-700">{formatINR(total)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/tours"
          className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Explore More Tours
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
