"use client";

import { bikes } from "@/data/bike";
import { OBike } from "@/types/bike";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type BikeWithExtras = OBike & { cc?: string };
type SortMode = "priceAsc" | "priceDesc" | "nameAsc" | "ccAsc" | "ccDesc";

const PER_PAGE = 40;

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

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "priceAsc", label: "Price: Low to High" },
  { value: "priceDesc", label: "Price: High to Low" },
  { value: "nameAsc", label: "Name: A to Z" },
  { value: "ccAsc", label: "Displacement: Low to High" },
  { value: "ccDesc", label: "Displacement: High to Low" },
];

function parsePrice(raw?: string): number | null {
  if (!raw) return null;
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return null;
  const num = parseInt(digits, 10);
  return Number.isNaN(num) || num === 0 ? null : num;
}

function parseCC(bike: BikeWithExtras): number | null {
  const raw = bike.engine?.displacement ?? bike.cc;
  if (!raw) return null;
  const match = raw.match(/\d+(\.\d+)?/);
  if (!match) return null;
  const num = parseFloat(match[0]);
  return Number.isNaN(num) ? null : num;
}

function formatPrice(price?: string): string {
  if (!price || price.trim() === "") return "Price on request";
  const cleaned = price.replace(/BDT/gi, "").trim();
  return cleaned ? `৳ ${cleaned}` : "Price on request";
}

