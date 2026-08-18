import { bikes } from "@/data/bike";
import { OBike } from "@/types/bike";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CompareTool from "../components/CompareTool";
import CategoryCompare from "../components/CategoryCompare";

const BASE_URL = "https://bikepriceinbangladesh.com";

// ─── Helpers ─────────────────────────────────────────────────────────────

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

function getImageUrl(image?: string): string {
  if (!image) return "/placeholder-bike.png";
  const markdownMatch = image.match(/\]\((https?:\/\/[^)]+)\)/);
  if (markdownMatch?.[1]) return markdownMatch[1];
  return image.trim();
}

function isType(bike: OBike, keyword: string): boolean {
  return (bike.bike_type || "").toLowerCase().includes(keyword);
}

// Preferred brands for the default comparison pairs shown in each category.
// Bikes from these brands are pulled to the front of each list before slicing,
// so the two pre-selected bikes in a comparison are, wherever possible, from
// Honda, Hero, Suzuki, Royal Enfield, or CFMOTO.
const PREFERRED_BRANDS = ["honda", "hero", "suzuki", "royal enfield", "cfmoto"];

function prioritizePreferredBrands(list: OBike[]): OBike[] {
  return [...list].sort((a, b) => {
    const aPref = PREFERRED_BRANDS.includes(a.brand.toLowerCase()) ? 0 : 1;
    const bPref = PREFERRED_BRANDS.includes(b.brand.toLowerCase()) ? 0 : 1;
    return aPref - bPref; // stable sort: preserves existing order within each group
  });
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

// ─── Metadata ────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Compare Bike Prices in Bangladesh 2026 | Popular, Commuter, Sports & More",
  description:
    "Compare motorcycle prices, specs and mileage side by side. Browse popular bikes, best commuter bikes, sports bikes, naked bikes, and bikes for students in Bangladesh.",
  alternates: { canonical: `${BASE_URL}/compare` },
  openGraph: {
    title: "Compare Bike Prices in Bangladesh 2026",
    description:
      "Pick 2-3 bikes and compare price, specs and mileage side by side, or browse curated bike categories for Bangladesh.",
    url: `${BASE_URL}/compare`,
    type: "website",
  },
  robots: { index: true, follow: true },
};

// ─── Reusable bike card (used only in the By Price Range section) ───────

function BikeCard({ bike }: { bike: OBike }) {
  return (
    <Link
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
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <BikePlaceholderIcon className="h-14 w-14 text-slate-300" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-blue-600">
          {bike.brand}
        </span>
        <h3 className="mt-0.5 line-clamp-2 text-sm font-bold text-slate-900">
          {bike.name}
        </h3>
        <span className="mt-auto pt-3 text-base font-extrabold text-slate-900">
          {formatPrice(bike.price)}
        </span>
      </div>
    </Link>
  );
}

// ─── Genuine, computed FAQs ──────────────────────────────────────────────

function generateCompareFaqs() {
  const priced = bikes.filter((b) => priceToNumber(b.price) > 0);
  const cheapest = [...priced].sort((a, b) => priceToNumber(a.price) - priceToNumber(b.price))[0];

  return [
    {
      question: "How do I compare bike prices in Bangladesh?",
      answer:
        "Use the comparison tool above to pick 2 or 3 motorcycles and see their price, engine specs, mileage and features laid out side by side. You can also browse the curated categories below — popular, commuter, sports, naked, and student-friendly bikes — to narrow down your options first.",
    },
    {
      question: "Which bike category is most popular for daily commuting in Bangladesh?",
      answer:
        "Standard and commuter-segment bikes, typically in the 100-150cc range, make up the largest share of motorcycles sold in Bangladesh, prized for high mileage, low maintenance, and easy city handling.",
    },
    cheapest
      ? {
          question: "What is a good first bike for a student in Bangladesh?",
          answer: `Students typically look for a low-cc, fuel-efficient, affordable first bike. The ${cheapest.name} is currently one of the most affordable options listed on our site at ${formatPrice(cheapest.price)}, though the right pick depends on your budget and intended use.`,
        }
      : {
          question: "What is a good first bike for a student in Bangladesh?",
          answer:
            "Students typically look for a low-cc, fuel-efficient, affordable first bike — browse our Best for Students section above for currently listed options in that range.",
        },
    {
      question: "What's the difference between naked and sports bikes?",
      answer:
        "Sports bikes typically have a full fairing, aggressive riding posture, and are tuned for higher-speed performance, while naked bikes expose the frame and engine, offer a more upright riding position, and prioritize everyday usability alongside performance.",
    },
  ];
}

