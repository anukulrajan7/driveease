import Link from "next/link";
import { MapPin, CalendarDays, ArrowRight } from "lucide-react";
import { Tour } from "@/data/tours";
import Rating from "./Rating";

export default function TourCard({ tour }: { tour: Tour }) {
  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10 focus-visible:ring-2 focus-visible:ring-brand-600"
    >
      <div className="relative h-48 overflow-hidden bg-slate-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tour.image}
          alt={`${tour.title} – ${tour.destination}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700">
          {tour.category}
        </span>
        {tour.badge && (
          <span className="absolute right-3 top-3 rounded-full bg-accent-500 px-3 py-1 text-xs font-bold text-white shadow">
            {tour.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <MapPin aria-hidden size={13} className="text-brand-500" />
            {tour.destination}, {tour.country}
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarDays aria-hidden size={13} className="text-brand-500" />
            {tour.durationDays - 1}N / {tour.durationDays}D
          </span>
        </div>
        <h3 className="mt-2 text-lg font-semibold text-slate-900 group-hover:text-brand-700">
          {tour.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{tour.shortDescription}</p>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          <Rating rating={tour.rating} reviewsCount={tour.reviewsCount} />
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 transition-transform group-hover:translate-x-0.5">
            View details
            <ArrowRight aria-hidden size={15} />
          </span>
        </div>
      </div>
    </Link>
  );
}
