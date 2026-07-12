"use client";

import { getRankedBikes } from "@/data/popularity";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type SortMode = "views" | "sales";

function formatPrice(price?: string): string {
  if (!price || price.trim() === "") return "Price on request";
  const cleaned = price.replace(/BDT/gi, "").trim();
  return cleaned ? `৳ ${cleaned}` : "Price on request";
}

function formatCompact(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `${n}`;
}

// Rank badges: top 3 get a filled blue tone by prominence, the rest a
// plain numbered outline. Stays inside the palette instead of literal
// gold/silver/bronze.
const RANK_STYLES = [
  { bg: "#1155F5", text: "#FFFFFF" }, // #1
  { bg: "#4C7DFA", text: "#FFFFFF" }, // #2
  { bg: "#9DBBFF", text: "#0B1B3A" }, // #3
];

export default function PopularBikes() {
  const [sortBy, setSortBy] = useState<SortMode>("views");
  const [category, setCategory] = useState("All");

  const ranked = useMemo(() => getRankedBikes(sortBy), [sortBy]);

  const categories = useMemo(() => {
    const types = new Set<string>();
    for (const r of ranked) {
      if (r.bike.bike_type) types.add(r.bike.bike_type);
    }
    return Array.from(types).sort();
  }, [ranked]);

  const filtered = useMemo(() => {
    if (category === "All") return ranked;
    return ranked.filter((r) => r.bike.bike_type === category);
  }, [ranked, category]);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F6F9FC]">
      <div className="mx-auto max-w-4xl">
        {/* Heading */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Most <span className="text-blue-600">Popular</span> Bikes
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Ranked by what riders are actually looking at and buying.
            </p>
          </div>

          {/* Sort toggle */}
          <div className="inline-flex flex-shrink-0 gap-1 rounded-full border border-blue-100 bg-white p-1 shadow-sm">
            <button
              onClick={() => setSortBy("views")}
              className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-all duration-300 ${
                sortBy === "views"
                  ? "bg-blue-600 text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)]"
                  : "text-slate-500 hover:text-blue-600"
              }`}
            >
              Most Viewed
            </button>
            <button
              onClick={() => setSortBy("sales")}
              className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-all duration-300 ${
                sortBy === "sales"
                  ? "bg-blue-600 text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)]"
                  : "text-slate-500 hover:text-blue-600"
              }`}
            >
              Best Selling
            </button>
          </div>
        </div>

        {/* Category filter */}
        {categories.length > 1 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {["All", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
                  category === cat
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-slate-400 border border-transparent hover:text-blue-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Ranked list */}
        {filtered.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_8px_30px_-16px_rgba(30,64,175,0.2)]">
            {filtered.map((entry, i) => {
              const rankStyle = RANK_STYLES[i] ?? { bg: "#EFF3FF", text: "#1155F5" };
              return (
                <Link
                  key={entry.bike.slug}
                  href={`/bikes/${entry.bike.slug}`}
                  className="group flex items-center gap-4 px-4 sm:px-6 py-4 transition-colors hover:bg-blue-50/60 border-b border-slate-100 last:border-b-0"
                >
                  {/* Rank */}
                  <div
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-extrabold"
                    style={{ background: rankStyle.bg, color: rankStyle.text }}
                  >
                    {i + 1}
                  </div>

                  {/* Thumbnail */}
                  <div className="relative h-16 w-16 flex-shrink-0 rounded-xl bg-gradient-to-b from-slate-50 to-blue-50/60">
                    <Image
                      src={entry.bike.images?.primary || "/placeholder-bike.png"}
                      alt={entry.bike.name}
                      fill
                      className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
                      sizes="64px"
                    />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-600">
                      {entry.bike.brand}
                    </p>
                    <p className="truncate text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {entry.bike.name}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
                      {sortBy === "views" ? (
                        <>
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{formatCompact(entry.monthlyViews)} views this month</span>
                        </>
                      ) : (
                        <>
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{formatCompact(entry.unitsSold)} sold this month</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Price + CTA */}
                  <div className="flex flex-shrink-0 items-center gap-3">
                    <span className="hidden sm:block text-sm font-extrabold text-slate-900">
                      {formatPrice(entry.bike.price)}
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="py-16 text-center text-sm text-slate-400">
            No popularity data available yet.
          </p>
        )}
      </div>
    </section>
  );
}