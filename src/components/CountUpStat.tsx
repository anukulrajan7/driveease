"use client";

import { useEffect, useRef, useState } from "react";

/** Parses "75,000+" → { num: 75000, suffix: "+" }; returns null for non-numeric values like "24×7". */
function parseStat(value: string): { num: number; suffix: string; decimals: number } | null {
  const match = value.match(/^([\d,]+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const num = Number(match[1].replace(/,/g, ""));
  if (Number.isNaN(num)) return null;
  const decimals = match[1].includes(".") ? match[1].split(".")[1].length : 0;
  return { num, suffix: match[2], decimals };
}

export default function CountUpStat({ value, label }: { value: string; label: string }) {
  const parsed = parseStat(value);
  const ref = useRef<HTMLParagraphElement>(null);
  const [display, setDisplay] = useState(parsed ? "0" : value);

  useEffect(() => {
    if (!parsed) return;
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const format = (n: number) =>
      parsed.decimals > 0
        ? n.toFixed(parsed.decimals)
        : Math.round(n).toLocaleString("en-IN");

    if (reduced) {
      setDisplay(format(parsed.num) + parsed.suffix);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const duration = 1400;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(format(parsed.num * eased) + (t === 1 ? parsed.suffix : ""));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <p ref={ref} className="font-serif text-3xl font-bold text-brand-800 tabular-nums sm:text-4xl">
        {display}
      </p>
      <p className="mt-1 text-sm text-slate-600">{label}</p>
    </div>
  );
}
