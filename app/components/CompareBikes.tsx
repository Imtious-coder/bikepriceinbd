"use client";

import { bikes } from "@/data/bike";
import { OBike } from "@/types/bike";
import Image from "next/image";
import { useMemo, useState } from "react";

type SpecRecord = Record<string, string> | undefined | null;
type BikeWithExtras = OBike & { cc?: string };

const MAX_SLOTS = 3;

const BUDGET_BUCKETS = [
  { label: "Under ৳1.5 Lakh", min: 0, max: 150_000 },
  { label: "৳1.5 – 3 Lakh", min: 150_000, max: 300_000 },
  { label: "৳3 – 5 Lakh", min: 300_000, max: 500_000 },
  { label: "৳5 Lakh+", min: 500_000, max: Infinity },
];

const SPEC_SECTIONS: { key: keyof BikeWithExtras; title: string }[] = [
  { key: "engine", title: "Engine" },
  { key: "transmission", title: "Transmission" },
  { key: "mileage_top_speed", title: "Mileage & Top Speed" },
  { key: "chassis_suspension", title: "Chassis & Suspension" },
  { key: "brakes", title: "Brakes" },
  { key: "wheel_tyres", title: "Wheels & Tyres" },
  { key: "dimensions", title: "Dimensions" },
  { key: "electricals", title: "Electricals" },
  { key: "others", title: "Others" },
];

function parsePrice(raw?: string): number | null {
  if (!raw) return null;
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return null;
  const num = parseInt(digits, 10);
  return Number.isNaN(num) || num === 0 ? null : num;
}

function parseLeadingNumber(raw?: string): number | null {
  if (!raw) return null;
  const match = raw.match(/-?\d+(\.\d+)?/);
  if (!match) return null;
  const num = parseFloat(match[0]);
  return Number.isNaN(num) ? null : num;
}

function formatPrice(price?: string): string {
  if (!price || price.trim() === "") return "Price on request";
  const cleaned = price.replace(/BDT/gi, "").trim();
  return cleaned ? `৳ ${cleaned}` : "Price on request";
}

