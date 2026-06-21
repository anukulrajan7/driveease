/**
 * Shared form primitives — single source of truth for control styling
 * (shadcn-style appearance, no dependency). Every input/select/textarea
 * on the site renders through these so heights, borders, radii, and
 * focus rings are identical everywhere.
 *
 * Dropdowns and date pickers use the custom popover controls in
 * `ui-controls.tsx` instead of the browser-native UI — `Select` and
 * `Input type="date"` delegate there automatically, so call sites are
 * unchanged.
 */

import { base, inputClass, tone } from "./ui-styles";
import { DateField, Select } from "./ui-controls";

export { inputClass, Select };

export function Input({
  invalid,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  // Native date input UI looks out of place — use the calendar popover.
  if (props.type === "date") {
    return <DateField invalid={invalid} className={className} {...props} />;
  }
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
