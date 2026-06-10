export default function Loading() {
  return (
    <div className="grid min-h-[50vh] place-items-center" role="status" aria-label="Loading">
      <div className="flex flex-col items-center gap-3">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
        <p className="text-sm text-slate-500">Packing your bags…</p>
      </div>
    </div>
  );
}
