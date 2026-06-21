import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  posts,
  getPostBySlug,
  formatPostDate,
} from "@/data/content";
import { getToursByDestination } from "@/data/tours";
import NewsletterCTA from "@/components/NewsletterCTA";
import JsonLd from "@/components/JsonLd";
import { abs, articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  const canonical = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: abs(canonical),
      images: [{ url: post.image, alt: post.title }],
      publishedTime: post.date,
      authors: [post.author.name],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const destinationTours =
    post.destinationSlug ? getToursByDestination(post.destinationSlug) : [];

  const morePosts = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 pb-16 sm:px-6 md:pb-24">
      <JsonLd
        data={[
          articleJsonLd(post),
          breadcrumbJsonLd([
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <Link href="/blog" className="hover:text-brand-700 hover:underline">
          Blog
        </Link>{" "}
        /{" "}
        <span className="text-slate-700">
          {post.title.length > 50 ? post.title.slice(0, 50) + "…" : post.title}
        </span>
      </nav>

      <div className="mx-auto mt-6 max-w-3xl">
        <span className="rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700">
          {post.category}
        </span>

        <h1 className="mt-3 text-3xl font-serif font-bold leading-snug text-slate-900 sm:text-4xl">
          {post.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
          <span className="font-medium text-slate-800">{post.author.name}</span>
          <span className="text-slate-400" aria-hidden>
            ·
          </span>
          <span className="text-slate-600">{post.author.role}</span>
          <span className="text-slate-400" aria-hidden>
            ·
          </span>
          <span>{formatPostDate(post.date)}</span>
          <span className="text-slate-400" aria-hidden>
            ·
          </span>
          <span>{post.readMinutes} min read</span>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image}
            alt={post.title}
            className="h-64 w-full object-cover sm:h-96"
          />
        </div>

        <article className="mt-10 space-y-8">
          {post.sections.slice(0, Math.ceil(post.sections.length / 2)).map(
            (section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-bold text-slate-900">
                  {section.heading}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-slate-700">
                  {section.body}
                </p>
              </section>
            )
          )}
        </article>

        {destinationTours.length > 0 && (
          <div className="my-10 rounded-2xl border border-brand-100 bg-brand-50 p-6">
            <h3 className="font-bold text-brand-700">
              Plan your trip
            </h3>
            <p className="mt-1 text-sm text-brand-700/80">
              Ready to go? Browse our curated tours for this destination.
            </p>
            <ul className="mt-4 space-y-3">
              {destinationTours.map((tour) => (
                <li key={tour.slug}>
                  <Link
                    href={`/tours/${tour.slug}`}
                    className="flex items-center gap-4 rounded-xl border border-brand-100 bg-white p-3 transition hover:shadow-sm"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="h-14 w-20 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-900">
                        {tour.title}
                      </p>
                      <p className="text-sm text-slate-500">
                        {tour.destination} · {tour.durationDays} days
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-brand-600">
                      View →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={`/destinations/${post.destinationSlug}`}
              className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:underline"
            >
              Explore {post.destinationSlug} destination →
            </Link>
          </div>
        )}

        <article className="space-y-8">
          {post.sections.slice(Math.ceil(post.sections.length / 2)).map(
            (section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-bold text-slate-900">
                  {section.heading}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-slate-700">
                  {section.body}
                </p>
              </section>
            )
          )}
        </article>

        {destinationTours.length > 0 && (
          <div className="mt-10 rounded-2xl bg-slate-50 p-6 text-center">
            <p className="text-lg font-bold text-slate-900">
              Ready to experience this yourself?
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Our guided tours take care of every detail so you can focus on
              the journey.
            </p>
            <Link
              href={`/destinations/${post.destinationSlug}`}
              className="mt-4 inline-block rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              View {post.destinationSlug} tours
            </Link>
          </div>
        )}
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <NewsletterCTA compact />
      </div>

      {morePosts.length > 0 && (
        <div className="mx-auto mt-14 max-w-3xl">
          <h2 className="text-xl font-bold text-slate-900">More stories</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {morePosts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 shadow-sm transition hover:shadow-md"
              >
                <div className="aspect-video overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <span className="w-fit rounded-full bg-accent-50 px-2 py-0.5 text-xs font-semibold text-accent-700">
                    {p.category}
                  </span>
                  <p className="text-sm font-semibold leading-snug text-slate-900 group-hover:text-brand-700">
                    {p.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatPostDate(p.date)} · {p.readMinutes} min read
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
