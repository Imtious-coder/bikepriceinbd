"use client";

import { bikes } from "@/data/bike";
import { OBike } from "@/types/bike";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import BrowseByCategory from "./components/Brand";
import CompareBikes from "./components/CompareBikes";
import MotoHeader from "./components/Header";
import BikeHero from "./components/Hero";
import Popularbikes from "./components/Popularbikes";
import RidersReviews from "./components/RidersReviews";
import Trustedshowrooms from "./components/Trustedshowrooms";

function formatPrice(price?: string): string {
  if (!price || price.trim() === "") return "Price on request";
  // price arrives pre-formatted, e.g. "4,29,950 BDT" — don't parseInt it,
  // that only reads up to the first comma and returns garbage.
  const cleaned = price.replace(/BDT/gi, "").trim();
  return cleaned ? `৳ ${cleaned}` : "Price on request";
}

function BikeCard({ bike }: { bike: OBike }) {
  return (
    <Link
      href={`/bikes/${bike.slug}`}
      className="group block [perspective:1200px]"
    >
      <div className="relative rounded-2xl overflow-hidden bg-white border border-blue-100 shadow-[0_4px_16px_-6px_rgba(30,64,175,0.12)] transition-all duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.015] group-hover:shadow-[0_18px_36px_-12px_rgba(30,64,175,0.22)] group-hover:border-blue-300">
        {/* Image */}
        <div className="relative h-52 bg-gradient-to-b from-slate-50 to-blue-50/60 overflow-hidden">
          <Image
            src={bike.images.primary}
            alt={bike.name}
            fill
            className="object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-[0_8px_12px_rgba(15,23,42,0.15)]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur border border-blue-200 text-blue-700 shadow-sm">
            {bike.bike_type}
          </span>
          {bike.availability === "upcoming" && (
            <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-600 text-white shadow-sm">
              Upcoming
            </span>
          )}
        </div>

        {/* Content */}
        <div className="relative p-5">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">
            {bike.brand}
          </p>
          <h3 className="text-slate-900 font-bold text-lg leading-snug mb-3 group-hover:text-blue-700 transition-colors">
            {bike.name}
          </h3>

          {/* Mileage row */}
          {bike.mileage && (bike.mileage.city || bike.mileage.highway) && (
            <div className="flex gap-3 mb-4">
              {bike.mileage.city && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <svg
                    className="w-3.5 h-3.5 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16"
                    />
                  </svg>
                  City {bike.mileage.city}
                </div>
              )}
              {bike.mileage.highway && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <svg
                    className="w-3.5 h-3.5 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4"
                    />
                  </svg>
                  Highway {bike.mileage.highway}
                </div>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {bike?.price}
            </span>
            <span className="text-sm text-blue-600 font-semibold group-hover:underline group-hover:text-blue-700">
              View details →
            </span>
          </div>
        </div>

        {/* Signature: throttle-fill bar, quiet until hover */}
        <div className="h-[3px] w-full bg-blue-50">
          <div className="h-full w-full origin-left scale-x-0 bg-blue-600 transition-transform duration-500 ease-out group-hover:scale-x-100" />
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  // Derive brand list dynamically from bike data
  const allBrands = useMemo(
    () => Array.from(new Set(bikes.map((b) => b.brand))).sort(),
    [],
  );

  const defaultBrand = useMemo(() => {
    const bajaj = allBrands.find((b) => b.toLowerCase() === "bajaj");
    return bajaj ?? allBrands[0] ?? "All";
  }, [allBrands]);

  const [activeBrand, setActiveBrand] = useState<string>(defaultBrand);
  const [brandSearch, setBrandSearch] = useState<string>("");

  const filteredBikes =
    activeBrand === "All"
      ? bikes
      : bikes.filter((b) => b.brand === activeBrand);

  const filterOptions = ["All", ...allBrands];

  // Filter which brand buttons are visible based on the search text.
  // "All" always stays visible so users can clear the brand filter easily.
  const visibleFilterOptions = useMemo(() => {
    const query = brandSearch.trim().toLowerCase();
    if (!query) return filterOptions;
    return filterOptions.filter(
      (brand) => brand === "All" || brand.toLowerCase().includes(query),
    );
  }, [filterOptions, brandSearch]);

  return (
    <div className="min-h-screen bg-[#F6F9FC]">
      <MotoHeader />
      <BikeHero />
      <BrowseByCategory />
      <CompareBikes />

      {/* Filter bar (brand-based) + search */}
      <div className="bg-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search input */}
          <div className="relative flex-shrink-0 w-full sm:w-56">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              placeholder="Search brand..."
              className="w-full pl-9 pr-8 py-2 rounded-full text-sm font-medium bg-slate-50 border border-slate-200
                         text-slate-900 placeholder:text-slate-400
                         focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white
                         transition-all duration-300"
            />
            {brandSearch && (
              <button
                onClick={() => setBrandSearch("")}
                aria-label="Clear brand search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center
                           text-slate-400 hover:text-blue-600 transition-colors"
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Divider (desktop only) */}
          <div className="hidden sm:block w-px h-6 bg-blue-100 flex-shrink-0" />

          {/* Brand filter buttons */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {visibleFilterOptions.length > 0 ? (
              visibleFilterOptions.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setActiveBrand(brand)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeBrand === brand
                      ? "bg-blue-600 text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)]"
                      : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  }`}
                >
                  {brand}
                </button>
              ))
            ) : (
              <span className="text-sm text-slate-400 px-2">
                No brands match &quot;{brandSearch}&quot;
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-sm text-slate-500 mb-6">
          Showing{" "}
          <span className="font-semibold text-slate-900">
            {filteredBikes.length}
          </span>{" "}
          bikes
          {activeBrand !== "All" && (
            <>
              {" "}
              from{" "}
              <span className="font-semibold text-blue-600">{activeBrand}</span>
            </>
          )}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 [transform-style:preserve-3d]">
          {filteredBikes.map((bike) => (
            <BikeCard key={bike.slug} bike={bike} />
          ))}
        </div>
      </main>

      {/* Showroom */}
      <Trustedshowrooms />

      {/* Popular Bikes */}
      <Popularbikes />

      {/* Reviews */}
      <RidersReviews />

      {/* Footer */}
      <footer className="border-t border-blue-100 bg-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 text-sm">BD Bikes</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 BD Bikes. All prices in BDT.
          </p>
        </div>
      </footer>
    </div>
  );
}
