import type { Metadata } from "next";
import Link from "next/link";
import { getTourBySlug } from "@/data/tours";
import { getCarBySlug } from "@/data/cars";

export const metadata: Metadata = { title: "Request received" };

function fmtDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <h1 className="text-2xl font-serif font-bold">No request found</h1>
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

function Shell({
  ref_,
  name,
  email,
  children,
  ctaPrimary,
}: {
  ref_: string;
  name: string;
  email?: string;
  children: React.ReactNode;
  ctaPrimary: { href: string; label: string };
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <svg aria-hidden width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <h1 className="mt-4 text-3xl font-serif font-bold">Request received!</h1>
        <p className="mt-2 text-slate-600">
          Thanks, {name.split(" ")[0]}! Our team will reach out within 24 hours to confirm.
          {email ? ` We'll email you at ${email}.` : ""}
        </p>
        <p className="mt-4 inline-block rounded-lg bg-slate-100 px-4 py-2 font-mono text-lg font-bold tracking-wider text-slate-900">
          {ref_}
        </p>
        <p className="mt-1 text-xs text-slate-500">Your request reference — keep it handy</p>
      </div>

      {children}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href={ctaPrimary.href}
          className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
        >
          {ctaPrimary.label}
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

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{
    type?: string;
    ref?: string;
    tour?: string;
    car?: string;
    name?: string;
    email?: string;
    date?: string;
    travelers?: string;
    tripType?: string;
    pickup?: string;
    drop?: string;
  }>;
}) {
  const sp = await searchParams;
  const { type, ref, name, email, date } = sp;

  /* ---- Car rental confirmation ---- */
  if (type === "car") {
    const car = sp.car ? getCarBySlug(sp.car) : undefined;
    if (!ref || !car || !name || !date) return <NotFound />;

    return (
      <Shell ref_={ref} name={name} email={email} ctaPrimary={{ href: "/car-rental", label: "Book Another Car" }}>
        <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200">
          <div className="relative h-40 bg-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={car.image} alt={car.name} className="h-full w-full object-cover" />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold">{car.name}</h2>
            <p className="text-sm text-slate-500">
              {car.type} · {car.seats} seats · driver included
            </p>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-600">Trip type</dt>
                <dd className="font-medium text-slate-900">{sp.tripType ?? "Cab booking"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">Route</dt>
                <dd className="font-medium text-slate-900">
                  {sp.pickup ?? "Siliguri"}
                  {sp.drop ? ` → ${sp.drop}` : ""}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">Pickup date</dt>
                <dd className="font-medium text-slate-900">{fmtDate(date)}</dd>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3">
                <dt className="text-slate-600">Status</dt>
                <dd className="font-semibold text-amber-600">Awaiting confirmation</dd>
              </div>
            </dl>

            <p className="mt-5 rounded-xl bg-brand-50 px-4 py-3 text-sm leading-relaxed text-brand-800">
              No payment has been taken. A trip specialist will confirm the car and share a final
              fare quote shortly.
            </p>
          </div>
        </div>
      </Shell>
    );
  }

  /* ---- Tour booking confirmation ---- */
  const tour = sp.tour ? getTourBySlug(sp.tour) : undefined;
  const travelers = sp.travelers;
  if (!ref || !tour || !name || !date || !travelers) return <NotFound />;

  const count = Number(travelers) || 1;

  return (
    <Shell ref_={ref} name={name} email={email} ctaPrimary={{ href: "/tours", label: "Explore More Tours" }}>
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
              <dd className="font-medium text-slate-900">{fmtDate(date)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Travellers</dt>
              <dd className="font-medium text-slate-900">{count}</dd>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-3">
              <dt className="text-slate-600">Status</dt>
              <dd className="font-semibold text-amber-600">Awaiting confirmation</dd>
            </div>
          </dl>

          <p className="mt-5 rounded-xl bg-brand-50 px-4 py-3 text-sm leading-relaxed text-brand-800">
            No payment has been taken. A trip specialist will confirm availability and share a
            personalised quote shortly.
          </p>
        </div>
      </div>
    </Shell>
  );
}
