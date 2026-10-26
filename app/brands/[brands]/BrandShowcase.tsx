"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export type BrandBike = {
  slug: string;
  name: string;
  cc: string;
  mileage: string;
  priceValue: number;
  type: string;
  image: string;
};

type Props = { brandName: string; intro: string; bikes: BrandBike[] };
type Category =
  | "All Bikes"
  | "Commuter"
  | "Sports"
  | "Scooter"
  | "Naked"
  | "Other";
type SortOrder = "price-asc" | "price-desc" | "name";

const BRAND_LOGOS: Record<string, string> = {
  Honda:
    "https://cdn.shopify.com/s/files/1/0644/7595/5297/files/Honda_Logo.jpg?v=1786298708",
  Lifan:
    "https://cdn.shopify.com/s/files/1/0644/7595/5297/files/images_1.jpg?v=1786299052",
  Suzuki:
    "https://cdn.shopify.com/s/files/1/0644/7595/5297/files/images_4.png?v=1786299052",
  Bajaj:
    "https://cdn.shopify.com/s/files/1/0644/7595/5297/files/images_1.png?v=1786299053",
  Yamaha:
    "https://cdn.shopify.com/s/files/1/0644/7595/5297/files/images.jpg?v=1786299051",
  Hero: "https://cdn.shopify.com/s/files/1/0644/7595/5297/files/images.png?v=1786299052",
  Runner:
    "https://cdn.shopify.com/s/files/1/0644/7595/5297/files/images_3.png?v=1786299052",
  CFMOTO:
    "https://cdn.shopify.com/s/files/1/0644/7595/5297/files/images_3.jpg?v=1786299052",
  TVS: "https://cdn.shopify.com/s/files/1/0644/7595/5297/files/images_2.png?v=1786299052",
};

const CATEGORIES: Category[] = [
  "All Bikes",
  "Commuter",
  "Sports",
  "Scooter",
  "Naked",
  "Other",
];
const PAGE_SIZE = 8;

function categoryOf(type: string): Category {
  const value = type.toLowerCase();
  if (value.includes("scooter")) return "Scooter";
  if (value.includes("naked")) return "Naked";
  if (value.includes("sport")) return "Sports";
  if (value.includes("commuter") || value.includes("standard"))
    return "Commuter";
  return "Other";
}

function money(value: number) {
  return `৳ ${value.toLocaleString("en-IN")}`;
}

function displayPrice(bike: BrandBike) {
  return bike.priceValue > 0 ? money(bike.priceValue) : "Price on request";
}

