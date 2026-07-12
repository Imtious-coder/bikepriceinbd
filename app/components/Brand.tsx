"use client";

import { bikes } from "@/data/bike";
import { OBike } from "@/types/bike";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type TabKey = "brand" | "budget" | "displacement" | "bodyStyle";

type FilterSelection = {
  title: string;
  matches: OBike[];
} | null;

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  {
    key: "brand",
    label: "Brand",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 17a2 2 0 100 4 2 2 0 000-4zM19 17a2 2 0 100 4 2 2 0 000-4zM5 17l2-7h10l2 7M7 10l2-5h6l1 5"
        />
      </svg>
    ),
  },
  {
    key: "budget",
    label: "Budget",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 10v2m9-8a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    key: "displacement",
    label: "Displacement",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    key: "bodyStyle",
    label: "Body Style",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h7"
        />
      </svg>
    ),
  },
];

// Cycles through a small set of blue tints so brand monograms feel varied
// without leaving the blue/white palette.
const MONOGRAM_SHADES = [
  { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-100" },
  { bg: "bg-blue-100/70", text: "text-blue-800", border: "border-blue-200" },
  { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-100" },
  { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-100" },
];

function parseNumber(raw?: string): number | null {
  if (!raw) return null;
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return null;
  const num = parseInt(digits, 10);
  return Number.isNaN(num) || num === 0 ? null : num;
}

function formatPrice(price?: string): string {
  if (!price || price.trim() === "") return "Price on request";
  const cleaned = price.replace(/BDT/gi, "").trim();
  return cleaned ? `৳ ${cleaned}` : "Price on request";
}

function monogram(brand: string): string {
  const parts = brand.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const INITIAL_BRAND_COUNT = 10;

const BUDGET_BUCKETS = [
  { label: "Under ৳1.5 Lakh", min: 0, max: 150_000 },
  { label: "৳1.5 – 3 Lakh", min: 150_000, max: 300_000 },
  { label: "৳3 – 5 Lakh", min: 300_000, max: 500_000 },
  { label: "৳5 Lakh+", min: 500_000, max: Infinity },
];

const DISPLACEMENT_BUCKETS = [
  { label: "Under 125cc", min: 0, max: 125 },
  { label: "125cc – 150cc", min: 125, max: 150 },
  { label: "150cc – 250cc", min: 150, max: 250 },
  { label: "250cc+", min: 250, max: Infinity },
];

export default function BrowseByCategory() {
  const [activeTab, setActiveTab] = useState<TabKey>("brand");
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [selection, setSelection] = useState<FilterSelection>(null);

  // Lock page scroll and allow Escape to close while the modal is open.
  useEffect(() => {
    if (!selection) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelection(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selection]);

  const brandCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const bike of bikes) {
      counts.set(bike.brand, (counts.get(bike.brand) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([brand, count]) => ({ brand, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  const budgetCounts = useMemo(() => {
    return BUDGET_BUCKETS.map((bucket) => {
      const matches = bikes.filter((b) => {
        const price = parseNumber(b.price);
        return price !== null && price >= bucket.min && price < bucket.max;
      });
      return { ...bucket, matches };
    });
  }, []);

  const displacementCounts = useMemo(() => {
    return DISPLACEMENT_BUCKETS.map((bucket) => {
      const matches = bikes.filter((b) => {
        const cc = parseNumber((b as { cc?: string }).cc);
        return cc !== null && cc >= bucket.min && cc < bucket.max;
      });
      return { ...bucket, matches };
    });
  }, []);

  const bodyStyleCounts = useMemo(() => {
    const groups = new Map<string, OBike[]>();
    for (const bike of bikes) {
      if (!bike.bike_type) continue;
      const list = groups.get(bike.bike_type) ?? [];
      list.push(bike);
      groups.set(bike.bike_type, list);
    }
    return Array.from(groups.entries())
      .map(([style, matches]) => ({ style, matches }))
      .sort((a, b) => b.matches.length - a.matches.length);
  }, []);

  const visibleBrands = showAllBrands
    ? brandCounts
    : brandCounts.slice(0, INITIAL_BRAND_COUNT);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F6F9FC]">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-8">
          Browse Bikes <span className="text-blue-600">By</span>
        </h2>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex flex-wrap justify-center gap-1 bg-white border border-blue-100 rounded-full p-1.5 shadow-sm">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.key
                    ? "bg-blue-600 text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)]"
                    : "text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                {tab.icon}
                {tab.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Brand tab */}
        {activeTab === "brand" && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
              {visibleBrands.map(({ brand, count }, i) => {
                const shade = MONOGRAM_SHADES[i % MONOGRAM_SHADES.length];
                return (
                  <button
                    key={brand}
                    onClick={() =>
                      setSelection({
                        title: brand,
                        matches: bikes.filter((b) => b.brand === brand),
                      })
                    }
                    className="group flex flex-col items-center gap-3 bg-white border border-blue-100 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_12px_28px_-12px_rgba(37,99,235,0.3)]"
                  >
                    <div
                      className={`w-14 h-14 rounded-xl ${shade.bg} ${shade.border} border flex items-center justify-center font-bold text-lg ${shade.text} group-hover:scale-105 transition-transform`}
                    >
                      {monogram(brand)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">
                        {brand}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {count} {count === 1 ? "model" : "models"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {brandCounts.length > INITIAL_BRAND_COUNT && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setShowAllBrands((v) => !v)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 transition-all shadow-[0_4px_14px_rgba(37,99,235,0.35)]"
                >
                  {showAllBrands ? "Show Fewer Brands" : "View More Brands"}
                  <svg
                    className={`w-4 h-4 transition-transform ${showAllBrands ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={showAllBrands ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                    />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}

        {/* Budget tab */}
        {activeTab === "budget" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {budgetCounts.map((bucket) => (
              <button
                key={bucket.label}
                onClick={() =>
                  setSelection({ title: bucket.label, matches: bucket.matches })
                }
                className="group bg-white border border-blue-100 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_12px_28px_-12px_rgba(37,99,235,0.3)]"
              >
                <p className="font-bold text-slate-900 text-base mb-1">
                  {bucket.label}
                </p>
                <p className="text-xs text-slate-400">
                  {bucket.matches.length}{" "}
                  {bucket.matches.length === 1 ? "model" : "models"}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Displacement tab */}
        {activeTab === "displacement" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {displacementCounts.map((bucket) => (
              <button
                key={bucket.label}
                onClick={() =>
                  setSelection({ title: bucket.label, matches: bucket.matches })
                }
                className="group bg-white border border-blue-100 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_12px_28px_-12px_rgba(37,99,235,0.3)]"
              >
                <p className="font-bold text-slate-900 text-base mb-1">
                  {bucket.label}
                </p>
                <p className="text-xs text-slate-400">
                  {bucket.matches.length}{" "}
                  {bucket.matches.length === 1 ? "model" : "models"}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Body style tab */}
        {activeTab === "bodyStyle" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {bodyStyleCounts.length > 0 ? (
              bodyStyleCounts.map(({ style, matches }) => (
                <button
                  key={style}
                  onClick={() => setSelection({ title: style, matches })}
                  className="group bg-white border border-blue-100 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_12px_28px_-12px_rgba(37,99,235,0.3)]"
                >
                  <p className="font-bold text-slate-900 text-base mb-1">
                    {style}
                  </p>
                  <p className="text-xs text-slate-400">
                    {matches.length} {matches.length === 1 ? "model" : "models"}
                  </p>
                </button>
              ))
            ) : (
              <p className="col-span-full text-center text-sm text-slate-400">
                No body style data available yet.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Results modal */}
      {selection && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${selection.title} bikes`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSelection(null)}
          />

          {/* Panel */}
          <div className="relative w-full max-w-5xl max-h-[85vh] bg-white rounded-2xl border border-blue-100 shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-blue-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {selection.title}
                </h3>
                <p className="text-sm text-slate-400">
                  {selection.matches.length}{" "}
                  {selection.matches.length === 1 ? "bike" : "bikes"} found
                </p>
              </div>
              <button
                onClick={() => setSelection(null)}
                aria-label="Close"
                className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Results */}
            <div className="overflow-y-auto px-6 py-6">
              {selection.matches.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {selection.matches.map((bike) => (
                    <Link
                      key={bike.slug}
                      href={`/bikes/${bike.slug}`}
                      onClick={() => setSelection(null)}
                      className="group block rounded-xl overflow-hidden bg-white border border-blue-100 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_12px_24px_-10px_rgba(37,99,235,0.3)]"
                    >
                      <div className="relative h-36 bg-gradient-to-b from-slate-50 to-blue-50/60">
                        <Image
                          src={bike.images?.primary}
                          alt={bike.name}
                          fill
                          className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wide mb-1">
                          {bike.brand}
                        </p>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                          {bike.name}
                        </h4>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-extrabold text-slate-900">
                            {formatPrice(bike.price)}
                          </span>
                          <span className="text-xs text-blue-600 font-semibold group-hover:underline">
                            View →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <p className="text-slate-400 text-sm">
                    No bikes match this filter yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
