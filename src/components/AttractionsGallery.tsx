"use client";

import { useCallback, useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import type { Attraction } from "@/data/content";

/**
 * Attraction cards that open a lightbox on click — larger image, full
 * description, and prev/next navigation (arrow keys + Esc supported).
 */
export default function AttractionsGallery({ attractions }: { attractions: Attraction[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;

  const go = useCallback(
    (dir: number) => setIndex((i) => (i === null ? null : (i + dir + attractions.length) % attractions.length)),
    [attractions.length]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, go]);

  const active = index !== null ? attractions[index] : null;

  return (
    <>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {attractions.map((attraction, i) => (
          <button
            key={attraction.name}
            type="button"
            onClick={() => setIndex(i)}
            className="group text-left overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-brand-600"
          >
            <div className="relative aspect-video overflow-hidden bg-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={attraction.image}
                alt={attraction.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-slate-900/55 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                <Maximize2 aria-hidden size={15} />
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-slate-900 group-hover:text-brand-700">{attraction.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-600">{attraction.description}</p>
              <span className="mt-2 inline-block text-xs font-semibold text-brand-700">View photo &amp; details →</span>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.name}
          onClick={() => setIndex(null)}
          className="fixed inset-0 z-[70] grid place-items-center bg-slate-900/80 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setIndex(null)}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-slate-900/55 text-white backdrop-blur transition-colors hover:bg-slate-900/80"
            >
              <X aria-hidden size={18} />
            </button>

            <div className="relative aspect-video bg-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={active.image} alt={active.name} className="h-full w-full object-cover" />
              {attractions.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous"
                    className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-800 shadow transition hover:bg-white"
                  >
                    <ChevronLeft aria-hidden size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next"
                    className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-800 shadow transition hover:bg-white"
                  >
                    <ChevronRight aria-hidden size={20} />
                  </button>
                </>
              )}
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900">{active.name}</h3>
              <p className="mt-2 leading-relaxed text-slate-600">{active.description}</p>
              <p className="mt-4 text-xs text-slate-400">
                {(index ?? 0) + 1} / {attractions.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
