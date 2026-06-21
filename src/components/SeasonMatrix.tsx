import { MONTHS, SEASON_MATRIX, SEASON_LEGEND, type SeasonRating } from "@/data/northeast";

const CELL: Record<SeasonRating, string> = {
  peak: "bg-brand-500",
  good: "bg-amber-300",
  limited: "bg-slate-200",
};

const RATING_LABEL: Record<SeasonRating, string> = {
  peak: "Best time",
  good: "Good",
  limited: "Limited — monsoon, snow or closure",
};

const FULL_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * A month-by-region heat grid for "when to go". Scannable at a glance:
 * green = prime, amber = a fine shoulder month, grey = go with care.
 */
export default function SeasonMatrix() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">When to go</h2>
          <p className="mt-1 text-sm text-slate-500">
            North East India runs on three seasons — here&apos;s the sweet spot for each region.
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600">
          {SEASON_LEGEND.map((l) => (
            <li key={l.key} className="inline-flex items-center gap-1.5" title={l.description}>
              <span aria-hidden className={`h-3 w-3 rounded-sm ${CELL[l.key]}`} />
              {l.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="no-scrollbar mt-5 overflow-x-auto">
        <div className="min-w-[520px]">
          {/* Month header */}
          <div className="flex items-center gap-1 pl-[136px]">
            {MONTHS.map((m, i) => (
              <div key={i} className="flex-1 text-center text-[11px] font-semibold uppercase text-slate-400">
                {m}
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className="mt-1.5 space-y-1.5">
            {SEASON_MATRIX.map((row) => (
              <div key={row.region} className="flex items-center gap-1">
                <div className="w-[132px] shrink-0 pr-2 text-right text-sm font-medium text-slate-700">
                  {row.region}
                </div>
                {row.months.map((rating, i) => (
                  <div
                    key={i}
                    title={`${row.region} · ${FULL_MONTHS[i]}: ${RATING_LABEL[rating]}`}
                    className={`h-7 flex-1 rounded ${CELL[rating]} transition-transform hover:scale-110`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <ul className="mt-5 space-y-1.5 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500">
        {SEASON_MATRIX.map((row) => (
          <li key={row.region}>
            <span className="font-semibold text-slate-700">{row.region}:</span> {row.note}
          </li>
        ))}
      </ul>
    </div>
  );
}
