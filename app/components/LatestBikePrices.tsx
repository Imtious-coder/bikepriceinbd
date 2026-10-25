"use client";

import { bikes } from "@/data/bike";
import type { OBike } from "@/types/bike";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const CATEGORIES = [
  "All",
  "Popular",
  "Sports",
  "Commuter",
  "Scooter",
  "Naked",
  "Adventure",
  "Electric",
] as const;

type Category = (typeof CATEGORIES)[number];

const MAX_CARDS = 24;
const MOBILE_PAGE_SIZE = 4;

function parseDate(value: string) {
  const date = Date.parse(value);
  return Number.isNaN(date) ? 0 : date;
}

function formatPrice(value: string) {
  const price = value.replace(/BDT|৳/gi, "").trim();
  return price ? `৳ ${price}` : "Price on request";
}

function formatPower(value: string) {
  const power = value.match(/\d+(?:\.\d+)?/);
  return power ? `${power[0]} hp` : "Power N/A";
}

function numericValue(value: string) {
  const digits = value.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

function bikeBadge(bike: OBike, popularBrands: Set<string>) {
  const price = numericValue(bike.price);
  const cc = parseFloat(bike.cc);

  if (Number.isFinite(cc) && cc >= 150 && price > 0 && price / cc <= 1400) {
    return { label: "Best Value", className: "bg-blue-600" };
  }
  if (Number(bike.model_year) >= 2025 || parseDate(bike.launched) >= Date.parse("2025-01-01")) {
    return { label: "New", className: "bg-orange-500" };
  }
  if (popularBrands.has(bike.brand)) {
    return { label: "Popular", className: "bg-orange-500" };
  }
  return null;
}

function shuffled<T>(items: T[], seed: number) {
  const result = [...items];
  let state = seed;
  for (let i = result.length - 1; i > 0; i--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

function EngineIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 7h9l2 2h2v8h-3l-2 2H8l-2-2H4V9h3V7ZM9 7V4h5M9 11v4m3-4v4" />
    </svg>
  );
}

function PowerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9ZM12 12l4-4M5 17h14" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TypeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="5" cy="17" r="3" /><circle cx="19" cy="17" r="3" />
      <path d="m5 17 4-8h5l5 8M9 9 7 6h3" />
    </svg>
  );
}

