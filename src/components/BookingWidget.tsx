"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Tour, formatINR, discountPercent } from "@/data/tours";
import { Input, Select } from "@/components/ui";

export default function BookingWidget({ tour }: { tour: Tour }) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [travelers, setTravelers] = useState(2);

  const today = new Date();
  today.setDate(today.getDate() + 1);
  const minDate = today.toISOString().split("T")[0];

  const discount = discountPercent(tour);

  const handleBook = () => {
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    params.set("travelers", String(travelers));
    router.push(`/book/${tour.slug}?${params.toString()}`);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
      <p className="text-xs text-slate-400">
        <s>{formatINR(tour.originalPricePerPerson)}</s>{" "}
        <span className="font-bold text-accent-600">{discount}% off</span>
      </p>
      <p>
        <span className="text-2xl font-bold text-slate-900">{formatINR(tour.pricePerPerson)}</span>
        <span className="text-sm text-slate-500"> / person</span>
      </p>

      <div className="mt-4 space-y-3">
        <div>
          <label htmlFor="widget-date" className="mb-1 block text-sm font-medium text-slate-700">
            Departure date
          </label>
          <Input
            id="widget-date"
            type="date"
            min={minDate}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="widget-travelers" className="mb-1 block text-sm font-medium text-slate-700">
            Travellers
          </label>
          <Select
            id="widget-travelers"
            value={travelers}
            onChange={(e) => setTravelers(Number(e.target.value))}
          >
            {Array.from({ length: tour.maxGroupSize }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "traveller" : "travellers"}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-sm">
        <span className="text-slate-600">Estimated total</span>
        <span className="font-semibold text-slate-900">{formatINR(tour.pricePerPerson * travelers)}</span>
      </div>

      <button
        type="button"
        onClick={handleBook}
        className="mt-4 w-full rounded-xl bg-brand-600 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-700"
      >
        Book Now
      </button>

      <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-600">
        <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-accent-500">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span className="font-semibold text-slate-900">{tour.rating}</span>
        <span className="text-slate-400">({tour.reviewsCount} reviews)</span>
      </div>

      <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-slate-500">
        <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <span>Small group — limited to {tour.maxGroupSize} guests</span>
      </div>

      <p className="mt-3 text-center text-xs text-slate-500">
        Free cancellation up to 7 days before departure
      </p>
    </div>
  );
}
