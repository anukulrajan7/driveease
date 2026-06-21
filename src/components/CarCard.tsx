import { Users, Briefcase, Snowflake, Cog, Check, ArrowRight } from "lucide-react";
import { Car, formatINR } from "@/data/cars";

export default function CarCard({
  car,
  onBook,
  selected = false,
}: {
  car: Car;
  onBook?: (slug: string) => void;
  selected?: boolean;
}) {
  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10 ${
        selected ? "border-brand-500 ring-2 ring-brand-500/30" : "border-slate-200"
      }`}
    >
      <div className="relative h-44 overflow-hidden bg-slate-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={car.image}
          alt={`${car.name} – ${car.type} for hire in Siliguri`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700">
          {car.type}
        </span>
        {car.popular && (
          <span className="absolute right-3 top-3 rounded-full bg-accent-500 px-3 py-1 text-xs font-bold text-white shadow">
            Popular
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-semibold text-slate-900">{car.name}</h3>
        <p className="mt-0.5 text-sm text-slate-500">{car.bestFor}</p>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1">
            <Users aria-hidden size={14} className="text-brand-500" />
            {car.seats} seats
          </span>
          <span className="inline-flex items-center gap-1">
            <Briefcase aria-hidden size={14} className="text-brand-500" />
            {car.luggage} bags
          </span>
          <span className="inline-flex items-center gap-1">
            <Cog aria-hidden size={14} className="text-brand-500" />
            {car.transmission}
          </span>
          {car.ac && (
            <span className="inline-flex items-center gap-1">
              <Snowflake aria-hidden size={14} className="text-brand-500" />
              AC
            </span>
          )}
        </div>

        <ul className="mt-3 grid grid-cols-2 gap-1 text-xs text-slate-600">
          {car.features.map((f) => (
            <li key={f} className="inline-flex items-center gap-1">
              <Check aria-hidden size={13} className="shrink-0 text-emerald-500" />
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-end justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-lg font-bold text-slate-900">
              {formatINR(car.pricePerDay)}
              <span className="text-sm font-normal text-slate-500">/day</span>
            </p>
            <p className="text-xs text-slate-500">+ {formatINR(car.perKm)}/km · driver included</p>
          </div>
          {onBook && (
            <button
              type="button"
              onClick={() => onBook(car.slug)}
              className="inline-flex items-center gap-1 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              {selected ? "Selected" : "Book"}
              <ArrowRight aria-hidden size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
