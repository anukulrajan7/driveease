import { Star, BadgeCheck, Quote } from "lucide-react";
import type { Testimonial } from "@/data/content";
import Reveal from "./Reveal";

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          aria-hidden
          size={size}
          className={i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}
        />
      ))}
    </span>
  );
}

const AVATAR_TONES = [
  "bg-brand-100 text-brand-800",
  "bg-accent-100 text-accent-700",
  "bg-sky-100 text-sky-800",
  "bg-rose-100 text-rose-700",
  "bg-violet-100 text-violet-800",
  "bg-emerald-100 text-emerald-800",
];

function initials(name: string) {
  return name
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function fmt(date?: string) {
  if (!date) return null;
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

function ReviewCard({ t, i }: { t: Testimonial; i: number }) {
  return (
    <figure className="relative flex h-full w-[300px] shrink-0 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:w-[330px]">
      <Quote aria-hidden size={28} className="absolute right-5 top-5 text-brand-100" />
      <div className="flex items-center justify-between gap-2">
        <Stars rating={t.rating ?? 5} />
        {t.source && <span className="text-xs font-medium text-slate-400">via {t.source}</span>}
      </div>
      <blockquote className="mt-3 line-clamp-5 text-sm leading-relaxed text-slate-700">“{t.quote}”</blockquote>
      <figcaption className="mt-auto flex items-center gap-3 pt-5">
        <span
          aria-hidden
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold ${
            AVATAR_TONES[i % AVATAR_TONES.length]
          }`}
        >
          {initials(t.name)}
        </span>
        <span className="min-w-0">
          <span className="flex items-center gap-1 text-sm font-semibold text-slate-900">
            {t.name}
            <BadgeCheck aria-hidden size={14} className="text-brand-600" />
          </span>
          <span className="block truncate text-xs text-slate-500">
            {t.location ? `${t.location} · ` : ""}
            {t.trip}
            {fmt(t.date) ? ` · ${fmt(t.date)}` : ""}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export default function Reviews({
  testimonials,
  avgRating,
  totalReviews,
  heading = "What travellers say",
}: {
  testimonials: Testimonial[];
  avgRating: string;
  totalReviews: number;
  heading?: string;
}) {
  const sources = Array.from(new Set(testimonials.map((t) => t.source).filter(Boolean))) as string[];
  // Duplicate the list so the marquee can loop seamlessly (translateX -50%).
  const loop = [...testimonials, ...testimonials];

  return (
    <section id="reviews" className="scroll-mt-20 overflow-hidden bg-slate-50 py-14 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-col items-center gap-4 text-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-accent-600">Real trips, real people</p>
              <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">{heading}</h2>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
                <span className="font-serif text-2xl font-bold text-slate-900">{avgRating}</span>
                <Stars rating={Number(avgRating)} size={16} />
              </span>
              <span className="text-sm text-slate-600">
                from <strong className="text-slate-900">{totalReviews.toLocaleString("en-IN")}+</strong> verified
                travellers
              </span>
              {sources.length > 0 && (
                <span className="flex flex-wrap gap-2">
                  {sources.map((s) => (
                    <span key={s} className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                      {s}
                    </span>
                  ))}
                </span>
              )}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Auto-scrolling marquee (pause on hover) */}
      <div className="review-marquee no-scrollbar edge-fade-x mt-10 overflow-x-auto">
        <div className="review-track flex w-max gap-5 px-4 sm:px-6">
          {loop.map((t, i) => (
            <ReviewCard key={`${t.name}-${i}`} t={t} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
