/**
 * Pure (server-safe) control styling tokens — shared by the static form
 * primitives in `ui.tsx` and the interactive controls in `ui-controls.tsx`.
 * Keeping these here (no "use client") lets server components import
 * `inputClass` without pulling the interactive controls into their bundle.
 */

export const base =
  "w-full rounded-lg border bg-white text-sm text-slate-900 transition-colors " +
  "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600/20 " +
  "disabled:cursor-not-allowed disabled:opacity-60";

export const tone = (invalid?: boolean) =>
  invalid
    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
    : "border-slate-300 focus:border-brand-600";

export function inputClass(invalid?: boolean, className = ""): string {
  return `${base} ${tone(invalid)} h-11 px-3 ${className}`;
}