export default function AllBikesPage() {
  const allBikes = bikes as BikeWithExtras[];

  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("All");
  const [bodyType, setBodyType] = useState("All");
  const [budget, setBudget] = useState("All");
  const [displacement, setDisplacement] = useState("All");
  const [sortBy, setSortBy] = useState<SortMode>("priceAsc");
  const [page, setPage] = useState(0);

  const brands = useMemo(
    () => Array.from(new Set(allBikes.map((b) => b.brand))).sort(),
    [allBikes],
  );

  const bodyTypes = useMemo(
    () =>
      Array.from(new Set(allBikes.map((b) => b.bike_type).filter(Boolean))).sort(),
    [allBikes],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const budgetBucket = BUDGET_BUCKETS.find((b) => b.label === budget);
    const ccBucket = DISPLACEMENT_BUCKETS.find((b) => b.label === displacement);

    return allBikes.filter((b) => {
      if (query && !`${b.name} ${b.brand}`.toLowerCase().includes(query))
        return false;
      if (brand !== "All" && b.brand !== brand) return false;
      if (bodyType !== "All" && b.bike_type !== bodyType) return false;
      if (budgetBucket) {
        const price = parsePrice(b.price);
        if (price === null || price < budgetBucket.min || price >= budgetBucket.max)
          return false;
      }
      if (ccBucket) {
        const cc = parseCC(b);
        if (cc === null || cc < ccBucket.min || cc >= ccBucket.max) return false;
      }
      return true;
    });
  }, [allBikes, search, brand, bodyType, budget, displacement]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (sortBy) {
      case "priceAsc":
        return list.sort(
          (a, b) => (parsePrice(a.price) ?? Infinity) - (parsePrice(b.price) ?? Infinity),
        );
      case "priceDesc":
        return list.sort(
          (a, b) => (parsePrice(b.price) ?? -1) - (parsePrice(a.price) ?? -1),
        );
      case "nameAsc":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case "ccAsc":
        return list.sort((a, b) => (parseCC(a) ?? Infinity) - (parseCC(b) ?? Infinity));
      case "ccDesc":
        return list.sort((a, b) => (parseCC(b) ?? -1) - (parseCC(a) ?? -1));
      default:
        return list;
    }
  }, [filtered, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const clampedPage = Math.min(page, totalPages - 1);
  const visible = sorted.slice(clampedPage * PER_PAGE, clampedPage * PER_PAGE + PER_PAGE);

  useEffect(() => setPage(0), [search, brand, bodyType, budget, displacement, sortBy]);

  const activeFilterCount = [
    search.trim() !== "",
    brand !== "All",
    bodyType !== "All",
    budget !== "All",
    displacement !== "All",
  ].filter(Boolean).length;

  function clearFilters() {
    setSearch("");
    setBrand("All");
    setBodyType("All");
    setBudget("All");
    setDisplacement("All");
  }

  return (
    <div className="min-h-screen bg-[#F6F9FC] pt-32 sm:pt-36 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            All <span className="text-blue-600">Bikes</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Browse every motorcycle in our database — filter by brand, budget,
            engine size, and body style.
          </p>
        </div>

        {/* Filter bar */}
        <div className="mb-6 rounded-2xl border border-blue-100 bg-white p-4 sm:p-5 shadow-sm">
          {/* Search */}
          <div className="relative mb-4">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by bike name or brand..."
              className="w-full rounded-full border border-blue-100 bg-slate-50 py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-500/15"
            />
          </div>

          {/* Dropdown filters */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/15"
            >
              <option value="All">All Brands</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <select
              value={bodyType}
              onChange={(e) => setBodyType(e.target.value)}
              className="rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/15"
            >
              <option value="All">All Body Types</option>
              {bodyTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/15"
            >
              <option value="All">Any Budget</option>
              {BUDGET_BUCKETS.map((b) => (
                <option key={b.label} value={b.label}>
                  {b.label}
                </option>
              ))}
            </select>

            <select
              value={displacement}
              onChange={(e) => setDisplacement(e.target.value)}
              className="rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/15"
            >
              <option value="All">Any Displacement</option>
              {DISPLACEMENT_BUCKETS.map((b) => (
                <option key={b.label} value={b.label}>
                  {b.label}
                </option>
              ))}
            </select>

            <div className="ml-auto flex items-center gap-3">
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Clear filters ({activeFilterCount})
                </button>
              )}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortMode)}
                className="rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/15"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="mb-5 text-sm text-slate-400">
          <span className="font-semibold text-slate-700">{sorted.length}</span>{" "}
          {sorted.length === 1 ? "bike" : "bikes"} found
        </p>

        {/* Grid */}
        {visible.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visible.map((bike) => {
              const cc = parseCC(bike);
              return (
                <Link
                  key={bike.slug}
                  href={`/bikes/${bike.slug}`}
                  className="group flex flex-col rounded-2xl border border-blue-100 bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_16px_32px_-16px_rgba(37,99,235,0.3)]"
                >
                  <div className="relative h-44 bg-gradient-to-b from-slate-50 to-blue-50/60">
                    <Image
                      src={bike.images?.primary || "/placeholder-bike.png"}
                      alt={bike.name}
                      fill
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    {bike.bike_type && (
                      <span className="absolute top-3 left-3 rounded-full border border-blue-200 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-blue-700 backdrop-blur">
                        {bike.bike_type}
                      </span>
                    )}
                    {bike.availability === "upcoming" && (
                      <span className="absolute top-3 right-3 rounded-full bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white">
                        Upcoming
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-blue-600">
                      {bike.brand}
                    </p>
                    <h3 className="mb-3 text-base font-bold leading-snug text-slate-900 line-clamp-2 group-hover:text-blue-700 transition-colors">
                      {bike.name}
                    </h3>

                    {/* Spec chips */}
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {cc && (
                        <span className="rounded-md bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700">
                          {cc}cc
                        </span>
                      )}
                      {bike.mileage?.city && (
                        <span className="rounded-md bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700">
                          {bike.mileage.city} city
                        </span>
                      )}
                      {bike.mileage_top_speed?.top_speed && (
                        <span className="rounded-md bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700">
                          {bike.mileage_top_speed.top_speed}
                        </span>
                      )}
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-lg font-extrabold text-slate-900">
                        {formatPrice(bike.price)}
                      </span>
                      <span className="text-xs font-semibold text-blue-600 group-hover:underline">
                        View →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-blue-100 bg-white py-20 text-center">
            <p className="text-sm text-slate-400 mb-4">
              No bikes match your filters.
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={clampedPage === 0}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-500 transition-all hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous page"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              // Collapse long page ranges to keep the control compact.
              const isEdge = i === 0 || i === totalPages - 1;
              const isNearCurrent = Math.abs(i - clampedPage) <= 1;
              if (!isEdge && !isNearCurrent) {
                if (i === clampedPage - 2 || i === clampedPage + 2) {
                  return (
                    <span key={i} className="px-1 text-slate-300">
                      …
                    </span>
                  );
                }
                return null;
              }
              return (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                    i === clampedPage
                      ? "bg-blue-600 text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)]"
                      : "border border-blue-100 bg-white text-slate-500 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}

            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={clampedPage === totalPages - 1}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-500 transition-all hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next page"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}