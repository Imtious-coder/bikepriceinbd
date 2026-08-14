"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { bikes } from "@/data/bike";

// ─── Config ──────────────────────────────────────────────────────────────

const FEATURED_BRANDS = ["Suzuki", "Hero", "CF Moto", "Bajaj", "Royal Enfield"];
const TABS = ["All", ...FEATURED_BRANDS, "Others"];
const VISIBLE_COUNT = 8;

function normalize(str: string) {
  return str.toLowerCase().replace(/\s+/g, "");
}

function parseDate(value: string) {
  const t = Date.parse(value);
  return Number.isNaN(t) ? 0 : t;
}

// ─── Icons (inline, no deps) ────────────────────────────────────────────

function TagIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.59 2.59 20 10a2 2 0 0 1 0 2.83l-6.17 6.17a2 2 0 0 1-2.83 0L3 11V4a2 2 0 0 1 2-2h7.59Z" />
      <circle cx="7.5" cy="7.5" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ArrowRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function GaugeIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 14 15 10" />
      <path d="M21 12a9 9 0 1 0-9 9" />
      <path d="M12 3v2" />
      <path d="M3 12h2" />
      <path d="M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function BikePlaceholderIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      <path d="M5.5 17.5 9 10h5l3.5 7.5" />
      <path d="M9 10 7 6h3" />
    </svg>
  );
}

// ─── Component ───────────────────────────────────────────────────────────

export default function LatestBikePrices() {
  const [activeTab, setActiveTab] = useState<string>("All");

  const filtered = useMemo(() => {
    let list = bikes;

    if (activeTab === "Others") {
      list = bikes.filter(
        (b) => !FEATURED_BRANDS.some((fb) => normalize(fb) === normalize(b.brand))
      );
    } else if (activeTab !== "All") {
      list = bikes.filter((b) => normalize(b.brand) === normalize(activeTab));
    }

    return [...list]
      .sort((a, b) => parseDate(b.updated_at) - parseDate(a.updated_at))
      .slice(0, VISIBLE_COUNT);
  }, [activeTab]);

  return (
    <section
      className="w-full bg-white py-14 sm:py-20"
      aria-label="Latest bike prices in Bangladesh"
    >
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
              <TagIcon className="h-3.5 w-3.5" />
              Updated regularly
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Latest Bike Prices in{" "}
              <span className="text-blue-600">Bangladesh</span>
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-500 sm:text-base">
              Fresh showroom prices and specs from Suzuki, Hero, CF Moto,
              Bajaj, Royal Enfield and more — pulled straight from our
              tracked listings.
            </p>
          </div>

          <Link
            href="/bikes"
            className="group hidden flex-shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 sm:inline-flex"
          >
            View all bikes
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Brand tabs */}
        <div
          role="tablist"
          aria-label="Filter by brand"
          className="mt-8 flex flex-wrap gap-2 border-b border-slate-100 pb-4"
        >
          {TABS.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "border border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Bike grid */}
        {filtered.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((bike) => (
              <Link
                key={bike.slug}
                href={`/bikes/${bike.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-slate-50">
                  {bike.images?.primary ? (
                    <img
                      src={bike.images.primary}
                      alt={bike.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <BikePlaceholderIcon className="h-16 w-16 text-slate-300" />
                  )}
                  {bike.cc && (
                    <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur-sm">
                      <GaugeIcon className="h-3 w-3" />
                      {bike.cc}cc
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-blue-600">
                    {bike.brand}
                  </span>
                  <h3 className="mt-0.5 line-clamp-2 text-sm font-bold text-slate-900">
                    {bike.name}
                  </h3>

                  <div className="mt-auto flex items-end justify-between pt-3">
                    <span className="text-base font-extrabold text-slate-900">
                      {bike.price || "Price on request"}
                    </span>
                    <ArrowRightIcon className="h-4 w-4 flex-shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-blue-600" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center text-sm text-slate-400">
            No bikes found for this brand yet.
          </p>
        )}

        {/* Mobile "view all" */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/BikesPage"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          >
            View all bikes
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}