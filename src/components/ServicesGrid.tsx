import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/data/services";
import { SERVICE_ICONS } from "@/lib/serviceIcons";

/** Grid of image-led service cards. Car rental leads; each card links to its page. */
export default function ServicesGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {SERVICES.map((s) => {
        const Icon = SERVICE_ICONS[s.iconKey];
        const href = s.externalHref ?? `/services/${s.slug}`;
        return (
          <Link
            key={s.slug}
            href={href}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-brand-600"
          >
            <div className="relative h-40 overflow-hidden bg-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.image}
                alt={s.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />
              <span className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-xl bg-white/95 text-brand-700 shadow-sm backdrop-blur transition-colors group-hover:bg-brand-600 group-hover:text-white">
                <Icon aria-hidden size={20} />
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-semibold text-slate-900 group-hover:text-brand-700">{s.title}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">{s.short}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600">
                {s.externalHref ? "View fleet & book" : "Learn more & enquire"}
                <ArrowRight aria-hidden size={15} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
