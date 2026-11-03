"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { bikes } from "@/data/bike";
import type { OBike } from "@/types/bike";

const BRANDS = ["All", "Honda", "Yamaha", "Bajaj", "Suzuki", "Hero", "TVS", "Royal Enfield", "CFMOTO"];
const PAGE_SIZE = 6;
const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "brand-asc", label: "Brand: A to Z" },
  { value: "brand-desc", label: "Brand: Z to A" },
  { value: "cc-asc", label: "CC: Low to High" },
  { value: "cc-desc", label: "CC: High to Low" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
] as const;
type SortKey = "name" | "brand" | "cc" | "price";
type SortDir = "asc" | "desc";

const normalize = (value: string) => value.toLowerCase().replace(/\s+/g, "");
const priceNumber = (value: string) => Number(value.replace(/\D/g, "")) || 0;
const ccNumber = (value: string) => Number.parseFloat(value) || 0;
const ccLabel = (value: string) => value ? `${value.replace(/\s*cc$/i, "")}cc` : "—";
function priceLabel(value: string) {
  const amount = value.replace(/BDT|৳/gi, "").trim();
  return amount ? `৳ ${amount} BDT` : "Price on request";
}
function mileageLabel(bike: OBike) {
  return bike.mileage_top_speed?.mileage || (bike.mileage?.city ? `${bike.mileage.city} (city)` : "") || "—";
}
function shortMileage(bike: OBike) {
  const match = mileageLabel(bike).match(/\d+(?:\.\d+)?/);
  return match ? `${match[0]} kmpl` : "N/A";
}

function Icon({ name, className = "h-4 w-4" }: { name: "table" | "search" | "grid" | "list" | "arrow" | "fuel" | "filter" | "engine"; className?: string }) {
  const paths = {
    table: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18M9 4v16" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m16 16 4 4" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    list: <><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h1M3 12h1M3 18h1" /></>,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    fuel: <><path d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M3 21h13M4 11h11M8 7h3M15 8h2l3 3v7a2 2 0 0 1-4 0v-5" /></>,
    filter: <path d="M4 7h16M7 12h10M10 17h4" />,
    engine: <><path d="M7 7h9l2 2h2v8h-3l-2 2H8l-2-2H4V9h3V7ZM9 7V4h5M9 11v4m3-4v4" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{paths[name]}</svg>;
}

function BikeImage({ bike, className }: { bike: OBike; className: string }) {
  return <div className={`relative shrink-0 overflow-hidden bg-slate-50 ${className}`}>
    {bike.images?.primary ? <Image src={bike.images.primary} alt={bike.name} fill sizes="(max-width: 767px) 45vw, 180px" className="object-contain p-1.5" /> : <div className="flex h-full items-center justify-center text-[10px] text-slate-400">No image</div>}
  </div>;
}

function BikeCard({ bike }: { bike: OBike }) {
  return <Link href={`/bikes/${bike.slug}`} className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_3px_12px_-8px_rgba(15,23,42,0.3)] transition hover:border-blue-200 hover:shadow-md">
    <BikeImage bike={bike} className="aspect-[4/3] w-full" />
    <div className="flex min-w-0 flex-1 flex-col p-2.5 sm:p-3">
      <h3 className="line-clamp-2 text-[11px] font-bold leading-4 text-slate-950 group-hover:text-blue-700 sm:text-sm">{bike.name}</h3>
      <p className="mt-1 truncate text-[10px] text-slate-500 sm:text-xs">{bike.brand}</p>
      <div className="flex flex-wrap gap-1 text-[9px] font-medium text-slate-600 sm:text-xs">
        <span className="inline-flex items-center gap-0.5 rounded-md bg-slate-50 pr-1.5 py-1"><Icon name="engine" className="h-3 w-3 text-blue-600" />{ccLabel(bike.cc)}</span>
        <span className="inline-flex items-center gap-0.5 rounded-md bg-slate-50 pr-1.5 py-1"><Icon name="fuel" className="h-3 w-3 text-blue-600" />{shortMileage(bike)}</span>
      </div>
      <p className="mt-auto text-[11px] font-extrabold text-blue-700 sm:text-sm">{priceLabel(bike.price)}</p>
    </div>
  </Link>;
}

