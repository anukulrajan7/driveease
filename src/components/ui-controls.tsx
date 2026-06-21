"use client";

/**
 * Interactive form controls that replace the browser-native dropdown and
 * date-picker UI (which look out of place against the rest of the site).
 *
 * - `Select` is a drop-in for the old native <select>: it still accepts
 *   <option> children, the same `value`/`onChange` API (onChange receives a
 *   { target: { value, name } }-shaped event so existing handlers that read
 *   `e.target.value` keep working), plus keyboard nav and click-outside.
 * - `DateField` renders a styled calendar popover instead of the native
 *   date input. `Input type="date"` delegates here automatically.
 *
 * Both popovers are portaled to <body> with fixed positioning so they
 * escape any `overflow: hidden` ancestor or backdrop-blur stacking context
 * (e.g. the hero search bar and the car-rental form card).
 */

import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { inputClass } from "./ui-styles";

/* ------------------------------------------------------------------ */
/* Shared: dismiss + portal positioning                                */
/* ------------------------------------------------------------------ */

/** Close when clicking outside *any* of the given elements (trigger + portaled panel). */
function useDismiss(
  open: boolean,
  close: () => void,
  refs: React.RefObject<HTMLElement | null>[],
) {
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (refs.some((r) => r.current?.contains(t))) return;
      close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, close]);
}

type Rect = { top: number; bottom: number; left: number; width: number };

/** Track the trigger's viewport rect while open (recomputes on scroll/resize). */
function useAnchorRect(anchorRef: React.RefObject<HTMLElement | null>, open: boolean) {
  const [rect, setRect] = useState<Rect | null>(null);
  useEffect(() => {
    if (!open) return;
    const measure = () => {
      const el = anchorRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, bottom: r.bottom, left: r.left, width: r.width });
    };
    measure();
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [open, anchorRef]);
  return rect;
}

/** Fixed-position style for a panel anchored under (or over) the trigger. */
function panelStyle(rect: Rect, desiredHeight: number, fixedWidth?: number): React.CSSProperties {
  const gap = 4;
  const margin = 8;
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const spaceBelow = vh - rect.bottom;
  const spaceAbove = rect.top;
  const below = spaceBelow >= desiredHeight || spaceBelow >= spaceAbove;
  const width = fixedWidth ?? rect.width;
  const left = Math.max(margin, Math.min(rect.left, vw - width - margin));
  const style: React.CSSProperties = { position: "fixed", left, width, zIndex: 1000 };
  if (below) {
    style.top = rect.bottom + gap;
    style.maxHeight = Math.max(140, spaceBelow - gap - margin);
  } else {
    style.bottom = vh - rect.top + gap;
    style.maxHeight = Math.max(140, spaceAbove - gap - margin);
  }
  return style;
}

const triggerClass = (invalid?: boolean, className = "") =>
  inputClass(invalid, `flex items-center justify-between gap-2 text-left ${className}`);

const panelClass =
  "overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg " +
  "shadow-slate-900/10 ring-1 ring-black/5";

/* ------------------------------------------------------------------ */
/* Select                                                              */
/* ------------------------------------------------------------------ */

type Opt = { value: string; label: React.ReactNode; disabled?: boolean };

function flattenOptions(children: React.ReactNode): Opt[] {
  const out: Opt[] = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    // <optgroup> support — recurse into its children.
    if (child.type === "optgroup") {
      out.push(...flattenOptions((child.props as { children?: React.ReactNode }).children));
      return;
    }
    if (child.type === "option") {
      const p = child.props as React.OptionHTMLAttributes<HTMLOptionElement>;
      out.push({
        value: String(p.value ?? ""),
        label: p.children,
        disabled: p.disabled,
      });
    }
  });
  return out;
}

