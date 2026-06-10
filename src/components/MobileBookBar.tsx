import Link from "next/link";
import { Tour, formatINR, discountPercent } from "@/data/tours";

export default function MobileBookBar({ tour }: { tour: Tour }) {
  const discount = discountPercent(tour);

  return (
    <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur px-4 pt-3 pb-[env(safe-area-inset-bottom,12px)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-slate-400">
            <s>{formatINR(tour.originalPricePerPerson)}</s>{" "}
            <span className="font-semibold text-accent-600">{discount}% off</span>
          </p>
          <p>
            <span className="text-lg font-bold text-slate-900">{formatINR(tour.pricePerPerson)}</span>
            <span className="text-xs text-slate-500"> per person</span>
          </p>
        </div>
        <Link
          href={`/book/${tour.slug}`}
          className="shrink-0 rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