function formatLabel(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Returns the indices (into `values`) that hold the best value, so the UI
// can highlight the winning cell(s) in a comparison row.
function getBestIndices(
  values: (number | null)[],
  better: "higher" | "lower",
): number[] {
  const defined = values
    .map((v, i) => ({ v, i }))
    .filter((x): x is { v: number; i: number } => x.v !== null);
  if (defined.length < 2) return [];
  const target =
    better === "higher"
      ? Math.max(...defined.map((d) => d.v))
      : Math.min(...defined.map((d) => d.v));
  return defined.filter((d) => d.v === target).map((d) => d.i);
}

type CuratedRow = {
  label: string;
  value: (b: BikeWithExtras) => string | undefined;
  numeric?: (b: BikeWithExtras) => number | null;
  better?: "higher" | "lower";
};

const CURATED_ROWS: CuratedRow[] = [
  {
    label: "Price",
    value: (b) => formatPrice(b.price),
    numeric: (b) => parsePrice(b.price),
    better: "lower",
  },
  { label: "Body Type", value: (b) => b.bike_type },
  {
    label: "Displacement",
    value: (b) =>
      b.engine?.displacement
        ? `${b.engine.displacement} cc`
        : b.cc
        ? `${b.cc} cc`
        : undefined,
    numeric: (b) =>
      parseLeadingNumber(b.engine?.displacement) ?? parseLeadingNumber(b.cc),
    better: "higher",
  },
  {
    label: "Max Power",
    value: (b) => b.engine?.maximum_power,
    numeric: (b) => parseLeadingNumber(b.engine?.maximum_power),
    better: "higher",
  },
  {
    label: "Max Torque",
    value: (b) => b.engine?.maximum_torque,
    numeric: (b) => parseLeadingNumber(b.engine?.maximum_torque),
    better: "higher",
  },
  {
    label: "Top Speed",
    value: (b) => b.mileage_top_speed?.top_speed,
    numeric: (b) => parseLeadingNumber(b.mileage_top_speed?.top_speed),
    better: "higher",
  },
  {
    label: "City Mileage",
    value: (b) => b.mileage?.city,
    numeric: (b) => parseLeadingNumber(b.mileage?.city),
    better: "higher",
  },
  {
    label: "Highway Mileage",
    value: (b) => b.mileage?.highway,
    numeric: (b) => parseLeadingNumber(b.mileage?.highway),
    better: "higher",
  },
  {
    label: "Weight",
    value: (b) => b.dimensions?.weight,
    numeric: (b) => parseLeadingNumber(b.dimensions?.weight),
    better: "lower",
  },
  {
    label: "Fuel Tank",
    value: (b) => b.dimensions?.fuel_tank_capacity,
    numeric: (b) => parseLeadingNumber(b.dimensions?.fuel_tank_capacity),
    better: "higher",
  },
  {
    label: "Transmission",
    value: (b) =>
      b.transmission?.no_of_gears
        ? `${b.transmission.no_of_gears}-Speed`
        : b.transmission?.transmission_type,
  },
  { label: "Braking System", value: (b) => b.brakes?.braking_system },
  { label: "Tyre Type", value: (b) => b.wheel_tyres?.tyre_type },
];

export default function CompareBikes() {
  const [slots, setSlots] = useState<(BikeWithExtras | null)[]>(
    Array(MAX_SLOTS).fill(null),
  );
  const [openSlot, setOpenSlot] = useState<number | null>(null);
  const [filterType, setFilterType] = useState("All");
  const [filterBudget, setFilterBudget] = useState("All");
  const [search, setSearch] = useState("");
  const [showFullSpecs, setShowFullSpecs] = useState(false);

  const bodyTypes = useMemo(
    () =>
      Array.from(new Set(bikes.map((b) => b.bike_type).filter(Boolean))).sort(),
    [],
  );

  // Bikes that match the active Body Type / Budget filters and aren't
  // already sitting in one of the 3 slots. Shown as a live count so the
  // person knows how many candidates a filter combination leaves them.
  const filteredByFacets = useMemo(() => {
    const selectedSlugs = new Set(slots.filter(Boolean).map((b) => b!.slug));
    const bucket = BUDGET_BUCKETS.find((x) => x.label === filterBudget);

    return (bikes as BikeWithExtras[]).filter((b) => {
      if (selectedSlugs.has(b.slug)) return false;
      if (filterType !== "All" && b.bike_type !== filterType) return false;
      if (bucket) {
        const price = parsePrice(b.price);
        if (price === null || price < bucket.min || price >= bucket.max)
          return false;
      }
      return true;
    });
  }, [slots, filterType, filterBudget]);

  const pickerResults = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return filteredByFacets;
    return filteredByFacets.filter((b) =>
      `${b.name} ${b.brand}`.toLowerCase().includes(query),
    );
  }, [filteredByFacets, search]);

  const selectedBikes = slots.filter((b): b is BikeWithExtras => !!b);

  function selectBike(index: number, bike: BikeWithExtras) {
    setSlots((prev) => {
      const next = [...prev];
      next[index] = bike;
      return next;
    });
    setOpenSlot(null);
    setSearch("");
  }

  function removeBike(index: number) {
    setSlots((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  }

  function clearAll() {
    setSlots(Array(MAX_SLOTS).fill(null));
    setShowFullSpecs(false);
  }

  const fullSpecSections = useMemo(() => {
    if (selectedBikes.length < 2) return [];
    return SPEC_SECTIONS.map((section) => {
      const keys = new Set<string>();
      selectedBikes.forEach((b) => {
        const data = b[section.key] as SpecRecord;
        if (data) Object.keys(data).forEach((k) => keys.add(k));
      });
      return { title: section.title, sectionKey: section.key, keys: Array.from(keys) };
    }).filter((s) => s.keys.length > 0);
  }, [selectedBikes]);

  const gridTemplate = `minmax(140px,1fr) repeat(${Math.max(
    selectedBikes.length,
    1,
  )}, minmax(130px,1.4fr))`;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F6F9FC]">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Compare <span className="text-blue-600">Bikes</span>
        </h2>
        <p className="text-center text-sm text-slate-500 mb-8">
          Pick 2 or 3 bikes and see them side by side.
        </p>

        {/* Filters (narrow the picker suggestions) */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-blue-100 text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="All">All Body Types</option>
            {bodyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            value={filterBudget}
            onChange={(e) => setFilterBudget(e.target.value)}
            className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-blue-100 text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="All">Any Budget</option>
            {BUDGET_BUCKETS.map((b) => (
              <option key={b.label} value={b.label}>
                {b.label}
              </option>
            ))}
          </select>
        </div>

        {/* Live count for the current filter combination */}
        <p className="text-center text-sm text-slate-400 mb-8">
          <span className="font-semibold text-blue-600">
            {filteredByFacets.length}
          </span>{" "}
          {filteredByFacets.length === 1 ? "bike" : "bikes"} available to
          compare
        </p>

        {/* Slots */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-slate-500">
            {selectedBikes.length}/{MAX_SLOTS} selected
          </span>
          {selectedBikes.length > 0 && (
            <button
              onClick={clearAll}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          {slots.map((bike, index) => (
            <div key={index} className="relative">
              {bike ? (
                <div className="bg-white border border-blue-100 rounded-2xl p-4 relative">
                  <button
                    onClick={() => removeBike(index)}
                    className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 border border-red-100 text-red-500 text-xs font-semibold hover:bg-red-100 hover:border-red-200 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Remove
                  </button>
                  <div className="relative h-28 bg-gradient-to-b from-slate-50 to-blue-50/60 rounded-xl mb-3">
                    <Image
                      src={bike.images?.primary || "/placeholder-bike.png"}
                      alt={bike.name}
                      fill
                      className="object-contain p-3"
                      sizes="200px"
                    />
                  </div>
                  <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wide mb-0.5">
                    {bike.brand}
                  </p>
                  <p className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 mb-1">
                    {bike.name}
                  </p>
                  <p className="text-sm font-extrabold text-slate-900">
                    {formatPrice(bike.price)}
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => setOpenSlot(openSlot === index ? null : index)}
                  className="w-full h-full min-h-[176px] flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-blue-200 text-blue-500 hover:border-blue-400 hover:bg-blue-50/50 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-sm font-semibold">Add Bike</span>
                </button>
              )}

              {/* Picker popover */}
              {openSlot === index && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                      setOpenSlot(null);
                      setSearch("");
                    }}
                  />
                  <div className="absolute z-50 top-full mt-2 left-0 right-0 bg-white border border-blue-100 rounded-2xl shadow-[0_16px_36px_-14px_rgba(30,64,175,0.3)] overflow-hidden">
                    <div className="p-3 border-b border-blue-100">
                      <input
                        autoFocus
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search bike or brand..."
                        className="w-full px-3 py-2 rounded-lg text-sm bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                      <p className="text-xs text-slate-400 mt-1.5 px-0.5">
                        {pickerResults.length}{" "}
                        {pickerResults.length === 1 ? "result" : "results"}
                      </p>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {pickerResults.length > 0 ? (
                        pickerResults.slice(0, 30).map((b) => (
                          <button
                            key={b.slug}
                            onClick={() => selectBike(index, b)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 transition-colors text-left"
                          >
                            <div className="relative w-12 h-12 flex-shrink-0 bg-slate-50 rounded-lg">
                              <Image
                                src={b.images?.primary || "/placeholder-bike.png"}
                                alt={b.name}
                                fill
                                className="object-contain p-1"
                                sizes="48px"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900 truncate">
                                {b.name}
                              </p>
                              <p className="text-xs text-slate-400">
                                {formatPrice(b.price)}
                              </p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <p className="px-3 py-6 text-center text-sm text-slate-400">
                          No bikes match your filters.
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Comparison */}
        {selectedBikes.length < 2 ? (
          <p className="text-center text-sm text-slate-400">
            Select at least 2 bikes above to see a comparison.
          </p>
        ) : (
          <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <div className="min-w-[560px]">
                {/* Curated rows */}
                {CURATED_ROWS.map((row) => {
                  const cellValues = selectedBikes.map((b) => row.value(b));
                  const bestIndices = row.better
                    ? getBestIndices(
                        selectedBikes.map((b) => row.numeric!(b)),
                        row.better,
                      )
                    : [];
                  return (
                    <div
                      key={row.label}
                      className="grid bg-white border-b border-slate-100 last:border-b-0"
                      style={{ gridTemplateColumns: gridTemplate }}
                    >
                      <div className="px-5 py-3 text-sm font-semibold text-slate-500 flex items-center bg-slate-50/60">
                        {row.label}
                      </div>
                      {selectedBikes.map((_, i) => {
                        const isBest = bestIndices.includes(i);
                        return (
                          <div
                            key={i}
                            className={`px-4 py-3 text-sm flex items-center gap-1.5 ${
                              isBest
                                ? "bg-blue-50 text-blue-700 font-bold"
                                : "text-slate-700 font-medium"
                            }`}
                          >
                            {isBest && (
                              <svg className="w-3.5 h-3.5 flex-shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            <span className="truncate">{cellValues[i] ?? "—"}</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}

                {/* Full specifications toggle */}
                {fullSpecSections.length > 0 && (
                  <div className="border-t border-blue-100">
                    <button
                      onClick={() => setShowFullSpecs((v) => !v)}
                      className="w-full flex items-center justify-center gap-2 px-5 py-4 text-sm font-semibold text-blue-600 bg-blue-50/40 hover:bg-blue-50 transition-colors"
                    >
                      {showFullSpecs ? "Hide Full Specifications" : "Show Full Specifications"}
                      <svg
                        className={`w-4 h-4 transition-transform ${showFullSpecs ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {showFullSpecs &&
                      fullSpecSections.map((section) => (
                        <div key={section.title} className="border-t border-blue-100">
                          <div className="px-5 pt-4 pb-1 bg-blue-50/30">
                            <h4 className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                              {section.title}
                            </h4>
                          </div>
                          {section.keys.map((key) => (
                            <div
                              key={key}
                              className="grid bg-white border-b border-slate-100 last:border-b-0"
                              style={{ gridTemplateColumns: gridTemplate }}
                            >
                              <div className="px-5 py-3 text-sm font-semibold text-slate-500 flex items-center bg-slate-50/60">
                                {formatLabel(key)}
                              </div>
                              {selectedBikes.map((b, bi) => {
                                const data = b[section.sectionKey] as SpecRecord;
                                return (
                                  <div
                                    key={bi}
                                    className="px-4 py-3 text-sm text-slate-700 font-medium flex items-center"
                                  >
                                    <span className="truncate">{data?.[key] ?? "—"}</span>
                                  </div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}