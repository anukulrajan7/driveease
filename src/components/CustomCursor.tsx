"use client";

import { useEffect, useRef } from "react";

/**
 * A trailing glow ring that follows the pointer and grows over interactive
 * elements. Pure enhancement layered above the real cursor (pointer-events
 * none). Disabled on touch / no-hover devices and under reduced motion.
 *
 * `scopeId` restricts the ring to a single section (e.g. the hero) — it only
 * shows while the pointer is over that element.
 */
export default function CustomCursor({ scopeId }: { scopeId?: string }) {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;
    const noHover = window.matchMedia("(hover: none)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (noHover || reduce) return;

    const scopeEl = scopeId ? document.getElementById(scopeId) : null;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;

    const inScope = (e: PointerEvent) => {
      if (!scopeEl) return true;
      const r = scopeEl.getBoundingClientRect();
      return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    };

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      ring.style.opacity = inScope(e) ? "1" : "0";
    };
    const onOver = (e: PointerEvent) => {
      const interactive = (e.target as HTMLElement)?.closest?.(
        'a, button, [role="button"], label, input, select, textarea, summary'
      );
      ring.classList.toggle("cursor-ring--active", !!interactive);
    };
    const onLeaveWindow = () => (ring.style.opacity = "0");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeaveWindow);

    let raf = 0;
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeaveWindow);
    };
  }, [scopeId]);

  return <div ref={ringRef} aria-hidden className="cursor-ring" />;
}
