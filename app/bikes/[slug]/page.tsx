import { bikes, getBikeBySlug } from "@/data/bike";
import { OBike } from "@/types/bike";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BikeDetailShowcase from "./BikeDetailShowcase";


type SpecRecord = Record<string, string> | undefined | null;


const BASE_URL = "https://bikepriceinbangladesh.com";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getBike(slug: string) {
  return bikes.find((bike) => bike.slug === slug);
}

function generateBikeDescription(bike: OBike): string {
  const parts: string[] = [];

  // Opening
  parts.push(
    `${bike.name} is a ${bike.cc}cc ${bike.bike_type?.toLowerCase() || "motorcycle"}`
  );

  if (bike.brand) {
    parts.push(`from ${bike.brand}`);
  }

  parts.push(`available in Bangladesh.`);

  // Price
  if (bike.price) {
    parts.push(`The current price is ${bike.price}.`);
  }

  // Engine & performance
  if (bike.engine) {
    const engineDetails: string[] = [];

    if (bike.engine.type) {
      engineDetails.push(`uses a ${bike.engine.type.toLowerCase()} engine`);
    }

    if (bike.engine.maximum_power) {
      engineDetails.push(
        `produces ${bike.engine.maximum_power} of maximum power`
      );
    }

    if (bike.engine.maximum_torque) {
      engineDetails.push(
        `and ${bike.engine.maximum_torque} of maximum torque`
      );
    }

    if (engineDetails.length > 0) {
      parts.push(
        `Its engine ${engineDetails.join(", ")}.`
      );
    }
  }

  // Transmission
  if (bike.transmission) {
    const transmissionDetails: string[] = [];

    if (bike.transmission.no_of_gears) {
      transmissionDetails.push(
        `${bike.transmission.no_of_gears}-speed transmission`
      );
    }

    if (bike.transmission.transmission_type) {
      transmissionDetails.push(
        `${bike.transmission.transmission_type.toLowerCase()} transmission`
      );
    }

    if (transmissionDetails.length > 0) {
      parts.push(
        `The bike features a ${transmissionDetails.join(" and ")}.`
      );
    }
  }

  // Mileage
  const cityMileage = bike.mileage?.city;
  const highwayMileage = bike.mileage?.highway;

  if (cityMileage || highwayMileage) {
    if (cityMileage && highwayMileage) {
      parts.push(
        `Its mileage is approximately ${cityMileage} in the city and ${highwayMileage} on the highway.`
      );
    } else if (cityMileage) {
      parts.push(
        `Its approximate city mileage is ${cityMileage}.`
      );
    } else if (highwayMileage) {
      parts.push(
        `Its approximate highway mileage is ${highwayMileage}.`
      );
    }
  } else if (bike.mileage_top_speed?.mileage) {
    parts.push(
      `Its approximate mileage is ${bike.mileage_top_speed.mileage}.`
    );
  }

  // Top speed
  if (bike.mileage_top_speed?.top_speed) {
    parts.push(
      `The approximate top speed is ${bike.mileage_top_speed.top_speed}.`
    );
  }

  // Brakes
  if (bike.brakes) {
    const brakeDetails: string[] = [];

    if (bike.brakes.front_brake_type) {
      brakeDetails.push(
        `${bike.brakes.front_brake_type.toLowerCase()} front brake`
      );
    }

    if (bike.brakes.rear_brake_type) {
      brakeDetails.push(
        `${bike.brakes.rear_brake_type.toLowerCase()} rear brake`
      );
    }

    if (bike.brakes.braking_system) {
      brakeDetails.push(
        `${bike.brakes.braking_system}`
      );
    }

    if (brakeDetails.length > 0) {
      parts.push(
        `Braking is handled by ${brakeDetails.join(", ")}.`
      );
    }
  }

  // Dimensions / fuel
  const dimensionDetails: string[] = [];

  if (bike.dimensions?.weight) {
    dimensionDetails.push(`weighs ${bike.dimensions.weight}`);
  }

  if (bike.dimensions?.seat_height) {
    dimensionDetails.push(
      `has a seat height of ${bike.dimensions.seat_height}`
    );
  }

  if (bike.dimensions?.fuel_tank_capacity) {
    dimensionDetails.push(
      `and has a ${bike.dimensions.fuel_tank_capacity} fuel tank`
    );
  }

  if (dimensionDetails.length > 0) {
    parts.push(
      `The ${bike.name} ${dimensionDetails.join(", ")}.`
    );
  }

  // Manufacturing / origin
  const originDetails: string[] = [];

  if (bike.brand_origin) {
    originDetails.push(`brand origin is ${bike.brand_origin}`);
  }

  if (bike.made_in) {
    originDetails.push(`made in ${bike.made_in}`);
  }

  if (bike.assembly) {
    originDetails.push(`assembled in ${bike.assembly}`);
  }

  if (originDetails.length > 0) {
    parts.push(
      `Its ${originDetails.join(", ")}.`
    );
  }

  return parts.join(" ");
}

