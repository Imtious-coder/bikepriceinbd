"use client";

import { bikes } from "@/data/bike";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";

const FEATURED_BRANDS = [
  "Hero",
  "Yamaha",
  "Honda",
  "Bajaj",
  "TVS",
  "Suzuki",
  "Runner",
  "Lifan",
];

const BRAND_LOGOS: Record<string, string> = {
  Honda: "https://cdn.shopify.com/s/files/1/0644/7595/5297/files/Honda_Logo.jpg?v=1786298708",
  Lifan: "https://cdn.shopify.com/s/files/1/0644/7595/5297/files/images_1.jpg?v=1786299052",
  Suzuki: "https://cdn.shopify.com/s/files/1/0644/7595/5297/files/images_4.png?v=1786299052",
  Bajaj: "https://cdn.shopify.com/s/files/1/0644/7595/5297/files/images_1.png?v=1786299053",
  Yamaha: "https://cdn.shopify.com/s/files/1/0644/7595/5297/files/images.jpg?v=1786299051",
  Hero: "https://cdn.shopify.com/s/files/1/0644/7595/5297/files/images.png?v=1786299052",
  Runner: "https://cdn.shopify.com/s/files/1/0644/7595/5297/files/images_3.png?v=1786299052",
  CFMOTO: "https://cdn.shopify.com/s/files/1/0644/7595/5297/files/images_3.jpg?v=1786299052",
  TVS: "https://cdn.shopify.com/s/files/1/0644/7595/5297/files/images_2.png?v=1786299052",
};

function slugifyBrand(brand: string) {
  return brand
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function BrowseByCategory() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(true);

  const brands = useMemo(() => {
    const counts = new Map<string, number>();
    for (const bike of bikes) {
      counts.set(bike.brand, (counts.get(bike.brand) ?? 0) + 1);
    }

    return Array.from(counts, ([brand, count]) => ({ brand, count })).sort(
      (a, b) => {
        const aIndex = FEATURED_BRANDS.indexOf(a.brand);
        const bIndex = FEATURED_BRANDS.indexOf(b.brand);
        if (aIndex !== -1 || bIndex !== -1) {
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        }
        return b.count - a.count || a.brand.localeCompare(b.brand);
      },
    );
  }, []);

  function updateScrollButtons() {
    const carousel = carouselRef.current;
    if (!carousel) return;
    setCanScrollBack(carousel.scrollLeft > 1);
    setCanScrollForward(
      carousel.scrollLeft + carousel.clientWidth < carousel.scrollWidth - 1,
    );
  }

  function scrollCards(direction: -1 | 1) {
    const carousel = carouselRef.current;
    if (!carousel) return;
    carousel.scrollBy({ left: direction * carousel.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <section className="bg-[linear-gradient(115deg,#f7fbff_0%,#ffffff_52%,#f6faff_100%)] px-4 pt-9 pb-0 sm:px-6 sm:py-12 lg:px-8 mt-12" aria-labelledby="browse-brand-heading">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
          <h2 id="browse-brand-heading" className="text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl lg:text-[28px]">
            Browse Bikes by Brand
          </h2>
          <Link href="/brands" className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-blue-700 transition-colors hover:text-blue-900 hover:underline sm:text-sm">
            View All Brands
          </Link>
        </div>

        <div className="relative">
          <div
            ref={carouselRef}
            onScroll={updateScrollButtons}
            className="scrollbar-hide flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth pb-1 pr-8 sm:gap-3 sm:pr-10 lg:gap-3 lg:pr-12"
            aria-label="Bike brands"
          >
            {brands.map(({ brand, count }) => (
              <Link
                key={brand}
                href={`/brands/${slugifyBrand(brand)}`}
                className="group flex h-[112px] w-[100px] shrink-0 snap-start flex-col items-center justify-center rounded-xl border border-slate-200/75 bg-white px-2 py-3 text-center shadow-[0_3px_18px_-12px_rgba(15,23,42,0.25)] transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_12px_24px_-12px_rgba(37,99,235,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 sm:h-[126px] sm:w-[118px] lg:h-[138px] lg:w-[138px]"
              >
                <div className="relative h-11 w-16 sm:h-12 sm:w-20 lg:h-14 lg:w-24">
                  {BRAND_LOGOS[brand] ? (
                    <Image
                      src={BRAND_LOGOS[brand]}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="(max-width: 639px) 64px, (max-width: 1023px) 80px, 96px"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center text-lg font-black tracking-tight text-blue-700">
                      {brand.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="mt-1 block max-w-full truncate text-xs font-bold text-slate-900 group-hover:text-blue-700 sm:text-sm">
                  {brand}
                </span>
                <span className="mt-1 text-[10px] font-medium text-slate-500 sm:text-xs">
                  {count} {count === 1 ? "Bike" : "Bikes"}
                </span>
              </Link>
            ))}
          </div>

          {canScrollBack && (
            <button
              type="button"
              onClick={() => scrollCards(-1)}
              aria-label="Previous brands"
              className="absolute -left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-600 shadow-md transition hover:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 sm:-left-4"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
          )}
          {canScrollForward && (
            <button
              type="button"
              onClick={() => scrollCards(1)}
              aria-label="Next brands"
              className="absolute -right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-600 shadow-md transition hover:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 sm:-right-4"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
