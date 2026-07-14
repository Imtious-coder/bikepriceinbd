import { bikes } from "@/data/bike";
import { blogPosts } from "@/data/Blog";
import { getTotalShowroomCount } from "@/data/showroom";
import Link from "next/link";

function getStats() {
  const totalBikes = bikes.length;
  const totalBrands = new Set(bikes.map((b) => b.brand)).size;
  const totalArticles = blogPosts.length;
  const totalShowrooms = getTotalShowroomCount();
  return { totalBikes, totalBrands, totalArticles, totalShowrooms };
}

const OFFERINGS = [
  {
    title: "Bike Price Database",
    description:
      "Up-to-date pricing on motorcycles sold in Bangladesh, from budget commuters to fully-faired sports bikes, all in one place.",
    href: "/bikes",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 10v2m9-8a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  {
    title: "Side-by-Side Comparison",
    description:
      "Put two or three bikes head to head on price, engine specs, mileage, and more to see exactly where each one wins.",
    href: "/",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M9 17V7m0 10H5a2 2 0 01-2-2V9a2 2 0 012-2h4m0 10h6m-6 0V7m6 10h4a2 2 0 002-2V9a2 2 0 00-2-2h-4m0 10V7"
      />
    ),
  },
  {
    title: "Rider Reviews",
    description:
      "Honest, first-hand experiences from riders across Bangladesh — not marketing copy from showroom brochures.",
    href: "/",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    ),
  },
  {
    title: "Showroom Directory",
    description:
      "Find trusted, verified showrooms near you, organized by division, so you know exactly where to go to see a bike in person.",
    href: "/",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M4 9.5V19a1 1 0 001 1h14a1 1 0 001-1V9.5M3 9.5l1.5-5A1 1 0 015.45 4h13.1a1 1 0 01.95.68l1.5 5.32M3 9.5a2 2 0 004 0 2 2 0 004 0 2 2 0 004 0 2 2 0 004 0"
      />
    ),
  },
];

const VALUES = [
  {
    title: "Accuracy First",
    description:
      "Prices and specifications are sourced and cross-checked so you're making a decision on real numbers, not guesswork.",
  },
  {
    title: "Independent by Default",
    description:
      "We're not owned by a dealership or a single brand. Comparisons and reviews aren't shaped by who's paying for placement.",
  },
  {
    title: "Built for This Market",
    description:
      "Prices in BDT, showrooms organized by Bangladesh's actual divisions, and coverage focused on what's really sold here.",
  },
];

export const metadata = {
  title: "About Us | Bike Price In Bangladesh",
  description:
    "Bike Price In Bangladesh is an independent motorcycle price, comparison, and review platform based in Dhaka.",
};

export default function AboutPage() {
  const stats = getStats();

  return (
    <div className="min-h-screen bg-[#F6F9FC] pt-32 sm:pt-36 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">
            About Us
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Bike Price <span className="text-blue-600">In Bangladesh</span>
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-base text-slate-500 leading-relaxed">
            We help riders across Bangladesh find, compare, and buy the right
            motorcycle — with real prices, real specs, and real rider
            experiences, all in one place.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: stats.totalBikes, label: "Bikes Listed" },
            { value: stats.totalBrands, label: "Brands Covered" },
            { value: stats.totalArticles, label: "Articles Published" },
            { value: stats.totalShowrooms, label: "Showrooms Listed" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-blue-100 bg-white py-6 text-center shadow-sm"
            >
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-600">
                {stat.value}+
              </p>
              <p className="mt-1 text-xs font-medium text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="mb-16 rounded-3xl border border-blue-100 bg-white p-8 sm:p-12 shadow-sm">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-4">
            Why We Built This
          </h2>
          <div className="space-y-4 text-slate-600 leading-relaxed">
            <p>
              Buying a motorcycle in Bangladesh usually means piecing together
              information from scattered Facebook groups, inconsistent
              showroom listings, and word of mouth. Prices change, new models
              launch constantly, and it&apos;s hard to know if you&apos;re
              comparing the right numbers.
            </p>
            <p>
              Bike Price In Bangladesh exists to fix that — one place to check
              current prices, compare specs side by side, read what actual
              owners think, and find a showroom you can trust, whether
              you&apos;re shopping for a first commuter or upgrading to
              something bigger.
            </p>
          </div>
        </div>

        {/* What we offer */}
        <div className="mb-16">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6 text-center">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {OFFERINGS.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-2xl border border-blue-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_16px_32px_-16px_rgba(37,99,235,0.3)]"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
                    {item.icon}
                  </svg>
                </div>
                <h3 className="mb-2 text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6 text-center">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-blue-100 bg-blue-50/40 p-6"
              >
                <h3 className="mb-2 text-sm font-bold text-blue-700">
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="mb-16 flex flex-col sm:flex-row items-center gap-6 rounded-3xl border border-blue-100 bg-white p-8 sm:p-10 shadow-sm">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-[0_10px_24px_-10px_rgba(17,85,245,0.5)]">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-bold text-slate-900">Based in Dhaka, Bangladesh</h3>
            <p className="mt-1 text-sm text-slate-500 leading-relaxed">
              Bike Price In Bangladesh is built and maintained locally, with a
              focus on the motorcycles, brands, and showrooms that actually
              serve Bangladeshi riders.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/bikes"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_-10px_rgba(17,85,245,0.5)] transition-all hover:bg-blue-500 hover:shadow-[0_14px_28px_-10px_rgba(17,85,245,0.55)]"
          >
            Explore All Bikes
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}