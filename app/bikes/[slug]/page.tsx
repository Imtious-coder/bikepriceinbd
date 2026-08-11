import { bikes, getBikeBySlug } from "@/data/bike";
import { OBike } from "@/types/bike";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";


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

  const bike = getBike(slug);

  
  if (!bike) {
    return {
      title: "Bike Not Found | Bike Price in Bangladesh",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
  
  const imageUrl = getImageUrl(bike.images?.primary);

  return {
    title: `${bike.name} Price in Bangladesh 2026 | Specs & Features`,

    description: `${bike.name} price in Bangladesh 2026 is ${bike.price}. Check engine specifications, mileage, top speed, features, dimensions, colors and latest information.`,

    alternates: {
      canonical: `${BASE_URL}/bikes/${bike.slug}`,
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

    robots: {
      index: true,
      follow: true,
    },
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
  const bike = getBikeBySlug(slug);

  if (!bike) {
    notFound();
  }

    const faqs = generateBikeFaqs(bike);


  const imageSrc = getImageUrl(bike.images?.primary);

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
      item: `${BASE_URL}/bikes`,
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

  return (
    <div className="min-h-screen bg-[#F6F9FC] pb-24 lg:pb-8 relative top-[65px] md:top-[116px]">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="hover:text-blue-600 transition-colors">
            {bike.brand}
          </span>
          <span>/</span>
          <span className="text-slate-700 font-medium">{bike.name}</span>
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
        <div className="bg-white rounded-2xl border border-blue-100 shadow-[0_8px_30px_-12px_rgba(30,64,175,0.18)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image Panel */}
            <div className="relative bg-gradient-to-b from-slate-50 to-blue-50/60 min-h-80 lg:min-h-[520px] p-8 flex items-center justify-center [perspective:1200px]">
              <div className="relative w-full h-full transition-transform duration-700 ease-out hover:[transform:rotateY(-6deg)_rotateX(2deg)]">
                <Image
                  src={imageSrc}
                  alt={`${bike.name} bike price in Bangladesh`}
                  width={520}
                  height={380}
                  className="object-contain w-full h-full max-h-96 mx-auto drop-shadow-[0_16px_20px_rgba(15,23,42,0.18)]"
                  priority
                />
              </div>
              {/* Badges */}
              <div className="absolute top-5 left-5 flex flex-col gap-2">
                {bike.bike_type && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/90 backdrop-blur border border-blue-200 text-blue-700 shadow-sm">
                    {bike.bike_type}
                  </span>
                )}
                {bike.availability === "upcoming" && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-600 text-white shadow-sm">
                    Upcoming
                  </span>
                )}
              </div>
            </div>

            {/* info panel */}
            <div className="p-8 lg:p-10 flex flex-col gap-6">
              {/* Brand + Name */}
              <div>
                <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-1">
                  {bike.brand}
                </p>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {bike.name} Price in Bangladesh 2026
                </h1>
              </div>

              {/* Price */}
              <div className="bg-blue-50/60 border border-blue-100 rounded-xl px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">
                    Price in Bangladesh
                  </p>
                  <p className="text-3xl font-extrabold text-slate-900">
                    {formatPrice(bike.price)}
                  </p>
                </div>
                <svg
                  className="w-8 h-8 text-blue-200"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              {/* Highlight spec strip */}
              {highlightSpecs.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {highlightSpecs.map((spec) => (
                    <div
                      key={spec.label}
                      className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-3 text-center transition-all duration-300 hover:border-blue-300 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_-6px_rgba(37,99,235,0.3)]"
                    >
                      <p className="text-[10px] text-blue-600 uppercase tracking-wider mb-1">
                        {spec.label}
                      </p>
                      <p className="text-sm font-bold text-slate-900">
                        {spec.value}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Mileage */}
              {hasMileage && (
                <div className="grid grid-cols-2 gap-3">
                  {bike.mileage?.city && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                      <p className="text-xs text-blue-600 uppercase tracking-wider mb-0.5">
                        City Mileage
                      </p>
                      <p className="text-xl font-bold text-slate-900">
                        {bike.mileage.city}
                      </p>
                    </div>
                  )}
                  {bike.mileage?.highway && (
                    <div className="bg-blue-100/50 border border-blue-200 rounded-xl px-4 py-3">
                      <p className="text-xs text-blue-700 uppercase tracking-wider mb-0.5">
                        Highway Mileage
                      </p>
                      <p className="text-xl font-bold text-slate-900">
                        {bike.mileage.highway}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Colors */}
              {hasColors && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                    Available Colors
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {bike.colors.map((color) => (
                      <span
                        key={color}
                        className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-slate-50 text-slate-700 font-medium border border-blue-100 transition-all hover:border-blue-300"
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-slate-200 shadow-inner"
                          style={{ backgroundColor: colorSwatch(color) }}
                        />
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Overview */}
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                  Overview
                </p>

                <p className="text-slate-600 leading-relaxed text-sm">
                  {generateBikeDescription(bike)}
                </p>
              </div>

              {/* CTA buttons (desktop) */}
              <div className="hidden lg:flex gap-3 mt-2">
                <a
                  href="tel:+8800000000"
                  className="flex-1 text-center px-5 py-3 rounded-full bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 transition-all shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)]"
                >
                  Call for Best Price
                </a>
                <Link
                  href="/"
                  className="flex-1 text-center px-5 py-3 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-semibold text-sm hover:bg-blue-100 hover:border-blue-300 transition-all"
                >
                  Compare Bikes
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content */}
          <div className="mt-8 bg-white rounded-2xl border border-blue-100 shadow-sm p-8 space-y-8">

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                {bike.name} Price in Bangladesh
              </h2>

              <p className="text-slate-600 leading-7">
                The current price of the {bike.name} in Bangladesh is {bike.price}.
                Check the latest price, availability and specifications before buying.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                {bike.name} Engine & Performance
              </h2>

              <p className="text-slate-600 leading-7">
                The {bike.name} is powered by a {bike.cc}cc engine.
                It produces {bike.engine.maximum_power} and
                {bike.engine.maximum_torque}.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                {bike.name} Mileage
              </h2>

              <p className="text-slate-600 leading-7">
                The {bike.name} offers an approximate mileage of{" "}
                {bike.mileage?.city || bike.mileage_top_speed?.mileage || "N/A"}.
                Actual mileage can vary depending on riding conditions,
                traffic and maintenance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                {bike.name} Top Speed
              </h2>

              <p className="text-slate-600 leading-7">
                The approximate top speed of the {bike.name} is{" "}
                {bike.mileage_top_speed?.top_speed || "N/A"}.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                {bike.name} Features
              </h2>

              <p className="text-slate-600 leading-7">
                The {bike.name} comes with features including{" "}
                {bike.electricals?.head_light} lighting,
                {bike.brakes?.braking_system} and{" "}
                {bike.transmission?.no_of_gears}-speed transmission.
              </p>
            </section>

          </div>

        {/* Specifications */}
        {specSections.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-blue-100">
              <h2 className="text-xl font-bold text-slate-900">
                Specifications
              </h2>
            </div>
            {specSections.map((section) => (
              <div key={section.title}>
                <div className="px-8 pt-5 pb-2">
                  <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    {section.title}
                  </h3>
                </div>
                <div className="divide-y divide-blue-100">
                  {Object.entries(section.data as Record<string, string>).map(
                    ([key, value], i) => (
                      <div
                        key={key}
                        className={`grid grid-cols-2 px-8 py-4 transition-colors ${
                          i % 2 === 0 ? "bg-transparent" : "bg-blue-50/50"
                        } hover:bg-blue-50`}
                      >
                        <span className="text-sm font-semibold text-slate-500">
                          {formatLabel(key)}
                        </span>
                        <span className="text-sm text-slate-900 font-medium">
                          {value}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Showroom */}
        {hasShowroom && (
          <div className="mt-8 bg-white rounded-2xl border border-blue-100 shadow-sm p-8">
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
            <section className="mt-8">
              <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6 md:p-8">
                <div className="mb-6">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                    Frequently Asked Questions
                  </p>

                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                    {bike.name} Frequently Asked Questions
                  </h2>

                  <p className="text-slate-600 text-sm mt-2">
                    Find answers to common questions about the {bike.name} price,
                    engine, mileage, performance and specifications.
                  </p>
                </div>

                <div className="divide-y divide-slate-200">
                  {faqs.map((faq, index) => (
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
          <div className="mt-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              More from <span className="text-blue-600">{bike.brand}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {similarBikes.map((sb) => (
                <Link
                  key={sb.slug}
                  href={`/bikes/${sb.slug}`}
                  className="group block [perspective:1000px]"
                >
                  <div className="rounded-xl overflow-hidden bg-white border border-blue-100 transition-all duration-500 group-hover:-translate-y-1.5 group-hover:scale-[1.02] group-hover:[transform:rotateX(3deg)_rotateY(-3deg)] group-hover:border-blue-300 group-hover:shadow-[0_16px_32px_-14px_rgba(37,99,235,0.35)]">
                    <div className="relative h-32 bg-gradient-to-b from-slate-50 to-blue-50/60">
                      <Image
                        src={sb.images?.primary || "/placeholder-bike.png"}
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
            href="/"
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
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t border-blue-100 px-4 py-3 flex gap-3">
        <a
          href="tel:+8800000000"
          className="flex-1 text-center px-5 py-3 rounded-full bg-blue-600 text-white font-semibold text-sm shadow-[0_4px_14px_rgba(37,99,235,0.3)]"
        >
          Call for Best Price
        </a>
        <Link
          href="/"
          className="flex-1 text-center px-5 py-3 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-semibold text-sm"
        >
          Compare
        </Link>
      </div>
    </div>
  );
}
