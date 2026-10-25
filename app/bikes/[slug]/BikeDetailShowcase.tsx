"use client";

import type { OBike } from "@/types/bike";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Variant = { slug: string; name: string; price: string; image: string };
type Highlight = { label: string; value: string };

type Props = {
  bike: OBike;
  gallerySources: string[];
  variants: Variant[];
  highlightSpecs: Highlight[];
  overview: string;
  lastUpdatedLabel: string;
  hasShowroom: boolean;
  hasSimilarBikes: boolean;
};

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

function formatPrice(price?: string) {
  if (!price?.trim()) return "Price on request";
  return `৳ ${price.replace(/BDT|৳/gi, "").trim()}`;
}

function shortValue(value?: string) {
  return value?.match(/\d+(?:\.\d+)?/)?.[0] || value || "—";
}

function DetailIcon({ type }: { type: "engine" | "power" | "torque" | "weight" | "speed" | "transmission" | "fuel" }) {
  const paths = {
    engine: <><path d="M7 7h9l2 2h2v8h-3l-2 2H8l-2-2H4V9h3V7ZM9 7V4h5" /><path d="M9 11v4m3-4v4" /></>,
    power: <><circle cx="12" cy="12" r="9" /><path d="m12 12 4-4M5 17h14" /></>,
    torque: <><circle cx="12" cy="12" r="9" /><path d="m12 12 5-3M7 16h10" /><circle cx="12" cy="12" r="1" /></>,
    weight: <><path d="M5 8h14l2 12H3L5 8Z" /><circle cx="12" cy="9" r="3" /></>,
    speed: <><path d="M4.9 19a9 9 0 1 1 14.2 0M12 13l4-4" /><circle cx="12" cy="13" r="1" /></>,
    transmission: <><path d="M5 4v16m7-16v16m7-16v16M5 7h14M5 17h14" /><circle cx="5" cy="4" r="1" /><circle cx="12" cy="4" r="1" /><circle cx="19" cy="4" r="1" /></>,
    fuel: <><rect x="4" y="6" width="11" height="15" rx="2" /><path d="M7 9h5M6 3h7v3m2 4 4 2v6a2 2 0 0 0 4 0v-7l-3-4" /></>,
  };
  return <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[type]}</svg>;
}

type IconName = "compare" | "heart" | "share" | "showroom" | "price" | "overview" | "specs" | "features" | "mileage" | "similar" | "headlight" | "instrument" | "suspension" | "brakes" | "verified";