import { permanentRedirect } from "next/navigation";

// ─── Normalization helper ───────────────────────────────────────────────

function normalizeSlug(slug: string): string {
  return slug.replace(/_/g, "-").toLowerCase();
}

function findBikeWithFallback(rawSlug: string) {
  // 1. Try exact match first (fast path for already-correct URLs)
  const exact = bikes.find((b) => b.slug === rawSlug);
  if (exact) return { bike: exact, needsRedirect: false };

  // 2. Try normalized match (catches old Underscore_Style / MixedCase slugs)
  const normalized = normalizeSlug(rawSlug);
  const fallback = bikes.find((b) => b.slug === normalized);
  if (fallback) return { bike: fallback, needsRedirect: normalized !== rawSlug };

  return { bike: null, needsRedirect: false };
}

const SPEC_SECTION_STYLES = [
  { bg: "bg-blue-50/70", border: "border-blue-100", accent: "text-blue-700" },
  { bg: "bg-emerald-50/70", border: "border-emerald-100", accent: "text-emerald-700" },
  { bg: "bg-amber-50/70", border: "border-amber-100", accent: "text-amber-700" },
  { bg: "bg-violet-50/70", border: "border-violet-100", accent: "text-violet-700" },
  { bg: "bg-rose-50/70", border: "border-rose-100", accent: "text-rose-700" },
  { bg: "bg-cyan-50/70", border: "border-cyan-100", accent: "text-cyan-700" },
];

