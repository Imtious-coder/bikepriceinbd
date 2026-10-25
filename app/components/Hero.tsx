"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { bikes } from "@/data/bike";

// ─── Content (edit freely — kept as data so copy/links stay easy to update) ──

const MAX_SUGGESTIONS = 6;
const SHORTCUTS = [
  { label: "Price List", href: "/bikes", icon: "list" },
  { label: "Compare Bikes", href: "/compare", icon: "compare" },
  { label: "Browse Bikes", href: "/bikes", icon: "spark" },
  { label: "All Brands", href: "/brands", icon: "brand" },
  { label: "Buying Guides", href: "/blogs", icon: "guide" },
];

const MOBILE_SHORTCUTS = [
  { label: "Price List", href: "/bikes", icon: "list" },
  { label: "Compare", href: "/compare", icon: "compare" },
  { label: "New Bikes", href: "/bikes?sort=new", icon: "spark" },
  { label: "Under 2 Lakh", href: "/bikes?maxPrice=200000", icon: "brand" },
];

function ShortcutIcon({
  type,
  className = "h-5 w-5",
}: {
  type: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} shrink-0`}
      aria-hidden="true"
    >
      {type === "list" ? (
        <>
          <rect x="5" y="3" width="14" height="18" rx="3" />
          <path d="M9 8h6M9 12h6M9 16h4" />
        </>
      ) : type === "compare" ? (
        <>
          <path d="M8 4v16M16 4v16M5 7l3-3 3 3M13 17l3 3 3-3" />
        </>
      ) : type === "spark" ? (
        <>
          <path d="m12 3 3 6 6 3-6 3-3 6-3-6-6-3 6-3Z" />
        </>
      ) : type === "brand" ? (
        <>
          <path d="m12 3 9 5v8l-9 5-9-5V8Z" />
          <path d="m3 8 9 5 9-5M12 13v8" />
        </>
      ) : (
        <>
          <path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1ZM12 6v14" />
        </>
      )}
    </svg>
  );
}

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

    return (
      bikes
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
        .slice(0, MAX_SUGGESTIONS)
    );
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
    router.push(trimmed ? `/bikes?q=${encodeURIComponent(trimmed)}` : "/bikes");
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
      className="relative isolate z-10 w-full bg-[#edf6ff] top-[65px] md:top-[90px] mb-4 md:mb-[70px] border-b border-blue-100"
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
            url: "https://bikepriceinbangladesh.com",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://bikepriceinbangladesh.com/bikes?q={search_term}",
              "query-input": "required name=search_term",
            },
          }),
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block"
        aria-hidden="true"
      >
        <div className="hero-scene absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f3f8ff] via-[#f3f8ff]/90 to-transparent lg:via-[#f3f8ff]/35" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#eaf4ff] to-transparent" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 pb-4 pt-3 sm:px-6 sm:pt-10 lg:px-8 lg:pt-12">
        <div className="relative z-10 max-w-xl pb-1 lg:min-h-[330px] lg:max-w-[53%] lg:pb-8">
          {/* eyebrow */}
          <span className="mb-2 inline-flex items-center rounded-full border border-blue-200/70 bg-blue-100/80 px-2 py-1 text-[8px] font-semibold uppercase tracking-wide text-blue-700 motion-safe:animate-[fade-in-up_0.5s_ease-out] lg:mb-3 lg:px-3 lg:py-1.5 lg:text-xs">
            Bangladesh #1 bike price guide
          </span>

          {/* H1 */}
          <h1 className="max-w-xl text-[20px] font-extrabold leading-[1.06] tracking-tight text-slate-950 sm:text-4xl lg:text-[48px] motion-safe:animate-[fade-in-up_0.5s_ease-out_0.05s_both]">
            <span className="lg:hidden">
              Latest Bike Prices
              <br />
              <span className="text-blue-600">in Bangladesh 2026</span>
            </span>
            <span className="hidden lg:inline">
              Latest Bike Prices in <span className="text-blue-600">Bangladesh 2026</span>
            </span>
          </h1>

          {/* Description */}
          <p className="mt-2 max-w-[260px] text-[10px] leading-[1.25] text-slate-600 sm:text-[15px] lg:hidden motion-safe:animate-[fade-in-up_0.5s_ease-out_0.1s_both]">
            Compare prices, specs, mileage and features to find the best bike for you.
          </p>
          <p className="mt-4 hidden max-w-lg text-pretty text-sm leading-relaxed text-slate-600 lg:block motion-safe:animate-[fade-in-up_0.5s_ease-out_0.1s_both]">
            Find the latest bike prices, specifications, mileage, features and
            reviews of motorcycles available in Bangladesh. Compare Honda,
            Yamaha, Bajaj, Suzuki, Hero, TVS, Royal Enfield, CFMOTO and other
            popular bike brands.
          </p>

          {/* Search Bike */}
          <div
            ref={containerRef}
            className="relative z-20 mt-3 w-full max-w-lg motion-safe:animate-[fade-in-up_0.5s_ease-out_0.15s_both] lg:mt-5"
          >
            <form
              action="/bikes"
              method="get"
              role="search"
              onSubmit={handleSubmit}
              className="flex w-full items-center gap-1 rounded-xl border border-blue-200 bg-white p-1 shadow-[0_8px_30px_-12px_rgba(37,99,235,0.25)] transition-shadow duration-300 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 focus-within:shadow-md lg:gap-2 lg:rounded-full lg:p-2"
            >
              <label htmlFor="bike-search" className="sr-only">
                Search bikes by name or brand
              </label>
              <svg
                className="ml-2 h-4 w-4 flex-shrink-0 text-slate-400 lg:h-5 lg:w-5"
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
                placeholder="Search bike name..."
                className="min-w-0 flex-1 border-none bg-transparent py-2 text-[10px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 lg:py-2.5 lg:text-sm"
                role="combobox"
                aria-expanded={isOpen && results.length > 0}
                aria-controls="bike-search-listbox"
                aria-autocomplete="list"
              />
              <button
                type="submit"
                className="flex h-8 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600 px-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 sm:px-6 lg:h-auto lg:w-auto lg:rounded-full lg:px-4 lg:py-3 lg:text-sm"
              >
                <span className="lg:hidden" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </svg>
                </span>
                <span className="hidden lg:inline">Search</span>
              </button>
            </form>

            {/* Live suggestions dropdown */}
            {isOpen && query.trim() && (
              <ul
                id="bike-search-listbox"
                role="listbox"
                className="absolute left-0 right-0 top-full z-20 mt-2 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white py-2 text-left shadow-lg motion-safe:animate-[fade-in-up_0.15s_ease-out]"
              >
                {results.length > 0 ? (
                  results.map((bike, i) => (
                    <li
                      key={bike.slug}
                      role="option"
                      aria-selected={i === activeIndex}
                    >
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
        </div>
        <div
          className="hero-mobile-scene hidden"
          role="img"
          aria-label="Sports motorcycle in front of the Bangladesh skyline"
        />
        <div className="relative z-0 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <nav
            aria-label="Explore motorcycles"
            className="scrollbar-hide hidden min-w-0 gap-2 overflow-x-auto py-1 lg:flex"
          >
            {SHORTCUTS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-xl border border-white bg-white/90 px-3 text-xs font-semibold text-slate-700 shadow-[0_3px_15px_-6px_rgba(37,99,235,0.15)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
              >
                <span className="text-blue-600">
                  <ShortcutIcon type={item.icon} />
                </span>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden shrink-0 items-stretch gap-2 lg:flex">
            <div className="flex flex-1 items-center justify-center gap-5 rounded-xl border border-white bg-white/85 px-4 py-3 text-center shadow-sm">
              <div>
                <strong className="block text-sm font-extrabold text-slate-900">
                  {bikes.length} Bikes
                </strong>
                <span className="block text-[10px] text-slate-500">
                  Catalog listings
                </span>
              </div>
              <div className="h-7 w-px bg-blue-100" />
              <div>
                <strong className="block text-sm font-extrabold text-slate-900">
                  {new Set(bikes.map((bike) => bike.brand)).size} Brands
                </strong>
                <span className="block text-[10px] text-slate-500">
                  All popular brands
                </span>
              </div>
            </div>
            <Link
              href="/about"
              className="flex items-center gap-2 rounded-xl border border-white bg-white/85 px-3 py-3 shadow-sm transition hover:bg-blue-50"
            >
              <svg
                className="h-5 w-5 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="m12 3 8 4v5c0 5-8 9-8 9s-8-4-8-9V7Z" />
                <path d="m8 12 3 3 5-6" />
              </svg>
              <span>
                <strong className="block text-xs text-slate-800">
                  Built for Riders
                </strong>
                <span className="block text-[10px] text-slate-500">
                  Explore with confidence
                </span>
              </span>
            </Link>
          </div>
        </div>

        {/* Compact mobile navigation and trust stats */}
        <nav
          aria-label="Mobile motorcycle shortcuts"
          className="mt-3 grid grid-cols-4 gap-2 lg:hidden"
        >
          {MOBILE_SHORTCUTS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex min-h-[45px] flex-col items-center justify-center gap-1 rounded-lg border border-white bg-white/90 px-1 py-1.5 text-center text-[7px] font-semibold leading-tight text-slate-700 shadow-[0_3px_15px_-6px_rgba(37,99,235,0.15)] transition hover:border-blue-200 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <span className="text-blue-600">
                <ShortcutIcon type={item.icon} className="h-3 w-3" />
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-3 grid grid-cols-3 gap-2 lg:hidden">
          <div className="flex min-h-[45px] flex-col items-center justify-center rounded-lg border border-white bg-white/90 px-1 py-1 text-center shadow-sm">
            <svg viewBox="0 0 24 24" className="mb-0.5 h-3 w-3 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="m12 3 8 4v5c0 5-8 9-8 9s-8-4-8-9V7Z" />
              <path d="m8 12 3 3 5-6" />
            </svg>
            <strong className="text-[9px] font-extrabold text-slate-900">{bikes.length >= 200 ? "200+" : `${bikes.length}+`}</strong>
            <span className="text-[7px] text-slate-500">Bikes</span>
          </div>
          <div className="flex min-h-[45px] flex-col items-center justify-center rounded-lg border border-white bg-white/90 px-1 py-1 text-center shadow-sm">
            <svg viewBox="0 0 24 24" className="mb-0.5 h-3 w-3 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="m12 3 9 5v8l-9 5-9-5V8Z" />
              <path d="m3 8 9 5 9-5M12 13v8" />
            </svg>
            <strong className="text-[9px] font-extrabold text-slate-900">{new Set(bikes.map((bike) => bike.brand)).size >= 10 ? "10+" : `${new Set(bikes.map((bike) => bike.brand)).size}+`}</strong>
            <span className="text-[7px] text-slate-500">Brands</span>
          </div>
          <div className="flex min-h-[45px] flex-col items-center justify-center rounded-lg border border-white bg-white/90 px-1 py-1 text-center shadow-sm">
            <svg viewBox="0 0 24 24" className="mb-0.5 h-3 w-3 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M12 3 4.5 7v5c0 4.6 3.2 7.5 7.5 9 4.3-1.5 7.5-4.4 7.5-9V7Z" />
              <path d="M8.5 12.2 11 14.7l4.7-5" />
            </svg>
            <strong className="text-[9px] font-extrabold text-slate-900">Updated</strong>
            <span className="text-[7px] text-slate-500">2026</span>
          </div>
        </div>
      </div>
      <style>{`
        .hero-scene {
          background: url('/hero-bangladesh-motorcycle.png') right 60% / auto 115% no-repeat;
        }
        .hero-mobile-scene {
          background: url('/hero-bangladesh-motorcycle.png') right 65% / auto 115% no-repeat;
          mask-image: linear-gradient(to bottom, transparent, black 12%, black 85%, transparent);
        }
        @media (max-width: 1023px) {
          .hero-scene { opacity: 0.18; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
