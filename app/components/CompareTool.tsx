"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { bikes } from "@/data/bike";

const MAX_COMPARE = 3;
const MAX_SUGGESTIONS = 6;

function getImageUrl(image?: string): string {
  if (!image) return "/placeholder-bike.png";
  const markdownMatch = image.match(/\]\((https?:\/\/[^)]+)\)/);
  if (markdownMatch?.[1]) return markdownMatch[1];
  return image.trim();
}

function formatPrice(price?: string): string {
  if (!price || price.trim() === "") return "Price on request";
  const cleaned = price.replace(/BDT/gi, "").trim();
  return cleaned ? `৳ ${cleaned}` : "Price on request";
}

function getMileage(bike: (typeof bikes)[number]): string {
  return (
    bike.mileage_top_speed?.mileage ||
    (bike.mileage?.city ? `${bike.mileage.city} (city)` : "") ||
    "—"
  );
}

function PlusIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function XIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export default function CompareTool() {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedBikes = useMemo(
    () => selectedSlugs.map((slug) => bikes.find((b) => b.slug === slug)).filter(Boolean) as typeof bikes,
    [selectedSlugs]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return bikes
      .filter((b) => !selectedSlugs.includes(b.slug))
      .filter((b) => `${b.name} ${b.brand}`.toLowerCase().includes(q))
      .slice(0, MAX_SUGGESTIONS);
  }, [query, selectedSlugs]);

  function addBike(slug: string) {
    if (selectedSlugs.length >= MAX_COMPARE) return;
    setSelectedSlugs((prev) => [...prev, slug]);
    setQuery("");
    setIsOpen(false);
  }

  function removeBike(slug: string) {
    setSelectedSlugs((prev) => prev.filter((s) => s !== slug));
  }

  const specRows: { label: string; get: (b: (typeof bikes)[number]) => string }[] = [
    { label: "Price", get: (b) => formatPrice(b.price) },
    { label: "Engine Capacity", get: (b) => (b.cc ? `${b.cc}cc` : "—") },
    { label: "Mileage", get: (b) => getMileage(b) },
    { label: "Top Speed", get: (b) => b.mileage_top_speed?.top_speed || "—" },
    { label: "Max Power", get: (b) => b.engine?.maximum_power || "—" },
    { label: "Max Torque", get: (b) => b.engine?.maximum_torque || "—" },
    { label: "Transmission", get: (b) => (b.transmission?.no_of_gears ? `${b.transmission.no_of_gears}-Speed` : "—") },
    { label: "Braking System", get: (b) => b.brakes?.braking_system || "—" },
    { label: "Weight", get: (b) => b.dimensions?.weight || "—" },
    { label: "Fuel Tank", get: (b) => b.dimensions?.fuel_tank_capacity || "—" },
  ];

  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-6 sm:p-8 shadow-sm">
      <p className="text-sm text-slate-500 mb-4">
        Pick 2 or 3 bikes below to compare price, engine specs, and mileage side by side.{" "}
        <span className="font-semibold text-slate-700">{selectedBikes.length}/{MAX_COMPARE} selected</span>
      </p>

      {/* Slots */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {Array.from({ length: MAX_COMPARE }).map((_, i) => {
          const bike = selectedBikes[i];
          if (bike) {
            return (
              <div key={bike.slug} className="relative rounded-xl border border-blue-200 bg-blue-50/40 p-4">
                <button
                  onClick={() => removeBike(bike.slug)}
                  aria-label={`Remove ${bike.name} from comparison`}
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm hover:text-red-500"
                >
                  <XIcon className="h-3.5 w-3.5" />
                </button>
                <div className="relative mx-auto mb-2 h-20 w-full">
                  <Image
                    src={getImageUrl(bike.images?.primary)}
                    alt={bike.name}
                    fill
                    className="object-contain"
                    sizes="150px"
                  />
                </div>
                <p className="text-xs font-semibold text-blue-600 uppercase">{bike.brand}</p>
                <p className="text-sm font-bold text-slate-900 line-clamp-2">{bike.name}</p>
              </div>
            );
          }

          // last empty slot with the search input
          const isSearchSlot = i === selectedBikes.length;
          return (
            <div
              key={`empty-${i}`}
              ref={isSearchSlot ? containerRef : undefined}
              className="relative rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-4 flex flex-col items-center justify-center min-h-[120px]"
            >
              {isSearchSlot ? (
                <>
                  <PlusIcon className="h-5 w-5 text-slate-300 mb-2" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setIsOpen(true);
                    }}
                    onFocus={() => query && setIsOpen(true)}
                    placeholder="Search a bike..."
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-center text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                  />
                  {isOpen && results.length > 0 && (
                    <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-52 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 text-left shadow-lg">
                      {results.map((b) => (
                        <li key={b.slug}>
                          <button
                            onClick={() => addBike(b.slug)}
                            className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-blue-50"
                          >
                            <span className="block font-medium">{b.name}</span>
                            <span className="block text-[10px] text-slate-400">{b.brand}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <span className="text-xs text-slate-300">Add Bike</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Comparison table */}
      {selectedBikes.length >= 2 ? (
        <div className="overflow-x-auto rounded-xl border border-blue-100">
          <table className="w-full min-w-[480px] border-collapse text-left text-sm">
            <tbody className="divide-y divide-blue-50">
              {specRows.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-blue-50/30"}>
                  <th scope="row" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                    {row.label}
                  </th>
                  {selectedBikes.map((b) => (
                    <td key={b.slug} className="px-4 py-3 text-sm font-medium text-slate-900">
                      {row.get(b)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <th scope="row" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Details
                </th>
                {selectedBikes.map((b) => (
                  <td key={b.slug} className="px-4 py-3">
                    <Link href={`/bikes/${b.slug}`} className="text-sm font-semibold text-blue-600 hover:underline">
                      View {b.name} →
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-sm text-slate-400 py-6">
          Select at least 2 bikes above to see a comparison.
        </p>
      )}
    </div>
  );
}