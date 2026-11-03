"use client";

import { bikes } from "@/data/bike";
import type { OBike } from "@/types/bike";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

const MAX_SLOTS = 3;
const BUDGET_BUCKETS = [
  { label: "Under ৳1.5 Lakh", min: 0, max: 150_000 },
  { label: "৳1.5 – 3 Lakh", min: 150_000, max: 300_000 },
  { label: "৳3 – 5 Lakh", min: 300_000, max: 500_000 },
  { label: "৳5 Lakh+", min: 500_000, max: Infinity },
];
const SPEC_SECTIONS = [
  { key: "engine", title: "Engine" },
  { key: "transmission", title: "Transmission" },
  { key: "mileage_top_speed", title: "Mileage & Top Speed" },
  { key: "chassis_suspension", title: "Chassis & Suspension" },
  { key: "brakes", title: "Brakes" },
  { key: "wheel_tyres", title: "Wheels & Tyres" },
  { key: "dimensions", title: "Dimensions" },
  { key: "electricals", title: "Electricals" },
  { key: "others", title: "Others" },
] as const;

type SpecSectionKey = (typeof SPEC_SECTIONS)[number]["key"];
type SpecRecord = Record<string, string> | undefined | null;
type CuratedRow = {
  label: string;
  value: (bike: OBike) => string | undefined;
  numeric?: (bike: OBike) => number | null;
  better?: "higher" | "lower";
};

function parsePrice(raw?: string): number | null {
  const digits = raw?.replace(/\D/g, "");
  const number = digits ? Number(digits) : 0;
  return number > 0 ? number : null;
}

