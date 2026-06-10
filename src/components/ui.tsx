/**
 * Shared form primitives — single source of truth for control styling
 * (shadcn-style appearance, no dependency). Every input/select/textarea
 * on the site renders through these so heights, borders, radii, and
 * focus rings are identical everywhere.
 */

const base =
  "w-full rounded-lg border bg-white text-sm text-slate-900 transition-colors " +
  "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600/20 " +
  "disabled:cursor-not-allowed disabled:opacity-60";

const tone = (invalid?: boolean) =>
  invalid
    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
    : "border-slate-300 focus:border-brand-600";

export function inputClass(invalid?: boolean, className = ""): string {
  return `${base} ${tone(invalid)} h-11 px-3 ${className}`;
}

export function Input({
  invalid,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return <input {...props} aria-invalid={invalid || undefined} className={inputClass(invalid, className)} />;
}

export function Textarea({
  invalid,
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return (
    <textarea
      {...props}
      aria-invalid={invalid || undefined}
      className={`${base} ${tone(invalid)} px-3 py-2.5 ${className}`}
    />
  );
}

export function Select({
  invalid,
  className = "",
  wrapperClassName = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
  wrapperClassName?: string;
}) {
  return (
    <span className={`relative block ${wrapperClassName}`}>
      <select
        {...props}
        aria-invalid={invalid || undefined}
        className={`${base} ${tone(invalid)} h-11 appearance-none pl-3 pr-9 ${className}`}
      >
        {children}
      </select>
      <svg
        aria-hidden
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </span>
  );
}