function getLastUpdatedLabel(updatedAt: string): string {
  const date = new Date(updatedAt);
  if (Number.isNaN(date.getTime())) return updatedAt;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function VerifiedIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 1.5 14.4 4l3.3-.7 1 3.2 3.2 1-.7 3.3L23.5 13l-2.3 2.4.7 3.3-3.2 1-1 3.2-3.3-.7L12 24.5l-2.4-2.3-3.3.7-1-3.2-3.2-1 .7-3.3L.5 13l2.3-2.4-.7-3.3 3.2-1 1-3.2 3.3.7L12 1.5Z" />
      <path
        d="m8.5 12.3 2.3 2.3 4.7-4.9"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function generateBikeFaqs(bike: OBike) {
  const faqs: {
    question: string;
    answer: string;
  }[] = [];

  // Price
  if (bike.price) {
    faqs.push({
      question: `What is the ${bike.name} price in Bangladesh?`,
      answer: `The current listed price of the ${bike.name} in Bangladesh is ${bike.price}. Prices may vary depending on availability, distributor pricing, and location.`,
    });
  }

  // Engine / CC
  if (bike.cc || bike.engine?.displacement) {
    const displacement =
      bike.engine?.displacement || bike.cc;

    faqs.push({
      question: `What is the engine capacity of the ${bike.name}?`,
      answer: `The ${bike.name} has a ${displacement}cc engine.`,
    });
  }

  // Power
  if (bike.engine?.maximum_power) {
    faqs.push({
      question: `What is the maximum power of the ${bike.name}?`,
      answer: `The ${bike.name} produces a maximum power of ${bike.engine.maximum_power}.`,
    });
  }

  // Torque
  if (bike.engine?.maximum_torque) {
    faqs.push({
      question: `What is the maximum torque of the ${bike.name}?`,
      answer: `The ${bike.name} produces a maximum torque of ${bike.engine.maximum_torque}.`,
    });
  }

  // Mileage
  if (bike.mileage?.city || bike.mileage?.highway) {
    let mileageAnswer = `The ${bike.name} has an approximate mileage of`;

    if (bike.mileage.city) {
      mileageAnswer += ` ${bike.mileage.city} in the city`;
    }

    if (bike.mileage.city && bike.mileage.highway) {
      mileageAnswer += ` and`;
    }

    if (bike.mileage.highway) {
      mileageAnswer += ` ${bike.mileage.highway} on the highway`;
    }

    mileageAnswer += `. Actual mileage can vary depending on riding conditions, traffic, maintenance, and riding style.`;

    faqs.push({
      question: `What is the mileage of the ${bike.name}?`,
      answer: mileageAnswer,
    });
  } else if (bike.mileage_top_speed?.mileage) {
    faqs.push({
      question: `What is the mileage of the ${bike.name}?`,
      answer: `The ${bike.name} has an approximate mileage of ${bike.mileage_top_speed.mileage}. Actual mileage may vary depending on riding conditions and riding style.`,
    });
  }

  // Top speed
  if (bike.mileage_top_speed?.top_speed) {
    faqs.push({
      question: `What is the top speed of the ${bike.name}?`,
      answer: `The approximate top speed of the ${bike.name} is ${bike.mileage_top_speed.top_speed}.`,
    });
  }

  // Gears
  if (bike.transmission?.no_of_gears) {
    faqs.push({
      question: `How many gears does the ${bike.name} have?`,
      answer: `The ${bike.name} has ${bike.transmission.no_of_gears} gears.`,
    });
  }

  // Transmission
  if (bike.transmission?.transmission_type) {
    faqs.push({
      question: `What type of transmission does the ${bike.name} use?`,
      answer: `The ${bike.name} uses a ${bike.transmission.transmission_type.toLowerCase()} transmission.`,
    });
  }

  // ABS / braking
  if (bike.brakes?.braking_system) {
    faqs.push({
      question: `Does the ${bike.name} have ABS?`,
      answer: `The ${bike.name} uses a ${bike.brakes.braking_system} braking system.`,
    });
  }

  // Weight
  if (bike.dimensions?.weight) {
    faqs.push({
      question: `What is the weight of the ${bike.name}?`,
      answer: `The ${bike.name} weighs ${bike.dimensions.weight}.`,
    });
  }

  // Seat height
  if (bike.dimensions?.seat_height) {
    faqs.push({
      question: `What is the seat height of the ${bike.name}?`,
      answer: `The ${bike.name} has a seat height of ${bike.dimensions.seat_height}.`,
    });
  }

  // Fuel tank
  if (bike.dimensions?.fuel_tank_capacity) {
    faqs.push({
      question: `What is the fuel tank capacity of the ${bike.name}?`,
      answer: `The ${bike.name} has a fuel tank capacity of ${bike.dimensions.fuel_tank_capacity}.`,
    });
  }

  // Starting method
  if (bike.engine?.starting_method) {
    faqs.push({
      question: `Does the ${bike.name} have electric starting?`,
      answer: `The ${bike.name} uses ${bike.engine.starting_method.toLowerCase()} starting.`,
    });
  }

  return faqs;
}

function getImageUrl(image?: string): string {
  if (!image) {
    return `${BASE_URL}/placeholder-bike.png`;
  }

  const markdownMatch = image.match(/\]\((https?:\/\/[^)]+)\)/);

  if (markdownMatch?.[1]) {
    return markdownMatch[1];
  }

  return image.trim();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { bike } = findBikeWithFallback(slug);

  if (!bike) {
    return {
      title: "Bike Not Found | Bike Price In Bangladesh",
      robots: { index: false, follow: false },
    };
  }

  const imageUrl = getImageUrl(bike.images?.primary);

  return {
    title: `${bike.name} Price in Bangladesh 2026 | Specs & Features`,
    description: `${bike.name} price in Bangladesh 2026 is ${bike.price}. Check engine specifications, mileage, top speed, features, dimensions, colors and latest information.`,
    alternates: {
      canonical: `${BASE_URL}/bikes/${bike.slug}`, // always the CORRECT canonical slug
    },
    openGraph: {
      title: `${bike.name} Price in Bangladesh 2026`,
      description: `${bike.name} price, specifications, mileage, top speed and features in Bangladesh.`,
      url: `${BASE_URL}/bikes/${bike.slug}`,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${bike.name} motorcycle in Bangladesh`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${bike.name} Price in Bangladesh 2026`,
      description: `${bike.name} price, specifications, mileage, top speed and features in Bangladesh.`,
      images: [imageUrl],
    },
    robots: { index: true, follow: true },
  };
}



function formatPrice(price?: string): string {
  if (!price || price.trim() === "") return "Price on request";
  const cleaned = price.replace(/BDT/gi, "").trim();
  return cleaned ? `৳ ${cleaned}` : "Price on request";
}

