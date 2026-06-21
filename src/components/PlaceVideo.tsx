"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

/**
 * Contained, rounded looping video for a place section — autoplays muted/inline,
 * loops, and falls back to its poster on reduced-motion or load error.
 */
export default function PlaceVideo({
  src,
  poster,
  label,
  caption,
  className = "",
}: {
  src: string;
  poster: string;
  label: string;
  caption?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [showVideo, setShowVideo] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowVideo(false);
      return;
    }
    ref.current?.play().catch(() => setShowVideo(false));
  }, []);

  return (
    <div className={`relative isolate overflow-hidden rounded-2xl bg-slate-200 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} alt={label} className="h-64 w-full object-cover sm:h-80" />
      {showVideo && (
        <video
          ref={ref}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          onError={() => setShowVideo(false)}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
      <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-slate-900/55 px-3.5 py-1.5 text-sm text-white backdrop-blur">
        <MapPin aria-hidden size={14} className="text-brand-300" />
        <span className="font-semibold">{label}</span>
        {caption && <span className="hidden text-slate-300 sm:inline">— {caption}</span>}
      </div>
    </div>
  );
}
