"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { bikes } from "@/data/bike";
import type { OBike } from "@/types/bike";

const FEATURED_BRANDS = ["All", "Suzuki", "Yamaha", "Royal Enfield", "CFMOTO", "TVS", "Hero", "Honda", "Bajaj"];
const PAGE_SIZE = 8;
const SORT_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name", label: "Name: A to Z" },
] as const;
type SortOption = (typeof SORT_OPTIONS)[number]["value"];

function Icon({ name, className = "h-4 w-4" }: { name: "search" | "filter" | "heart" | "arrow" | "grid" | "list" | "city" | "highway" | "chevron"; className?: string }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m16 16 4 4" /></>,
    filter: <><path d="M4 5h16l-6.5 7.5V19l-3 1v-7.5L4 5Z" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    list: <><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h1M3 12h1M3 18h1" /></>,
    city: <><path d="M5 20V6l7-3 7 3v14M3 20h18M9 8h1m4 0h1M9 12h1m4 0h1M9 16h1m4 0h1" /></>,
    highway: <><path d="M7 3 4 21m13-18 3 18M12 4v3m0 4v3m0 4v3M4 21h16" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{paths[name]}</svg>;
}

function priceLabel(price: string) {
  const amount = price.replace(/BDT|৳/gi, "").trim();
  return amount ? `৳ ${amount} BDT` : "Price on request";
}

function shortMileage(value?: string) {
  const match = value?.match(/\d+(?:\.\d+)?/);
  return match ? `${match[0]} km/l` : "N/A";
}

function Mileage({ bike, compact = false }: { bike: OBike; compact?: boolean }) {
  const city = shortMileage(bike.mileage?.city);
  const highway = shortMileage(bike.mileage?.highway);
  return <div className={`flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-slate-600 ${compact ? "text-[9px]" : "text-[11px]"}`}>
    <span className="inline-flex items-center gap-1 whitespace-nowrap"><Icon name="city" className="h-3 w-3 text-blue-600" />City: {city}</span>
    <span className="inline-flex items-center gap-1 whitespace-nowrap"><Icon name="highway" className="h-3 w-3 text-blue-600" />Highway: {highway}</span>
  </div>;
}

function ListingCard({ bike, mode, saved, onSave }: { bike: OBike; mode: "grid" | "list"; saved: boolean; onSave: (slug: string) => void }) {
  return <article className={`group relative min-w-0 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_8px_26px_-17px_rgba(30,64,175,0.3)] transition hover:border-blue-300 hover:shadow-[0_14px_32px_-18px_rgba(30,64,175,0.42)] ${mode === "list" ? "md:flex md:min-h-44" : ""}`}>
    <Link href={`/bikes/${bike.slug}`} className={`relative block shrink-0 bg-gradient-to-b from-white to-blue-50/30 max-md:absolute max-md:inset-y-0 max-md:left-0 max-md:w-[34%] ${mode === "list" ? "md:w-56" : "md:aspect-[1.55] md:w-full"}`} aria-label={`View ${bike.name}`}>
      {bike.images?.primary ? <Image src={bike.images.primary} alt={bike.name} fill sizes="(max-width: 767px) 34vw, (max-width: 1023px) 50vw, 25vw" className="object-contain p-3 transition duration-300 group-hover:scale-105 max-md:p-2" /> : <span className="flex h-full items-center justify-center text-xs text-slate-400">Image coming soon</span>}
      <span className="absolute left-3 top-3 hidden max-w-[70%] items-center gap-1 truncate rounded-full border border-blue-100 bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-blue-700 shadow-sm md:inline-flex">✦ {bike.bike_type || "Motorcycle"}</span>
    </Link>
    <button type="button" onClick={() => onSave(bike.slug)} aria-label={saved ? `Remove ${bike.name} from wishlist` : `Save ${bike.name} to wishlist`} aria-pressed={saved} className={`absolute right-3 top-3 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 transition hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 ${saved ? "text-blue-600" : "text-slate-800"}`}><Icon name="heart" className={`h-5 w-5 ${saved ? "fill-blue-600" : "fill-none"}`} /></button>
    <div className={`flex min-w-0 flex-col max-md:ml-[34%] max-md:min-h-[143px] max-md:py-3 max-md:pl-2 max-md:pr-9 ${mode === "list" ? "md:flex-1 md:p-5" : "md:p-4"}`}>
      <span className="mb-1 inline-flex w-fit rounded-full bg-blue-50 px-2 py-1 text-[9px] font-semibold text-blue-700 md:hidden">{bike.bike_type || "Motorcycle"}</span>
      <p className="hidden text-xs font-medium text-blue-600 md:block">{bike.brand}</p>
      <Link href={`/bikes/${bike.slug}`} className="line-clamp-2 text-[12px] font-bold leading-tight text-slate-950 hover:text-blue-700 md:mt-1 md:min-h-[2.5rem] md:text-base">{bike.name}</Link>
      <div className="mt-2"><Mileage bike={bike} compact /></div>
      <div className="mt-4 flex items-center justify-between gap-1">
        <span className="text-[14px] font-extrabold leading-tight text-blue-700 md:text-lg">{priceLabel(bike.price)}</span>
        <Link href={`/bikes/${bike.slug}`} aria-label={`All details for ${bike.name}`} className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 transition hover:bg-blue-600 hover:text-white md:hidden"><Icon name="arrow" /></Link>
      </div>
      <Link href={`/bikes/${bike.slug}`} className="mt-4 hidden h-9 items-center justify-center gap-1 rounded-xl bg-blue-50 text-sm font-bold text-blue-700 transition hover:bg-blue-600 hover:text-white md:inline-flex">All Details <Icon name="arrow" className="h-4 w-4" /></Link>
    </div>
  </article>;
}

