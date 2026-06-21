import { useId } from "react";

/**
 * SiliguriHolidays emblem.
 * A single fused symbol: the location-pin silhouette frames a Himalayan
 * mountain range (negative space), with a gold "journey" arc curving beneath.
 * Pin + mountains + path unified into one minimal, high-end mark.
 */
export function LogoMark({ size = 36 }: { size?: number }) {
  const id = useId();
  const green = `green-${id}`;
  const gold = `gold-${id}`;

  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className="shrink-0"
    >
      <defs>
        <linearGradient id={green} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1c7a4a" />
          <stop offset="100%" stopColor="#0f3d24" />
        </linearGradient>
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="55%" stopColor="#f0b429" />
          <stop offset="100%" stopColor="#c47f12" />
        </linearGradient>
      </defs>

      {/* Emblem field */}
      <rect width="64" height="64" rx="15" fill={`url(#${green})`} />

      {/* Gold journey arc — the path beneath the destination */}
      <path
        d="M13 53 Q 32 61 51 50"
        fill="none"
        stroke={`url(#${gold})`}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeDasharray="0.5 5.2"
        opacity="0.95"
      />

      {/* Location pin silhouette (gold) */}
      <path
        d="M32 50.5
           C 23.5 37.5 17.5 33 17.5 24
           A 14.5 14.5 0 1 1 46.5 24
           C 46.5 33 40.5 37.5 32 50.5 Z"
        fill={`url(#${gold})`}
      />

      {/* Mountain range as negative space inside the pin */}
      <path
        d="M20 30.5 L27.5 18.5 L31.5 24.5 L37.5 15 L44 30.5 Z"
        fill="#ffffff"
      />
      {/* Snow-line detail on the tallest peak */}
      <path
        d="M37.5 15 L34.4 19.8 L37 21.4 L40.1 19 Z"
        fill={`url(#${green})`}
        opacity="0.85"
      />
    </svg>
  );
}

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span
          className={`text-[1.35rem] font-semibold tracking-tight ${
            light ? "text-white" : "text-slate-900"
          }`}
        >
          Siliguri<span className="font-light text-brand-600">Holidays</span>
        </span>
        <span
          className={`mt-1 text-[0.5rem] font-medium uppercase tracking-[0.32em] ${
            light ? "text-white/60" : "text-slate-400"
          }`}
        >
          Himalayan Journeys · North Bengal
        </span>
      </span>
    </span>
  );
}