export default function BikePriceTable() {
  const [activeBrand, setActiveBrand] = useState("All");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [page, setPage] = useState(1);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [mobileBrandOpen, setMobileBrandOpen] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const brandMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: PointerEvent) {
      if (!sortMenuRef.current?.contains(event.target as Node)) setMobileSortOpen(false);
      if (!brandMenuRef.current?.contains(event.target as Node)) setMobileBrandOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") { setMobileSortOpen(false); setMobileBrandOpen(false); }
    }
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => { document.removeEventListener("pointerdown", closeOnOutsideClick); document.removeEventListener("keydown", closeOnEscape); };
  }, []);

  const filtered = useMemo(() => {
    const search = normalize(query.trim());
    return bikes.filter((bike) =>
      (activeBrand === "All" || normalize(bike.brand) === normalize(activeBrand)) &&
      (!search || normalize(`${bike.name} ${bike.brand} ${bike.cc}`).includes(search))
    ).sort((a, b) => {
      const difference = sortKey === "name" ? a.name.localeCompare(b.name)
        : sortKey === "brand" ? a.brand.localeCompare(b.brand)
        : sortKey === "cc" ? ccNumber(a.cc) - ccNumber(b.cc)
        : priceNumber(a.price) - priceNumber(b.price);
      return sortDir === "asc" ? difference : -difference;
    });
  }, [activeBrand, query, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const sortValue = sortKey === "name" && sortDir === "asc" ? "default" : `${sortKey}-${sortDir}`;
  const pageNumbers = [...new Set([1, currentPage - 1, currentPage, currentPage + 1, pageCount])].filter((number) => number >= 1 && number <= pageCount).sort((a, b) => a - b);

  function selectBrand(brand: string) { setActiveBrand(brand); setPage(1); setMobileBrandOpen(false); }
  function sortBy(key: SortKey) {
    if (sortKey === key) setSortDir((dir) => dir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  }
  function selectSort(value: string) {
    if (value === "default") { setSortKey("name"); setSortDir("asc"); }
    else { const [key, direction] = value.split("-") as [SortKey, SortDir]; setSortKey(key); setSortDir(direction); }
    setPage(1);
    setMobileSortOpen(false);
  }

  const sortOptions = SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.value === "default" ? "Sort: Default" : option.label}</option>);

  return <section className="w-full bg-[#f5f9ff] px-3 py-8 sm:px-6 sm:py-12" aria-labelledby="bike-price-table-heading">
    <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-blue-100 bg-white p-3 shadow-[0_12px_36px_-20px_rgba(37,99,235,0.3)] sm:p-6 lg:p-8">
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-[9px] font-bold uppercase text-blue-700 sm:text-[10px]"><Icon name="table" className="h-3 w-3" /> {bikes.length} models tracked</span>
      <h2 id="bike-price-table-heading" className="mt-2 text-xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">Latest Bike Price in <span className="text-blue-600">Bangladesh 2026</span></h2>
      <p className="mt-1 max-w-3xl text-[11px] leading-relaxed text-slate-600 sm:text-sm">Compare official showroom prices, engine capacity and mileage for motorcycles from Honda, Yamaha, Bajaj, Suzuki, Hero, TVS, Royal Enfield, CFMOTO and other leading brands.</p>

      <div className="mt-4 hidden flex-wrap gap-2 md:flex" role="group" aria-label="Filter bikes by brand">
        {BRANDS.map((brand) => <button key={brand} type="button" aria-pressed={brand === activeBrand} onClick={() => selectBrand(brand)} className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${brand === activeBrand ? "border-blue-600 bg-blue-600 text-white shadow-sm" : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50"}`}>{brand}</button>)}
      </div>
      <div className="mt-4 flex min-w-0 items-center gap-1.5 md:hidden" role="group" aria-label="Filter bikes by brand">
        {BRANDS.slice(0, 4).map((brand) => <button key={brand} type="button" aria-pressed={brand === activeBrand} onClick={() => selectBrand(brand)} className={`min-w-0 shrink-0 rounded-full border px-2.5 py-1.5 text-[10px] font-semibold transition ${brand === activeBrand ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-700"}`}>{brand}</button>)}
        <div ref={brandMenuRef} className="relative min-w-0 flex-1">
          <button type="button" aria-expanded={mobileBrandOpen} aria-controls="mobile-brand-menu" onClick={() => { setMobileBrandOpen((open) => !open); setMobileSortOpen(false); }} className={`flex w-full items-center justify-between gap-1 rounded-full border px-2 py-1.5 text-[10px] font-semibold ${BRANDS.slice(4).includes(activeBrand) ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-700"}`}><span className="truncate">{BRANDS.slice(4).includes(activeBrand) ? activeBrand : "More"}</span><span aria-hidden="true">→</span></button>
          {mobileBrandOpen && <div id="mobile-brand-menu" className="absolute right-0 top-full z-30 mt-2 max-h-64 w-40 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
            {BRANDS.slice(4).map((brand) => <button key={brand} type="button" onClick={() => selectBrand(brand)} className={`block w-full rounded-lg px-3 py-2 text-left text-xs ${activeBrand === brand ? "bg-blue-50 font-bold text-blue-700" : "text-slate-700 hover:bg-slate-50"}`}>{brand}</button>)}
          </div>}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <label className="relative min-w-0 flex-1 md:max-w-sm"><span className="sr-only">Search bikes</span><Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search bike (e.g. Pulsar, Avenger...)" className="h-9 w-full rounded-full border border-slate-200 bg-white pl-9 pr-3 text-[11px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-xs" />
        </label>
        <div className="ml-auto hidden items-center gap-2 md:flex"><label className="sr-only" htmlFor="bike-table-sort">Sort bikes</label>
          <select id="bike-table-sort" value={sortValue} onChange={(event) => selectSort(event.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500">{sortOptions}</select>
          <button type="button" onClick={() => setViewMode("list")} aria-label="Table view" aria-pressed={viewMode === "list"} className={`flex h-9 w-9 items-center justify-center rounded-lg border ${viewMode === "list" ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-600"}`}><Icon name="list" /></button>
          <button type="button" onClick={() => setViewMode("grid")} aria-label="Grid view" aria-pressed={viewMode === "grid"} className={`flex h-9 w-9 items-center justify-center rounded-lg border ${viewMode === "grid" ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-600"}`}><Icon name="grid" /></button>
        </div>
        <div ref={sortMenuRef} className="relative md:hidden">
          <button type="button" aria-label="Sort bikes" aria-expanded={mobileSortOpen} aria-controls="mobile-sort-menu" onClick={() => { setMobileSortOpen((open) => !open); setMobileBrandOpen(false); }} className={`flex h-9 w-9 items-center justify-center rounded-lg border ${mobileSortOpen ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-700"}`}><Icon name="filter" /></button>
          {mobileSortOpen && <div id="mobile-sort-menu" className="absolute right-0 top-full z-30 mt-2 max-h-72 w-52 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
            {SORT_OPTIONS.map((option) => <button key={option.value} type="button" onClick={() => selectSort(option.value)} className={`block w-full rounded-lg px-3 py-2 text-left text-xs ${sortValue === option.value ? "bg-blue-50 font-bold text-blue-700" : "text-slate-700 hover:bg-slate-50"}`}>{option.label}</button>)}
          </div>}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2.5 md:hidden">{visible.map((bike) => <BikeCard key={bike.slug} bike={bike} />)}</div>
      {viewMode === "grid" ? <div className="mt-3 hidden grid-cols-2 gap-4 md:grid lg:grid-cols-3">{visible.map((bike) => <BikeCard key={bike.slug} bike={bike} />)}</div> :
        <div className="mt-3 hidden overflow-hidden rounded-xl border border-slate-200 md:block"><table className="w-full table-fixed text-left text-xs"><thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-600"><tr>
          <th className="w-[32%] px-3 py-2"><button type="button" onClick={() => sortBy("name")} className="hover:text-blue-600">Bike ↕</button></th>
          <th className="w-[15%] px-3 py-2"><button type="button" onClick={() => sortBy("brand")} className="hover:text-blue-600">Brand ↕</button></th>
          <th className="w-[10%] px-3 py-2"><button type="button" onClick={() => sortBy("cc")} className="hover:text-blue-600">CC ↕</button></th>
          <th className="w-[18%] px-3 py-2"><button type="button" onClick={() => sortBy("price")} className="hover:text-blue-600">Price ↕</button></th>
          <th className="w-[15%] px-3 py-2">Mileage</th><th className="w-[10%] px-3 py-2 text-right"><span className="sr-only">Details</span></th>
        </tr></thead><tbody className="divide-y divide-slate-100">{visible.map((bike) => <tr key={bike.slug} className="hover:bg-blue-50/50">
          <td className="px-3 py-1.5"><Link href={`/bikes/${bike.slug}`} className="flex min-w-0 items-center gap-2 font-bold text-slate-950 hover:text-blue-700"><BikeImage bike={bike} className="h-10 w-14 rounded-md" /><span className="line-clamp-2">{bike.name}</span></Link></td>
          <td className="truncate px-3 py-1.5 text-slate-600">{bike.brand}</td><td className="px-3 py-1.5 text-slate-600">{ccLabel(bike.cc)}</td>
          <td className="px-3 py-1.5"><span className="inline-block rounded-lg bg-blue-50 px-2 py-1 font-bold text-slate-900">{priceLabel(bike.price)}</span></td>
          <td className="px-3 py-1.5 text-slate-600"><span className="inline-flex items-center gap-1"><Icon name="fuel" className="h-3 w-3 shrink-0" />{mileageLabel(bike)}</span></td>
          <td className="px-3 py-1.5 text-right"><Link href={`/bikes/${bike.slug}`} className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg bg-blue-50 px-2 py-1 font-bold text-blue-700 hover:bg-blue-100"><span className="lg:hidden">View</span><span className="hidden lg:inline">View Details</span> <Icon name="arrow" className="h-3 w-3" /></Link></td>
        </tr>)}</tbody></table></div>}

      {filtered.length === 0 && <p className="rounded-xl border border-slate-200 py-8 text-center text-sm text-slate-500">No bikes match your search. Try another name or brand.</p>}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-600">
        <span>Showing {filtered.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0} – {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} bikes</span>
        {pageCount > 1 && <nav className="flex items-center gap-1" aria-label="Bike price pages">
          <button type="button" onClick={() => setPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} aria-label="Previous page" className="h-7 rounded-md border border-slate-200 px-2 disabled:opacity-40">‹</button>
          {pageNumbers.map((number, index) => <span key={number} className="flex items-center gap-1">{index > 0 && number - pageNumbers[index - 1] > 1 && <span className="px-1">…</span>}<button type="button" onClick={() => setPage(number)} aria-current={number === currentPage ? "page" : undefined} className={`h-7 min-w-7 rounded-md px-1 font-semibold ${number === currentPage ? "bg-blue-600 text-white" : "border border-slate-200 hover:bg-blue-50"}`}>{number}</button></span>)}
          <button type="button" onClick={() => setPage(Math.min(pageCount, currentPage + 1))} disabled={currentPage === pageCount} aria-label="Next page" className="h-7 rounded-md border border-slate-200 px-2 disabled:opacity-40">›</button>
        </nav>}
        <Link href="/bikes" className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline">View full bike price list <Icon name="arrow" className="h-3.5 w-3.5" /></Link>
      </div>
    </div>
  </section>;
}
