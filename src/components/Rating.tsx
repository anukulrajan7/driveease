export default function Rating({ rating, reviewsCount }: { rating: number; reviewsCount?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" className="fill-amber-400">
        <path d="M12 2l2.92 6.26 6.87.82-5.08 4.7 1.35 6.78L12 17.27l-6.06 3.29 1.35-6.78-5.08-4.7 6.87-.82L12 2z" />
      </svg>
      <span className="font-semibold text-slate-900">{rating.toFixed(1)}</span>
      {reviewsCount !== undefined && (
        <span className="text-slate-500">({reviewsCount} reviews)</span>
      )}
    </span>
  );
}
