import type { Metadata } from "next";
import Link from "next/link";
import { posts, formatPostDate } from "@/data/content";
import NewsletterCTA from "@/components/NewsletterCTA";

export const metadata: Metadata = {
  title: "Travel Stories & Guides",
  description:
    "Practical travel guides, destination itineraries, and food & culture stories from the Siliguri Holidays team.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const featured = posts.find((p) => p.featured);
  const allNonFeatured = posts.filter((p) => !p.featured);

  const categories = Array.from(new Set(posts.map((p) => p.category)));
  const activeCategory = category ?? null;

  const rest = activeCategory
    ? allNonFeatured.filter((p) => p.category === activeCategory)
    : allNonFeatured;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-16 sm:px-6 md:pb-24">
      <div className="mb-10">
        <h1 className="text-3xl font-serif font-bold tracking-tight text-slate-900 sm:text-4xl">
          Travel stories &amp; guides
        </h1>
        <p className="mt-2 max-w-2xl text-slate-500">
          Practical advice, honest itineraries, and food &amp; culture
          dispatches from our team of travel specialists on the ground.
        </p>
      </div>

      <div className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        <Link
          href="/blog"
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
            !activeCategory
              ? "bg-brand-600 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/blog?category=${encodeURIComponent(cat)}`}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              activeCategory === cat
                ? "bg-brand-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {featured && (
        <div className="mb-12">
          <Link
            href={`/blog/${featured.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 shadow-sm transition hover:shadow-md sm:flex-row"
          >
            <div className="sm:w-1/2 sm:shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.image}
                alt={featured.title}
                className="h-60 w-full object-cover sm:h-full"
              />
            </div>
            <div className="flex flex-col justify-center gap-3 p-6 sm:p-8">
              <span className="w-fit rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700">
                {featured.category}
              </span>
              <h2 className="text-2xl font-bold leading-snug text-slate-900 group-hover:text-brand-700">
                {featured.title}
              </h2>
              <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
                {featured.excerpt}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                <span className="font-medium text-slate-700">
                  {featured.author.name}
                </span>
                <span aria-hidden>·</span>
                <span>{formatPostDate(featured.date)}</span>
                <span aria-hidden>·</span>
                <span>{featured.readMinutes} min read</span>
              </div>
            </div>
          </Link>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 shadow-sm transition hover:shadow-md"
          >
            <div className="aspect-video overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.title}
                className="h-full w-full object-cover transition group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-5">
              <span className="w-fit rounded-full bg-accent-50 px-2.5 py-0.5 text-xs font-semibold text-accent-700">
                {post.category}
              </span>
              <h2 className="font-bold leading-snug text-slate-900 group-hover:text-brand-700">
                {post.title}
              </h2>
              <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
                {post.excerpt}
              </p>
              <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-3 text-xs text-slate-500">
                <span className="font-medium text-slate-700">
                  {post.author.name}
                </span>
                <span aria-hidden>·</span>
                <span>{formatPostDate(post.date)}</span>
                <span aria-hidden>·</span>
                <span>{post.readMinutes} min read</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16">
        <NewsletterCTA />
      </div>
    </div>
  );
}
