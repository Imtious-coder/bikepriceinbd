"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { OBike } from "@/types/bike";

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

function getMileage(bike: OBike): string {
  return (
    bike.mileage_top_speed?.mileage ||
    (bike.mileage?.city ? `${bike.mileage.city} (city)` : "") ||
    "—"
  );
}

const SPEC_ROWS: { label: string; get: (b: OBike) => string }[] = [
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

function XIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function PlusIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
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

export default function CategoryCompare({
  id,
  title,
  description,
  bikes,
  searchPool,
}: {
  id: string;
  title: string;
  description: string;
  bikes: OBike[]; // category-specific list, top 2 become the default comparison
  searchPool: OBike[]; // full bike list to search a 3rd bike from
}) {
  const [thirdSlug, setThirdSlug] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const base = bikes.slice(0, 2);

  if (base.length < 2) return null;

  const third = thirdSlug ? searchPool.find((b) => b.slug === thirdSlug) : null;
  const selected = third ? [...base, third] : base;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return searchPool
      .filter((b) => !selected.some((s) => s.slug === b.slug))
      .filter((b) => `${b.name} ${b.brand}`.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query, searchPool, selected]);

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="mb-14 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-5">
        <div>
          <h2 id={`${id}-heading`} className="text-2xl font-extrabold text-slate-900">
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-500 max-w-xl">{description}</p>
        </div>
        <Link
          href="/bikes"
          className="group inline-flex items-center gap-1.5 flex-shrink-0 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          View all bikes
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-white p-6 sm:p-8 shadow-sm">
        {/* Bike slots */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {base.map((bike) => (
            <div key={bike.slug} className="rounded-xl border border-blue-200 bg-blue-50/40 p-4">
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
          ))}

          {/* Third slot: selected or search */}
          {third ? (
            <div className="relative rounded-xl border border-blue-200 bg-blue-50/40 p-4">
              <button
                onClick={() => setThirdSlug(null)}
                aria-label={`Remove ${third.name} from comparison`}
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm hover:text-red-500"
              >
                <XIcon className="h-3.5 w-3.5" />
              </button>
              <div className="relative mx-auto mb-2 h-20 w-full">
                <Image
                  src={getImageUrl(third.images?.primary)}
                  alt={third.name}
                  fill
                  className="object-contain"
                  sizes="150px"
                />
              </div>
              <p className="text-xs font-semibold text-blue-600 uppercase">{third.brand}</p>
              <p className="text-sm font-bold text-slate-900 line-clamp-2">{third.name}</p>
            </div>
          ) : (
            <div className="relative rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-4 flex flex-col items-center justify-center min-h-[120px]">
              <PlusIcon className="h-5 w-5 text-slate-300 mb-2" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => query && setIsOpen(true)}
                placeholder="Add a 3rd bike to compare..."
                className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-center text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
              {isOpen && results.length > 0 && (
                <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-52 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 text-left shadow-lg">
                  {results.map((b) => (
                    <li key={b.slug}>
                      <button
                        onClick={() => {
                          setThirdSlug(b.slug);
                          setQuery("");
                          setIsOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-blue-50"
                      >
                        <span className="block font-medium">{b.name}</span>
                        <span className="block text-[10px] text-slate-400">{b.brand}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Comparison table */}
        <div className="overflow-x-auto rounded-xl border border-blue-100">
          <table className="w-full min-w-[480px] border-collapse text-left text-sm">
            <tbody className="divide-y divide-blue-50">
              {SPEC_ROWS.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-blue-50/30"}>
                  <th scope="row" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                    {row.label}
                  </th>
                  {selected.map((b) => (
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
                {selected.map((b) => (
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
      </div>
    </section>
  );
}