function Icon({ name, className = "h-4 w-4" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    compare: <><circle cx="6" cy="6" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="12" cy="18" r="2" /><path d="M8 6h8M7 8l4 8m6-8-4 8" /></>,
    heart: <path d="M20.8 8.5c0 4.2-8.8 10-8.8 10s-8.8-5.8-8.8-10a4.7 4.7 0 0 1 8.8-2.2 4.7 4.7 0 0 1 8.8 2.2Z" />,
    share: <><circle cx="18" cy="5" r="2" /><circle cx="6" cy="12" r="2" /><circle cx="18" cy="19" r="2" /><path d="m8 11 8-5M8 13l8 5" /></>,
    showroom: <><path d="M3 10h18l-1-5H4l-1 5Zm1 0v10h16V10M9 20v-7h6v7" /><path d="M3 10c0 2 3 2 4 0 1 2 4 2 5 0 1 2 4 2 5 0 1 2 4 2 4 0" /></>,
    price: <><path d="M12 3 3 8l9 5 9-5-9-5ZM3 8v9l9 5 9-5V8M12 13v9" /></>,
    overview: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7 8h10M7 12h10M7 16h6" /></>,
    specs: <><path d="M4 7h16M4 12h16M4 17h16" /><circle cx="9" cy="7" r="2" fill="white" /><circle cx="15" cy="12" r="2" fill="white" /><circle cx="8" cy="17" r="2" fill="white" /></>,
    features: <><path d="m12 2 2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2L12 2ZM19 18l.7 1.3L21 20l-1.3.7L19 22l-.7-1.3L17 20l1.3-.7L19 18Z" /></>,
    mileage: <><path d="M4 18a8 8 0 1 1 16 0M12 18l4-6M5 18h14" /><circle cx="12" cy="18" r="1" /></>,
    similar: <><circle cx="6" cy="17" r="2" /><circle cx="18" cy="17" r="2" /><path d="M4 17H2l2-7h5l3 4h4l2-4h2l2 7h-2M8 17h8" /></>,
    headlight: <><path d="M5 6c6 0 10 2.5 10 6s-4 6-10 6V6ZM18 8l3-2m-3 6h3m-3 4 3 2" /></>,
    instrument: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M7 14a5 5 0 0 1 10 0M12 14l3-4M7 17h10" /></>,
    suspension: <><path d="M7 3h10M7 21h10M9 3v4l6 3-6 4 6 3v4M15 3v4l-6 3 6 4-6 3v4" /></>,
    brakes: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><path d="M12 3v5m0 8v5M3 12h5m8 0h5" /></>,
    verified: <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></>,
  };
  return <svg viewBox="0 0 24 24" className={`${className} shrink-0`} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function BikeDetailShowcase({
  bike,
  gallerySources,
  variants,
  highlightSpecs,
  overview,
  lastUpdatedLabel,
  hasShowroom,
  hasSimilarBikes,
}: Props) {
  const gallery = gallerySources.length === 1
    ? Array(4).fill(gallerySources[0]) as string[]
    : gallerySources;
  const colors = bike.colors.length > 0 ? bike.colors : ["Current color"];
  const colorImageFor = (color: string) => Object.entries(bike.colorImages ?? {})
    .find(([name, source]) => name.trim().toLowerCase() === color.trim().toLowerCase() && source.trim())?.[1]?.trim();
  const [activePhoto, setActivePhoto] = useState(0);
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const selectedColorImage = activeColor === null ? null : colorImageFor(colors[activeColor]);
  const displayedGallery = activeColor === null
    ? gallery
    : [selectedColorImage || gallery[0], ...gallery.slice(1)];
  const [expandedOverview, setExpandedOverview] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [wishlisted, setWishlisted] = useState(false);
  const [extraFees, setExtraFees] = useState(0);
  const [onRoadTotal, setOnRoadTotal] = useState<number | null>(null);
  const basePrice = Number(bike.price.replace(/[^\d]/g, "")) || 0;
  const [downPayment, setDownPayment] = useState(Math.round(basePrice * 0.2));
  const [tenure, setTenure] = useState(24);
  const [annualRate, setAnnualRate] = useState(0);
  const principal = Math.max(0, basePrice - downPayment);
  const monthlyRate = Math.max(0, annualRate) / 1200;
  const monthlyPayment = monthlyRate > 0
    ? principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -tenure))
    : principal / tenure;

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("bikebd-wishlist") || "[]") as string[];
      setWishlisted(Array.isArray(saved) && saved.includes(bike.slug));
    } catch {
      setWishlisted(false);
    }
  }, [bike.slug]);

  function toggleWishlist() {
    try {
      const saved = JSON.parse(localStorage.getItem("bikebd-wishlist") || "[]") as string[];
      const next = new Set(Array.isArray(saved) ? saved : []);
      if (next.has(bike.slug)) next.delete(bike.slug);
      else next.add(bike.slug);
      localStorage.setItem("bikebd-wishlist", JSON.stringify([...next]));
      setWishlisted(next.has(bike.slug));
    } catch {
      setShareMessage("Wishlist is unavailable in this browser");
    }
  }

  function movePhoto(direction: -1 | 1) {
    setActivePhoto((index) => (index + direction + displayedGallery.length) % displayedGallery.length);
  }

  async function shareBike() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: bike.name, url });
        setShareMessage("Shared");
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setShareMessage("Link copied");
      } else {
        setShareMessage(url);
      }
    } catch {
      setShareMessage("Could not share link");
    }
  }

  const stats = [
    { type: "engine" as const, value: `${bike.cc || shortValue(bike.engine?.displacement)} cc`, label: "Engine" },
    { type: "power" as const, value: `${shortValue(bike.engine?.maximum_power)} hp`, label: "Max Power" },
    { type: "weight" as const, value: bike.dimensions?.weight || "—", label: "Kerb Weight" },
    { type: "speed" as const, value: bike.mileage_top_speed?.top_speed || "—", label: "Top Speed" },
  ];

  return (
    <div className="space-y-3">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,1fr)]">
        <div className="min-w-0 rounded-2xl bg-white p-2 shadow-sm sm:p-3">
          <div className="relative h-[255px] overflow-hidden rounded-xl bg-[radial-gradient(circle_at_50%_50%,#fff_10%,#e8f3fd_100%)] sm:h-[390px] lg:h-[420px]">
            <Image key={displayedGallery[activePhoto]} src={displayedGallery[activePhoto]} alt={`${bike.name}${activePhoto === 0 && selectedColorImage && activeColor !== null ? ` in ${colors[activeColor]}` : ""}, image ${activePhoto + 1} of ${displayedGallery.length}`} fill priority className="object-contain p-5 sm:p-8" sizes="(max-width: 1023px) 100vw, 55vw" />
            <button type="button" onClick={() => movePhoto(-1)} aria-label="Previous motorcycle photo" className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-blue-600 shadow-md transition hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 sm:left-3"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg></button>
            <button type="button" onClick={() => movePhoto(1)} aria-label="Next motorcycle photo" className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-blue-600 shadow-md transition hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 sm:right-3"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg></button>
            <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700">{activePhoto + 1} / {displayedGallery.length}</span>
          </div>
          <div className="scrollbar-hide mt-2 flex gap-2 overflow-x-auto pb-1 sm:mt-3">
            {displayedGallery.map((source, index) => (
              <button key={index} type="button" onClick={() => setActivePhoto(index)} aria-label={`Show motorcycle photo ${index + 1}`} aria-pressed={activePhoto === index} className={`relative h-[54px] w-[64px] shrink-0 overflow-hidden rounded-lg border-2 bg-slate-50 sm:h-[68px] sm:w-[78px] ${activePhoto === index ? "border-blue-600" : "border-transparent hover:border-blue-200"}`}>
                <Image src={source} alt="" fill className="object-contain p-1" sizes="78px" />
              </button>
            ))}
            {gallerySources.length === 1 && <span className="self-center px-2 text-[11px] text-slate-400"></span>}
          </div>
        </div>

        <div className="min-w-0 rounded-2xl bg-white p-4 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-3">
            {bike.bike_type && <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">{bike.bike_type} Bike</span>}
            {BRAND_LOGOS[bike.brand] && <div className="relative h-9 w-24 shrink-0"><Image src={BRAND_LOGOS[bike.brand]} alt={`${bike.brand} logo`} fill className="object-contain object-right" sizes="96px" /></div>}
          </div>
          <p className="mt-2 text-xs font-bold uppercase tracking-wide text-blue-600">{bike.brand}</p>
          <h1 className="mt-1 text-2xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-3xl">{bike.name}<span className="mt-0.5 block text-xs font-medium text-slate-500 sm:text-sm">Price in Bangladesh 2026</span></h1>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500"><Icon name="verified" className="h-4 w-4 text-blue-600" /> Price last updated on <span className="font-semibold text-slate-700">{lastUpdatedLabel}</span></div>
          {bike.availability === "upcoming" && <p className="mt-2 text-xs font-semibold text-blue-700">Upcoming</p>}

          <div className="mt-4 flex flex-wrap items-end justify-between gap-2">
            <div><p className="text-[11px] text-slate-500">Price in Bangladesh</p><p className="text-2xl font-extrabold text-blue-600 sm:text-3xl">{formatPrice(bike.price)}</p></div>
            <div className="flex flex-wrap items-center gap-2"><Link href="/compare" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700"><Icon name="compare" />Compare</Link><button type="button" onClick={toggleWishlist} aria-pressed={wishlisted} className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold ${wishlisted ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-700"}`}><Icon name="heart" />{wishlisted ? "Saved" : "Wishlist"}</button><button type="button" onClick={shareBike} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700"><Icon name="share" />Share</button></div>
          </div>
          {shareMessage && <p role="status" className="mt-1 text-xs text-blue-700">{shareMessage}</p>}

          <div className="mt-4 grid grid-cols-4 gap-1 rounded-xl bg-slate-50 p-2 sm:gap-2 sm:p-3">
            {stats.map((stat) => <div key={stat.label} className="flex min-w-0 flex-col items-center gap-1 text-center sm:flex-row sm:text-left"><DetailIcon type={stat.type} /><div className="min-w-0"><strong className="block truncate text-[10px] font-bold text-slate-900 sm:text-xs">{stat.value}</strong><span className="hidden text-[10px] text-slate-500 sm:block">{stat.label}</span></div></div>)}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <a href={hasShowroom ? "#showroom" : "/contact"} className="flex min-h-11 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-2 text-center text-xs font-bold text-white transition hover:bg-blue-700 sm:text-sm"><Icon name="showroom" />{hasShowroom ? "View Showrooms" : "Contact Us"}</a>
            <a href="#price-in-bangladesh" className="flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-blue-500 px-2 text-center text-xs font-bold text-blue-700 transition hover:bg-blue-50 sm:text-sm"><Icon name="price" />Price Details</a>
          </div>

          <nav aria-label="Bike details sections" className="scrollbar-hide mt-4 flex gap-4 overflow-x-auto border-t border-slate-100 pt-4 text-xs font-semibold text-slate-600 sm:flex-wrap sm:gap-x-5 sm:gap-y-3">
            <a href="#overview" className="inline-flex shrink-0 items-center gap-1.5 hover:text-blue-600"><Icon name="overview" />Overview</a><a href="#specifications" className="inline-flex shrink-0 items-center gap-1.5 hover:text-blue-600"><Icon name="specs" />Specs</a><a href="#features" className="inline-flex shrink-0 items-center gap-1.5 hover:text-blue-600"><Icon name="features" />Features</a><a href="#mileage" className="inline-flex shrink-0 items-center gap-1.5 hover:text-blue-600"><Icon name="mileage" />Mileage</a>{hasShowroom && <a href="#showroom" className="inline-flex shrink-0 items-center gap-1.5 hover:text-blue-600"><Icon name="showroom" />Showrooms</a>}{hasSimilarBikes && <a href="#similar-bikes" className="inline-flex shrink-0 items-center gap-1.5 hover:text-blue-600"><Icon name="similar" />Similar Bikes</a>}
          </nav>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,1fr)]">
        <section id="overview" className="scroll-mt-28 rounded-2xl bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-slate-950">Quick Overview</h2>
          <p className={`mt-2 text-sm leading-relaxed text-slate-600 ${expandedOverview ? "" : "line-clamp-4 sm:line-clamp-none"}`}>{overview}</p>
          <button type="button" onClick={() => setExpandedOverview((value) => !value)} className="mt-2 text-xs font-bold text-blue-600 sm:hidden">{expandedOverview ? "Read Less" : "Read More"} →</button>
          {highlightSpecs.length > 0 && <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 sm:grid-cols-4">{highlightSpecs.map((spec) => <div key={spec.label} className="rounded-lg bg-blue-50/60 px-2 py-2"><div className="flex items-center gap-1.5"><DetailIcon type={spec.label === "Displacement" ? "engine" : spec.label === "Weight" ? "weight" : spec.label === "Fuel Tank" ? "fuel" : spec.label === "Top Speed" ? "speed" : spec.label === "Transmission" ? "transmission" : spec.label === "Max Torque" ? "torque" : "power"} /><span className="block text-[10px] text-slate-500">{spec.label}</span></div><strong className="mt-1 block text-xs text-slate-900">{spec.value}</strong></div>)}</div>}
          {(bike.mileage?.city || bike.mileage?.highway) && <div className="mt-4 grid grid-cols-2 gap-2">{bike.mileage.city && <div className="rounded-lg bg-slate-50 p-3"><span className="flex items-center gap-1.5 text-xs text-slate-500"><Icon name="mileage" className="h-4 w-4 text-blue-600" />City Mileage</span><strong className="text-sm text-slate-900">{bike.mileage.city}</strong></div>}{bike.mileage.highway && <div className="rounded-lg bg-slate-50 p-3"><span className="flex items-center gap-1.5 text-xs text-slate-500"><Icon name="mileage" className="h-4 w-4 text-blue-600" />Highway Mileage</span><strong className="text-sm text-slate-900">{bike.mileage.highway}</strong></div>}</div>}
          <div id="features" className="mt-5 scroll-mt-28 border-t border-slate-100 pt-4" aria-labelledby="features-heading">
            <h3 id="features-heading" className="text-base font-bold text-slate-950">Features</h3>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Headlight", value: bike.electricals?.head_light, icon: "headlight" as const },
                { label: "Instrument Cluster", value: bike.others?.speedometer, icon: "instrument" as const },
                { label: "Front Suspension", value: bike.chassis_suspension?.front_suspension, icon: "suspension" as const },
                { label: "Braking System", value: bike.brakes?.braking_system, icon: "brakes" as const },
              ].map((feature) => <div key={feature.label} className="min-w-0 rounded-xl border border-slate-100 bg-slate-50/70 p-3 sm:p-4"><span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Icon name={feature.icon} className="h-5 w-5" /></span><h4 className="text-xs font-bold text-slate-950 sm:text-sm">{feature.label}</h4><p className="mt-1 break-words text-[11px] leading-relaxed text-slate-600 sm:text-xs">{feature.value || "Not listed"}</p></div>)}
            </div>
          </div>
        </section>

        <div className="space-y-3">
          <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-5" aria-label="Variants and colors">
            <h2 className="text-base font-bold text-slate-950">Variants &amp; Price</h2>
            <div className="mt-3 space-y-2">
              {variants.map((variant) => <Link key={variant.slug} href={`/bikes/${variant.slug}`} aria-current={variant.slug === bike.slug ? "page" : undefined} className={`flex items-center gap-3 rounded-lg border p-2 transition ${variant.slug === bike.slug ? "border-blue-300 bg-blue-50/50" : "border-slate-100 hover:border-blue-200"}`}><div className="relative h-12 w-14 shrink-0 rounded-md bg-slate-50"><Image src={variant.image} alt="" fill className="object-contain p-1" sizes="56px" /></div><div className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-slate-900">{variant.name}</span><strong className="text-xs text-slate-950">{formatPrice(variant.price)}</strong></div><span className={`h-4 w-4 shrink-0 rounded-full border ${variant.slug === bike.slug ? "border-[5px] border-blue-600" : "border-slate-300"}`} aria-hidden="true" /></Link>)}
            </div>
            <h3 className="mt-5 text-sm font-bold text-slate-950">Available Colors</h3>
            <div className="scrollbar-hide mt-2 flex gap-2 overflow-x-auto pb-1">
              {colors.map((color, index) => <button key={`${color}-${index}`} type="button" onClick={() => { setActiveColor(index); setActivePhoto(0); }} aria-label={`Select ${color} color`} aria-pressed={activeColor === index} className={`w-[75px] shrink-0 rounded-lg border p-1.5 text-center ${activeColor === index ? "border-blue-600 bg-blue-50/50" : "border-slate-200 hover:border-blue-200"}`}><span className="relative block h-12 rounded-md bg-slate-50"><Image src={colorImageFor(color) || gallery[0]} alt="" fill className="object-contain p-1" sizes="64px" /></span><span className="mt-1 block truncate text-[10px] text-slate-600">{color}</span></button>)}
            </div>
            {colors.some((color) => !colorImageFor(color)) && <p className="mt-1 text-[11px] text-slate-500">Some color photos are coming soon.</p>}
            {activeColor !== null && <p className="mt-1 text-[11px] font-semibold text-blue-700">Selected: {colors[activeColor]}</p>}
          </section>

          {basePrice > 0 && <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-5" aria-label="Price calculators">
            <h2 className="text-sm font-bold text-slate-950">On-Road Price Estimate</h2>
            <p className="mt-1 text-[11px] text-slate-500">Add your local registration and other fees to the listed price.</p>
            <div className="mt-3 flex gap-2"><label className="min-w-0 flex-1 text-[11px] text-slate-600">Additional fees (৳)<input type="number" min="0" value={extraFees} onChange={(event) => setExtraFees(Math.max(0, Number(event.target.value) || 0))} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900" /></label><button type="button" onClick={() => setOnRoadTotal(basePrice + extraFees)} className="self-end rounded-lg bg-blue-600 px-3 py-2.5 text-xs font-bold text-white hover:bg-blue-700">Calculate</button></div>
            {onRoadTotal !== null && <p role="status" className="mt-2 text-sm font-bold text-blue-600">Estimated total: ৳ {onRoadTotal.toLocaleString("en-IN")}</p>}
            <div className="mt-5 border-t border-slate-100 pt-4"><h3 className="text-sm font-bold text-slate-950">EMI Calculator</h3><div className="mt-2 grid grid-cols-3 gap-2"><label className="text-[10px] text-slate-600">Down payment<input type="number" min="0" max={basePrice} value={downPayment} onChange={(event) => setDownPayment(Math.min(basePrice, Math.max(0, Number(event.target.value) || 0)))} className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900" /></label><label className="text-[10px] text-slate-600">Months<select value={tenure} onChange={(event) => setTenure(Number(event.target.value))} className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900"><option value={12}>12</option><option value={24}>24</option><option value={36}>36</option><option value={48}>48</option><option value={60}>60</option></select></label><label className="text-[10px] text-slate-600">Annual rate %<input type="number" min="0" max="100" step="0.1" value={annualRate} onChange={(event) => setAnnualRate(Math.min(100, Math.max(0, Number(event.target.value) || 0)))} className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900" /></label></div><p className="mt-3 text-xl font-extrabold text-blue-600">৳ {Math.round(monthlyPayment).toLocaleString("en-IN")} <span className="text-xs font-medium text-slate-500">/ month</span></p><p className="mt-1 text-[11px] text-slate-500">Estimate only. Enter your lender&apos;s rate for a closer estimate.</p></div>
          </section>}
        </div>
      </div>
    </div>
  );
}