export function Select({
  invalid,
  className = "",
  wrapperClassName = "",
  children,
  value,
  onChange,
  id,
  name,
  required,
  disabled,
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
  wrapperClassName?: string;
}) {
  const options = flattenOptions(children);
  const current = String(value ?? "");
  const selected = options.find((o) => o.value === current);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLUListElement>(null);
  useDismiss(open, () => setOpen(false), [triggerRef, panelRef]);
  const rect = useAnchorRect(triggerRef, open);
  const reactId = useId();
  const listId = `${id ?? reactId}-listbox`;

  const choose = (opt: Opt) => {
    if (opt.disabled) return;
    setOpen(false);
    // Synthesize a native-like event so existing `e.target.value` handlers work.
    onChange?.({ target: { value: opt.value, name: name ?? "" } } as unknown as React.ChangeEvent<HTMLSelectElement>);
  };

  const openWith = (idx: number) => {
    setActive(idx < 0 ? 0 : idx);
    setOpen(true);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (disabled) return;
    const move = (dir: 1 | -1) => {
      e.preventDefault();
      if (!open) {
        openWith(options.findIndex((o) => o.value === current));
        return;
      }
      let i = active;
      for (let step = 0; step < options.length; step++) {
        i = (i + dir + options.length) % options.length;
        if (!options[i]?.disabled) break;
      }
      setActive(i);
    };
    switch (e.key) {
      case "ArrowDown":
        move(1);
        break;
      case "ArrowUp":
        move(-1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open && options[active]) choose(options[active]);
        else openWith(options.findIndex((o) => o.value === current));
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  // Keep the highlighted option scrolled into view.
  useEffect(() => {
    if (!open) return;
    const node = panelRef.current?.children[active] as HTMLElement | undefined;
    node?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  return (
    <div className={`relative block ${wrapperClassName}`}>
      <button
        type="button"
        id={id}
        ref={triggerRef}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => (open ? setOpen(false) : openWith(options.findIndex((o) => o.value === current)))}
        onKeyDown={onKey}
        className={triggerClass(invalid, className)}
      >
        <span className={`truncate ${selected ? "text-slate-900" : "text-slate-400"}`}>
          {selected ? selected.label : "Select…"}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {name != null && <input type="hidden" name={name} value={current} required={required} />}

      {open &&
        rect &&
        createPortal(
          <ul
            ref={panelRef}
            id={listId}
            role="listbox"
            tabIndex={-1}
            style={{ ...panelStyle(rect, Math.min(options.length * 40 + 8, 264)), overflowY: "auto" }}
            className={panelClass + " py-1"}
          >
            {options.map((opt, i) => {
              const isSel = opt.value === current;
              return (
                <li
                  key={`${opt.value}-${i}`}
                  role="option"
                  aria-selected={isSel}
                  aria-disabled={opt.disabled || undefined}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    choose(opt);
                  }}
                  className={`flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm ${
                    opt.disabled
                      ? "cursor-not-allowed text-slate-300"
                      : i === active
                        ? "bg-brand-50 text-brand-900"
                        : "text-slate-700"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSel && <Check size={15} className="shrink-0 text-brand-600" />}
                </li>
              );
            })}
          </ul>,
          document.body,
        )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* DateField (calendar popover)                                        */
/* ------------------------------------------------------------------ */

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const pad = (n: number) => String(n).padStart(2, "0");
const toYMD = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function parseYMD(s?: string): Date | null {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? null : date;
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export function DateField({
  invalid,
  className = "",
  value,
  onChange,
  min,
  max,
  id,
  name,
  required,
  disabled,
  placeholder = "Select date",
}: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  const selected = parseYMD(typeof value === "string" ? value : undefined);
  const minDate = parseYMD(typeof min === "string" ? min : undefined);
  const maxDate = parseYMD(typeof max === "string" ? max : undefined);

  const [open, setOpen] = useState(false);
  // Month currently shown in the calendar grid (first of month).
  const [view, setView] = useState(() => {
    const anchor = selected ?? minDate ?? new Date();
    return new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useDismiss(open, () => setOpen(false), [triggerRef, panelRef]);
  const rect = useAnchorRect(triggerRef, open);

  // Re-anchor the grid on the selected month when opening.
  const toggle = () => {
    if (!open) {
      const anchor = selected ?? minDate ?? new Date();
      setView(new Date(anchor.getFullYear(), anchor.getMonth(), 1));
    }
    setOpen((o) => !o);
  };

  const today = startOfDay(new Date());
  const isDisabled = (d: Date) =>
    (minDate ? startOfDay(d) < startOfDay(minDate) : false) ||
    (maxDate ? startOfDay(d) > startOfDay(maxDate) : false);

  const pick = (d: Date) => {
    if (isDisabled(d)) return;
    setOpen(false);
    onChange?.({ target: { value: toYMD(d), name: name ?? "" } } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  const stepMonth = (delta: number) => setView(new Date(year, month + delta, 1));
  const prevDisabled = minDate
    ? new Date(year, month, 1) <= new Date(minDate.getFullYear(), minDate.getMonth(), 1)
    : false;
  const nextDisabled = maxDate ? new Date(year, month + 1, 1) > maxDate : false;

  const display = selected
    ? `${selected.getDate()} ${MONTHS[selected.getMonth()].slice(0, 3)} ${selected.getFullYear()}`
    : "";

  return (
    <div className="relative block">
      <button
        type="button"
        id={id}
        ref={triggerRef}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={toggle}
        className={triggerClass(invalid, className)}
      >
        <span className={display ? "text-slate-900" : "text-slate-400"}>{display || placeholder}</span>
        <CalendarDays size={16} className="shrink-0 text-slate-400" />
      </button>

      {name != null && (
        <input type="hidden" name={name} value={typeof value === "string" ? value : ""} required={required} />
      )}

      {open &&
        rect &&
        createPortal(
          <div
            ref={panelRef}
            style={panelStyle(rect, 360, 288)}
            className={`${panelClass} px-3 pb-3 pt-2`}
            role="dialog"
            aria-label="Choose date"
          >
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => stepMonth(-1)}
                disabled={prevDisabled}
                aria-label="Previous month"
                className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm font-semibold text-slate-800">
                {MONTHS[month]} {year}
              </span>
              <button
                type="button"
                onClick={() => stepMonth(1)}
                disabled={nextDisabled}
                aria-label="Next month"
                className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="mt-2 grid grid-cols-7 gap-0.5 text-center text-[11px] font-medium text-slate-400">
              {WEEKDAYS.map((w) => (
                <div key={w} className="py-1">
                  {w}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5">
              {cells.map((d, i) => {
                if (!d) return <div key={`e${i}`} />;
                const off = isDisabled(d);
                const isSel = selected && toYMD(d) === toYMD(selected);
                const isToday = toYMD(d) === toYMD(today);
                return (
                  <button
                    key={toYMD(d)}
                    type="button"
                    disabled={off}
                    onClick={() => pick(d)}
                    aria-current={isSel ? "date" : undefined}
                    className={`flex h-9 items-center justify-center rounded-md text-sm transition-colors ${
                      isSel
                        ? "bg-brand-600 font-semibold text-white"
                        : off
                          ? "cursor-not-allowed text-slate-300"
                          : isToday
                            ? "font-semibold text-brand-700 ring-1 ring-inset ring-brand-300 hover:bg-brand-50"
                            : "text-slate-700 hover:bg-brand-50"
                    }`}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