function Icon({
  name,
  className = "h-4 w-4",
}: {
  name:
    | "bike"
    | "shield"
    | "price"
    | "search"
    | "arrow"
    | "chevron"
    | "heart"
    | "filter"
    | "list"
    | "specs"
    | "review"
    | "help"
    | "home"
    | "more";
  className?: string;
}) {
  const paths = {
    bike: (
      <>
        <circle cx="5" cy="17" r="3" />
        <circle cx="19" cy="17" r="3" />
        <path d="m5 17 4-8h4l5 8M9 9 7 6h3m2 11 3-6h3" />
      </>
    ),
    shield: (
      <>
        <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    price: (
      <>
        <path d="m3 11 8 8 10-10-8-8H3v10Z" />
        <circle cx="8" cy="6" r="1" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
    arrow: (
      <>
        <path d="M4 12h16m-6-6 6 6-6 6" />
      </>
    ),
    chevron: <path d="m9 5 7 7-7 7" />,
    heart: (
      <path d="M20.8 8.5c0 4.2-8.8 10-8.8 10s-8.8-5.8-8.8-10a4.7 4.7 0 0 1 8.8-2.2 4.7 4.7 0 0 1 8.8 2.2Z" />
    ),
    filter: (
      <>
        <path d="M3 5h18M6 11h12m-9 6h6" />
        <circle cx="12" cy="17" r="2" />
      </>
    ),
    list: (
      <>
        <path d="M8 5h13M8 12h13M8 19h13" />
        <path d="M3 5h1M3 12h1M3 19h1" />
      </>
    ),
    specs: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </>
    ),
    review: (
      <>
        <path d="M4 4h16v13H8l-4 3V4Z" />
        <path d="m12 7 1.1 2.2 2.4.3-1.8 1.7.4 2.4-2.1-1.2-2.1 1.2.4-2.4-1.8-1.7 2.4-.3L12 7Z" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9a2.5 2.5 0 1 1 4.4 1.6c-.8.8-1.9 1.2-1.9 2.6M12 17h.01" />
      </>
    ),
    home: (
      <>
        <path d="m3 10 9-7 9 7v10H3V10Z" />
        <path d="M9 20v-7h6v7" />
      </>
    ),
    more: (
      <>
        <circle cx="5" cy="12" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} shrink-0`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export default function BrandShowcase({ brandName, intro, bikes }: Props) {
  const [category, setCategory] = useState<Category>("All Bikes");
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("price-asc");
  const [page, setPage] = useState(1);
  const [showAllMobile, setShowAllMobile] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [moreOpen, setMoreOpen] = useState(false);
  const [bottomMoreOpen, setBottomMoreOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("bikebd-wishlist") || "[]",
      );
      if (Array.isArray(stored))
        setSaved(
          stored.filter((item): item is string => typeof item === "string"),
        );
    } catch {
      /* Keep the page usable when storage is unavailable. */
    }
  }, []);

  const counts = useMemo(
    () =>
      CATEGORIES.reduce(
        (result, item) => {
          result[item] =
            item === "All Bikes"
              ? bikes.length
              : bikes.filter((bike) => categoryOf(bike.type) === item).length;
          return result;
        },
        {} as Record<Category, number>,
      ),
    [bikes],
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return bikes
      .filter(
        (bike) =>
          (category === "All Bikes" || categoryOf(bike.type) === category) &&
          bike.name.toLowerCase().includes(term),
      )
      .sort((a, b) =>
        sortOrder === "name"
          ? a.name.localeCompare(b.name)
          : sortOrder === "price-desc"
            ? b.priceValue - a.priceValue
            : (a.priceValue || Number.MAX_SAFE_INTEGER) -
              (b.priceValue || Number.MAX_SAFE_INTEGER),
      );
  }, [bikes, category, query, sortOrder]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visiblePage = Math.min(page, pageCount);
  const desktopRows = filtered.slice(
    (visiblePage - 1) * PAGE_SIZE,
    visiblePage * PAGE_SIZE,
  );
  const mobileRows = showAllMobile ? filtered : filtered.slice(0, 5);
  const priced = bikes
    .filter((bike) => bike.priceValue > 0)
    .sort((a, b) => a.priceValue - b.priceValue);
  const minPrice = priced[0]?.priceValue;
  const maxPrice = priced[priced.length - 1]?.priceValue;
  const popular = priced.slice(0, 4);
  const ranges = [
    {
      label: "Under ৳1.5 Lakh",
      count: priced.filter((bike) => bike.priceValue < 150000).length,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "৳1.5 – 2 Lakh",
      count: priced.filter(
        (bike) => bike.priceValue >= 150000 && bike.priceValue < 200000,
      ).length,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "৳2 – 5 Lakh",
      count: priced.filter(
        (bike) => bike.priceValue >= 200000 && bike.priceValue < 500000,
      ).length,
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Above ৳5 Lakh",
      count: priced.filter((bike) => bike.priceValue >= 500000).length,
      color: "bg-violet-50 text-violet-600",
    },
  ];

  function chooseCategory(next: Category) {
    setCategory(next);
    setPage(1);
    setShowAllMobile(false);
    setMoreOpen(false);
  }

  function toggleSaved(slug: string) {
    const next = saved.includes(slug)
      ? saved.filter((item) => item !== slug)
      : [...saved, slug];
    setSaved(next);
    try {
      localStorage.setItem("bikebd-wishlist", JSON.stringify(next));
    } catch {
      /* The current selection still works. */
    }
  }

  function categoryButton(item: Category, compact = false) {
    return (
      <button
        key={item}
        type="button"
        onClick={() => chooseCategory(item)}
        aria-pressed={category === item}
        className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition sm:px-4 ${category === item ? "border-blue-600 bg-blue-600 text-white shadow-sm" : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700"}`}
      >
        <Icon name="bike" className={compact ? "h-4 w-4" : "h-3.5 w-3.5"} />
        {item === "All Bikes"
          ? `All Bikes (${counts[item]})`
          : `${item} (${counts[item]})`}
      </button>
    );
  }

  const sortControl = (
    <label className="relative block min-w-[155px]">
      <span className="sr-only">Sort bikes</span>
      <select
        value={sortOrder}
        onChange={(event) => {
          setSortOrder(event.target.value as SortOrder);
          setPage(1);
        }}
        className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-8 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
      >
        <option value="price-asc">Price (Low to High)</option>
        <option value="price-desc">Price (High to Low)</option>
        <option value="name">Name (A to Z)</option>
      </select>
      <span className="pointer-events-none absolute right-3 top-3 rotate-90 text-blue-700">
        <Icon name="chevron" className="h-4 w-4" />
      </span>
    </label>
  );

  return (
    <>
      <section
        className="relative overflow-hidden rounded-2xl border border-blue-100 bg-[#eaf5ff] shadow-sm"
        aria-labelledby="brand-heading"
      >
        <div
          className="absolute inset-0 hidden bg-cover bg-top opacity-75 lg:block"
          style={{
            backgroundImage:
              "linear-gradient(90deg, #f7fbff 0%, rgba(247,251,255,.95) 40%, rgba(237,247,255,.25) 100%), url('/hero-bangladesh-motorcycle.png')",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 px-4 pt-4 sm:px-7 sm:pt-6 lg:px-9">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[11px] text-slate-500"
          >
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <Icon name="chevron" className="h-3 w-3" />
            <Link href="/brands" className="hover:text-blue-600">
              Brands
            </Link>
            <Icon name="chevron" className="h-3 w-3" />
            <span className="font-bold text-slate-900">{brandName}</span>
          </nav>
        </div>
        <div className="relative z-10 px-4 pb-5 pt-5 sm:px-7 sm:pb-7 lg:min-h-[250px] lg:px-9 lg:pt-7">
          <div className="flex min-w-0 items-start gap-3 sm:gap-4 lg:max-w-[58%] lg:gap-6">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-2 shadow-sm sm:h-24 sm:w-24 sm:p-3">
              {BRAND_LOGOS[brandName] ? (
                <Image
                  src={BRAND_LOGOS[brandName]}
                  alt={`${brandName} logo`}
                  fill
                  className="object-contain p-3"
                  sizes="96px"
                />
              ) : (
                <span className="text-xl font-extrabold text-blue-700">
                  {brandName.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <h1
                id="brand-heading"
                className="max-w-lg break-words text-xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-3xl lg:text-[34px]"
              >
                {brandName} Bike Price in Bangladesh{" "}
                <span className="text-blue-600">2026</span>
              </h1>
              <p className="mt-2 max-w-xl text-[11px] leading-relaxed text-slate-600 sm:text-sm">
                {intro}
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-2 lg:max-w-[58%] lg:flex-row lg:items-stretch">
            <div className="grid min-w-0 grid-cols-3 gap-1.5 sm:gap-2 lg:flex-1">
              {[
                {
                  icon: "bike" as const,
                  value: bikes.length.toString(),
                  label: "Models",
                },
                {
                  icon: "shield" as const,
                  value: minPrice ? money(minPrice) : "—",
                  label: "Lowest Price",
                },
                {
                  icon: "price" as const,
                  value: maxPrice ? money(maxPrice) : "—",
                  label: "Highest Price",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex min-w-0 flex-col items-center justify-center gap-1 rounded-lg border border-white/80 bg-white/80 px-1 py-2 text-center shadow-sm sm:flex-row sm:gap-2 sm:px-3 sm:text-left"
                >
                  <span className="rounded-md bg-blue-50 p-1 text-blue-600">
                    <Icon name={stat.icon} className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <strong className="block whitespace-nowrap text-[10px] text-slate-950 sm:text-xs">
                      {stat.value}
                    </strong>
                    <span className="block text-[9px] leading-tight text-slate-500 sm:text-[10px]">
                      {stat.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/compare"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
            >
              Compare {brandName} Bikes <Icon name="arrow" />
            </Link>
          </div>
          <div
            className="pointer-events-none absolute bottom-0 right-0 hidden h-[230px] w-[43%] items-end justify-end lg:flex"
            aria-hidden="true"
          >
            {bikes.slice(0, 3).map((bike, index) => (
              <div
                key={bike.slug}
                className={`relative h-[190px] w-[32%] ${index === 1 ? "-ml-5 h-[220px] w-[38%]" : "-ml-2"}`}
              >
                <Image
                  src={bike.image}
                  alt=""
                  fill
                  className="object-contain object-bottom mix-blend-multiply drop-shadow-xl"
                  sizes="180px"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="relative mt-3">
        <nav
          aria-label={`${brandName} page sections`}
          className="flex min-w-0 items-stretch gap-1 rounded-xl border border-slate-100 bg-white p-1.5 shadow-sm sm:gap-2 sm:p-2"
        >
          <div className="scrollbar-hide hidden min-w-0 flex-1 gap-1.5 overflow-x-auto md:flex">
            {CATEGORIES.filter((item) => counts[item] > 0).map((item) =>
              categoryButton(item),
            )}
          </div>
          <div className="scrollbar-hide flex min-w-0 flex-1 gap-1.5 overflow-x-auto md:hidden">
            {CATEGORIES.filter(
              (item) =>
                item === "All Bikes" ||
                ((item === "Commuter" ||
                  item === "Sports" ||
                  item === "Scooter") &&
                  counts[item] > 0),
            ).map((item) => categoryButton(item, true))}
          </div>
          <div className="shrink-0 md:hidden">
            <button
              type="button"
              onClick={() => setMoreOpen((open) => !open)}
              aria-expanded={moreOpen}
              className="inline-flex h-full items-center gap-1 rounded-xl border border-slate-200 px-2.5 text-xs font-semibold text-slate-700"
            >
              More <span aria-hidden="true">•••</span>
            </button>
          </div>
          <div className="hidden items-center gap-1 border-l border-slate-100 pl-2 lg:flex">
            <a
              href="#price-list-heading"
              className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700"
            >
              <Icon name="list" />
              Price List
            </a>
            <a
              href="#specs-heading"
              className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700"
            >
              <Icon name="specs" />
              Specifications
            </a>
            <a
              href="#reviews-heading"
              className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700"
            >
              <Icon name="review" />
              Reviews
            </a>
            <a
              href="#faq-heading"
              className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700"
            >
              <Icon name="help" />
              FAQs
            </a>
          </div>
        </nav>
        {moreOpen && (
          <div className="absolute right-1 top-full z-20 mt-1 w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-lg md:hidden">
            {CATEGORIES.filter(
              (item) =>
                (item === "Naked" || item === "Other") && counts[item] > 0,
            ).map((item) => (
              <div key={item} className="mb-1">
                {categoryButton(item)}
              </div>
            ))}
            <a
              href="#specs-heading"
              onClick={() => setMoreOpen(false)}
              className="block px-3 py-2 text-xs font-semibold text-slate-700"
            >
              Specifications
            </a>
            <a
              href="#reviews-heading"
              onClick={() => setMoreOpen(false)}
              className="block px-3 py-2 text-xs font-semibold text-slate-700"
            >
              Reviews
            </a>
            <a
              href="#faq-heading"
              onClick={() => setMoreOpen(false)}
              className="block px-3 py-2 text-xs font-semibold text-slate-700"
            >
              FAQs
            </a>
          </div>
        )}
      </div>

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_230px] w-full grid-cols-1">
        <section
          aria-labelledby="price-list-heading"
          className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2
                id="price-list-heading"
                className="text-lg font-extrabold text-slate-950 sm:text-xl"
              >
                {brandName} Bike Price List
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Check the latest {brandName} bike prices, specifications,
                mileage and top speed in Bangladesh.
              </p>
            </div>
            <div className="hidden gap-2 md:flex">
              <label className="relative">
                <span className="sr-only">Search {brandName} bikes</span>
                <Icon
                  name="search"
                  className="absolute left-3 top-3 h-4 w-4 text-blue-600"
                />
                <input
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setPage(1);
                    setShowAllMobile(false);
                  }}
                  placeholder={`Search ${brandName} bike...`}
                  className="h-10 w-44 rounded-xl border border-slate-200 pl-9 pr-3 text-xs outline-none focus:border-blue-500"
                />
              </label>
              {sortControl}
            </div>
          </div>
          <div className="relative mt-4 flex min-w-0 gap-2 md:hidden">
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Search {brandName} bikes</span>
              <Icon
                name="search"
                className="absolute left-3 top-3 h-4 w-4 text-blue-600"
              />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                  setShowAllMobile(false);
                }}
                placeholder={`Search ${brandName} bike...`}
                className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-2 text-xs outline-none focus:border-blue-500"
              />
            </label>
            <button
              type="button"
              onClick={() => setMobileSortOpen((open) => !open)}
              aria-label="Sort bikes"
              aria-expanded={mobileSortOpen}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-blue-50 text-blue-700"
            >
              <Icon name="filter" className="h-5 w-5" />
            </button>
            {mobileSortOpen && (
              <div className="absolute right-0 top-11 z-20 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                {(
                  [
                    { value: "price-asc", label: "Price (Low to High)" },
                    { value: "price-desc", label: "Price (High to Low)" },
                    { value: "name", label: "Name (A to Z)" },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSortOrder(option.value);
                      setPage(1);
                      setMobileSortOpen(false);
                    }}
                    aria-pressed={sortOrder === option.value}
                    className={`block w-full rounded-lg px-3 py-2 text-left text-xs ${sortOrder === option.value ? "bg-blue-50 font-bold text-blue-700" : "text-slate-700 hover:bg-slate-50"}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 hidden overflow-hidden rounded-lg border border-slate-200 md:block">
            <table className="w-full table-fixed text-left text-xs">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="w-9 px-3 py-2.5">#</th>
                  <th className="px-3 py-2.5">Bike Name</th>
                  <th className="w-24 px-3 py-2.5">Engine (CC)</th>
                  <th className="w-28 px-3 py-2.5">Mileage</th>
                  <th className="w-28 px-3 py-2.5">Price (BDT)</th>
                  <th className="w-20 px-3 py-2.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {desktopRows.map((bike, index) => (
                  <tr key={bike.slug} className="hover:bg-blue-50/40">
                    <td className="px-3 py-2 text-slate-500">
                      {(visiblePage - 1) * PAGE_SIZE + index + 1}
                    </td>
                    <td className="px-3 py-2 font-medium text-slate-900">
                      <Link
                        href={`/bikes/${bike.slug}`}
                        className="hover:text-blue-600"
                      >
                        {bike.name}
                      </Link>
                    </td>
                    <td className="px-3 py-2 text-slate-500">
                      {bike.cc ? `${bike.cc}cc` : "—"}
                    </td>
                    <td className="px-3 py-2 text-slate-500">{bike.mileage}</td>
                    <td className="px-3 py-2 font-bold text-slate-950">
                      {displayPrice(bike)}
                    </td>
                    <td className="px-2 py-2 text-center">
                      <Link
                        href={`/bikes/${bike.slug}`}
                        className="block rounded-lg bg-blue-50 px-2 py-1.5 font-semibold text-blue-700 hover:bg-blue-100"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="p-6 text-center text-sm text-slate-500">
                No bikes match your search.
              </p>
            )}
          </div>
          <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 md:hidden">
            {mobileRows.map((bike, index) => (
              <Link
                key={bike.slug}
                href={`/bikes/${bike.slug}`}
                className="grid min-w-0 grid-cols-[18px_minmax(0,1fr)_82px_14px] items-center gap-1.5 border-b border-slate-100 px-2 py-3 text-[11px] last:border-b-0"
              >
                <span className="text-slate-500">{index + 1}</span>
                <span className="min-w-0 break-words font-semibold leading-snug text-slate-950">
                  {bike.name}
                  <span className="mt-1 block text-[10px] font-normal text-slate-500">
                    {bike.cc ? `${bike.cc}cc` : "—"}
                  </span>
                </span>
                <strong className="min-w-0 text-right text-[10px] leading-tight text-slate-950 sm:text-[11px]">
                  {displayPrice(bike)}
                </strong>
                <Icon name="chevron" className="h-3.5 w-3.5 text-blue-600" />
              </Link>
            ))}
            {filtered.length === 0 && (
              <p className="p-6 text-center text-sm text-slate-500">
                No bikes match your search.
              </p>
            )}
          </div>
          <div className="mt-3 hidden items-center justify-between gap-3 md:flex">
            <p className="text-[11px] text-slate-500">
              Showing {filtered.length ? (visiblePage - 1) * PAGE_SIZE + 1 : 0}–
              {Math.min(visiblePage * PAGE_SIZE, filtered.length)} of{" "}
              {filtered.length} bikes
            </p>
            <div className="flex gap-1">
              {Array.from({ length: pageCount }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setPage(index + 1)}
                  aria-label={`Page ${index + 1}`}
                  aria-current={visiblePage === index + 1 ? "page" : undefined}
                  className={`h-8 min-w-8 rounded-md border text-xs font-semibold ${visiblePage === index + 1 ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 text-slate-700 hover:bg-blue-50"}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
          {filtered.length > 5 && (
            <button
              type="button"
              onClick={() => setShowAllMobile((value) => !value)}
              className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg bg-blue-50 py-2.5 text-xs font-semibold text-blue-700 md:hidden"
            >
              {showAllMobile
                ? "Show fewer bikes"
                : `View All ${filtered.length} Bikes`}{" "}
              <Icon name="arrow" className="h-3.5 w-3.5" />
            </button>
          )}
        </section>

        <aside className="space-y-4">
          <section
            aria-labelledby="price-range-heading"
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
          >
            <h2
              id="price-range-heading"
              className="text-sm font-extrabold text-slate-950"
            >
              {brandName} Bike Price Range in Bangladesh
            </h2>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
              {minPrice && maxPrice
                ? `${brandName} bikes in Bangladesh are currently priced between ${money(minPrice)} and ${money(maxPrice)}, covering ${priced.length} models across different budgets.`
                : `Pricing details for ${brandName} models are being updated.`}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {ranges.map((range) => (
                <div
                  key={range.label}
                  className={`rounded-xl p-3 text-center ${range.color}`}
                >
                  <strong className="block text-xl">{range.count}</strong>
                  <span className="block text-[10px]">{range.label}</span>
                </div>
              ))}
            </div>
          </section>
          <section
            aria-labelledby="popular-bikes-heading"
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <h2
                id="popular-bikes-heading"
                className="text-sm font-extrabold text-slate-950"
              >
                Popular {brandName} Bikes
              </h2>
              <a
                href="#available-models-heading"
                className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-blue-600"
              >
                View All <Icon name="arrow" className="h-3 w-3" />
              </a>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              A snapshot of currently listed {brandName} models, from most to
              least affordable.
            </p>
            <div className="scrollbar-hide mt-3 flex gap-2 overflow-x-auto">
              {popular.map((bike) => (
                <div
                  key={bike.slug}
                  className="relative w-24 shrink-0 rounded-lg border border-slate-100 p-1.5"
                >
                  <button
                    type="button"
                    onClick={() => toggleSaved(bike.slug)}
                    aria-label={`${saved.includes(bike.slug) ? "Remove" : "Add"} ${bike.name} ${saved.includes(bike.slug) ? "from" : "to"} wishlist`}
                    aria-pressed={saved.includes(bike.slug)}
                    className="absolute right-1 top-1 z-10 text-blue-700"
                  >
                    <Icon name="heart" className="h-3.5 w-3.5" />
                  </button>
                  <Link href={`/bikes/${bike.slug}`}>
                    <span className="relative block h-16">
                      <Image
                        src={bike.image}
                        alt=""
                        fill
                        className="object-contain mix-blend-multiply"
                        sizes="96px"
                      />
                    </span>
                    <span className="mt-1 block line-clamp-2 min-h-7 text-[9px] leading-tight text-slate-800">
                      {bike.name}
                    </span>
                    <strong className="mt-1 block text-[10px] text-slate-950">
                      {displayPrice(bike)}
                    </strong>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <section
        aria-labelledby="available-models-heading"
        className="mt-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5"
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2
              id="available-models-heading"
              className="text-lg font-extrabold text-slate-950 sm:text-xl"
            >
              {brandName} Motorcycles Available in Bangladesh
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Explore all {bikes.length} {brandName} bikes with latest prices
              and key details.
            </p>
          </div>
          <div className="hidden sm:block">{sortControl}</div>
        </div>
        <div className="scrollbar-hide mt-4 flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.filter((item) => counts[item] > 0).map((item) =>
            categoryButton(item),
          )}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
          {filtered.map((bike) => (
            <article
              key={bike.slug}
              className="group relative min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-blue-300 hover:shadow-md"
            >
              <button
                type="button"
                onClick={() => toggleSaved(bike.slug)}
                aria-label={`${saved.includes(bike.slug) ? "Remove" : "Add"} ${bike.name} ${saved.includes(bike.slug) ? "from" : "to"} wishlist`}
                aria-pressed={saved.includes(bike.slug)}
                className={`absolute right-2 top-2 z-10 rounded-full bg-white/90 p-1 ${saved.includes(bike.slug) ? "text-blue-600" : "text-slate-600"}`}
              >
                <Icon name="heart" className="h-4 w-4" />
              </button>
              <Link href={`/bikes/${bike.slug}`} className="block">
                <div className="relative h-28 bg-gradient-to-b from-white to-slate-50 sm:h-36">
                  <Image
                    src={bike.image}
                    alt={`${bike.name} price in Bangladesh`}
                    fill
                    className="object-contain p-2 mix-blend-multiply transition group-hover:scale-105"
                    sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
                  />
                </div>
                <div className="p-2.5 sm:p-3">
                  <span className="text-[9px] font-bold uppercase tracking-wide text-blue-600">
                    {bike.type || brandName}
                  </span>
                  <h3 className="mt-0.5 line-clamp-2 min-h-8 text-xs font-bold leading-snug text-slate-950 sm:text-sm">
                    {bike.name}
                  </h3>
                  <strong className="mt-1 block text-xs text-slate-950 sm:text-sm">
                    {displayPrice(bike)}
                  </strong>
                </div>
              </Link>
            </article>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-500">
              No bikes match your search.
            </p>
          )}
        </div>
      </section>
      <nav
        aria-label="Mobile site navigation"
        className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(15,23,42,0.08)] backdrop-blur md:hidden"
      >
        <Link
          href="/"
          className="flex flex-col items-center gap-0.5 py-2 text-[10px] text-slate-600"
        >
          <Icon name="home" className="h-5 w-5" />
          Home
        </Link>
        <a
          href="#price-list-heading"
          aria-current="page"
          className="flex flex-col items-center gap-0.5 rounded-t-lg bg-blue-50 py-2 text-[10px] font-bold text-blue-600"
        >
          <Icon name="price" className="h-5 w-5" />
          Prices
        </a>
        <Link
          href="/brands"
          className="flex flex-col items-center gap-0.5 py-2 text-[10px] text-slate-600"
        >
          <Icon name="bike" className="h-5 w-5" />
          Brands
        </Link>
        <Link
          href="/compare"
          className="flex flex-col items-center gap-0.5 py-2 text-[10px] text-slate-600"
        >
          <Icon name="specs" className="h-5 w-5" />
          Compare
        </Link>
        <button
          type="button"
          onClick={() => setBottomMoreOpen((open) => !open)}
          aria-expanded={bottomMoreOpen}
          className="flex flex-col items-center gap-0.5 py-2 text-[10px] text-slate-600"
        >
          <Icon name="more" className="h-5 w-5" />
          More
        </button>
        {bottomMoreOpen && (
          <div className="absolute bottom-full right-2 mb-2 w-40 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
            <a
              href="#specs-heading"
              onClick={() => setBottomMoreOpen(false)}
              className="block rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-blue-50"
            >
              Specifications
            </a>
            <a
              href="#reviews-heading"
              onClick={() => setBottomMoreOpen(false)}
              className="block rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-blue-50"
            >
              Reviews
            </a>
            <a
              href="#faq-heading"
              onClick={() => setBottomMoreOpen(false)}
              className="block rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-blue-50"
            >
              FAQs
            </a>
          </div>
        )}
      </nav>
    </>
  );
}