// ─── Page ────────────────────────────────────────────────────────────────

export default function ComparePage() {
  const pricedBikes = bikes.filter((b) => priceToNumber(b.price) > 0);

  // Popular: a representative spread of major brands, most recently updated first,
  // preferred brands (Honda/Hero/Suzuki/Royal Enfield/CFMOTO) pulled to the front
  const majorBrands = ["suzuki", "yamaha", "honda", "bajaj", "tvs", "hero", "royal enfield", "cfmoto"];
  const popularBikes = prioritizePreferredBrands(
    [...pricedBikes]
      .filter((b) => majorBrands.includes(b.brand.toLowerCase()))
      .sort((a, b) => (b.updated_at || "").localeCompare(a.updated_at || ""))
  ).slice(0, 8);

  // Most Sold: standard/commuter segment genuinely dominates real-world BD sales volume
  const mostSoldBikes = prioritizePreferredBrands(
    [...pricedBikes]
      .filter((b) => isType(b, "commuter") || isType(b, "standard"))
      .sort((a, b) => priceToNumber(a.price) - priceToNumber(b.price))
  ).slice(0, 8);

  // Best for Students: low cc, low price
  const studentBikes = prioritizePreferredBrands(
    [...pricedBikes]
      .filter((b) => ccToNumber(b.cc) > 0 && ccToNumber(b.cc) <= 125 && priceToNumber(b.price) < 200000)
      .sort((a, b) => priceToNumber(a.price) - priceToNumber(b.price))
  ).slice(0, 8);

  // Commuter
  const commuterBikes = prioritizePreferredBrands(
    [...pricedBikes]
      .filter((b) => isType(b, "commuter"))
      .sort((a, b) => priceToNumber(a.price) - priceToNumber(b.price))
  ).slice(0, 8);

  // Sports (excluding naked sports to keep categories distinct)
  const sportsBikes = prioritizePreferredBrands(
    [...pricedBikes]
      .filter((b) => isType(b, "sports") && !isType(b, "naked"))
      .sort((a, b) => priceToNumber(b.price) - priceToNumber(a.price))
  ).slice(0, 8);

  // Naked
  const nakedBikes = prioritizePreferredBrands(
    [...pricedBikes]
      .filter((b) => isType(b, "naked"))
      .sort((a, b) => priceToNumber(b.price) - priceToNumber(a.price))
  ).slice(0, 8);

  // By price segment (show cheapest few in each band)
  const priceSegments = [
    { id: "under-1-5-lakh", label: "Under ৳1.5 Lakh", min: 0, max: 150000 },
    { id: "1-5-to-3-lakh", label: "৳1.5 – 3 Lakh", min: 150000, max: 300000 },
    { id: "3-to-5-lakh", label: "৳3 – 5 Lakh", min: 300000, max: 500000 },
    { id: "above-5-lakh", label: "Above ৳5 Lakh", min: 500000, max: Infinity },
  ];

  const faqs = generateCompareFaqs();

  // ─── Structured data ───
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Compare", item: `${BASE_URL}/compare` },
    ],
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, faqSchema]) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">Compare</span>
        </nav>

        {/* H1 + intro */}
        <div className="mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 mb-3">
            <TagIcon className="h-3.5 w-3.5" />
            {bikes.length} bikes available to compare
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Compare Bike Prices in <span className="text-blue-600">Bangladesh 2026</span>
          </h1>
          <p className="mt-4 max-w-2xl text-slate-500 leading-relaxed">
            Put two or three motorcycles head to head on price, engine specs
            and mileage, or jump straight to a curated category below —
            popular bikes, commuter bikes, sports bikes, naked bikes, and
            the best options for students on a budget.
          </p>
        </div>

        {/* Quick category nav */}
        <nav aria-label="Jump to category" className="mb-10 flex flex-wrap gap-2">
          {[
            { id: "popular-bikes", label: "Popular" },
            { id: "most-sold-bikes", label: "Most Sold" },
            { id: "student-bikes", label: "Best for Students" },
            { id: "commuter-bikes", label: "Commuter" },
            { id: "sports-bikes", label: "Sports" },
            { id: "naked-bikes", label: "Naked" },
            { id: "by-price", label: "By Price" },
          ].map((cat) => (
            
              <a key={cat.id}
              href={`#${cat.id}`}
              className="rounded-full border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            >
              {cat.label}
            </a>
          ))}
        </nav>

        {/* Interactive compare tool */}
        <section aria-labelledby="compare-tool-heading" className="mb-16">
          <h2 id="compare-tool-heading" className="text-2xl font-extrabold text-slate-900 mb-4">
            Compare Bikes Side by Side
          </h2>
          <CompareTool />
        </section>

        {/* Popular */}
        <CategoryCompare
          id="popular-bikes"
          title="Popular Bikes in Bangladesh"
          description="Well-known models from the market's leading motorcycle brands, compared side by side."
          bikes={popularBikes}
          searchPool={bikes}
        />

        {/* Most Sold */}
        <CategoryCompare
          id="most-sold-bikes"
          title="Most Sold Bikes in Bangladesh"
          description="The commuter and standard segment consistently accounts for the largest share of motorcycle sales in Bangladesh, thanks to strong mileage and low running costs."
          bikes={mostSoldBikes}
          searchPool={bikes}
        />

        {/* Best for Students */}
        <CategoryCompare
          id="student-bikes"
          title="Best Bikes for Students"
          description="Affordable, low-cc, fuel-efficient bikes suited to a first-time rider's budget."
          bikes={studentBikes}
          searchPool={bikes}
        />

        {/* Commuter */}
        <CategoryCompare
          id="commuter-bikes"
          title="Best Commuter Bikes"
          description="Reliable, low-maintenance bikes built for daily city riding and traffic."
          bikes={commuterBikes}
          searchPool={bikes}
        />

        {/* Sports */}
        <CategoryCompare
          id="sports-bikes"
          title="Best Sports Bikes"
          description="Fully-faired, performance-oriented motorcycles for riders who want speed and styling."
          bikes={sportsBikes}
          searchPool={bikes}
        />

        {/* Naked */}
        <CategoryCompare
          id="naked-bikes"
          title="Best Naked Bikes"
          description="Street-style bikes with an exposed frame, upright posture, and everyday usability."
          bikes={nakedBikes}
          searchPool={bikes}
        />

        {/* By Price Range */}
        <section id="by-price" aria-labelledby="by-price-heading" className="mb-14 scroll-mt-24">
          <h2 id="by-price-heading" className="text-2xl font-extrabold text-slate-900 mb-1">
            Bikes by Price Range
          </h2>
          <p className="text-sm text-slate-500 mb-6 max-w-xl">
            Browse motorcycles grouped by budget to quickly find bikes within your price range.
          </p>
          <div className="space-y-10">
            {priceSegments.map((seg) => {
              const segBikes = prioritizePreferredBrands(
                pricedBikes
                  .filter((b) => {
                    const p = priceToNumber(b.price);
                    return p >= seg.min && p < seg.max;
                  })
                  .sort((a, b) => priceToNumber(a.price) - priceToNumber(b.price))
              ).slice(0, 4);

              if (segBikes.length === 0) return null;

              return (
                <div key={seg.id}>
                  <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wide mb-3">
                    {seg.label}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {segBikes.map((bike) => (
                      <BikeCard key={bike.slug} bike={bike} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="compare-faq-heading" className="mb-14">
          <h2 id="compare-faq-heading" className="text-2xl font-extrabold text-slate-900 mb-4">
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

        {/* Back link */}
        <div className="flex justify-center">
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