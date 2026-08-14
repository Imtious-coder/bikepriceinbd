"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { bikes } from "@/data/bike";

// ─── Content (edit freely — kept as data so copy/links stay easy to update) ──

const BRANDS = ["Yamaha", "Honda", "Bajaj", "TVS", "Suzuki", "Hero"];

const BUDGETS = [
  { label: "Under ৳1 Lakh", query: "budget=under-1l" },
  { label: "৳1 – 2 Lakh", query: "budget=1l-2l" },
  { label: "৳2 – 3 Lakh", query: "budget=2l-3l" },
  { label: "Above ৳3 Lakh", query: "budget=above-3l" },
];

const ENGINE_CC = [
  { label: "Up to 125cc", query: "cc=upto-125" },
  { label: "125cc – 150cc", query: "cc=125-150" },
  { label: "150cc+", query: "cc=150-plus" },
];

const BIKES_INDEXED = "750+";
const MAX_SUGGESTIONS = 6;

export default function Hero() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return bikes
      .filter((bike) => {
        const haystack = `${bike.name} ${bike.brand}`.toLowerCase();
        return haystack.includes(q);
      })
      // prioritize matches where the name starts with the query
      .sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(q) ? 0 : 1;
        const bStarts = b.name.toLowerCase().startsWith(q) ? 0 : 1;
        return aStarts - bStarts;
      })
      .slice(0, MAX_SUGGESTIONS);
  }, [query]);

  // close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goToBike(slug: string) {
    setIsOpen(false);
    setActiveIndex(-1);
    router.push(`/bikes/${slug}`);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsOpen(false);

    // if a suggestion is highlighted, go straight to that bike
    if (activeIndex >= 0 && results[activeIndex]) {
      goToBike(results[activeIndex].slug);
      return;
    }

    const trimmed = query.trim();
    router.push(
      trimmed ? `/BikesPage?q=${encodeURIComponent(trimmed)}` : "/BikesPage"
    );
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
    }
  }

  return (
    <section
      className="relative w-full overflow-hidden bg-blue-50 top-[65px] md:top-[90px] mb-4 md:mb-[70px]"
      aria-label="Motorcycle price search"
    >
      {/* Structured data: lets Google show a sitelinks search box for the site */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            url: "https://example.com",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://example.com/BikesPage?q={search_term}",
              "query-input": "required name=search_term",
            },
          }),
        }}
      />

      {/* quiet background: faint watermark of the bike count + soft blue wash */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <span
          className="absolute -right-6 -top-10 select-none font-black text-blue-100 md:-right-4 md:-top-16"
          style={{ fontSize: "clamp(140px, 22vw, 260px)", lineHeight: 1 }}
        >
          {BIKES_INDEXED}
        </span>
      </div>

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center sm:py-20 md:py-24">
        {/* eyebrow */}
        <span className="mb-4 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
          {BIKES_INDEXED} bikes tracked across Bangladesh
        </span>

        {/* H1 */}
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Latest Bike Price in <span className="text-blue-600">Bangladesh 2026</span>
        </h1>

        {/* Description */}
        <p className="mt-4 max-w-xl text-balance text-base text-slate-500 sm:text-lg">
          Find the latest bike prices, specifications, mileage, features and reviews of motorcycles available in Bangladesh. Compare Honda, Yamaha, Bajaj, Suzuki, Hero, TVS, Royal Enfield, CFMOTO and other popular bike brands.
        </p>

        {/* Search Bike */}
        <div ref={containerRef} className="relative mt-8 w-full max-w-xl">
          <form
            action="/BikesPage"
            method="get"
            role="search"
            onSubmit={handleSubmit}
            className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100"
          >
            <label htmlFor="bike-search" className="sr-only">
              Search bikes by name or brand
            </label>
            <svg
              className="ml-2 h-5 w-5 flex-shrink-0 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              id="bike-search"
              name="q"
              type="search"
              autoComplete="off"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
                setActiveIndex(-1);
              }}
              onFocus={() => {
                if (query.trim()) setIsOpen(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search bike name, or model... e.g. Yamaha R15M"
              className="min-w-0 flex-1 border-none bg-transparent py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
              role="combobox"
              aria-expanded={isOpen && results.length > 0}
              aria-controls="bike-search-listbox"
              aria-autocomplete="list"
            />
            <button
              type="submit"
              className="flex-shrink-0 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
            >
              Search
            </button>
          </form>

          {/* Live suggestions dropdown */}
          {isOpen && query.trim() && (
            <ul
              id="bike-search-listbox"
              role="listbox"
              className="absolute left-0 right-0 top-full z-20 mt-2 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white py-2 text-left shadow-lg"
            >
              {results.length > 0 ? (
                results.map((bike, i) => (
                  <li key={bike.slug} role="option" aria-selected={i === activeIndex}>
                    <Link
                      href={`/bikes/${bike.slug}`}
                      onMouseDown={(e) => {
                        // prevent input blur from closing dropdown before navigation
                        e.preventDefault();
                        goToBike(bike.slug);
                      }}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={`flex items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors ${
                        i === activeIndex
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-medium">
                          {bike.name}
                        </span>
                        <span className="block text-xs text-slate-400">
                          {bike.brand}
                          {bike.cc ? ` · ${bike.cc}cc` : ""}
                        </span>
                      </span>
                      {bike.price && (
                        <span className="flex-shrink-0 text-xs font-semibold text-slate-500">
                          {bike.price}
                        </span>
                      )}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-sm text-slate-400">
                  No bikes found for &quot;{query.trim()}&quot;
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Browse by Brand / Budget / CC */}
        <nav
          aria-label="Browse motorcycles by category"
          className="mt-10 grid w-full max-w-2xl gap-6 text-left sm:grid-cols-3"
        >
          <div>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Brand
            </h2>
            <ul className="flex flex-wrap gap-1.5">
              {BRANDS.map((brand) => (
                <li key={brand}>
                  <Link
                    href={`/BikesPage?brand=${encodeURIComponent(
                      brand.toLowerCase()
                    )}`}
                    className="inline-block rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  >
                    {brand}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Budget
            </h2>
            <ul className="flex flex-wrap gap-1.5">
              {BUDGETS.map((b) => (
                <li key={b.query}>
                  <Link
                    href={`/BikesPage?${b.query}`}
                    className="inline-block rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  >
                    {b.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Engine CC
            </h2>
            <ul className="flex flex-wrap gap-1.5">
              {ENGINE_CC.map((c) => (
                <li key={c.query}>
                  <Link
                    href={`/BikesPage?${c.query}`}
                    className="inline-block rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </section>
  );
}