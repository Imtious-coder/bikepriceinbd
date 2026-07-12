import { getBikeBySlug } from "@/data/bike";
// import { blogPosts, getBlogBySlug, getRelatedPosts } from "@/data/blog";
import { blogPosts, getBlogBySlug, getRelatedPosts } from "@/data/Blog";
import { BlogContentBlock } from "@/types/Blog";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatPrice(price?: string): string {
  if (!price || price.trim() === "") return "Price on request";
  const cleaned = price.replace(/BDT/gi, "").trim();
  return cleaned ? `৳ ${cleaned}` : "Price on request";
}

function renderBlock(block: BlogContentBlock, key: number) {
  switch (block.type) {
    case "heading":
      return (
        <h2 key={key} className="text-xl font-bold text-slate-900 mt-8 mb-3">
          {block.text}
        </h2>
      );
    case "paragraph":
      return (
        <p key={key} className="text-slate-600 leading-relaxed mb-4">
          {block.text}
        </p>
      );
    case "quote":
      return (
        <blockquote
          key={key}
          className="border-l-4 border-blue-300 bg-blue-50/50 rounded-r-xl px-5 py-4 my-6 text-slate-700 italic"
        >
          {block.text}
        </blockquote>
      );
    case "list":
      return (
        <ul key={key} className="list-disc pl-5 mb-4 space-y-2">
          {block.items.map((item, i) => (
            <li key={i} className="text-slate-600 leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      );
    case "image":
      return (
        <figure key={key} className="my-6">
          <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden bg-slate-50">
            <Image src={block.src} alt={block.alt} fill className="object-cover" />
          </div>
          {block.caption && (
            <figcaption className="text-xs text-slate-400 text-center mt-2">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    default:
      return null;
  }
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) return { title: "Article Not Found" };
  return {
    title: `${post.title} | BD Bikes Blog`,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedBikes = (post.relatedBikeSlugs ?? [])
    .map((bikeSlug) => getBikeBySlug(bikeSlug))
    .filter((b): b is NonNullable<typeof b> => !!b);

  const relatedPosts = getRelatedPosts(post);

  return (
    <div className="min-h-screen bg-[#F6F9FC] pb-16">
      {/* Header */}
      <header className="bg-white border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_4px_10px_rgba(37,99,235,0.3)]">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">BD Bikes</span>
          </Link>
          <Link
            href="/blogs"
            className="text-sm font-medium text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Articles
          </Link>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blogs" className="hover:text-blue-600 transition-colors">Blogs</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium truncate">{post.title}</span>
        </nav>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Article header */}
        <span className="inline-block text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">
          {post.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-slate-400 mb-6">
          <span className="font-medium text-slate-600">{post.author}</span>
          <span>•</span>
          <span>{formatDate(post.publishedAt)}</span>
          <span>•</span>
          <span>{post.readTimeMinutes} min read</span>
        </div>

        {/* Cover image */}
        <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden bg-gradient-to-b from-slate-50 to-blue-50/60 border border-blue-100 mb-8">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article body */}
        <article className="bg-white border border-blue-100 rounded-2xl px-6 sm:px-10 py-8">
          {post.content.map((block, i) => renderBlock(block, i))}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-blue-100">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Related bikes */}
        {relatedBikes.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Bikes Mentioned in This Article
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {relatedBikes.map((bike) => (
                <Link
                  key={bike.slug}
                  href={`/bikes/${bike.slug}`}
                  className="group flex items-center gap-4 bg-white border border-blue-100 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_12px_28px_-12px_rgba(37,99,235,0.3)]"
                >
                  <div className="relative w-20 h-20 flex-shrink-0 bg-gradient-to-b from-slate-50 to-blue-50/60 rounded-xl">
                    <Image
                      src={bike.images?.primary || "/placeholder-bike.png"}
                      alt={bike.name}
                      fill
                      className="object-contain p-2"
                      sizes="80px"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wide mb-0.5">
                      {bike.brand}
                    </p>
                    <p className="text-sm font-bold text-slate-900 leading-snug truncate group-hover:text-blue-700 transition-colors">
                      {bike.name}
                    </p>
                    <p className="text-sm font-extrabold text-slate-900 mt-1">
                      {formatPrice(bike.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related articles */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-slate-900 mb-4">More in {post.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blogs/${related.slug}`}
                  className="group block bg-white border border-blue-100 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_12px_28px_-12px_rgba(37,99,235,0.3)]"
                >
                  <div className="relative h-32 bg-gradient-to-b from-slate-50 to-blue-50/60">
                    <Image
                      src={related.coverImage}
                      alt={related.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">
                      {related.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-semibold text-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all articles
          </Link>
        </div>
      </main>
    </div>
  );
}