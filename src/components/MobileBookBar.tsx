import Link from "next/link";
import { Tour } from "@/data/tours";

export default function MobileBookBar({ tour }: { tour: Tour }) {
  return (
    <div className="lg:hidden fixed inset-x-0 bottom-14 z-40 border-t border-slate-200 bg-white/95 backdrop-blur px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{tour.title}</p>
          <p className="text-xs text-slate-500">{tour.durationDays} days · small group</p>
        </div>
        <Link
          href={`/book/${tour.slug}`}
          className="shrink-0 rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
        >
          Request to Book
        </Link>
      </div>
    </div>
  );
}
