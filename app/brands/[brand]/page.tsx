import { bikes } from "@/data/bike";
import { OBike } from "@/types/bike";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const BASE_URL = "https://bikepriceinbangladesh.com";

type PageProps = {
  params: Promise<{ brand: string }>;
};

// ─── Helpers ─────────────────────────────────────────────────────────────

function slugifyBrand(brand: string) {
  return brand
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getBikesForBrandSlug(slug: string): OBike[] {
  return bikes.filter((b) => slugifyBrand(b.brand) === slug);
}

function priceToNumber(price?: string): number {
  if (!price) return 0;
  const digits = price.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

function ccToNumber(cc?: string): number {
  if (!cc) return 0;
  const digits = cc.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
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

function getImageUrl(image?: string): string {
  if (!image) return "/placeholder-bike.png";
  const markdownMatch = image.match(/\]\((https?:\/\/[^)]+)\)/);
  if (markdownMatch?.[1]) return markdownMatch[1];
  return image.trim();
}

function formatBDT(n: number): string {
  return `৳${n.toLocaleString("en-IN")}`;
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

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.1 6.6L12 17.4l-5.8 3.2 1.1-6.6L2.5 9.4l6.6-.9L12 2.5z" />
    </svg>
  );
}

// ─── Static params & metadata ───────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = new Set(bikes.map((b) => slugifyBrand(b.brand)));
  return Array.from(slugs).map((brand) => ({ brand }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brand } = await params;
  const brandBikes = getBikesForBrandSlug(brand);

  if (brandBikes.length === 0) {
    return {
      title: "Brand Not Found | Bike Price In Bangladesh",
      robots: { index: false, follow: false },
    };
  }

  const brandName = brandBikes[0].brand;
  const title = `${brandName} Bike Price in Bangladesh 2026 | Models, Specs & Mileage`;
  const description = `Check the latest ${brandName} bike price in Bangladesh 2026. Browse all ${brandName} motorcycles with specifications, mileage, and prices, and compare models before you buy.`;

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/brand/${brand}` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/brand/${brand}`,
      type: "website",
      images: [
        {
          url: getImageUrl(brandBikes[0].images?.primary),
          width: 1200,
          height: 630,
          alt: `${brandName} motorcycles in Bangladesh`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

// ─── FAQ generation (genuine, computed from real data) ──────────────────

function generateBrandFaqs(brandName: string, brandBikes: OBike[]) {
  const priced = brandBikes.filter((b) => priceToNumber(b.price) > 0);
  const cheapest = [...priced].sort(
    (a, b) => priceToNumber(a.price) - priceToNumber(b.price)
  )[0];
  const mostExpensive = [...priced].sort(
    (a, b) => priceToNumber(b.price) - priceToNumber(a.price)
  )[0];

  const faqs: { question: string; answer: string }[] = [];

  faqs.push({
    question: `What is the price range of ${brandName} bikes in Bangladesh?`,
    answer: cheapest && mostExpensive
      ? `${brandName} motorcycles in Bangladesh currently range from ${formatPrice(cheapest.price)} for the ${cheapest.name} to ${formatPrice(mostExpensive.price)} for the ${mostExpensive.name}, covering ${brandBikes.length} listed models.`
      : `We currently list ${brandBikes.length} ${brandName} models in Bangladesh. Browse the price list above for exact figures.`,
  });

  if (cheapest) {
    faqs.push({
      question: `What is the cheapest ${brandName} bike in Bangladesh?`,
      answer: `The most affordable ${brandName} model currently listed is the ${cheapest.name}, priced at ${formatPrice(cheapest.price)}.`,
    });
  }

  faqs.push({
    question: `How many ${brandName} bike models are available in Bangladesh?`,
    answer: `We currently track ${brandBikes.length} ${brandName} motorcycle models available in the Bangladeshi market, spanning different engine capacities and body styles.`,
  });

  faqs.push({
    question: `Are ${brandName} bike prices in Bangladesh updated regularly?`,
    answer: `Yes. ${brandName} prices are checked against manufacturer and authorized-dealer information and updated whenever a change is identified. Each model's page shows when its price was last reviewed.`,
  });

  faqs.push({
    question: `Where can I buy a ${brandName} bike in Bangladesh?`,
    answer: `${brandName} motorcycles are sold through authorized showrooms across Bangladesh. Check our Showroom Directory to find a verified dealer near you.`,
  });

  return faqs;
}

// ─── Page ────────────────────────────────────────────────────────────────

export default async function BrandPage({ params }: PageProps) {
  const { brand } = await params;
  const brandBikes = getBikesForBrandSlug(brand);

  if (brandBikes.length === 0) {
    notFound();
  }

  const brandName = brandBikes[0].brand;
  const brandOrigin = brandBikes.find((b) => b.brand_origin)?.brand_origin;

  const sortedByPrice = [...brandBikes].sort(
    (a, b) => priceToNumber(a.price) - priceToNumber(b.price)
  );
  const pricedBikes = sortedByPrice.filter((b) => priceToNumber(b.price) > 0);
  const minPrice = pricedBikes[0] ? priceToNumber(pricedBikes[0].price) : 0;
  const maxPrice = pricedBikes.length
    ? priceToNumber(pricedBikes[pricedBikes.length - 1].price)
    : 0;

  const priceSegments = [
    { label: "Under ৳1.5 Lakh", min: 0, max: 150000 },
    { label: "৳1.5 – 3 Lakh", min: 150000, max: 300000 },
    { label: "৳3 – 5 Lakh", min: 300000, max: 500000 },
    { label: "Above ৳5 Lakh", min: 500000, max: Infinity },
  ].map((seg) => ({
    ...seg,
    count: pricedBikes.filter((b) => {
      const p = priceToNumber(b.price);
      return p >= seg.min && p < seg.max;
    }).length,
  }));

  const popularBikes = sortedByPrice.slice(0, 4);
  const specSampleBikes = brandBikes.slice(0, 8);
  const faqs = generateBrandFaqs(brandName, brandBikes);

  // ─── Structured data ───
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Bikes", item: `${BASE_URL}/bikes` },
      { "@type": "ListItem", position: 3, name: brandName, item: `${BASE_URL}/brand/${brand}` },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${brandName} Bikes in Bangladesh`,
    itemListElement: brandBikes.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE_URL}/bikes/${b.slug}`,
      name: b.name,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <div className="min-h-screen bg-[#F6F9FC] pt-32 sm:pt-36 pb-20">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbSchema, itemListSchema, faqSchema]),
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/bikes" className="hover:text-blue-600 transition-colors">Bikes</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">{brandName}</span>
        </nav>

        {/* H1 + intro */}
        <div className="mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 mb-3">
            <TagIcon className="h-3.5 w-3.5" />
            {brandBikes.length} models tracked
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {brandName} Bike Price in <span className="text-blue-600">Bangladesh 2026</span>
          </h1>
          <p className="mt-4 max-w-2xl text-slate-500 leading-relaxed">
            Looking for the latest {brandName} bike price in Bangladesh? Below
            you'll find an up-to-date price list, specifications, mileage,
            and reviews for every {brandName} motorcycle currently sold in
            the Bangladeshi market
            {brandOrigin ? `, a brand originating from ${brandOrigin}` : ""}
            {pricedBikes.length > 0
              ? `, with prices ranging from ${formatBDT(minPrice)} to ${formatBDT(maxPrice)}.`
              : "."}
          </p>
        </div>

        {/* ── Price List ── */}
        <section aria-labelledby="price-list-heading" className="mb-14">
          <h2 id="price-list-heading" className="text-2xl font-extrabold text-slate-900 mb-4">
            {brandName} Bike Price List
          </h2>
          <div className="overflow-x-auto rounded-xl border border-blue-100 bg-white shadow-sm">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-blue-100 bg-blue-50/50">
                  <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {brandName} Bike
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">CC</th>
                  <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Mileage</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {sortedByPrice.map((bike) => (
                  <tr key={bike.slug} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      <Link href={`/bikes/${bike.slug}`} className="hover:text-blue-600 hover:underline">
                        {bike.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{bike.cc ? `${bike.cc}cc` : "—"}</td>
                    <td className="px-4 py-3 text-slate-500">{getMileage(bike)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900">
                      {formatPrice(bike.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Available Models (cards) ── */}
        <section aria-labelledby="available-models-heading" className="mb-14">
          <h2 id="available-models-heading" className="text-2xl font-extrabold text-slate-900 mb-4">
            {brandName} Motorcycles Available in Bangladesh
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {brandBikes.map((bike) => (
              <Link
                key={bike.slug}
                href={`/bikes/${bike.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-blue-100 bg-white transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg"
              >
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-slate-50">
                  {bike.images?.primary ? (
                    <Image
                      src={getImageUrl(bike.images.primary)}
                      alt={`${bike.name} price in Bangladesh`}
                      fill
                      className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  ) : (
                    <BikePlaceholderIcon className="h-14 w-14 text-slate-300" />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-blue-600">
                    {bike.bike_type || brandName}
                  </span>
                  <h3 className="mt-0.5 line-clamp-2 text-sm font-bold text-slate-900">
                    {bike.name}
                  </h3>
                  <span className="mt-auto pt-3 text-base font-extrabold text-slate-900">
                    {formatPrice(bike.price)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Price Range ── */}
        <section aria-labelledby="price-range-heading" className="mb-14">
          <h2 id="price-range-heading" className="text-2xl font-extrabold text-slate-900 mb-4">
            {brandName} Bike Price Range in Bangladesh
          </h2>
          <div className="rounded-2xl border border-blue-100 bg-white p-6 sm:p-8 shadow-sm">
            <p className="text-slate-600 leading-relaxed mb-6">
              {pricedBikes.length > 0
                ? `${brandName} bikes in Bangladesh are currently priced between ${formatBDT(minPrice)} and ${formatBDT(maxPrice)}, covering ${pricedBikes.length} models across different budgets.`
                : `Pricing details for ${brandName} models are being updated.`}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {priceSegments.map((seg) => (
                <div
                  key={seg.label}
                  className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 text-center"
                >
                  <p className="text-2xl font-extrabold text-blue-600">{seg.count}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">{seg.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Popular Bikes ── */}
        {popularBikes.length > 0 && (
          <section aria-labelledby="popular-bikes-heading" className="mb-14">
            <h2 id="popular-bikes-heading" className="text-2xl font-extrabold text-slate-900 mb-1">
              Popular {brandName} Bikes
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              A snapshot of currently listed {brandName} models, from most to least affordable.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {popularBikes.map((bike, i) => (
                <Link
                  key={bike.slug}
                  href={`/bikes/${bike.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-blue-100 bg-white transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg"
                >
                  <span className="absolute left-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-slate-50">
                    <Image
                      src={getImageUrl(bike.images?.primary)}
                      alt={bike.name}
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2">{bike.name}</h3>
                    <span className="mt-1 block text-sm font-extrabold text-slate-900">
                      {formatPrice(bike.price)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Specifications ── */}
        <section aria-labelledby="specs-heading" className="mb-14">
          <h2 id="specs-heading" className="text-2xl font-extrabold text-slate-900 mb-4">
            {brandName} Bike Specifications
          </h2>
          <div className="overflow-x-auto rounded-xl border border-blue-100 bg-white shadow-sm">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-blue-100 bg-blue-50/50">
                  <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Model</th>
                  <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Engine</th>
                  <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Max Power</th>
                  <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Transmission</th>
                  <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Weight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {specSampleBikes.map((bike) => (
                  <tr key={bike.slug} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      <Link href={`/bikes/${bike.slug}`} className="hover:text-blue-600 hover:underline">
                        {bike.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {bike.engine?.displacement ? `${bike.engine.displacement}cc` : bike.cc ? `${bike.cc}cc` : "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{bike.engine?.maximum_power || "—"}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {bike.transmission?.no_of_gears ? `${bike.transmission.no_of_gears}-Speed` : "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{bike.dimensions?.weight || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {brandBikes.length > specSampleBikes.length && (
            <p className="mt-3 text-sm text-slate-400">
              Showing {specSampleBikes.length} of {brandBikes.length} models.
              Visit each bike's page above for full specifications.
            </p>
          )}
        </section>

        {/* ── Reviews ── */}
        <section aria-labelledby="reviews-heading" className="mb-14">
          <h2 id="reviews-heading" className="text-2xl font-extrabold text-slate-900 mb-4">
            {brandName} Bike Reviews
          </h2>
          <div className="rounded-2xl border border-blue-100 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <StarIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-slate-600 leading-relaxed">
                  Rider feedback on {brandName} models is collected on each
                  bike's individual page, based on real ownership experience
                  rather than showroom marketing copy. Browse a {brandName}{" "}
                  model above to read reviews specific to that bike, covering
                  daily usability, mileage in real conditions, and long-term
                  reliability.
                </p>
                <Link
                  href="/blogs"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline"
                >
                  Read more rider reviews and buying guides
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section aria-labelledby="faq-heading" className="mb-14">
          <h2 id="faq-heading" className="text-2xl font-extrabold text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="rounded-2xl border border-blue-100 bg-white shadow-sm divide-y divide-slate-100">
            {faqs.map((faq) => (
              <details key={faq.question} className="group p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900">
                  <span>{faq.question}</span>
                  <ChevronIcon className="h-4 w-4 flex-shrink-0 text-blue-500 transition-transform duration-200 group-open:rotate-45" />
                </summary>
                <p className="mt-3 pr-8 text-sm leading-7 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── All model links (internal linking) ── */}
        <section aria-labelledby="all-models-heading">
          <h2 id="all-models-heading" className="text-xl font-bold text-slate-900 mb-4">
            All {brandName} Bikes in Bangladesh
          </h2>
          <div className="rounded-2xl border border-blue-100 bg-white p-6 sm:p-8 shadow-sm">
            <ul className="flex flex-wrap gap-x-2 gap-y-3">
              {brandBikes.map((bike, i) => (
                <li key={bike.slug} className="flex items-center">
                  <Link
                    href={`/bikes/${bike.slug}`}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    {bike.name} Price in Bangladesh
                  </Link>
                  {i < brandBikes.length - 1 && (
                    <span className="ml-2 text-slate-300">•</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Back to all bikes */}
        <div className="mt-12 flex justify-center">
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