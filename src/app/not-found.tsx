import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-semibold text-brand-700">404</p>
      <h1 className="mt-2 text-3xl font-serif font-bold">This page wandered off</h1>
      <p className="mt-2 text-slate-600">We couldn&apos;t find what you were looking for — but there are plenty of trips waiting.</p>
      <Link
        href="/tours"
        className="mt-6 inline-block rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
      >
        Browse Tours
      </Link>
    </div>
  );
}
