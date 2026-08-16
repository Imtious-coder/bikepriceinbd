import { bikes } from "@/data/bike";
import { OBike } from "@/types/bike";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const BASE_URL = "https://bikepriceinbangladesh.com";
const BIKES_PER_BRAND_PREVIEW = 4;

// ─── Helpers ─────────────────────────────────────────────────────────────

function slugifyBrand(brand: string) {
  return brand
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function priceToNumber(price?: string): number {
  if (!price) return 0;
  const digits = price.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

function formatPrice(price?: string): string {
  if (!price || price.trim() === "") return "Price on request";
  const cleaned = price.replace(/BDT/gi, "").trim();
  return cleaned ? `৳ ${cleaned}` : "Price on request";
}

function formatBDT(n: number): string {
  return `৳${n.toLocaleString("en-IN")}`;
}

function getImageUrl(image?: string): string {
  if (!image) return "/placeholder-bike.png";
  const markdownMatch = image.match(/\]\((https?:\/\/[^)]+)\)/);
  if (markdownMatch?.[1]) return markdownMatch[1];
  return image.trim();
}

function groupByBrand(list: OBike[]) {
  const map = new Map<string, { name: string; slug: string; bikes: OBike[] }>();

  for (const bike of list) {
    const slug = slugifyBrand(bike.brand);
    if (!map.has(slug)) {
      map.set(slug, { name: bike.brand, slug, bikes: [] });
    }
    map.get(slug)!.bikes.push(bike);
  }

  return Array.from(map.values()).sort((a, b) => b.bikes.length - a.bikes.length);
}

// ─── Icons (inline, no deps) ────────────────────────────────────────────

function ArrowRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function BikePlaceholderIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      <path d="M5.5 17.5 9 10h5l3.5 7.5" />
      <path d="M9 10 7 6h3" />
    </svg>
  );
}

function TagIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12.59 2.59 20 10a2 2 0 0 1 0 2.83l-6.17 6.17a2 2 0 0 1-2.83 0L3 11V4a2 2 0 0 1 2-2h7.59Z" />
      <circle cx="7.5" cy="7.5" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ─── Metadata ────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "All Motorcycle Brands in Bangladesh 2026 | Bike Price In Bangladesh",
  description:
    "Browse every motorcycle brand available in Bangladesh — Honda, Yamaha, Suzuki, Bajaj, TVS, Hero, Royal Enfield, CFMOTO and more. Compare prices, models and specifications by brand.",
  alternates: { canonical: `${BASE_URL}/brands` },
  openGraph: {
    title: "All Motorcycle Brands in Bangladesh 2026",
    description:
      "Browse every motorcycle brand available in Bangladesh, with current prices and models for each.",
    url: `${BASE_URL}/brands`,
    type: "website",
  },
  robots: { index: true, follow: true },
};

// ─── Page ────────────────────────────────────────────────────────────────

export default function BrandsPage() {
  const grouped = groupByBrand(bikes);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Brands", item: `${BASE_URL}/brands` },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Motorcycle Brands in Bangladesh",
    itemListElement: grouped.map((group, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE_URL}/brand/${group.slug}`,
      name: `${group.name} Bike Price in Bangladesh`,
    })),
  };

  return (
    <div className="min-h-screen bg-[#F6F9FC] pt-32 sm:pt-36 pb-20">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbSchema, itemListSchema]),
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">Brands</span>
        </nav>

        {/* H1 + intro */}
        <div className="mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 mb-3">
            <TagIcon className="h-3.5 w-3.5" />
            {grouped.length} brands · {bikes.length} models tracked
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            All Motorcycle Brands in <span className="text-blue-600">Bangladesh</span>
          </h1>
          <p className="mt-4 max-w-2xl text-slate-500 leading-relaxed">
            Browse every motorcycle brand sold in Bangladesh, from Honda and
            Yamaha to Royal Enfield and CFMOTO. Each brand below links to a
            dedicated page with the full price list, specifications, and
            reviews for that brand's lineup.
          </p>
        </div>

        {/* Brand sections */}
        <div className="space-y-14">
          {grouped.map((group) => {
            const pricedBikes = group.bikes.filter((b) => priceToNumber(b.price) > 0);
            const minPrice = pricedBikes.length
              ? Math.min(...pricedBikes.map((b) => priceToNumber(b.price)))
              : 0;
            const maxPrice = pricedBikes.length
              ? Math.max(...pricedBikes.map((b) => priceToNumber(b.price)))
              : 0;
            const preview = group.bikes.slice(0, BIKES_PER_BRAND_PREVIEW);
            const remaining = group.bikes.length - preview.length;

            return (
              <section
                key={group.slug}
                aria-labelledby={`brand-${group.slug}-heading`}
                className="rounded-2xl border border-blue-100 bg-white p-6 sm:p-8 shadow-sm"
              >
                {/* Section header — links to the brand's dedicated page */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
                  <div>
                    <h2
                      id={`brand-${group.slug}-heading`}
                      className="text-2xl font-extrabold text-slate-900"
                    >
                      <Link
                        href={`/brand/${group.slug}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {group.name} Bike Price in Bangladesh
                      </Link>
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {group.bikes.length} model{group.bikes.length !== 1 ? "s" : ""}
                      {pricedBikes.length > 0
                        ? ` · ${formatBDT(minPrice)} – ${formatBDT(maxPrice)}`
                        : ""}
                    </p>
                  </div>

                  <Link
                    href={`/brand/${group.slug}`}
                    className="group inline-flex items-center gap-1.5 flex-shrink-0 text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    View all {group.name} bikes
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>

                {/* Bike cards — link straight to bike detail pages */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {preview.map((bike) => (
                    <Link
                      key={bike.slug}
                      href={`/bikes/${bike.slug}`}
                      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                    >
                      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-slate-50">
                        {bike.images?.primary ? (
                          <Image
                            src={getImageUrl(bike.images.primary)}
                            alt={`${bike.name} price in Bangladesh`}
                            fill
                            className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 50vw, 12vw"
                          />
                        ) : (
                          <BikePlaceholderIcon className="h-10 w-10 text-slate-300" />
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                          {bike.name}
                        </h3>
                        <span className="mt-1 block text-xs font-extrabold text-slate-900">
                          {formatPrice(bike.price)}
                        </span>
                      </div>
                    </Link>
                  ))}

                  {/* If there are more bikes than fit the preview, show a "+N more" tile */}
                  {remaining > 0 && (
                    <Link
                      href={`/brand/${group.slug}`}
                      className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-blue-200 bg-blue-50/40 p-3 text-center transition-colors hover:bg-blue-50 hover:border-blue-300"
                    >
                      <span className="text-lg font-extrabold text-blue-600">+{remaining}</span>
                      <span className="text-xs font-medium text-blue-600">
                        more {group.name} bikes
                      </span>
                    </Link>
                  )}
                </div>
              </section>
            );
          })}
        </div>

        {/* Back link */}
        <div className="mt-14 flex justify-center">
          <Link
            href="/bikes"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-semibold text-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
          >
            View All Bikes in Bangladesh
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}