"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tour, formatINR, SERVICE_FEE_RATE } from "@/data/tours";
import { getOfferByCode, offerDiscount, Offer } from "@/data/content";
import { Input, Select, Textarea } from "@/components/ui";

interface FormState {
  name: string;
  email: string;
  phone: string;
  date: string;
  travelers: number;
  requests: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

type CouponState =
  | { status: "idle" }
  | { status: "emi"; offer: Offer }
  | { status: "applied"; offer: Offer; discount: number }
  | { status: "error" };

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          className={i <= Math.round(rating) ? "text-accent-500" : "text-slate-300"}
          aria-hidden
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

export default function BookingForm({
  tour,
  initialDate,
  initialTravelers,
  initialCoupon,
}: {
  tour: Tour;
  initialDate?: string;
  initialTravelers?: number;
  initialCoupon?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    date: initialDate ?? "",
    travelers: Math.min(Math.max(initialTravelers ?? 2, 1), tour.maxGroupSize),
    requests: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const [couponOpen, setCouponOpen] = useState(!!initialCoupon);
  const [couponInput, setCouponInput] = useState(initialCoupon ?? "");
  const [couponState, setCouponState] = useState<CouponState>({ status: "idle" });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const subtotal = tour.pricePerPerson * form.travelers;
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
  const discount = couponState.status === "applied" ? couponState.discount : 0;
  const total = subtotal + serviceFee - discount;

  const applyCode = (code: string) => {
    const offer = getOfferByCode(code);
    if (!offer) {
      setCouponState({ status: "error" });
      return;
    }
    if (offer.discountPercent === 0) {
      setCouponState({ status: "emi", offer });
      return;
    }
    const amt = offerDiscount(offer, subtotal);
    setCouponState({ status: "applied", offer, discount: amt });
  };

  useEffect(() => {
    if (initialCoupon) {
      applyCode(initialCoupon);
    }
    // only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recompute discount when travelers change while a code is applied
  useEffect(() => {
    setCouponState((prev) => {
      if (prev.status !== "applied") return prev;
      return { status: "applied", offer: prev.offer, discount: offerDiscount(prev.offer, subtotal) };
    });
  }, [subtotal]);

  const handleApply = () => {
    applyCode(couponInput);
  };

  const handleRemove = () => {
    setCouponState({ status: "idle" });
    setCouponInput("");
  };

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): Errors => {
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Please enter a valid email address.";
    if (!/^[\d+\-() ]{8,15}$/.test(form.phone.trim())) next.phone = "Please enter a valid phone number.";
    if (!form.date) next.date = "Please choose a departure date.";
    else if (form.date < minDate) next.date = "Departure date must be in the future.";
    if (form.travelers < 1 || form.travelers > tour.maxGroupSize)
      next.travelers = `Travellers must be between 1 and ${tour.maxGroupSize}.`;
    return next;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setSubmitting(true);

    const ref = `DE-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const params = new URLSearchParams({
      ref,
      tour: tour.slug,
      name: form.name.trim(),
      email: form.email.trim(),
      date: form.date,
      travelers: String(form.travelers),
    });
    if (couponState.status === "applied") {
      params.set("coupon", couponState.offer.code);
      params.set("discount", String(couponState.discount));
    }
    router.push(`/confirmation?${params.toString()}`);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold">Traveller details</h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="bf-name" className="mb-1 block text-sm font-medium text-slate-700">
              Full name
            </label>
            <Input
              id="bf-name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              invalid={!!errors.name}
            />
            {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="bf-email" className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <Input
              id="bf-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              invalid={!!errors.email}
            />
            {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="bf-phone" className="mb-1 block text-sm font-medium text-slate-700">
              Phone
            </label>
            <Input
              id="bf-phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              invalid={!!errors.phone}
            />
            {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="bf-date" className="mb-1 block text-sm font-medium text-slate-700">
              Departure date
            </label>
            <Input
              id="bf-date"
              type="date"
              min={minDate}
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              invalid={!!errors.date}
            />
            {errors.date && <p className="mt-1 text-xs text-rose-600">{errors.date}</p>}
          </div>

          <div>
            <label htmlFor="bf-travelers" className="mb-1 block text-sm font-medium text-slate-700">
              Travellers
            </label>
            <Select
              id="bf-travelers"
              value={form.travelers}
              onChange={(e) => set("travelers", Number(e.target.value))}
              invalid={!!errors.travelers}
            >
              {Array.from({ length: tour.maxGroupSize }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "traveller" : "travellers"}
                </option>
              ))}
            </Select>
            {errors.travelers && <p className="mt-1 text-xs text-rose-600">{errors.travelers}</p>}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="bf-requests" className="mb-1 block text-sm font-medium text-slate-700">
              Special requests <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <Textarea
              id="bf-requests"
              rows={3}
              value={form.requests}
              onChange={(e) => set("requests", e.target.value)}
              placeholder="Dietary needs, accessibility, celebrations…"
            />
          </div>
        </div>

        {/* Coupon section */}
        <div className="mt-5">
          {!couponOpen ? (
            <button
              type="button"
              onClick={() => setCouponOpen(true)}
              className="text-sm text-brand-600 underline-offset-2 hover:underline"
            >
              Have a promo code?
            </button>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-2 text-sm font-medium text-slate-700">Promo code</p>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value.toUpperCase());
                    setCouponState({ status: "idle" });
                  }}
                  placeholder="Enter code"
                  className="flex-1 font-mono uppercase tracking-wide"
                  aria-label="Promo code"
                />
                <button
                  type="button"
                  onClick={handleApply}
                  className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                >
                  Apply
                </button>
              </div>

              {couponState.status === "error" && (
                <p className="mt-2 text-xs text-rose-600">That code didn&apos;t work.</p>
              )}
              {couponState.status === "emi" && (
                <p className="mt-2 text-xs text-slate-600">
                  EMI offer noted — no price change. You&apos;ll see EMI options at payment.
                </p>
              )}
              {couponState.status === "applied" && (
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs font-semibold text-emerald-700">
                    ✓ {couponState.offer.code} applied — you save {formatINR(couponState.discount)}
                  </p>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="ml-3 text-xs text-rose-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Trust cluster */}
        <div className="mt-5 flex flex-col gap-2 rounded-xl bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <StarRating rating={tour.rating} />
            <span className="text-sm text-slate-700">
              <strong>{tour.rating}</strong>{" "}
              <span className="text-slate-500">({tour.reviewsCount} reviews)</span>
            </span>
          </div>
          <p className="text-xs text-slate-500">
            🔒 Secure checkout &middot; Free cancellation up to 7 days
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-xl bg-brand-600 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Confirming…" : `Confirm Booking · ${formatINR(total)}`}
        </button>
        <p className="mt-3 text-center text-xs text-slate-500">
          This is a demo — no payment will be taken.
        </p>
      </form>

      <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-bold">Booking summary</h2>
        <div className="mt-3 flex gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tour.image}
            alt=""
            className="h-16 w-20 shrink-0 rounded-lg object-cover"
          />
          <div>
            <p className="font-semibold text-slate-900">{tour.title}</p>
            <p className="text-sm text-slate-500">
              {tour.destination} · {tour.durationDays} days
            </p>
          </div>
        </div>

        <dl className="mt-5 space-y-2 border-t border-slate-200 pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-600">
              {formatINR(tour.pricePerPerson)} × {form.travelers}{" "}
              {form.travelers === 1 ? "traveller" : "travellers"}
            </dt>
            <dd className="font-medium text-slate-900">{formatINR(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-600">Service fee (5%)</dt>
            <dd className="font-medium text-slate-900">{formatINR(serviceFee)}</dd>
          </div>
          {couponState.status === "applied" && (
            <div className="flex justify-between text-emerald-700">
              <dt>Coupon {couponState.offer.code}</dt>
              <dd className="font-medium">− {formatINR(couponState.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-slate-200 pt-3 text-base">
            <dt className="font-bold text-slate-900">Total</dt>
            <dd className="font-bold text-slate-900">{formatINR(total)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