function BikeCard({ bike, popularBrands }: { bike: OBike; popularBrands: Set<string> }) {
  const badge = bikeBadge(bike, popularBrands);
  return (
    <Link
      href={`/bikes/${bike.slug}`}
      className="group flex min-h-[122px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_4px_18px_-12px_rgba(15,23,42,0.22)] transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_14px_30px_-16px_rgba(37,99,235,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 sm:h-full sm:flex-col"
      aria-label={`View details for ${bike.name}`}
    >
      <div className="relative flex w-[41%] shrink-0 items-center justify-center bg-white sm:h-48 sm:w-full">
        {bike.images?.primary ? (
          <Image
            src={bike.images.primary}
            alt={bike.name}
            fill
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-105 sm:p-4"
            sizes="(max-width: 639px) 40vw, (max-width: 1023px) 50vw, 25vw"
          />
        ) : (
          <svg viewBox="0 0 24 24" className="h-20 w-20 text-slate-200" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <circle cx="5.5" cy="17.5" r="3.5" />
            <circle cx="18.5" cy="17.5" r="3.5" />
            <path d="M5.5 17.5 9 10h5l4.5 7.5M9 10 7 6h3" />
          </svg>
        )}
        {badge && (
          <span className={`absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-[9px] font-bold text-white shadow-sm sm:bottom-auto sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[11px] ${badge.className}`}>
            {badge.label}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center px-2.5 py-2 sm:justify-start sm:px-4 sm:pb-4 sm:pt-1">
        <span className="truncate text-[10px] font-medium text-slate-500 sm:text-xs">{bike.brand}</span>
        <h3 className="mt-0.5 line-clamp-2 text-xs font-bold leading-tight text-slate-950 group-hover:text-blue-700 sm:mt-1 sm:min-h-[2.5rem] sm:text-base">
          {bike.name}
        </h3>
        <p className="mt-1 text-sm font-extrabold text-slate-950 sm:mt-2 sm:text-lg">
          {formatPrice(bike.price)}
        </p>

        <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[10px] font-medium text-slate-500 sm:mt-3 sm:gap-x-3 sm:gap-y-1.5 sm:text-[11px]">
          <span className="inline-flex items-center gap-1"><EngineIcon />{bike.cc ? `${bike.cc} cc` : "CC N/A"}</span>
          <span className="inline-flex items-center gap-1"><PowerIcon />{formatPower(bike.engine?.maximum_power ?? "")}</span>
          <span className="hidden max-w-full items-center gap-1 truncate sm:inline-flex"><TypeIcon />{bike.bike_type || "Motorcycle"}</span>
        </div>

        <div className="mt-4 hidden border-t border-slate-100 pt-3 sm:block">
          <span className="inline-flex min-h-9 items-center rounded-lg bg-blue-50 px-4 text-xs font-bold text-blue-700 transition-colors group-hover:bg-blue-100">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
}

function BikeRow({ items, number, popularBrands }: { items: OBike[]; number: 1 | 2; popularBrands: Set<string> }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canGoLeft, setCanGoLeft] = useState(false);
  const [canGoRight, setCanGoRight] = useState(false);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollLeft = 0;

    const updateControls = () => {
      setCanGoLeft(scroller.scrollLeft > 1);
      setCanGoRight(
        scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1,
      );
    };

    updateControls();
    const observer = new ResizeObserver(updateControls);
    observer.observe(scroller);
    return () => observer.disconnect();
  }, [items]);

  function slide(direction: -1 | 1) {
    const scroller = scrollerRef.current;
    const card = scroller?.firstElementChild as HTMLElement | null;
    if (!scroller || !card) return;
    const gap = parseFloat(getComputedStyle(scroller).columnGap) || 0;
    scroller.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: "smooth" });
  }

  return (
    <div aria-label={`Bike slider row ${number}`}>
      <div className="mb-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => slide(-1)}
          disabled={!canGoLeft}
          aria-label={`Slide row ${number} left`}
          aria-controls={`latest-bike-row-${number}`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-600 shadow-sm transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
        >
          <ArrowIcon direction="left" />
        </button>
        <button
          type="button"
          onClick={() => slide(1)}
          disabled={!canGoRight}
          aria-label={`Slide row ${number} right`}
          aria-controls={`latest-bike-row-${number}`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-600 shadow-sm transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
        >
          <ArrowIcon direction="right" />
        </button>
      </div>
      <div
        id={`latest-bike-row-${number}`}
        ref={scrollerRef}
        onScroll={() => {
          const scroller = scrollerRef.current;
          if (!scroller) return;
          setCanGoLeft(scroller.scrollLeft > 1);
          setCanGoRight(scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1);
        }}
        className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-3 scroll-smooth"
      >
        {items.map((bike) => (
          <div key={bike.slug} className="w-[82vw] max-w-[330px] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] sm:max-w-none lg:w-[calc((100%-3rem)/4)]">
            <BikeCard bike={bike} popularBrands={popularBrands} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LatestBikePrices() {
  const [category, setCategory] = useState<Category>("All");
  const [seed, setSeed] = useState(1);
  const [mobilePage, setMobilePage] = useState(0);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 0xffffffff) || 1);
  }, []);

  const popularBrands = useMemo(() => {
    const counts = new Map<string, number>();
    for (const bike of bikes) {
      counts.set(bike.brand, (counts.get(bike.brand) ?? 0) + 1);
    }
    return new Set(
      [...counts].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([brand]) => brand),
    );
  }, []);

  const [selectedBikes, firstRow, secondRow] = useMemo(() => {
    const matches = bikes.filter((bike) => {
      const type = bike.bike_type.toLowerCase();
      switch (category) {
        case "All": return true;
        case "Popular": return popularBrands.has(bike.brand);
        case "Sports": return type === "sports";
        case "Commuter": return type === "commuter";
        case "Scooter": return type.includes("scooter");
        case "Naked": return type.includes("naked");
        case "Adventure": return ["adventure", "dual purpose", "off road"].includes(type);
        case "Electric": return type.includes("electric") || bike.name.toLowerCase().includes("electric");
      }
    });

    const recent = [...matches].sort(
      (a, b) => parseDate(b.updated_at) - parseDate(a.updated_at),
    );
    const pool = shuffled(recent, seed);
    const chosen: OBike[] = [];

    for (const label of ["Popular", "New", "Best Value"]) {
      const index = pool.findIndex(
        (bike) => bikeBadge(bike, popularBrands)?.label === label,
      );
      if (index >= 0) chosen.push(...pool.splice(index, 1));
    }
    chosen.push(...pool.slice(0, MAX_CARDS - chosen.length));
    return [chosen, chosen.filter((_, index) => index % 2 === 0), chosen.filter((_, index) => index % 2 === 1)];
  }, [category, popularBrands, seed]);

  const mobilePageCount = Math.ceil(selectedBikes.length / MOBILE_PAGE_SIZE);
  const currentMobilePage = Math.min(mobilePage, Math.max(0, mobilePageCount - 1));

  return (
    <section className="w-full bg-[#f7fbff] py-6 sm:bg-white sm:py-16" aria-labelledby="latest-bike-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="latest-bike-heading" className="text-lg font-extrabold tracking-tight text-slate-950 sm:text-3xl">
              Latest Bike Prices<span className="hidden sm:inline"> in <span className="text-blue-600">Bangladesh</span></span>
            </h2>
            <p className="mt-1 hidden text-sm text-slate-500 sm:block sm:text-base">
              Check the most recent bike prices, specs and features. Updated for 2026.
            </p>
          </div>
          <Link href="/bikes" className="inline-flex shrink-0 items-center gap-1 pt-1 text-xs font-bold text-blue-600 hover:underline sm:text-sm">
            View All <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="scrollbar-hide mt-3 flex gap-2 overflow-x-auto pb-2 sm:mt-5" role="group" aria-label="Filter bikes by category">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setCategory(item);
                setMobilePage(0);
              }}
              aria-pressed={category === item}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-semibold transition-colors sm:px-5 sm:py-2 sm:text-sm ${
                category === item
                  ? "border-blue-600 bg-blue-600 text-white shadow-[0_5px_14px_-7px_rgba(37,99,235,0.65)]"
                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50"
              } focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600`}
            >
              {item}
            </button>
          ))}
        </div>

        {selectedBikes.length > 0 ? (
          <>
            <div className="mt-3 space-y-3 sm:hidden">
              {selectedBikes
                .slice(currentMobilePage * MOBILE_PAGE_SIZE, (currentMobilePage + 1) * MOBILE_PAGE_SIZE)
                .map((bike) => (
                  <BikeCard key={bike.slug} bike={bike} popularBrands={popularBrands} />
                ))}
            </div>
            {mobilePageCount > 1 && (
              <div className="mt-4 flex items-center justify-between sm:hidden">
                <button
                  type="button"
                  onClick={() => setMobilePage((page) => Math.max(0, page - 1))}
                  disabled={currentMobilePage === 0}
                  className="inline-flex h-9 items-center gap-1 rounded-full border border-blue-100 bg-white px-3 text-xs font-semibold text-blue-600 disabled:opacity-40"
                  aria-label="Previous bikes"
                >
                  <ArrowIcon direction="left" /> Previous
                </button>
                <span className="text-xs text-slate-500">{currentMobilePage + 1} / {mobilePageCount}</span>
                <button
                  type="button"
                  onClick={() => setMobilePage((page) => Math.min(mobilePageCount - 1, page + 1))}
                  disabled={currentMobilePage === mobilePageCount - 1}
                  className="inline-flex h-9 items-center gap-1 rounded-full border border-blue-100 bg-white px-3 text-xs font-semibold text-blue-600 disabled:opacity-40"
                  aria-label="Next bikes"
                >
                  Next <ArrowIcon direction="right" />
                </button>
              </div>
            )}
            <div className="mt-4 hidden space-y-7 sm:block">
              <BikeRow items={firstRow} number={1} popularBrands={popularBrands} />
              {secondRow.length > 0 && <BikeRow items={secondRow} number={2} popularBrands={popularBrands} />}
            </div>
          </>
        ) : (
          <p className="mt-8 rounded-xl border border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-600">
            No {category.toLowerCase()} bikes are listed yet. Try another category.
          </p>
        )}

      </div>
    </section>
  );
}
