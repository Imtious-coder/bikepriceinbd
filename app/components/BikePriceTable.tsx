"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { bikes } from "@/data/bike";

// ─── Config ──────────────────────────────────────────────────────────────

const FEATURED_BRANDS = ["Honda", "Yamaha", "Bajaj", "Suzuki", "Hero", "TVS", "Royal Enfield", "CFMOTO"];
const TABS = ["All", ...FEATURED_BRANDS];
const PAGE_SIZE = 15;

type SortKey = "name" | "brand" | "cc" | "price";
type SortDir = "asc" | "desc";

function normalize(str: string) {
  return str.toLowerCase().replace(/\s+/g, "");
}

// pull a comparable number out of "4,29,950 BDT" style strings
function priceToNumber(price: string) {
  const digits = price.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

function ccToNumber(cc: string) {
  const digits = cc.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

function getMileage(bike: (typeof bikes)[number]) {
  return (
    bike.mileage_top_speed?.mileage ||
    (bike.mileage?.city ? `${bike.mileage.city} (city)` : "") ||
    "—"
  );
}

// ─── Icons (inline, no deps) ────────────────────────────────────────────

function SortIcon({ direction, className = "" }: { direction: SortDir | null; className?: string }) {
  if (direction === "asc") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="m18 15-6-6-6 6" />
      </svg>
    );
  }
  if (direction === "desc") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="m7 15 5 5 5-5" />
      <path d="m7 9 5-5 5 5" />
    </svg>
  );
}

function ArrowRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function TableIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18" />
      <path d="M9 4v16" />
    </svg>
  );
}

// ─── Component ───────────────────────────────────────────────────────────

export default function BikePriceTable() {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filteredSorted = useMemo(() => {
    let list =
      activeTab === "All"
        ? bikes
        : bikes.filter((b) => normalize(b.brand) === normalize(activeTab));

    list = [...list].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "brand":
          cmp = a.brand.localeCompare(b.brand);
          break;
        case "cc":
          cmp = ccToNumber(a.cc) - ccToNumber(b.cc);
          break;
        case "price":
          cmp = priceToNumber(a.price) - priceToNumber(b.price);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [activeTab, sortKey, sortDir]);

  const visible = filteredSorted.slice(0, visibleCount);
  const hasMore = visibleCount < filteredSorted.length;

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setVisibleCount(PAGE_SIZE);
  }

  function handleTabChange(tab: string) {
    setActiveTab(tab);
    setVisibleCount(PAGE_SIZE);
  }

  const columns: { key: SortKey; label: string; align?: "left" | "right" }[] = [
    { key: "name", label: "Bike" },
    { key: "brand", label: "Brand" },
    { key: "cc", label: "CC" },
    { key: "price", label: "Price", align: "right" },
  ];

  return (
    <section className="w-full bg-white py-14 sm:py-20" aria-label="Bike price table Bangladesh">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="flex flex-col items-start gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
            <TableIcon className="h-3.5 w-3.5" />
            {filteredSorted.length} models tracked
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Latest Bike Price in{" "}
            <span className="text-blue-600">Bangladesh 2026</span>
          </h2>
          <p className="max-w-2xl text-sm text-slate-500 sm:text-base">
            Compare official showroom prices, engine capacity and mileage
            for motorcycles from Honda, Yamaha, Bajaj, Suzuki, Hero, TVS,
            Royal Enfield, CFMOTO and other leading brands.
          </p>
        </div>

        {/* Brand tabs */}
        <div role="tablist" aria-label="Filter by brand" className="mt-6 flex flex-wrap gap-2">
          {TABS.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleTabChange(tab)}
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

        {/* Table */}
        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                {columns.map((col) => (
                  <th key={col.key} scope="col" className="px-4 py-3">
                    <button
                      onClick={() => handleSort(col.key)}
                      className={`flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 transition-colors hover:text-blue-600 ${
                        col.align === "right" ? "ml-auto" : ""
                      }`}
                    >
                      {col.label}
                      <SortIcon
                        direction={sortKey === col.key ? sortDir : null}
                        className="h-3.5 w-3.5"
                      />
                    </button>
                  </th>
                ))}
                <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Mileage
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visible.map((bike) => (
                <tr key={bike.slug} className="transition-colors hover:bg-blue-50/50">
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    <Link
                      href={`/bikes/${bike.slug}`}
                      className="hover:text-blue-600 hover:underline"
                    >
                      {bike.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{bike.brand}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {bike.cc ? `${bike.cc}cc` : "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-900">
                    {bike.price || "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{getMileage(bike)}</td>
                </tr>
              ))}

              {visible.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    No bikes found for this brand yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Load more / view all */}
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          {hasMore ? (
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            >
              Load more bikes
            </button>
          ) : (
            <span className="text-xs text-slate-400">
              Showing all {filteredSorted.length} bikes
              {activeTab !== "All" ? ` in ${activeTab}` : ""}
            </span>
          )}

          <Link
            href="/bikes"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View full bike price list
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}