function parseNumber(raw?: string): number | null {
  const match = raw?.match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function formatPrice(raw?: string, includeUnit = true) {
  const amount = raw?.replace(/BDT|৳/gi, "").trim();
  return amount ? `৳ ${amount}${includeUnit ? " BDT" : ""}` : "Price on request";
}

function formatLabel(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function bestIndices(values: (number | null)[], better: "higher" | "lower") {
  const defined = values.map((value, index) => ({ value, index })).filter((item): item is { value: number; index: number } => item.value !== null);
  if (defined.length < 2) return [];
  const target = better === "higher" ? Math.max(...defined.map((item) => item.value)) : Math.min(...defined.map((item) => item.value));
  return defined.filter((item) => item.value === target).map((item) => item.index);
}

const CURATED_ROWS: CuratedRow[] = [
  { label: "Price", value: (bike) => formatPrice(bike.price), numeric: (bike) => parsePrice(bike.price), better: "lower" },
  { label: "Body Type", value: (bike) => bike.bike_type },
  { label: "Displacement", value: (bike) => bike.engine?.displacement ? `${bike.engine.displacement.replace(/\s*cc$/i, "")} cc` : bike.cc ? `${bike.cc} cc` : undefined, numeric: (bike) => parseNumber(bike.engine?.displacement) ?? parseNumber(bike.cc), better: "higher" },
  { label: "Max Power", value: (bike) => bike.engine?.maximum_power, numeric: (bike) => parseNumber(bike.engine?.maximum_power), better: "higher" },
  { label: "Max Torque", value: (bike) => bike.engine?.maximum_torque, numeric: (bike) => parseNumber(bike.engine?.maximum_torque), better: "higher" },
  { label: "Top Speed", value: (bike) => bike.mileage_top_speed?.top_speed, numeric: (bike) => parseNumber(bike.mileage_top_speed?.top_speed), better: "higher" },
  { label: "City Mileage", value: (bike) => bike.mileage?.city, numeric: (bike) => parseNumber(bike.mileage?.city), better: "higher" },
  { label: "Highway Mileage", value: (bike) => bike.mileage?.highway, numeric: (bike) => parseNumber(bike.mileage?.highway), better: "higher" },
  { label: "Weight", value: (bike) => bike.dimensions?.weight, numeric: (bike) => parseNumber(bike.dimensions?.weight), better: "lower" },
  { label: "Fuel Tank", value: (bike) => bike.dimensions?.fuel_tank_capacity, numeric: (bike) => parseNumber(bike.dimensions?.fuel_tank_capacity), better: "higher" },
  { label: "Transmission", value: (bike) => bike.transmission?.no_of_gears ? `${bike.transmission.no_of_gears.replace(/\s*(speed|gears?)$/i, "")}-Speed` : bike.transmission?.transmission_type },
  { label: "Braking System", value: (bike) => bike.brakes?.braking_system },
  { label: "Tyre Type", value: (bike) => bike.wheel_tyres?.tyre_type },
];

function SpecIcon({ label }: { label: string }) {
  let path = <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>;
  if (label === "Price") path = <><path d="m3 11 8 8 10-10-8-8H3v10Z" /><circle cx="8" cy="6" r="1" /></>;
  else if (label === "Body Type") path = <><circle cx="5" cy="17" r="3" /><circle cx="19" cy="17" r="3" /><path d="m5 17 4-8h5l5 8M9 9 7 6h3" /></>;
  else if (label === "Displacement") path = <><path d="M7 7h9l2 2h2v8h-3l-2 2H8l-2-2H4V9h3V7ZM9 7V4h5" /></>;
  else if (label === "Max Power") path = <path d="m13 2-9 12h7l-1 8 10-12h-7l1-8Z" />;
  else if (label === "Max Torque") path = <><circle cx="12" cy="12" r="7" /><path d="M12 2v3m0 14v3M2 12h3m14 0h3M12 9v3l2 2" /></>;
  else if (label === "Top Speed") path = <><path d="M4 17a9 9 0 0 1 16 0M12 15l4-6" /><circle cx="12" cy="16" r="1" /></>;
  else if (label.includes("Mileage")) path = <><path d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M3 21h13M4 11h11M15 8h2l3 3v7a2 2 0 0 1-4 0v-5" /></>;
  else if (label === "Weight") path = <><path d="M5 9h14l2 12H3L5 9Z" /><circle cx="12" cy="7" r="3" /></>;
  else if (label === "Fuel Tank") path = <><rect x="4" y="5" width="13" height="16" rx="2" /><path d="M7 5V3h7v2M17 9h2l2 3v6a2 2 0 0 1-4 0" /></>;
  else if (label === "Transmission") path = <><path d="M6 3v18M18 3v18M3 7h6m6 10h6M9 12h6" /><circle cx="6" cy="7" r="2" /><circle cx="18" cy="17" r="2" /></>;
  else if (label === "Braking System") path = <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><path d="M12 3v5m0 8v5M3 12h5m8 0h5" /></>;
  else if (label === "Tyre Type") path = <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><path d="m12 3 2 5m7 4-5 2m-4 7-2-5m-7-4 5-2" /></>;
  return <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-blue-700" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{path}</svg>;
}

function BikeArt() {
  return <svg viewBox="0 0 140 60" className="pointer-events-none absolute bottom-1 right-3 h-14 w-32 text-blue-200/80 max-sm:bottom-0 max-sm:right-1 max-sm:h-12 max-sm:w-24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 56c25-20 39-20 61 0 27-18 43-17 75 0" fill="currentColor" opacity=".25" stroke="none" />
    <circle cx="38" cy="43" r="11" /><circle cx="107" cy="43" r="11" /><path d="m38 43 20-24 18 24H38l22-12h27l20 12-15-29h-9m-12 0 13-7m-4 7h17m-34 4-14-5-8 3" />
  </svg>;
}

function ComparisonRow({ label, values, winners, columns, defaultOpen = false }: { label: string; values: string[]; winners: number[]; columns: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return <div className="border-b border-blue-100 last:border-b-0">
    <div className="hidden min-h-9 md:grid" style={{ gridTemplateColumns: columns }}>
      <div className="flex items-center gap-3 bg-[#f5f8ff] px-4 py-2 text-xs font-bold text-slate-800"><SpecIcon label={label} />{label}</div>
      {values.map((value, index) => <div key={index} className={`flex min-w-0 items-center gap-2 border-l border-blue-100 px-4 py-2 text-xs ${winners.includes(index) ? "bg-blue-50 font-bold text-blue-700" : "bg-white text-slate-800"}`}>
        {winners.includes(index) && <span className="shrink-0 text-blue-600" aria-label="Best value">✓</span>}<span className="min-w-0 break-words">{value || "—"}</span>
      </div>)}
    </div>
    <button type="button" onClick={() => setOpen((wasOpen) => !wasOpen)} aria-expanded={open} className="flex w-full items-center gap-3 px-3 py-2 text-left text-xs font-bold text-slate-900 md:hidden"><SpecIcon label={label} /><span className="flex-1">{label}</span><svg viewBox="0 0 24 24" className={`h-4 w-4 text-blue-600 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></button>
    {open && <div className="grid gap-1 px-2 pb-2 md:hidden" style={{ gridTemplateColumns: `repeat(${values.length},minmax(0,1fr))` }}>
      {values.map((value, index) => <div key={index} className={`min-w-0 rounded-md px-1.5 py-2 text-center text-[10px] leading-tight ${winners.includes(index) ? "bg-blue-50 font-bold text-blue-700" : "bg-slate-50 text-slate-700"}`}>
        {winners.includes(index) && <span className="mr-0.5" aria-label="Best value">✓</span>}{label === "Price" ? value.replace(/ BDT$/, "") : value || "—"}
      </div>)}
    </div>}
  </div>;
}

export default function CompareBikes() {
  const [slots, setSlots] = useState<(OBike | null)[]>(() => Array(MAX_SLOTS).fill(null));
  const [openSlot, setOpenSlot] = useState<number | null>(null);
  const [filterType, setFilterType] = useState("All");
  const [filterBudget, setFilterBudget] = useState("All");
  const [search, setSearch] = useState("");
  const [showFullSpecs, setShowFullSpecs] = useState(false);
  const pickerInputRef = useRef<HTMLInputElement>(null);

  const selectedBikes = useMemo(() => slots.filter((bike): bike is OBike => bike !== null), [slots]);
  const bodyTypes = useMemo(() => [...new Set(bikes.map((bike) => bike.bike_type).filter(Boolean))].sort(), []);

  const availableBikes = useMemo(() => {
    const selectedSlugs = new Set(selectedBikes.map((bike) => bike.slug));
    const bucket = BUDGET_BUCKETS.find((item) => item.label === filterBudget);
    return bikes.filter((bike) => {
      if (selectedSlugs.has(bike.slug)) return false;
      if (filterType !== "All" && bike.bike_type !== filterType) return false;
      if (!bucket) return true;
      const price = parsePrice(bike.price);
      return price !== null && price >= bucket.min && price < bucket.max;
    });
  }, [selectedBikes, filterType, filterBudget]);

  const pickerResults = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query ? availableBikes.filter((bike) => `${bike.name} ${bike.brand}`.toLowerCase().includes(query)) : availableBikes;
  }, [availableBikes, search]);

  const fullSpecSections = useMemo(() => {
    if (selectedBikes.length < 2) return [];
    return SPEC_SECTIONS.map((section) => {
      const keys = new Set<string>();
      for (const bike of selectedBikes) {
        const data = bike[section.key] as unknown as SpecRecord;
        if (data) Object.keys(data).forEach((key) => keys.add(key));
      }
      return { ...section, keys: [...keys] };
    }).filter((section) => section.keys.length > 0);
  }, [selectedBikes]);

  useEffect(() => {
    if (openSlot === null) return;
    pickerInputRef.current?.focus();
    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") { setOpenSlot(null); setSearch(""); }
    }
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [openSlot]);

  function selectBike(index: number, bike: OBike) {
    setSlots((previous) => {
      if (previous.some((selected) => selected?.slug === bike.slug)) return previous;
      const next = [...previous];
      next[index] = bike;
      return next;
    });
    setOpenSlot(null);
    setSearch("");
  }

  function removeBike(index: number) {
    setSlots((previous) => previous.map((bike, slotIndex) => slotIndex === index ? null : bike));
  }

  function clearAll() {
    setSlots(Array(MAX_SLOTS).fill(null));
    setShowFullSpecs(false);
    setOpenSlot(null);
    setSearch("");
  }

  const columns = `minmax(170px,0.8fr) repeat(${selectedBikes.length},minmax(0,1fr))`;

  return <section className="bg-[#eaf3ff] px-3 py-10 sm:px-6 sm:py-16 lg:px-8" aria-labelledby="compare-bikes-heading">
    <div className="mx-auto max-w-6xl rounded-[28px] border border-blue-100 bg-gradient-to-br from-white via-[#f8fbff] to-[#eaf2ff] px-3 pb-6 pt-8 shadow-[0_18px_45px_-25px_rgba(37,99,235,0.3)] sm:px-8 sm:pb-8 lg:px-12">
      <h2 id="compare-bikes-heading" className="text-center text-[26px] font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl">Compare <span className="text-blue-600">Bikes</span></h2>
      <p className="mt-1 text-center text-xs text-slate-600 sm:text-sm">Pick 2 or 3 bikes and see them side by side.</p>

      <div className="mx-auto mt-5 grid max-w-sm grid-cols-2 gap-2 sm:mt-6 sm:gap-3">
        <label className="relative min-w-0"><span className="sr-only">Filter by body type</span><select value={filterType} onChange={(event) => setFilterType(event.target.value)} className="h-10 w-full appearance-none rounded-full border border-blue-200 bg-white pl-3 pr-7 text-[11px] font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:pl-4 sm:text-sm"><option value="All">All Body Types</option>{bodyTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select><svg viewBox="0 0 24 24" className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-900" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></label>
        <label className="relative min-w-0"><span className="sr-only">Filter by budget</span><select value={filterBudget} onChange={(event) => setFilterBudget(event.target.value)} className="h-10 w-full appearance-none rounded-full border border-blue-200 bg-white pl-3 pr-7 text-[11px] font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:pl-4 sm:text-sm"><option value="All">Any Budget</option>{BUDGET_BUCKETS.map((bucket) => <option key={bucket.label} value={bucket.label}>{bucket.label}</option>)}</select><svg viewBox="0 0 24 24" className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-900" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></label>
      </div>
      <p className="mt-2 text-center text-xs text-slate-600 sm:text-sm"><strong className="text-blue-600">{availableBikes.length}</strong> {availableBikes.length === 1 ? "bike" : "bikes"} available to compare</p>

      <div className="mb-3 mt-7 flex items-center justify-between text-xs sm:mt-9 sm:text-sm"><span className="font-semibold text-slate-600">{selectedBikes.length}/{MAX_SLOTS} selected</span>{selectedBikes.length > 0 && <button type="button" onClick={clearAll} className="font-bold text-blue-600 hover:underline">Clear all</button>}</div>
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {slots.map((bike, index) => bike ? <div key={index} className="relative flex min-w-0 flex-col rounded-xl border border-blue-200 bg-white p-2 shadow-sm sm:rounded-2xl sm:p-4">
          <button type="button" onClick={() => removeBike(index)} aria-label={`Remove ${bike.name} from comparison`} className="absolute right-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-slate-500 hover:bg-red-50 hover:text-red-600 sm:right-2 sm:top-2"><svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19" /></svg></button>
          <div className="relative mb-1 h-16 w-full sm:h-24"><Image src={bike.images?.primary || "/placeholder-bike.png"} alt={bike.name} fill sizes="(max-width: 639px) 30vw, 240px" className="object-contain" /></div>
          <p className="truncate text-[9px] font-semibold text-blue-600 sm:text-xs">{bike.brand}</p>
          <p className="line-clamp-3 min-h-[2.25rem] text-[10px] font-bold leading-tight text-slate-950 sm:line-clamp-2 sm:min-h-[2.5rem] sm:text-sm">{bike.name}</p>
          <p className="mt-auto pt-1 text-[10px] font-extrabold leading-tight text-slate-950 sm:text-base"><span className="sm:hidden">{formatPrice(bike.price, false)}</span><span className="hidden sm:inline">{formatPrice(bike.price)}</span></p>
        </div> : <button key={index} type="button" onClick={() => { setOpenSlot(index); setSearch(""); }} aria-label={`Add bike ${index + 1} to comparison`} className="relative flex min-h-[92px] flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-blue-300 bg-white/40 text-blue-600 transition hover:border-blue-500 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 sm:min-h-[180px] sm:rounded-2xl">
          <span className="z-10 flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-2xl leading-none sm:h-12 sm:w-12 sm:text-3xl" aria-hidden="true">+</span><span className="z-10 mt-1 text-[11px] font-bold sm:text-lg">Add Bike</span><BikeArt />
        </button>)}
      </div>

      {selectedBikes.length < 2 ? <p className="mx-auto mt-7 flex max-w-lg items-center justify-center gap-2 rounded-full border border-blue-200 bg-blue-50/70 px-3 py-3 text-center text-[11px] text-slate-600 sm:text-sm"><SpecIcon label="Body Type" />Select at least 2 bikes to start comparing prices, specs, and features.</p> : <div className="mt-5 overflow-hidden rounded-xl border border-blue-200 bg-white/70 sm:mt-6">
        {CURATED_ROWS.map((row) => <ComparisonRow key={row.label} label={row.label} values={selectedBikes.map((bike) => row.value(bike) || "—")} winners={row.better && row.numeric ? bestIndices(selectedBikes.map(row.numeric), row.better) : []} columns={columns} defaultOpen={row.label === "Price"} />)}
        {showFullSpecs && fullSpecSections.map((section) => <div key={section.key}><h3 className="border-y border-blue-100 bg-blue-50/80 px-4 py-2 text-xs font-bold uppercase tracking-wide text-blue-700">{section.title}</h3>{section.keys.map((key) => <ComparisonRow key={`${section.key}-${key}`} label={formatLabel(key)} values={selectedBikes.map((bike) => { const data = bike[section.key as SpecSectionKey] as unknown as SpecRecord; return data?.[key] || "—"; })} winners={[]} columns={columns} />)}</div>)}
        {fullSpecSections.length > 0 && <button type="button" onClick={() => setShowFullSpecs((shown) => !shown)} aria-expanded={showFullSpecs} className="flex w-full items-center justify-center gap-2 border-t border-blue-200 bg-blue-50/70 px-4 py-3 text-xs font-bold text-blue-700 hover:bg-blue-100 sm:text-sm">{showFullSpecs ? "Hide Full Specifications" : "Show Full Specifications"}<svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform ${showFullSpecs ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></button>}
      </div>}
    </div>

    {openSlot !== null && <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/40 sm:items-center sm:p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) { setOpenSlot(null); setSearch(""); } }}>
      <div role="dialog" aria-modal="true" aria-labelledby="compare-picker-heading" className="w-full overflow-hidden rounded-t-2xl border border-blue-100 bg-white shadow-2xl sm:max-w-md sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-blue-100 px-4 py-3"><h3 id="compare-picker-heading" className="text-base font-bold text-slate-950">Choose a bike</h3><button type="button" onClick={() => { setOpenSlot(null); setSearch(""); }} aria-label="Close bike picker" className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100">✕</button></div>
        <div className="p-3"><label className="sr-only" htmlFor="compare-bike-search">Search bike or brand</label><input id="compare-bike-search" ref={pickerInputRef} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search bike or brand..." className="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /><p className="mt-1 px-1 text-xs text-slate-500">{pickerResults.length} {pickerResults.length === 1 ? "bike" : "bikes"} match your filters</p></div>
        <div className="max-h-[55vh] overflow-y-auto border-t border-blue-50 pb-[env(safe-area-inset-bottom)]">{pickerResults.length ? pickerResults.map((bike) => <button key={bike.slug} type="button" onClick={() => selectBike(openSlot, bike)} className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-2 text-left hover:bg-blue-50"><span className="relative h-12 w-14 shrink-0"><Image src={bike.images?.primary || "/placeholder-bike.png"} alt="" fill sizes="56px" className="object-contain" /></span><span className="min-w-0"><span className="block truncate text-sm font-semibold text-slate-900">{bike.name}</span><span className="block text-xs text-slate-500">{bike.brand} · {formatPrice(bike.price)}</span></span></button>) : <p className="px-4 py-8 text-center text-sm text-slate-500">No bikes match your filters. Try a different body type or budget.</p>}</div>
      </div>
    </div>}
  </section>;
}