// Try to map a color name to an actual swatch color for visual display
function colorSwatch(name: string): string {
  const map: Record<string, string> = {
    black: "#0a0a0a",
    white: "#f5f5f5",
    red: "#dc2626",
    blue: "#2563eb",
    green: "#16a34a",
    yellow: "#eab308",
    grey: "#6b7280",
    gray: "#6b7280",
    silver: "#c0c0c0",
    orange: "#ea580c",
    matte: "#374151",
  };
  const key = Object.keys(map).find((k) => name.toLowerCase().includes(k));
  return key ? map[key] : "#1e3a8a";
}

function formatLabel(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getHighlightSpecs(bike: {
  engine?: Record<string, any> | null;
  transmission?: Record<string, any> | null;
  mileage_top_speed?: Record<string, any> | null;
  dimensions?: Record<string, any> | null;
}) {
  const candidates: { label: string; value?: string }[] = [
    {
      label: "Displacement",
      value: bike.engine?.displacement && `${bike.engine.displacement} cc`,
    },
    { label: "Max Power", value: bike.engine?.maximum_power },
    { label: "Max Torque", value: bike.engine?.maximum_torque },
    { label: "Top Speed", value: bike.mileage_top_speed?.top_speed },
    {
      label: "Transmission",
      value:
        bike.transmission?.no_of_gears &&
        `${bike.transmission.no_of_gears}-Speed`,
    },
    { label: "Weight", value: bike.dimensions?.weight },
    { label: "Fuel Tank", value: bike.dimensions?.fuel_tank_capacity },
  ];
  return candidates
    .filter((c): c is { label: string; value: string } => !!c.value)
    .slice(0, 4);
}

export async function generateStaticParams() {
  return bikes.map((bike) => ({ slug: bike.slug }));
}

export default async function BikeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { bike, needsRedirect } = findBikeWithFallback(slug);

  if (!bike) {
    notFound();
  }

  if (needsRedirect) {
    permanentRedirect(`/bikes/${bike.slug}`);
  }

  const faqs = generateBikeFaqs(bike);
  const imageSrc = getImageUrl(bike.images?.primary);
  const gallerySources = [
    imageSrc,
    ...(bike.images.gallery ?? []).filter((source) => source?.trim()).map(getImageUrl),
  ];

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",

  name: bike.name,

  description: bike.description,

  image: [imageSrc],

  url: `${BASE_URL}/bikes/${bike.slug}`,

  brand: {
    "@type": "Brand",
    name: bike.brand,
  },

  category: "Motorcycle",

  offers: {
    "@type": "Offer",
    priceCurrency: "BDT",
    price: Number(bike.price.replace(/[^\d]/g, "")),
    url: `${BASE_URL}/bikes/${bike.slug}`,
  },
};

