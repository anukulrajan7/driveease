export default function AltitudeAdvisory({
  maxElevation,
  note,
}: {
  maxElevation: string;
  note: string;
}) {
  return (
    <div className="mt-8 rounded-2xl border border-sky-200 bg-sky-50 p-5">
      <div className="flex items-start gap-3">
        <svg
          aria-hidden
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mt-0.5 shrink-0 text-sky-600"
        >
          <path d="M3 20l4.5-9 4.5 5 3-4 6 8H3z" />
          <circle cx="18" cy="5" r="2" />
        </svg>
        <div>
          <h2 className="font-bold text-sky-900">High-altitude route</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-sky-800">
            <li>
              <span className="font-semibold">Max elevation:</span> {maxElevation}
            </li>
            <li>{note}</li>
            <li>Stay well hydrated and avoid alcohol for the first 48 hours at altitude.</li>
            <li>
              Report any AMS symptoms — headache, nausea, dizziness, or shortness of breath — to
              your trip captain immediately.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
