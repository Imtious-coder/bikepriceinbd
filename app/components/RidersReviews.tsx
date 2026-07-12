"use client";

import { getBikeBySlug } from "@/data/bike";
import { reviews } from "@/data/reviews";
import { Review } from "@/types/review";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const PER_PAGE = 3;

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Cycles through a few blue-family gradients so avatars feel varied
// without leaving the palette.
const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#1155F5,#4FB8FF)",
  "linear-gradient(135deg,#0B1B3A,#1155F5)",
  "linear-gradient(135deg,#2563EB,#38BDF8)",
  "linear-gradient(135deg,#4F46E5,#60A5FA)",
];

function timeAgo(iso: string): string {
  const days = Math.floor(
    (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (days < 1) return "Today";
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

function StarRow({ rating, size = "w-4 h-4" }: { rating: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={size}
          fill={i <= rating ? "#F5A623" : "none"}
          stroke="#F5A623"
          strokeWidth={i <= rating ? 0 : 1.5}
        >
          <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z" />
        </svg>
      ))}
    </div>
  );
}

function BikeChip({ slug }: { slug: string }) {
  const bike = getBikeBySlug(slug);
  if (!bike) return null;
  const subtitle = [
    bike.engine?.displacement ? `${bike.engine.displacement}cc` : null,
    bike.bike_type,
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <Link
      href={`/bikes/${bike.slug}`}
      className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-2.5 transition-colors hover:bg-blue-50"
    >
      <div className="relative h-10 w-10 flex-shrink-0 rounded-lg bg-white">
        <Image
          src={bike.images?.primary || "/placeholder-bike.png"}
          alt={bike.name}
          fill
          className="object-contain p-1"
          sizes="40px"
        />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-bold text-slate-900">{bike.name}</p>
        {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
      </div>
    </Link>
  );
}

function ReviewCard({
  review,
  index,
  onExpand,
}: {
  review: Review;
  index: number;
  onExpand: () => void;
}) {
  return (
    <div className="group flex flex-col rounded-2xl border border-blue-100 bg-white p-6 shadow-[0_4px_18px_-10px_rgba(30,64,175,0.15)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_20px_36px_-16px_rgba(30,64,175,0.28)]">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
            style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}
          >
            {initials(review.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900">{review.name}</p>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <svg className="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{review.location}</span>
            </div>
          </div>
        </div>
        {review.verified && (
          <span className="flex flex-shrink-0 items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700 border border-blue-100">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Verified
          </span>
        )}
      </div>

      {/* Bike chip */}
      <div className="mb-4">
        <BikeChip slug={review.bikeSlug} />
      </div>

      {/* Rating + date */}
      <div className="mb-3 flex items-center gap-2">
        <StarRow rating={review.rating} />
        <span className="text-xs text-slate-400">• {timeAgo(review.reviewedAt)}</span>
      </div>

      {/* Text */}
      <p className="mb-5 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-4">
        {review.text}
      </p>

      <button
        onClick={onExpand}
        className="mt-auto inline-flex items-center gap-1.5 self-start rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 transition-colors hover:bg-blue-100"
      >
        Read Full Review
        <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </button>
    </div>
  );
}

export default function RiderReviews() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState<Review | null>(null);

  const categories = useMemo(() => {
    const types = new Set<string>();
    for (const r of reviews) {
      const bike = getBikeBySlug(r.bikeSlug);
      if (bike?.bike_type) types.add(bike.bike_type);
    }
    return Array.from(types).sort();
  }, []);

  const stats = useMemo(() => {
    const totalReviews = reviews.length;
    const uniqueBikes = new Set(reviews.map((r) => r.bikeSlug)).size;
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);
    return { totalReviews, uniqueBikes, avgRating };
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return reviews.filter((r) => {
      if (category !== "All") {
        const bike = getBikeBySlug(r.bikeSlug);
        if (bike?.bike_type !== category) return false;
      }
      if (query) {
        const bike = getBikeBySlug(r.bikeSlug);
        const haystack = `${r.name} ${r.text} ${bike?.name ?? ""}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [category, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const clampedPage = Math.min(page, totalPages - 1);
  const visible = filtered.slice(
    clampedPage * PER_PAGE,
    clampedPage * PER_PAGE + PER_PAGE,
  );

  // Reset to page 0 whenever the filters change so results aren't hidden
  // on a now out-of-range page.
  useEffect(() => setPage(0), [category, search]);

  useEffect(() => {
    if (!expanded) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(null);
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [expanded]);

  return (
    <section
      className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8"
      style={{
        background:
          "radial-gradient(120% 100% at 50% 0%, #EEF3FF 0%, #F6F9FC 55%, #F6F9FC 100%)",
      }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            What <span className="text-blue-600">Riders</span> Say
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
            Real experiences from real riders. Honest insights from our community
            of motorcycle enthusiasts across Bangladesh.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 shadow-sm">
            <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 100-8 4 4 0 000 8zm6 0a4 4 0 10-8 0" />
            </svg>
            <span className="text-sm font-bold text-slate-900">{stats.totalReviews}+</span>
            <span className="text-xs text-slate-400">Reviews</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 shadow-sm">
            <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 17a2 2 0 100 4 2 2 0 000-4zM19 17a2 2 0 100 4 2 2 0 000-4zM5 17l2-7h10l2 7M7 10l2-5h6l1 5" />
            </svg>
            <span className="text-sm font-bold text-slate-900">{stats.uniqueBikes}+</span>
            <span className="text-xs text-slate-400">Bike Models</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 shadow-sm">
            <svg className="h-4 w-4" fill="#F5A623" viewBox="0 0 20 20">
              <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z" />
            </svg>
            <span className="text-sm font-bold text-slate-900">{stats.avgRating.toFixed(1)}</span>
            <span className="text-xs text-slate-400">Avg Rating</span>
          </div>
        </div>

        {/* Search */}
        <div className="mx-auto mb-6 max-w-md">
          <div className="relative">
            <svg className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for bike reviews (e.g. Gixxer SF 250)..."
              className="w-full rounded-full border border-blue-100 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-500/15"
            />
          </div>
        </div>

        {/* Category filters */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-all duration-300 ${
                category === cat
                  ? "bg-blue-600 text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)]"
                  : "border border-blue-100 bg-white text-slate-500 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards */}
        {visible.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((review, i) => (
              <ReviewCard
                key={review.id}
                review={review}
                index={i}
                onExpand={() => setExpanded(review)}
              />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-sm text-slate-400">
            No reviews match your search.
          </p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={clampedPage === 0}
              aria-label="Previous reviews"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-500 shadow-sm transition-all hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  aria-label={`Go to page ${i + 1}`}
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: i === clampedPage ? "22px" : "8px",
                    background: i === clampedPage ? "#1155F5" : "rgba(17,85,245,0.2)",
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={clampedPage === totalPages - 1}
              aria-label="Next reviews"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-500 shadow-sm transition-all hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Full review modal */}
      {expanded && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Review by ${expanded.name}`}
        >
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setExpanded(null)}
          />
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-blue-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
                  style={{ background: AVATAR_GRADIENTS[0] }}
                >
                  {initials(expanded.name)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{expanded.name}</p>
                  <p className="text-xs text-slate-400">{expanded.location}</p>
                </div>
              </div>
              <button
                onClick={() => setExpanded(null)}
                aria-label="Close"
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-6">
              <div className="mb-4">
                <BikeChip slug={expanded.bikeSlug} />
              </div>
              <div className="mb-3 flex items-center gap-2">
                <StarRow rating={expanded.rating} size="w-5 h-5" />
                <span className="text-xs text-slate-400">
                  • {timeAgo(expanded.reviewedAt)}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">{expanded.text}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}