const brandSlug = bike.brand.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: BASE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: bike.brand,
      item: `${BASE_URL}/brands/${brandSlug}`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: bike.name,
      item: `${BASE_URL}/bikes/${bike.slug}`,
    },
  ],
};

 const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

  const highlightSpecs = getHighlightSpecs(bike);
  const hasColors = Array.isArray(bike.colors) && bike.colors.length > 0;
  const hasMileage = !!(
    bike.mileage &&
    (bike.mileage.city || bike.mileage.highway)
  );
  const hasShowroom =
    bike.showroom && !bike.showroom.includes("Feature Your Showroom");

  const rawSpecSections = [
    { title: "Engine", data: bike.engine },
    { title: "Transmission", data: bike.transmission },
    { title: "Mileage & Top Speed", data: bike.mileage_top_speed },
    { title: "Chassis & Suspension", data: bike.chassis_suspension },
    { title: "Brakes", data: bike.brakes },
    { title: "Wheels & Tyres", data: bike.wheel_tyres },
    { title: "Dimensions", data: bike.dimensions },
    { title: "Electricals", data: bike.electricals },
    { title: "Others", data: bike.others },
  ];

  const specSections: { title: string; data?: SpecRecord }[] = rawSpecSections
    .filter((section) => section.data && Object.keys(section.data).length > 0)
    .map((section) => ({
      title: section.title,
      data: section.data as unknown as SpecRecord,
    }));

  const similarBikes = bikes
    .filter((b) => b.brand === bike.brand && b.slug !== bike.slug)
    .slice(0, 4);
  const variants = bikes
    .filter((candidate) => candidate.brand === bike.brand && (
      candidate.slug === bike.slug ||
      candidate.name.startsWith(`${bike.name} `) ||
      bike.name.startsWith(`${candidate.name} `)
    ))
    .sort((a, b) => Number(b.slug === bike.slug) - Number(a.slug === bike.slug))
    .slice(0, 5)
    .map((candidate) => ({
      slug: candidate.slug,
      name: candidate.name,
      price: candidate.price,
      image: getImageUrl(candidate.images?.primary),
    }));

  return (
    <div className="relative top-[65px] min-h-screen bg-[#f4f8fc] pb-24 md:top-[116px] lg:pb-8">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 overflow-hidden whitespace-nowrap text-[11px] text-slate-500 sm:text-sm">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href={`/brands/${brandSlug}`} className="hover:text-blue-600 transition-colors">
            {bike.brand}
          </Link>
          <span>/</span>
          <span className="truncate font-medium text-slate-700" aria-current="page">{bike.name}</span>
        </nav>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify([
                productSchema,
                breadcrumbSchema,
                faqSchema,
              ]),
            }}/>
        <BikeDetailShowcase
          bike={bike}
          gallerySources={gallerySources}
          variants={variants}
          highlightSpecs={highlightSpecs}
          overview={generateBikeDescription(bike)}
          lastUpdatedLabel={getLastUpdatedLabel(bike.updated_at)}
          hasShowroom={!!hasShowroom}
          hasSimilarBikes={similarBikes.length > 0}
        />

        {/* SEO Content */}
          <div className="mt-3 grid gap-3 sm:grid-cols-2">

            <section id="price-in-bangladesh" className="scroll-mt-28 rounded-2xl bg-white p-4 shadow-sm sm:p-6">
              <h2 className="mb-2 text-base font-bold text-slate-900 sm:text-lg">
                {bike.name} Price in Bangladesh
              </h2>

              <p className="text-sm leading-relaxed text-slate-600">
                The current price of the {bike.name} in Bangladesh is {bike.price}.
                Check the latest price, availability and specifications before buying.
              </p>
            </section>

            <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
              <h2 className="mb-2 text-base font-bold text-slate-900 sm:text-lg">
                {bike.name} Engine & Performance
              </h2>

              <p className="text-sm leading-relaxed text-slate-600">
                The {bike.name} is powered by a {bike.cc}cc engine.
                It produces {bike.engine.maximum_power} and
                {bike.engine.maximum_torque}.
              </p>
            </section>

            <section id="mileage" className="scroll-mt-28 rounded-2xl bg-white p-4 shadow-sm sm:p-6">
              <h2 className="mb-2 text-base font-bold text-slate-900 sm:text-lg">
                {bike.name} Mileage
              </h2>

              <p className="text-sm leading-relaxed text-slate-600">
                The {bike.name} offers an approximate mileage of{" "}
                {bike.mileage?.city || bike.mileage_top_speed?.mileage || "N/A"}.
                Actual mileage can vary depending on riding conditions,
                traffic and maintenance.
              </p>
            </section>

            <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
              <h2 className="mb-2 text-base font-bold text-slate-900 sm:text-lg">
                {bike.name} Top Speed
              </h2>

              <p className="text-sm leading-relaxed text-slate-600">
                The approximate top speed of the {bike.name} is{" "}
                {bike.mileage_top_speed?.top_speed || "N/A"}.
              </p>
            </section>

            <section className="rounded-2xl bg-white p-4 shadow-sm sm:col-span-2 sm:p-6">
              <h2 className="mb-2 text-base font-bold text-slate-900 sm:text-lg">
                {bike.name} Features
              </h2>

              <p className="text-sm leading-relaxed text-slate-600">
                The {bike.name} comes with features including{" "}
                {bike.electricals?.head_light} lighting,
                {bike.brakes?.braking_system} and{" "}
                {bike.transmission?.no_of_gears}-speed transmission.
              </p>
            </section>

          </div>

        {/* Specifications */}
{specSections.length > 0 && (
  <div id="specifications" className="mt-3 scroll-mt-28 space-y-3">
    {specSections.map((section, i) => {
      const style = SPEC_SECTION_STYLES[i % SPEC_SECTION_STYLES.length];
      const anchorId = section.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      return (
        <section
          key={section.title}
          id={anchorId}
          aria-labelledby={`${anchorId}-heading`}
          className={`scroll-mt-28 overflow-hidden rounded-2xl border shadow-sm ${style.bg} ${style.border}`}
        >
          <div className="px-4 pb-3 pt-5 sm:px-6">
            <p className={`text-xs font-semibold uppercase tracking-wider ${style.accent} mb-1`}>
              Specifications
            </p>
            <h2
              id={`${anchorId}-heading`}
              className="text-base font-bold text-slate-900 sm:text-xl"
            >
              {bike.name} {section.title} Specifications
            </h2>
          </div>
          <div className="divide-y divide-black/5">
            {Object.entries(section.data as Record<string, string>).map(
              ([key, value], j) => (
                <div
                  key={key}
                  className={`grid grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] gap-3 px-4 py-3 transition-colors sm:px-6 ${
                    j % 2 === 0 ? "bg-white/70" : "bg-transparent"
                  } hover:bg-white/90`}
                >
                  <span className="break-words text-xs font-semibold text-slate-600 sm:text-sm">
                    {formatLabel(key)}
                  </span>
                  <span className="break-words text-xs font-medium text-slate-900 sm:text-sm">
                    {value}
                  </span>
                </div>
              ),
            )}
          </div>
        </section>
      );
    })}
  </div>
)}

        {/* Showroom */}
        {hasShowroom && (
          <div id="showroom" className="mt-3 scroll-mt-28 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Showroom</h2>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex-shrink-0 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                {bike.showroom}
              </p>
            </div>
          </div>
        )}

        {/* FAQ */}
          {faqs.length > 0 && (
            <section className="mt-3">
              <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-6">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                    Frequently Asked Questions
                  </p>

                  <h2 className="text-lg font-bold text-slate-900 sm:text-2xl">
                    {bike.name} Frequently Asked Questions
                  </h2>

                  <p className="text-slate-600 text-sm mt-2">
                    Find answers to common questions about the {bike.name} price,
                    engine, mileage, performance and specifications.
                  </p>
                </div>

                <div className="divide-y divide-slate-200">
                  {faqs.map((faq) => (
                    <details
                      key={faq.question}
                      className="group py-5 first:pt-0 last:pb-0"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900">
                        <span>
                          {faq.question}
                        </span>

                        <span className="flex-shrink-0 text-xl text-slate-400 transition-transform duration-200 group-open:rotate-45">
                          +
                        </span>
                      </summary>

                      <p className="mt-3 pr-8 text-sm leading-7 text-slate-600">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </section>
          )}

        {/* Similar Bikes */}
        {similarBikes.length > 0 && (
          <div id="similar-bikes" className="mt-5 scroll-mt-28">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              More from <span className="text-blue-600">{bike.brand}</span>
            </h2>
            <div className="scrollbar-hide flex snap-x gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible">
              {similarBikes.map((sb) => (
                <Link
                  key={sb.slug}
                  href={`/bikes/${sb.slug}`}
                  className="group block w-[210px] shrink-0 snap-start sm:w-[250px] lg:w-auto"
                >
                  <div className="overflow-hidden rounded-xl border border-blue-100 bg-white transition-all duration-300 group-hover:-translate-y-1 group-hover:border-blue-300 group-hover:shadow-md">
                    <div className="relative h-32 bg-gradient-to-b from-slate-50 to-blue-50/60">
                      <Image
                        src={getImageUrl(sb.images?.primary)}
                        alt={sb.name}
                        fill
                        className="object-contain p-3 group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-[11px] text-blue-600 font-semibold uppercase tracking-wide mb-1">
                        {sb.brand}
                      </p>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                        {sb.name}
                      </h3>
                      <p className="text-sm font-extrabold text-slate-900">
                        {formatPrice(sb.price)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-10 mb-4 flex justify-center">
          <Link
            href="/bikes"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-semibold text-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to all bikes
          </Link>
        </div>
      </main>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-3 border-t border-blue-100 bg-white/95 px-4 py-2.5 shadow-[0_-8px_24px_-16px_rgba(15,23,42,0.3)] backdrop-blur lg:hidden">
        <div className="min-w-0 flex-1"><strong className="block truncate text-base font-extrabold text-blue-600">{formatPrice(bike.price)}</strong><span className="block text-[10px] text-slate-500">Official Price in Bangladesh</span></div>
        <a href={hasShowroom ? "#showroom" : "/contact"} className="flex min-h-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 px-4 text-center text-xs font-bold text-white shadow-sm">
          {hasShowroom ? "View Showrooms" : "Contact Us"}
        </a>
      </div>
    </div>
  );
}
