import { posts, getPostBySlug } from "@/data/content";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/ogImage";

export const alt = "Travel guide | Siliguri Holidays";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return renderOgImage({
    eyebrow: post?.category ?? "Travel guide",
    title: post?.title ?? "North East India travel guide",
    subtitle: (post?.excerpt ?? "").slice(0, 120),
    image: post?.image,
  });
}
