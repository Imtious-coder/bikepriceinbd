"use client";

import { blogPosts, getAllCategories } from "@/data/Blog";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogsPage() {
  const categories = useMemo(() => getAllCategories(), []);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [search, setSearch] = useState("");

  const sortedPosts = useMemo(
    () =>
      [...blogPosts].sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      ),
    [],
  );

  const [featured, ...rest] = sortedPosts;

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rest.filter((post) => {
      if (activeCategory !== "All" && post.category !== activeCategory)
        return false;
      if (query) {
        const haystack = `${post.title} ${post.excerpt}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [rest, activeCategory, search]);

  return (
    <div className="min-h-screen bg-[#F6F9FC]">
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
            href="/"
            className="text-sm font-medium text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Bikes
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Heading */}
        <h1 className="text-center text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Bike <span className="text-blue-600">Blogs</span> &amp; Guides
        </h1>
        <p className="text-center text-sm text-slate-500 mb-10">
          Reviews, comparisons, and buying advice for the Bangladeshi motorcycle market.
        </p>

        {/* Featured post */}
        {featured && (
          <Link
            href={`/blogs/${featured.slug}`}
            className="group block mb-12 bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-[0_8px_30px_-12px_rgba(30,64,175,0.18)] hover:border-blue-300 transition-all"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-56 lg:h-full min-h-[260px] bg-gradient-to-b from-slate-50 to-blue-50/60">
                <Image
                  src={featured.coverImage}
                  alt={featured.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <span className="absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full bg-blue-600 text-white shadow-sm">
                  Featured
                </span>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
                  {featured.category}
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 leading-snug mb-3 group-hover:text-blue-700 transition-colors">
                  {featured.title}
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>{featured.author}</span>
                  <span>•</span>
                  <span>{formatDate(featured.publishedAt)}</span>
                  <span>•</span>
                  <span>{featured.readTimeMinutes} min read</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
          <div className="relative flex-shrink-0 w-full sm:w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-9 pr-4 py-2 rounded-full text-sm font-medium bg-white border border-blue-100 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {["All", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)]"
                    : "bg-white border border-blue-100 text-slate-500 hover:text-blue-600 hover:border-blue-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-slate-400 mb-6">
          <span className="font-semibold text-slate-700">{filteredPosts.length}</span>{" "}
          {filteredPosts.length === 1 ? "article" : "articles"}
        </p>

        {/* Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blogs/${post.slug}`}
                className="group block bg-white border border-blue-100 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_16px_32px_-14px_rgba(37,99,235,0.3)]"
              >
                <div className="relative h-44 bg-gradient-to-b from-slate-50 to-blue-50/60">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur border border-blue-200 text-blue-700 shadow-sm">
                    {post.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-slate-900 leading-snug mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{formatDate(post.publishedAt)}</span>
                    <span>•</span>
                    <span>{post.readTimeMinutes} min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-slate-400 py-16">
            No articles match your search.
          </p>
        )}
      </main>
    </div>
  );
}