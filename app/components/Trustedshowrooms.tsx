"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  DIVISIONS,
  getDivisionCounts,
  getTotalShowroomCount,
  showrooms,
} from "@/data/showroom";

type ShowroomRecord = (typeof showrooms)[number];

const icons = {
  shop: (
    <path d="M3 9h18l-1.5-5h-15L3 9Zm0 0v10h18V9M9 19v-7h6v7M3 9c0 2 4 2 4 0 0 2 4 2 4 0 0 2 4 2 4 0 0 2 4 2 4 0 0 2 4 2 4 0" />
  ),
  pin: (
    <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>
  ),
  search: <><circle cx="10.8" cy="10.8" r="6.5"/><path d="m16 16 5 5"/></>,
  arrow: <><path d="M5 12h14m-6-6 6 6-6 6"/></>,
  external: <><path d="M14 4h6v6m0-6-9 9"/><path d="M20 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6"/></>,
  map: <><path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5Zm6-2v16m6-14v16"/></>,
  chevron: <path d="m6 9 6 6 6-6" />,
  check: <path d="m5 12 4 4L19 6" />,
};

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: keyof typeof icons;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

function mapsEmbedUrl(showroom: ShowroomRecord) {
  // Query-only embedded map. This does NOT assert a verified pin or coordinates.
  const query = `${showroom.name}, ${showroom.address}, Bangladesh`;
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

export default function TrustedShowrooms() {
  const [selectedDivision, setSelectedDivision] = useState<string>("Dhaka");
  const [selectedShowroomId, setSelectedShowroomId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("All brands");

  const divisionCounts = useMemo(() => getDivisionCounts(), []);
  const total = useMemo(() => getTotalShowroomCount(), []);

  const divisionShowrooms = useMemo(
    () => showrooms.filter((showroom) => showroom.division === selectedDivision),
    [selectedDivision]
  );

  const brands = useMemo(
    () => ["All brands", ...Array.from(new Set(divisionShowrooms.flatMap((s) => s.brands))).sort()],
    [divisionShowrooms]
  );

  const filteredShowrooms = useMemo(() => {
    const q = search.trim().toLowerCase();
    return divisionShowrooms.filter((showroom) => {
      const matchesBrand = brand === "All brands" || showroom.brands.includes(brand);
      const matchesSearch = !q || [
        showroom.name,
        showroom.city,
        showroom.address,
        ...showroom.brands,
        "district" in showroom ? String(showroom.district) : "",
      ].some((field) => field.toLowerCase().includes(q));
      return matchesBrand && matchesSearch;
    });
  }, [divisionShowrooms, search, brand]);

  const selectedShowroom = filteredShowrooms.find((s) => s.id === selectedShowroomId) ?? null;

  function selectDivision(division: string) {
    setSelectedDivision(division);
    setSelectedShowroomId(null);
    setSearch("");
    setBrand("All brands");
  }

  return (
    <section className="bg-[#F5F8FE] px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-blue-100 bg-white shadow-[0_20px_70px_-35px_rgba(37,99,235,0.3)]">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0B1738] via-[#102C65] to-[#1C57CF] px-5 py-8 text-white sm:px-9 sm:py-10">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border-[35px] border-white/5" />
          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-blue-100">
                <Icon name="pin" className="h-3.5 w-3.5" /> BANGLADESH BIKE DEALER DIRECTORY
              </div>
              <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                Find a bike showroom <span className="text-[#91C3FF]">near you.</span>
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
                Explore directory-listed motorcycle dealers, compare locations, and search for directions on Google Maps.
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-sm">
                <div className="text-2xl font-extrabold">{total}</div>
                <div className="text-xs text-blue-100">Listed showrooms</div>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-sm">
                <div className="text-2xl font-extrabold">{DIVISIONS.length}</div>
                <div className="text-xs text-blue-100">Divisions</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-8">
          {/* Division picker */}
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 sm:text-xl">Choose your division</h3>
              <p className="mt-1 text-sm text-slate-500">Select an area to discover its listed motorcycle showrooms.</p>
            </div>
            <div className="relative sm:hidden">
              <select
                aria-label="Choose division"
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={selectedDivision}
                onChange={(e) => selectDivision(e.target.value)}
              >
                {DIVISIONS.map((division) => <option key={division} value={division}>{division}</option>)}
              </select>
              <Icon name="chevron" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {divisionCounts.map(({ division, count }) => {
              const active = selectedDivision === division;
              return (
                <button
                  key={division}
                  type="button"
                  aria-pressed={active}
                  onClick={() => selectDivision(division)}
                  className={`group relative min-w-0 rounded-2xl border p-3 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 sm:p-4 ${
                    active
                      ? "border-blue-500 bg-blue-50 shadow-[0_5px_18px_-12px_rgba(37,99,235,0.7)]"
                      : "border-slate-200 bg-[#F8FAFE] hover:border-blue-200"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${active ? "bg-blue-600 text-white" : "bg-white text-blue-600 shadow-sm"}`}>
                      <Icon name="shop" className="h-5 w-5" />
                    </span>
                    {active && <Icon name="check" className="h-4 w-4 text-blue-600" />}
                  </div>
                  <div className="truncate text-sm font-bold text-slate-900" title={division}>{division}</div>
                  <div className="mt-1 text-xs font-medium text-slate-500">{count} showroom{count !== 1 ? "s" : ""}</div>
                </button>
              );
            })}
          </div>

          {/* Results and map */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.06fr)] lg:items-start">
            <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="border-b border-slate-100 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">Showrooms in {selectedDivision}</h3>
                    <p className="mt-1 text-xs text-slate-500">{filteredShowrooms.length} of {divisionShowrooms.length} showrooms</p>
                  </div>
                  <div className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">{divisionShowrooms.length} listed</div>
                </div>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <label className="relative block min-w-0 flex-1">
                    <span className="sr-only">Search showrooms</span>
                    <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="search"
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setSelectedShowroomId(null); }}
                      placeholder="Search name, city or address"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </label>
                  <label className="relative block sm:w-36">
                    <span className="sr-only">Filter by brand</span>
                    <select
                      value={brand}
                      onChange={(e) => { setBrand(e.target.value); setSelectedShowroomId(null); }}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-8 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    >
                      {brands.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                    <Icon name="chevron" className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </label>
                </div>
              </div>

              <div className="max-h-[530px] space-y-2 overflow-y-auto p-3 sm:p-4" aria-label="Showroom results">
                {filteredShowrooms.length === 0 ? (
                  <div className="py-12 text-center">
                    <Icon name="search" className="mx-auto mb-3 h-8 w-8 text-slate-300" />
                    <p className="font-semibold text-slate-800">No matching showrooms</p>
                    <p className="mt-1 text-sm text-slate-500">Try another search or brand.</p>
                  </div>
                ) : filteredShowrooms.map((showroom) => {
                  const active = showroom.id === selectedShowroom?.id;
                  return (
                    <button
                      type="button"
                      key={showroom.id}
                      onClick={() => setSelectedShowroomId(showroom.id)}
                      aria-pressed={active}
                      className={`block w-full rounded-xl border p-3.5 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 sm:p-4 ${
                        active ? "border-blue-400 bg-blue-50/80 ring-1 ring-blue-200" : "border-slate-100 bg-[#FAFBFF] hover:border-blue-200 hover:bg-blue-50/40"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${active ? "bg-blue-600 text-white" : "bg-white text-blue-600 shadow-sm"}`}>
                          <Icon name="pin" className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-extrabold text-slate-900">{showroom.name}</span>
                          <span className="mt-1 block text-xs leading-5 text-slate-500">{showroom.address}</span>
                          <span className="mt-2 flex flex-wrap gap-1.5">
                            {showroom.brands.map((item) => (
                              <span key={item} className="rounded-md border border-blue-100 bg-white px-2 py-0.5 text-[11px] font-bold text-blue-700">{item}</span>
                            ))}
                          </span>
                        </span>
                        <Icon name="arrow" className={`mt-1 h-4 w-4 shrink-0 ${active ? "text-blue-600" : "text-slate-300"}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white lg:sticky lg:top-5">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-4 sm:p-5">
                <div>
                  <h3 className="flex items-center gap-2 text-base font-extrabold text-slate-900">
                    <Icon name="map" className="h-5 w-5 text-blue-600" /> Location preview
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">Google Maps address search</p>
                </div>
                {selectedShowroom && (
                  <a href={selectedShowroom.mapSearchUrl} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-blue-700 hover:underline">
                    Open map <Icon name="external" className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
              <div className="relative h-[290px] bg-[#EAF1FB] sm:h-[360px]">
                {selectedShowroom ? (
                  <iframe
                    key={selectedShowroom.id}
                    title={`Google Maps search preview for ${selectedShowroom.name}`}
                    src={mapsEmbedUrl(selectedShowroom)}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center px-7 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm"><Icon name="map" className="h-8 w-8" /></div>
                    <p className="text-base font-extrabold text-slate-800">Choose a showroom to view its map</p>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">Select any showroom from the list. Its address will appear in the Google Maps preview here.</p>
                  </div>
                )}
              </div>
              <div className="p-4 sm:p-5">
                {selectedShowroom ? (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-base font-extrabold text-slate-900">{selectedShowroom.name}</h4>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{selectedShowroom.address}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <a
                        href={selectedShowroom.mapSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                      >
                        <Icon name="pin" className="h-4 w-4" /> View on Google Maps
                      </a>
                      {"sourceUrl" in selectedShowroom && typeof selectedShowroom.sourceUrl === "string" && (
                        <a
                          href={selectedShowroom.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Dealer source <Icon name="external" className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <p className="mt-3 text-xs leading-5 text-slate-500">
                      Map results are based on the listed address. Exact GPS position and current opening status have not been independently confirmed.
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-slate-500">Select a showroom above to see its address and map link.</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-col items-start justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 px-5 py-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-bold text-slate-900">Browse the full directory</p>
              <p className="mt-1 text-xs text-slate-600">Currently showing {total} curated dealer listings across Bangladesh — not every active showroom.</p>
            </div>
            <Link href="/showrooms" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-blue-700 shadow-sm transition hover:bg-blue-100">
              All showrooms <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
