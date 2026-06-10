export default function NewsletterCTA({ compact }: { compact?: boolean }) {
  return (
    <div
      className={
        compact
          ? "rounded-2xl bg-brand-800 px-6 py-8 text-white"
          : "rounded-2xl bg-brand-800 px-8 py-12 text-white"
      }
    >
      <div className={compact ? "mx-auto max-w-xl text-center" : "mx-auto max-w-2xl text-center"}>
        <h2 className={compact ? "text-xl font-bold" : "text-2xl font-bold sm:text-3xl"}>
          Get NE India trip ideas in your inbox
        </h2>
        <p className={compact ? "mt-2 text-sm text-brand-200" : "mt-3 text-brand-200"}>
          Curated itineraries, hidden gems, and seasonal guides from our on-the-ground specialists.
        </p>
        <div className={compact ? "mt-5 flex flex-col gap-3 sm:flex-row" : "mt-6 flex flex-col gap-3 sm:flex-row"}>
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            placeholder="you@example.com"
            className="h-11 flex-1 rounded-xl border border-brand-600 bg-white/10 px-4 text-sm text-white placeholder:text-brand-300 focus:border-white focus:outline-none"
          />
          <button
            type="button"
            className="rounded-xl bg-accent-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-600"
          >
            Get the guide
          </button>
        </div>
        <p className="mt-3 text-xs text-brand-300">One email a month. No spam.</p>
      </div>
    </div>
  );
}
