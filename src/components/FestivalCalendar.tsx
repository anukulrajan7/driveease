import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { FESTIVALS } from "@/data/northeast";

/**
 * A horizontal, snap-scrolling rail of North East festivals in calendar order.
 * Each card deep-links to the destination guide so a traveller can plan a trip
 * around the date. Pure server component — no JS shipped beyond the links.
 */
export default function FestivalCalendar() {
  return (
    <div className="no-scrollbar edge-fade-x -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
      {FESTIVALS.map((f) => (
        <Link
          key={f.name}
          href={`/destinations/${f.destinationSlug}`}
          className="group relative flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent-200 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-brand-600"
        >
          <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500 to-accent-500" />
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700">
              <CalendarDays aria-hidden size={13} />
              {f.window}
              {f.variable && <span className="font-normal text-accent-600/70">·varies</span>}
            </span>
            <ArrowUpRight
              aria-hidden
              size={16}
              className="text-slate-300 transition-colors group-hover:text-accent-600"
            />
          </div>
          <h3 className="mt-4 font-serif text-xl font-bold text-slate-900 group-hover:text-brand-700">
            {f.name}
          </h3>
          <p className="text-sm font-medium text-slate-500">{f.state}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.why}</p>
          <span className="mt-auto pt-4 text-xs font-semibold text-brand-700">
            Plan a trip around it →
          </span>
        </Link>
      ))}
    </div>
  );
}
