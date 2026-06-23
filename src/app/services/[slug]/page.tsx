import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Check, Phone, ArrowRight, Clock, MapPin, ShieldCheck } from "lucide-react";
import { SERVICES, getServiceBySlug } from "@/data/services";
import { SERVICE_ICONS } from "@/lib/serviceIcons";
import { site } from "@/data/content";
import ServiceLeadForm from "@/components/ServiceLeadForm";
import { abs, breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

export function generateStaticParams() {
  return SERVICES.filter((s) => !s.externalHref).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service not found" };
  return {
    title: `${service.title} in Siliguri`,
    description: service.short,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      type: "website",
      title: `${service.title} — Siliguri Holidays`,
      description: service.short,
      url: abs(`/services/${service.slug}`),
    },
  };
}

const STEPS = [
  { title: "Tell us what you need", desc: "Share the dates, route and group — takes a minute." },
  { title: "We confirm & quote", desc: "Our team replies on WhatsApp or a call with a clear price." },
  { title: "We arrive at your doorstep", desc: "Verified driver, clean vehicle, on time. Pay after." },
];

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();
  if (service.externalHref) redirect(service.externalHref);

  const Icon = SERVICE_ICONS[service.iconKey];
  const phoneHref = `tel:${site.contact.phone.replace(/\s/g, "")}`;
  const others = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 5);

  return (
    <div>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Services", path: "/services" },
            { name: service.title, path: `/services/${service.slug}` },
          ]),
          serviceJsonLd(service),
        ]}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-slate-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={service.image}
          alt=""
          aria-hidden
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-900/90 via-slate-900/65 to-slate-900/75" />
        <div aria-hidden className="grain pointer-events-none absolute inset-0 -z-10" />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-300">
            <Link href="/services" className="hover:text-white hover:underline">Services</Link>{" "}
            / <span className="text-white">{service.title}</span>
          </nav>
          <span className="mt-5 inline-grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-brand-300 backdrop-blur">
            <Icon aria-hidden size={24} />
          </span>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {service.title}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-200">{service.tagline}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="#enquire"
              className="group inline-flex items-center gap-2 rounded-full bg-accent-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent-600/30 transition-all hover:-translate-y-0.5 hover:bg-accent-600"
            >
              Enquire now
              <ArrowRight aria-hidden size={17} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href={phoneHref}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur transition-all hover:bg-white/20"
            >
              <Phone aria-hidden size={17} />
              {site.contact.phone}
            </a>
          </div>
          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-200">
            <li className="inline-flex items-center gap-1.5"><Clock aria-hidden size={15} className="text-brand-300" /> 24×7 support</li>
            <li className="inline-flex items-center gap-1.5"><MapPin aria-hidden size={15} className="text-brand-300" /> Doorstep pickup</li>
            <li className="inline-flex items-center gap-1.5"><ShieldCheck aria-hidden size={15} className="text-brand-300" /> No payment now</li>
          </ul>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_440px]">
          <div>
            <p className="text-lg leading-relaxed text-slate-700">{service.intro}</p>

            <h2 className="mt-10 text-xl font-bold text-slate-900">What&apos;s covered</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {service.offers.map((o) => (
                <li key={o} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                    <Check aria-hidden size={13} />
                  </span>
                  {o}
                </li>
              ))}
            </ul>

            <h2 className="mt-10 text-xl font-bold text-slate-900">How it works</h2>
            <ol className="mt-4 space-y-4">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900">{step.title}</h3>
                    <p className="mt-0.5 text-sm text-slate-600">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Enquiry form */}
          <aside id="enquire" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
            <h2 className="mb-3 text-xl font-bold text-slate-900">Enquire about {service.title.toLowerCase()}</h2>
            <ServiceLeadForm defaultService={service.title} />
          </aside>
        </div>

        {/* Other services */}
        <section className="mt-16 border-t border-slate-200 pt-10">
          <h2 className="text-lg font-bold text-slate-900">Other services</h2>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {others.map((s) => (
              <Link
                key={s.slug}
                href={s.externalHref ?? `/services/${s.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700"
              >
                {s.title}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