export default function BikeListings() {
  const brands = useMemo(() => {
    const available = new Set(bikes.map((bike) => bike.brand));
    return [...FEATURED_BRANDS.filter((brand) => brand === "All" || available.has(brand)), ...[...available].filter((brand) => !FEATURED_BRANDS.includes(brand)).sort()];
  }, []);
  const [brand, setBrand] = useState(() => brands.includes("Suzuki") ? "Suzuki" : "All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("popular");
  const [mode, setMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [sortOpen, setSortOpen] = useState(false);
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const brandsRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const mobileSortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("bikebd-wishlist") || "[]");
      if (Array.isArray(saved)) setSavedSlugs(saved.filter((slug): slug is string => typeof slug === "string"));
    } catch { /* Storage may be unavailable. */ }
  }, []);

  useEffect(() => {
    function close(event: PointerEvent) {
      if (!sortRef.current?.contains(event.target as Node) && !mobileSortRef.current?.contains(event.target as Node)) setSortOpen(false);
    }
    function escape(event: KeyboardEvent) { if (event.key === "Escape") setSortOpen(false); }
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", escape); };
  }, []);

  function toggleSave(slug: string) {
    try {
      const stored = JSON.parse(localStorage.getItem("bikebd-wishlist") || "[]");
      const next = new Set<string>(Array.isArray(stored) ? stored.filter((item): item is string => typeof item === "string") : []);
      if (next.has(slug)) next.delete(slug); else next.add(slug);
      localStorage.setItem("bikebd-wishlist", JSON.stringify([...next]));
      setSavedSlugs([...next]);
    } catch { /* Keep browsing available when storage is blocked. */ }
  }

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    const matches = bikes.filter((bike) => (brand === "All" || bike.brand === brand) && (!search || `${bike.name} ${bike.brand} ${bike.bike_type}`.toLowerCase().includes(search)));
    if (sort === "popular") return matches;
    return [...matches].sort((a, b) => sort === "newest" ? (Date.parse(b.updated_at) || 0) - (Date.parse(a.updated_at) || 0) : sort === "name" ? a.name.localeCompare(b.name) : sort === "price-low" ? (Number(a.price.replace(/\D/g, "")) || 0) - (Number(b.price.replace(/\D/g, "")) || 0) : (Number(b.price.replace(/\D/g, "")) || 0) - (Number(a.price.replace(/\D/g, "")) || 0));
  }, [brand, query, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function selectBrand(next: string) { setBrand(next); setPage(1); }
  function search(value: string) { setQuery(value); if (value.trim()) setBrand("All"); setPage(1); }
  function selectSort(next: SortOption) { setSort(next); setPage(1); setSortOpen(false); }

  return <section className="bg-[#f7faff] py-8 sm:py-12" aria-label="Browse motorcycles by brand">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-blue-100 bg-white/90 p-3 shadow-[0_8px_28px_-18px_rgba(30,64,175,0.24)] md:flex md:items-center md:gap-4">
        <div className="flex min-w-0 items-center gap-2 md:shrink-0">
          <label className="relative block min-w-0 flex-1 md:w-64"><span className="sr-only">Search brand or model</span><Icon name="search" className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-600" /><input value={query} onChange={(event) => search(event.target.value)} placeholder="Search brand or model..." className="h-11 w-full rounded-full border border-blue-100 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></label>
          <div ref={mobileSortRef} className="relative md:hidden"><button type="button" onClick={() => setSortOpen((open) => !open)} aria-expanded={sortOpen} aria-controls="mobile-listing-sort-options" aria-label="Sort bikes" className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-600"><Icon name="filter" className="h-5 w-5" /></button>
            {sortOpen && <div id="mobile-listing-sort-options" className="absolute right-0 top-full z-30 mt-2 w-48 rounded-xl border border-blue-100 bg-white p-1.5 shadow-xl">{SORT_OPTIONS.map((option) => <button key={option.value} type="button" onClick={() => selectSort(option.value)} className={`block w-full rounded-lg px-3 py-2 text-left text-xs ${sort === option.value ? "bg-blue-50 font-bold text-blue-700" : "text-slate-700 hover:bg-slate-50"}`}>{option.label}</button>)}</div>}
          </div>
        </div>
        <div className="mt-3 flex min-w-0 items-center gap-2 md:mt-0 md:flex-1">
          <div ref={brandsRef} className="scrollbar-hide flex min-w-0 flex-1 gap-2 overflow-x-auto whitespace-nowrap" role="group" aria-label="Filter by brand">
            {brands.map((item) => <button key={item} type="button" onClick={() => selectBrand(item)} aria-pressed={brand === item} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition sm:text-sm ${brand === item ? "bg-blue-600 text-white shadow-[0_5px_13px_-7px_rgba(37,99,235,0.65)]" : "bg-blue-50 text-blue-700 hover:bg-blue-100"}`}>{brand === item && item !== "All" && <span aria-hidden="true" className="mr-1">✓</span>}{item}</button>)}
          </div>
          <button type="button" onClick={() => brandsRef.current?.scrollBy({ left: 220, behavior: "smooth" })} aria-label="Show more brands" className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-700 md:inline-flex">→</button>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-600">Showing <strong className="text-slate-950">{filtered.length}</strong> bikes{brand !== "All" && <> from <strong className="text-blue-700">{brand}</strong></>}</p>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 rounded-xl border border-blue-100 bg-white p-1 md:flex"><button type="button" onClick={() => setMode("grid")} aria-label="Grid view" aria-pressed={mode === "grid"} className={`flex h-8 w-8 items-center justify-center rounded-lg ${mode === "grid" ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-blue-50"}`}><Icon name="grid" /></button><button type="button" onClick={() => setMode("list")} aria-label="List view" aria-pressed={mode === "list"} className={`flex h-8 w-8 items-center justify-center rounded-lg ${mode === "list" ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-blue-50"}`}><Icon name="list" /></button></div>
          <div ref={sortRef} className="relative hidden md:block"><button type="button" onClick={() => setSortOpen((open) => !open)} aria-expanded={sortOpen} aria-controls="listing-sort-options" aria-label="Sort bikes" className="flex h-9 min-w-40 items-center justify-center gap-2 rounded-xl border border-blue-100 bg-white px-3 text-slate-900 shadow-sm"><span className="text-xs font-semibold">Sort: {SORT_OPTIONS.find((option) => option.value === sort)?.label}</span><span>→</span></button>
            {sortOpen && <div id="listing-sort-options" className="absolute right-0 top-full z-30 mt-2 w-48 rounded-xl border border-blue-100 bg-white p-1.5 shadow-xl">{SORT_OPTIONS.map((option) => <button key={option.value} type="button" onClick={() => selectSort(option.value)} className={`block w-full rounded-lg px-3 py-2 text-left text-xs ${sort === option.value ? "bg-blue-50 font-bold text-blue-700" : "text-slate-700 hover:bg-slate-50"}`}>{option.label}</button>)}</div>}
          </div>
        </div>
      </div>

      {visible.length ? <div className={`mt-5 grid gap-3 md:gap-4 ${mode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-4" : "grid-cols-1 md:grid-cols-2"}`}>
        {visible.map((bike) => <ListingCard key={bike.slug} bike={bike} mode={mode} saved={savedSlugs.includes(bike.slug)} onSave={toggleSave} />)}
      </div> : <p className="mt-5 rounded-2xl border border-blue-100 bg-white px-4 py-12 text-center text-sm text-slate-600">No bikes match this search. Try another brand or model.</p>}

      <div className="mt-5 flex flex-wrap items-center justify-center md:justify-between gap-3 text-xs text-slate-600">
        <span className="hidden md:block">Showing {filtered.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0} – {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} bikes</span>
        {pageCount > 1 && <nav className="flex items-center gap-2" aria-label="Bike listing pages"><button type="button" onClick={() => setPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} aria-label="Previous page" className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-600 disabled:opacity-40"><Icon name="chevron" className="h-4 w-4 rotate-180" /></button>{Array.from({ length: pageCount }, (_, index) => index + 1).filter((number) => number === 1 || number === pageCount || Math.abs(number - currentPage) <= 1).map((number) => <button key={number} type="button" onClick={() => setPage(number)} aria-current={number === currentPage ? "page" : undefined} className={`h-9 min-w-9 rounded-xl px-2 font-bold ${number === currentPage ? "bg-blue-600 text-white" : "border border-blue-100 bg-white text-blue-700"}`}>{number}</button>)}<button type="button" onClick={() => setPage(Math.min(pageCount, currentPage + 1))} disabled={currentPage === pageCount} aria-label="Next page" className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-600 disabled:opacity-40"><Icon name="chevron" className="h-4 w-4" /></button></nav>}
      </div>
    </div>
  </section>;
}
