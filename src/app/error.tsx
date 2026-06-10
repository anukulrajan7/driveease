"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-semibold text-accent-600">Something went wrong</p>
      <h1 className="mt-2 text-3xl font-serif font-bold">We hit a bump on the trail</h1>
      <p className="mt-2 text-slate-600">An unexpected error occurred. Trying again usually fixes it.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
      >
        Try again
      </button>
    </div>
  );
}
