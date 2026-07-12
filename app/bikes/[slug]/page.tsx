import { bikes, getBikeBySlug } from "@/data/bike";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type SpecRecord = Record<string, string> | undefined | null;

function formatPrice(price?: string): string {
  if (!price || price.trim() === "") return "Price on request";
  // price arrives pre-formatted, e.g. "4,29,950 BDT" — don't parseInt it,
  // that only reads up to the first comma and returns garbage.
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

// Human-friendly label from a snake_case spec key, e.g. "maximum_power" -> "Maximum Power"
function formatLabel(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Headline specs live across several nested objects in the data, not just `engine`.
// Pull the specific fields we want to show as highlight cards, in priority order.
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bike = getBikeBySlug(slug);
  if (!bike) return { title: "Bike Not Found" };
  return {
    title: `${bike.name} Price in Bangladesh | BD Bikes`,
    description:
      bike.description ??
      `${bike.name} price, engine and details in Bangladesh.`,
  };
}

export default async function BikeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bike = getBikeBySlug(slug);

  // Guard: if no bike matches this slug, show 404 immediately.
  // Everything below this line can safely assume `bike` exists.
  if (!bike) {
    notFound();
  }

  const highlightSpecs = getHighlightSpecs(bike);
  const hasColors = Array.isArray(bike.colors) && bike.colors.length > 0;
  const hasMileage = !!(
    bike.mileage &&
    (bike.mileage.city || bike.mileage.highway)
  );
  const hasShowroom =
    bike.showroom && !bike.showroom.includes("Feature Your Showroom");
  const imageSrc = bike.images?.primary || "/placeholder-bike.png";

  // Full spec table is spread across several nested category objects in the data.
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
      // cast to SpecRecord to satisfy the expected index signature
      data: section.data as unknown as SpecRecord,
    }));

  const similarBikes = bikes
    .filter((b) => b.brand === bike.brand && b.slug !== bike.slug)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#F6F9FC] pb-24 lg:pb-8">
      {/* Header */}
      <header className="bg-white border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_4px_10px_rgba(37,99,235,0.3)]">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">
              BD Bikes
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
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
            All Bikes
          </Link>
        </div>
      </header>

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
        <div className="bg-white rounded-2xl border border-blue-100 shadow-[0_8px_30px_-12px_rgba(30,64,175,0.18)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image Panel */}
            <div className="relative bg-gradient-to-b from-slate-50 to-blue-50/60 min-h-80 lg:min-h-[520px] p-8 flex items-center justify-center [perspective:1200px]">
              <div className="relative w-full h-full transition-transform duration-700 ease-out hover:[transform:rotateY(-6deg)_rotateX(2deg)]">
                <Image
                  src={imageSrc}
                  alt={bike.name}
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
                  {bike.name}
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

              {/* Description */}
              {bike.description && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                    Overview
                  </p>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {bike.description}
                  </p>
                </div>
              )}

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
