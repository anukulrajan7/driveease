"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import type { HeroClip } from "@/data/media";

/**
 * Full-bleed hero background that plays a *montage* of real North East India
 * clips (the Seven Sisters), with a caption that names the place on screen so
 * the words match the footage.
 *
 * - Plays one clip at a time, crossfading to the next when it ends — only the
 *   current clip is loaded, so it stays light.
 * - Autoplays muted + inline (mobile-safe).
 * - Falls back to the poster image if the user prefers reduced motion or a
 *   clip errors — nothing ever breaks.
 */
export default function HeroVideo({
  poster,
  clips,
  showCaption = true,
}: {
  poster: string;
  clips: HeroClip[];
  showCaption?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [index, setIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      // Sync to a browser capability only known on the client — poster only.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowVideo(false);
      return;
    }
    ref.current?.play().catch(() => setShowVideo(false));
  }, [index]);

  const next = () => setIndex((i) => (i + 1) % clips.length);
  const current = clips[index];

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        aria-hidden
        className="animate-ken-burns absolute inset-0 -z-20 h-full w-full object-cover"
      />
      {showVideo && (
        <video
          key={index}
          ref={ref}
          poster={poster}
          autoPlay
          muted
          playsInline
          preload="auto"
          aria-hidden
          onEnded={next}
          onError={next}
          className="hero-video-fade absolute inset-0 -z-20 h-full w-full object-cover"
        >
          <source src={current.src} type="video/mp4" />
        </video>
      )}

      {showCaption && current && (
        <div
          key={`cap-${index}`}
          className="hero-video-fade pointer-events-none absolute bottom-5 left-4 z-10 flex items-center gap-2 rounded-full bg-slate-900/55 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur sm:left-6 sm:text-sm"
        >
          <MapPin aria-hidden size={14} className="text-brand-300" />
          <span className="font-semibold">{current.place}</span>
          <span className="hidden text-slate-300 sm:inline">— {current.caption}</span>
        </div>
      )}
    </>
  );
}
