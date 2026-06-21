"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Play } from "lucide-react";

/**
 * Destination card that plays a short looping clip on hover/focus (muted),
 * falling back to the poster image otherwise. Pure progressive enhancement —
 * without JS it's just the image card.
 */
export default function DestinationVideoCard({
  href,
  image,
  videoSrc,
  name,
  country,
  tagline,
  tourCount,
}: {
  href: string;
  image: string;
  videoSrc: string;
  name: string;
  country: string;
  tagline: string;
  tourCount: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const start = () => {
    const v = videoRef.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPlaying(true);
    v.play().catch(() => setPlaying(false));
  };
  const stop = () => {
    setPlaying(false);
    videoRef.current?.pause();
  };

  return (
    <Link
      href={href}
      onMouseEnter={start}
      onMouseLeave={stop}
      onFocus={start}
      onBlur={stop}
      className="group relative block overflow-hidden rounded-2xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-brand-600"
    >
      <div className="relative h-56 bg-slate-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            playing ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />

        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-slate-900/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur opacity-0 transition-opacity group-hover:opacity-100">
          <Play aria-hidden size={11} className="fill-white" /> Preview
        </span>

        <div className="absolute bottom-0 left-0 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/80">{country}</p>
          <h2 className="text-xl font-bold text-white">{name}</h2>
          <p className="mt-0.5 line-clamp-1 text-sm text-white/90">{tagline}</p>
        </div>

        <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700">
          {tourCount} {tourCount === 1 ? "tour" : "tours"}
        </span>
      </div>
    </Link>
  );
}
